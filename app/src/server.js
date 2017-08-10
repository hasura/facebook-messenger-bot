var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let FACEBOOK_VERIFY_TOKEN = "my_password";
let FACEBOOK_PAGE_ACCESS_TOKEN = "EAAZAZAhL1jbuEBACGr4EzJlNOQd9IZCEyk7J6eJbvbs7qimW16TT1SJ8ol0a4gAESg6iWvLgVZBN4Kv3D4ESRYGJrWfmrBlFjmqODaL5BAN7twhpOS8Cplce34XUppWQsZBZCwgpZAS4z8DBHtEmiteS5CIZAZAqAzkwxYvKvOnBjPgZDZD";

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

app.post('/webhook/', function(req, res) {
  console.log(JSON.stringify(req.body));
  res.sendStatus(200);
})



app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
