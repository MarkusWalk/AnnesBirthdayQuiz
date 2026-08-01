/* Dauerverbindung für die Mitleser.

   Beim Verbinden kommt sofort der aktuelle Stand – wer später dazukommt,
   sitzt also nicht vor einer leeren Seite. Danach wird der Redis-Kanal
   durchgereicht; klappt das nicht, wird stattdessen in Ruhe abgefragt.

   Die Verbindung wird nach vier Minuten von sich aus beendet. Der Browser
   verbindet automatisch neu – das hält die Sache innerhalb der Laufzeit-
   grenzen der Plattform, ohne dass jemand etwas merkt. */

export const config = { runtime: "edge" };

const REDIS_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL   || "";
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

const ROOM_RE = /^[A-Z0-9]{4,12}$/;
const keyOf = room => `abq:state:${room}`;
const chanOf = room => `abq:chan:${room}`;

const LIFETIME = 240000;   /* danach neu verbinden lassen */
const PING = 20000;        /* Kommentarzeile gegen zwischengeschaltete Zeitabschaltungen */
const POLL = 2500;         /* nur im Notbetrieb ohne Kanal */

async function redisGet(room){
  const r = await fetch(REDIS_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${REDIS_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(["GET", keyOf(room)])
  });
  if(!r.ok) throw new Error(`Redis antwortete mit ${r.status}`);
  return (await r.json()).result;
}

export default async function handler(req){
  const room = (new URL(req.url).searchParams.get("room") || "").toUpperCase();
  if(!ROOM_RE.test(room)) return new Response("Ungültiger Raumcode", { status: 400 });
  if(!REDIS_URL || !REDIS_TOKEN) return new Response("Kein Speicher eingerichtet", { status: 503 });

  const enc = new TextEncoder();
  const deadline = Date.now() + LIFETIME;

  const stream = new ReadableStream({
    async start(controller){
      let closed = false, last = null, ping = null, upstream = null;

      const write = text => {
        if(closed) return;
        try{ controller.enqueue(enc.encode(text)); }
        catch(e){ closed = true; }
      };
      const sendState = payload => {
        if(payload == null || payload === last) return;
        last = payload;
        /* Zeilenumbrüche kämen im SSE-Format durcheinander – der Zustand ist
           kompaktes JSON, hat also normalerweise keine. */
        write(`event: state\ndata: ${String(payload).replace(/\r?\n/g, " ")}\n\n`);
      };
      const finish = () => {
        if(closed) return;
        closed = true;
        clearInterval(ping);
        try{ upstream?.cancel(); }catch(e){}
        try{ controller.close(); }catch(e){}
      };

      req.signal?.addEventListener("abort", finish);
      write("retry: 2000\n\n");

      /* Aktueller Stand, damit Nachzügler sofort im Bild sind. Auch wenn noch
         gar nichts vorliegt, wird "ready" geschickt – daran erkennt das Handy,
         dass die Leitung steht und der Quizmaster nur noch nicht begonnen hat. */
      try{
        const cur = await redisGet(room);
        write("event: ready\ndata: 1\n\n");
        sendState(cur);
      }catch(e){
        write(`event: trouble\ndata: ${JSON.stringify({ error: String(e.message || e) })}\n\n`);
      }

      ping = setInterval(()=>{
        if(closed || Date.now() > deadline) return finish();
        write(": ping\n\n");
      }, PING);

      /* Bevorzugt: der Kanal von Upstash, dann kommt jede Änderung sofort an. */
      let subscribed = false;
      try{
        const res = await fetch(`${REDIS_URL}/subscribe/${encodeURIComponent(chanOf(room))}`, {
          headers: { authorization: `Bearer ${REDIS_TOKEN}`, accept: "text/event-stream" }
        });
        if(res.ok && res.body){
          subscribed = true;
          upstream = res.body.getReader();
          const dec = new TextDecoder();
          let buf = "";
          while(!closed && Date.now() < deadline){
            const { value, done } = await upstream.read();
            if(done) break;
            buf += dec.decode(value, { stream: true });
            let nl;
            while((nl = buf.indexOf("\n")) >= 0){
              const line = buf.slice(0, nl).trim();
              buf = buf.slice(nl + 1);
              if(!line.startsWith("data:")) continue;
              /* Upstash schickt "message,<kanal>,<inhalt>" – der Inhalt darf
                 selbst Kommas enthalten, also nur zweimal trennen. */
              const rest = line.slice(5).trim();
              const a = rest.indexOf(","), b = rest.indexOf(",", a + 1);
              if(a < 0 || b < 0 || rest.slice(0, a) !== "message") continue;
              sendState(rest.slice(b + 1));
            }
          }
        }
      }catch(e){
        subscribed = false;
      }

      /* Notbetrieb: kein Kanal zu bekommen – dann eben nachfragen. */
      if(!subscribed){
        while(!closed && Date.now() < deadline){
          await new Promise(r => setTimeout(r, POLL));
          if(closed) break;
          try{ sendState(await redisGet(room)); }catch(e){}
        }
      }

      finish();
    }
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-store, no-transform",
      "connection": "keep-alive",
      "x-accel-buffering": "no"
    }
  });
}
