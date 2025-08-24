const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();

app.use(cors()); // allow your React app to fetch

app.get('/getAlt', (req, res) => {
  const altsFile = 'alts.txt';
  const usedFile = 'used.txt';

  let alts = [];
  if (fs.existsSync(altsFile)) {
    alts = fs.readFileSync(altsFile, 'utf-8').split('\n').filter(Boolean);
  }

  if (!alts.length) return res.status(400).send('No more alts!');

  const alt = alts.shift();          // take first alt
  fs.writeFileSync(altsFile, alts.join('\n'));  // save remaining
  fs.appendFileSync(usedFile, alt + '\n');      // add to used

  res.send(alt);
});

app.listen(3001, () => console.log('Alt server running on http://localhost:3001'));
