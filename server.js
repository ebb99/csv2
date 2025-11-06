import 'dotenv/config';
import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Aus .env-Datei
const REPO = "DEIN_GITHUB_NAME/csv1";          // <- anpassen
const FILE_PATH = "data.csv";

app.post("/submit", async (req, res) => {
  const { name, comment } = req.body;
  const newLine = `${name},${comment},${new Date().toISOString()}\n`;

  try {
    // CSV von GitHub holen
    const fileRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}` }
    });
    const fileJson = await fileRes.json();
    const oldContent = Buffer.from(fileJson.content, "base64").toString("utf8");

    // Neue Zeile anhängen
    const newContent = oldContent + newLine;

    // Datei wieder auf GitHub speichern
    const uploadRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE_PATH}`, {
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

    if (!uploadRes.ok) throw new Error(await uploadRes.text());
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.listen(3000, () => console.log("Server läuft auf http://localhost:3000"));
