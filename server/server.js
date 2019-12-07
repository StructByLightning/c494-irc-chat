//setup html server
console.log("Starting...");
const express = require("express");
var path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');



const privateKey = fs.readFileSync('/etc/letsencrypt/live/inscriptionserial.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/inscriptionserial.com/cert.pem', 'utf8');
const ca = fs.readFileSync('/etc/letsencrypt/live/inscriptionserial.com/chain.pem', 'utf8');
const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca
};


const httpsExpress = express();
//special path for letsencrypt challenge
httpsExpress.get("/.well-known/acme-challenge/ahQ5kcUGlSCNDefE353mq-H11zcZPXKAcZ4V6GHaN34", function response(req, res) {
  res.sendFile(path.join(__dirname + "/../letsencrypt-secret.txt"));
});

//serve files from /build if it exists
httpsExpress.use(express.static("./build"));

//otherwise just return the index since this is a spa
httpsExpress.get("*", function response(req, res) {
  res.sendFile(path.join(__dirname + "/../build/index.html"));
});

const httpsServer = https.createServer(credentials, httpsExpress);


const httpExpress = express();


httpExpress.get("*", function response(req, res) {
  res.redirect("https://" + req.headers.host + req.url);
});


const httpServer = http.createServer(httpExpress);


httpServer.listen(80, () => {
  console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
  console.log('HTTPS Server running on port 443');
});


//htmlServer.listen(80, () => console.log("Started HTML server"));

//setup socket server
const ServerNetwork = require("./server-network");
const network = new ServerNetwork();
network.listen();


