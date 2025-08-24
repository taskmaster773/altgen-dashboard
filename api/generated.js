import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const dataPath = path.resolve("./data.json");

    // Read JSON
    const raw = fs.readFileSync(dataPath, "utf-8");
    const data = JSON.parse(raw);

    if (!data.alts || data.alts.length === 0) {
      return res.status(400).json({ error: "No more unused alts!" });
    }

    // Take the first alt
    const alt = data.alts.shift();

    // Add to used
    data.used.push(alt);

    // Save back
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

    res.status(200).json({ alt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating alt" });
  }
}
