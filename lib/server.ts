/** 
 * Copyright 2020, Ingenia, S.A.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 * 
 * @author jamartin@ingenia.es
 */
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