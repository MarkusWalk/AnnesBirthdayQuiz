#!/usr/bin/env python3
"""Baut aus index.html die Fassung für die gehostete Einzelseite.

Zwei Unterschiede zur lokalen Datei:
  * Rahmen-Tags (<!doctype>, <html>, <head>, <body>) entfallen – die
    Hosting-Umgebung liefert sie selbst.
  * Bilder aus bilder/ werden als data-URI eingebettet, weil dort kein
    Dateiordner danebenliegt.

Aufruf:  python3 build-artifact.py <zieldatei>
"""
import base64, mimetypes, pathlib, re, sys

ROOT = pathlib.Path(__file__).parent
src = (ROOT / "index.html").read_text(encoding="utf-8")

head = re.search(r"<head>(.*?)</head>", src, re.S).group(1)
title = re.search(r"<title>.*?</title>", head, re.S).group(0)
style = re.search(r"<style>.*?</style>", head, re.S).group(0)
body = re.search(r"<body>(.*)</body>", src, re.S).group(1)
out = f"{title}\n{style}\n{body.strip()}\n"

# Jeden in den Fragen genannten Bildpfad durch eine vorhandene Datei ersetzen –
# unabhängig von der Endung, genau wie es die App zur Laufzeit tut.
EXTS = ["jpg", "jpeg", "png", "webp", "svg"]
embedded, missing = [], []
for ref in sorted(set(re.findall(r'"(bilder/[^"]+)"', out))):
    stem = re.sub(r"\.[a-z0-9]+$", "", ref, flags=re.I)
    found = next((p for e in EXTS if (p := ROOT / f"{stem}.{e}").exists()), None)
    if not found:
        missing.append(ref)
        continue
    mime = mimetypes.guess_type(found.name)[0] or "application/octet-stream"
    data = base64.b64encode(found.read_bytes()).decode("ascii")
    out = out.replace(f'"{ref}"', f'"data:{mime};base64,{data}"')
    embedded.append(f"{ref} -> {found.name} ({len(data)//1024} kB base64)")

assert "<!DOCTYPE" not in out and "<html" not in out and "<body" not in out

target = pathlib.Path(sys.argv[1])
target.write_text(out, encoding="utf-8")

print(f"geschrieben: {target} ({len(out)//1024} kB)")
for line in embedded:
    print("  eingebettet:", line)
if missing:
    print(f"  noch ohne Bild ({len(missing)}):", ", ".join(missing))
