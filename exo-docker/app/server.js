const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serve static assets (public/style.css)
app.use(express.static(path.join(__dirname, "public")));

// Le stockage "persistant" attendu : un fichier monté sur un volume
const DATA_DIR = process.env.DATA_DIR || "./data";
const DATA_FILE = path.join(DATA_DIR, "notes.json");

function ensureStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ notes: [] }, null, 2));
  }
}

function readNotes() {
  ensureStore();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(raw).notes || [];
}

function writeNotes(notes) {
  ensureStore();
  fs.writeFileSync(DATA_FILE, JSON.stringify({ notes }, null, 2));
}

app.get("/", (req, res) => {
  const notes = readNotes();
  const html = `
    <!doctype html>
    <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <title>Mini Notes</title>

        </head>
      <body>
        <main class="container">
          <h1>Mini Notes</h1>
          <form method="post" action="/notes" class="note-form">
            <input name="text" placeholder="Nouvelle note..." required />
            <button>Ajouter</button>
          </form>
          <h2>Notes</h2>
          <ul class="notes">${notes.map(n => `<li>${escapeHtml(n)}</li>`).join("")}</ul>
          <p><small>Stockage: ${DATA_FILE}</small></p>
        </main>
      </body>
    </html>
  `;
  res.status(200).send(html);
});

app.post("/notes", (req, res) => {
  const text = (req.body.text || "").trim();
  if (!text) return res.status(400).send("Texte vide");

  const notes = readNotes();
  notes.unshift(`${new Date().toISOString()} — ${text}`);
  writeNotes(notes);

  // redirection vers /
  res.redirect("/");
});

app.get("/health", (req, res) => res.status(200).json({ ok: true }));

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`Listening on :${port}`));

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}