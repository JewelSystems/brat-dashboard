let express = require('express');
let serveStatic = require('serve-static');

let app = express();
app.use(serveStatic(__dirname + "/dist"));

const hostname = "painel.brat.com.br";
const port = process.env.PORT || 5000;

app.listen(port, hostname);
