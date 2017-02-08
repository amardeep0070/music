var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

//require ("./test/app.js")(app);

require ("./app")(app);
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 5000;

app.listen(port, ipaddress);
console.log(ipaddress);
console.log(port);
//app.listen(5000);
