// server.js (ES Module compatible)
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3000;

app.use(express.json());

// Paths to your text files
const altsPath = path.resolve("./alts.txt");
const usedPath = path.resolve("./used.txt");

// Endpoint to generate an alt
app.get("/generate", (req, res) => {
  try {
    // Read unused alts
    let alts = fs.readFileSync(altsPath, "utf-8").split("\n").filter(Boolean);

    if (alts.length === 0) {
      return res.status(400).json({ error: "No more unused alts!" });
    }

    // Take the first alt
    const alt = alts.shift();

    // Update alts.txt
    fs.writeFileSync(altsPath, alts.join("\n"));

    // Add to used.txt
    fs.appendFileSync(usedPath, alt + "\n");

    // Send the alt to frontend
    res.json({ alt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating alt" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
