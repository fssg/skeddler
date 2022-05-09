const process = require('process');
// const child_process = require('child_process');
// const cluster = require('cluster');
const http = require('http');
const https = require('https');
const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');

const mongodb = require('mongodb');

const cfg = require('./cfg.jsonc');

const port = process.env.PORT || cfg.port || 8080;
const host = process.env.HOST || cfg.host || 'localhost';
const key = process.env.KEY || fs.readFileSync(path.join(__dirname, cfg.keyPath)) || undefined;
const cert = process.env.CERT || fs.readFileSync(path.join(__dirname, cfg.certPath)) || undefined;
const useHttps = !!key && !!cert;

const server = (useHttps ? https : http).createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
});

server.listen(port, host, () => {
    console.log('\x1b[32m%s\x1b[0m', `Server running at https://${host}:${port}`);
});

// if (process.isPrimary && !useHttps) {
//     (spawn HTTP redirector) 
//     child_process.fork()
// }