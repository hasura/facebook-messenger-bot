var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlEncoded({extended: false}));

let FACEBOOK_VERIFY_TOKEN = "my_password";

//your routes here
app.get('/', function (req, res) {
    res.send("Hello World, I am a bot.");
});

app.get('/webhook/', function(req, res) {
  if (req.query['hub.verify_token'] === FACEBOOK_VERIFY_TOKEN) {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
});



app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
