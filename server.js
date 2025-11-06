import 'dotenv/config';
import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// statische Dateien wie index.html ausliefern
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = "ebb99/csv2";
const FILE_PATH = "data.csv";

app.post("/submit", async (req, res) => {
  const { name, comment } = req.body;
  const newLine = `${name},${comment},${new Date().toISOString()}\n`;

  try {
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const fileJson = await fileRes.json();
    const oldContent = Buffer.from(fileJson.content, "base64").toString("utf8");
    const newContent = oldContent + newLine;

    await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Neue Eingabe hinzugefügt",
        content: Buffer.from(newContent).toString("base64"),
        sha: fileJson.sha
      })
    });

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("✅ Server läuft auf http://localhost:3000"));
