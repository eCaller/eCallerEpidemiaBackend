import app from './app';
const fs  = require('fs');
//const http = require('http');
const https = require('https');
const config = require('./config')

// Son certificados de prueba
const privateKey  = fs.readFileSync('selfsigned.key', 'utf8');
const certificate = fs.readFileSync('selfsigned.crt', 'utf8');
let credentials = {key: privateKey, cert: certificate};

//let httpServer = http.createServer(app);
let httpsServer = https.createServer(credentials, app);
//httpServer.listen(httpPort);
httpsServer.listen(config.httpsPort);