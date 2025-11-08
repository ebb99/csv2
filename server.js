// server.js
import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000;

// Middleware: JSON aus Webhooks empfangen
app.use(bodyParser.json());

// Test-Route (damit du prüfen kannst, ob Server läuft)
app.get("/", (req, res) => {
  res.send("✅ Node-Server läuft! GitHub-Webhook ist aktiv.");
});

// Haupt-Webhook-Route
app.post("/webhook", (req, res) => {
  console.log("📩 Webhook empfangen!");
  const event = req.headers["x-github-event"];
  const payload = req.body;

  console.log("Event:", event);
  console.log("Repository:", payload?.repository?.full_name);
  console.log("Benutzer:", payload?.sender?.login);
  console.log("Push-Nachricht:", payload?.head_commit?.message);

  // Beispiel: auf Push reagieren
  if (event === "push") {
    console.log("🚀 Neuer Push erkannt!");
  }

  res.status(200).send("OK");
});

// Starte den Server
app.listen(PORT, () => {
  console.log(`🌐 Server läuft auf http://localhost:${PORT}`);
});

