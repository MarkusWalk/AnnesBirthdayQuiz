/* Zustand des Quizmasters ablegen und abrufen.
   POST  {room, state}  – legt den Stand ab und schickt ihn an alle Mitleser
   GET   ?room=XXXX     – liefert den aktuellen Stand (für Nachzügler)

   Speicher ist Upstash Redis, angebunden über die REST-Schnittstelle.
   Vercel legt je nach Integration unterschiedliche Namen an – beide werden
   akzeptiert. Fehlt der Speicher, antwortet die Funktion mit 503. */

export const config = { runtime: "edge" };

const REDIS_URL   = process.env.KV_REST_API_URL   || process.env.UPSTASH_REDIS_REST_URL   || "";
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

/* Ein Quizabend ist nach ein paar Stunden vorbei – danach darf der Stand verfallen. */
const TTL = 10800;
const MAX_BODY = 4096;

const ROOM_RE = /^[A-Z0-9]{4,12}$/;
const keyOf = room => `abq:state:${room}`;
const chanOf = room => `abq:chan:${room}`;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
  });

async function redis(command){
  const r = await fetch(REDIS_URL, {
    method: "POST",
    headers: { authorization: `Bearer ${REDIS_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify(command)
  });
  if(!r.ok) throw new Error(`Redis antwortete mit ${r.status}`);
  return (await r.json()).result;
}

export default async function handler(req){
  if(!REDIS_URL || !REDIS_TOKEN)
    return json({ error: "Kein Speicher eingerichtet. In Vercel unter Storage eine Upstash-Redis-Datenbank anlegen." }, 503);

  if(req.method === "GET"){
    const room = (new URL(req.url).searchParams.get("room") || "").toUpperCase();
    if(!ROOM_RE.test(room)) return json({ error: "Ungültiger Raumcode" }, 400);
    try{
      const cur = await redis(["GET", keyOf(room)]);
      return json({ state: cur ? JSON.parse(cur) : null });
    }catch(e){
      return json({ error: String(e.message || e) }, 502);
    }
  }

  if(req.method === "POST"){
    const raw = await req.text();
    if(raw.length > MAX_BODY) return json({ error: "Zustand zu groß" }, 413);

    let body;
    try{ body = JSON.parse(raw); }
    catch(e){ return json({ error: "Kein gültiges JSON" }, 400); }

    const room = String(body.room || "").toUpperCase();
    if(!ROOM_RE.test(room)) return json({ error: "Ungültiger Raumcode" }, 400);
    if(!body.state || typeof body.state !== "object") return json({ error: "Kein Zustand übergeben" }, 400);

    const payload = JSON.stringify(body.state);
    try{
      /* Ablegen und verteilen in einem Zug: Nachzügler lesen den Schlüssel,
         alle bereits Verbundenen bekommen die Nachricht über den Kanal. */
      const r = await fetch(`${REDIS_URL}/pipeline`, {
        method: "POST",
        headers: { authorization: `Bearer ${REDIS_TOKEN}`, "content-type": "application/json" },
        body: JSON.stringify([
          ["SET", keyOf(room), payload, "EX", String(TTL)],
          ["PUBLISH", chanOf(room), payload]
        ])
      });
      if(!r.ok) throw new Error(`Redis antwortete mit ${r.status}`);
      const res = await r.json();
      const listeners = Array.isArray(res) && res[1] ? res[1].result : 0;
      return json({ ok: true, listeners: Number(listeners) || 0 });
    }catch(e){
      return json({ error: String(e.message || e) }, 502);
    }
  }

  return json({ error: "Methode nicht erlaubt" }, 405);
}
