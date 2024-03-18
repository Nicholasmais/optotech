const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const port = parseInt(process.env.PORT, 10) || 3000;

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Caminho para os arquivos de certificado e chave
const keyPath = path.join(__dirname, '../certificates/key.pem'); // ajuste o caminho
const certPath = path.join(__dirname, '../certificates/cert.pem'); // ajuste o caminho

app.prepare().then(() => {
    createServer(
        {
            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)
        },
        (req, res) => {
            const parsedUrl = parse(req.url, true);
            handle(req, res, parsedUrl);
        }
    )
    .listen(port, err => {
        if (err) throw err;
        console.log(`> Ready on https://localhost:${port}`);
    });
});
