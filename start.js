// start.js
import { exec } from "child_process";
import ngrok from "@ngrok/ngrok";

const PORT = 5000;

// 🟢 1. Starte den lokalen Node-Server
console.log("🚀 Starte lokalen Server...");
const serverProcess = exec(`node server.js`);

serverProcess.stdout.on("data", data => {
  console.log(data.toString());
});

serverProcess.stderr.on("data", data => {
  console.error("❌ Fehler im Server:", data.toString());
});

// 🟣 2. Starte ngrok, sobald Server läuft
(async function() {
  console.log("🌍 Starte ngrok...");
  try {
    const listener = await ngrok.connect({ addr: PORT });
    console.log(`✅ ngrok läuft: ${listener.url()}`);
    console.log(`➡️  Diese URL kannst du in GitHub Webhook eintragen: ${listener.url()}/webhook`);
  } catch (err) {
    console.error("❌ Fehler beim Starten von ngrok:", err);
  }
})();
