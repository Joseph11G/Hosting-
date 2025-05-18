const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
const unzipper = require('unzipper');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.static('public'));
app.use(express.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

app.post('/upload', async (req, res) => {
    if (!req.files || !req.files.zip) return res.status(400).send('No file uploaded.');

    const zipPath = path.join(uploadDir, 'bot.zip');
    const extractPath = path.join(uploadDir, 'bot');

    fs.rmSync(extractPath, { recursive: true, force: true });
    await req.files.zip.mv(zipPath);

    fs.createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: extractPath }))
        .on('close', () => {
            exec(`pm2 delete bot || true && pm2 start index.js --name bot --cwd ${extractPath}`, (err) => {
                if (err) return res.status(500).send('Bot start failed.');
                res.send('Bot uploaded and started.');
            });
        });
});

app.post('/restart', (req, res) => {
    exec(`pm2 restart bot`, (err) => {
        if (err) return res.status(500).send('Restart failed.');
        res.send('Bot restarted.');
    });
});

app.post('/stop', (req, res) => {
    exec(`pm2 stop bot`, (err) => {
        if (err) return res.status(500).send('Stop failed.');
        res.send('Bot stopped.');
    });
});

app.get('/logs', (req, res) => {
    exec(`pm2 logs bot --lines 100 --nostream`, (err, stdout) => {
        if (err) return res.status(500).send('Log fetch failed.');
        res.send(stdout);
    });
});

app.listen(PORT, () => console.log(`Hosting panel running on port ${PORT}`));
