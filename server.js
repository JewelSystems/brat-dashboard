var express = require('express');
var serveStatic = require('serve-static');

var app = express();
app.use(serveStatic(__dirname + "/dist"));

console.log("aqui: ", process.env.PORT);
var port = process.env.PORT || 5000;
app.listen(port);
