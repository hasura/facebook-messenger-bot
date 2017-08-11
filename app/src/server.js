var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();

let mdb = require('moviedb')('87435796fadd1be0372685ee1fcc033f');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let FACEBOOK_VERIFY_TOKEN = "my_password";
let FACEBOOK_PAGE_ACCESS_TOKEN = "EAAZAZAhL1jbuEBACGr4EzJlNOQd9IZCEyk7J6eJbvbs7qimW16TT1SJ8ol0a4gAESg6iWvLgVZBN4Kv3D4ESRYGJrWfmrBlFjmqODaL5BAN7twhpOS8Cplce34XUppWQsZBZCwgpZAS4z8DBHtEmiteS5CIZAZAqAzkwxYvKvOnBjPgZDZD";
let FACEBOOK_SEND_MESSAGE_URL = 'https://graph.facebook.com/v2.6/me/messages?access_token=' + FACEBOOK_PAGE_ACCESS_TOKEN;

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
  if (req.body.object === 'page') {
    if (req.body.entry) {
      req.body.entry.forEach(function(entry) {
        if (entry.messaging) {
          entry.messaging.forEach(function(messagingObject) {
              var senderId = messagingObject.sender.id;
              if (messagingObject.message) {
                if (!messagingObject.message.is_echo) {
                  //Assuming that everything sent to this bot is a movie name.
                  var movieName = messagingObject.message.text;
                  // getMovieDetails(senderId, movieName);
                  sendUIMessageToUser(senderId);
                }
              }
          });
        } else {
          console.log('Error: No messaging key found');
        }
      });
    } else {
      console.log('Error: No entry key found');
    }
  } else {
    console.log('Error: Not a page object');
  }
  res.sendStatus(200);
})

function sendUIMessageToUser(senderId) {
  request({
    url: FACEBOOK_SEND_MESSAGE_URL,
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        attachment: {
          type: 'template',
          payload: {
            template_type: 'generic',
            elements: [
              {
                title: 'Test Title',
                subtitle: 'Test subtitle'
              }
            ]
          }
        }
      }
    }
  }, function(error, response, body) {
        if (error) {
          console.log('Error sending message to user: ' + error);
        } else if (response.body.error){
          console.log('Error sending message to user: ' + response.body.error);
        }
  });
}

function sendMessageToUser(senderId, message) {
  request({
    url: FACEBOOK_SEND_MESSAGE_URL,
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      }
    }
  }, function(error, response, body) {
        if (error) {
          console.log('Error sending message to user: ' + error);
        } else if (response.body.error){
          console.log('Error sending message to user: ' + response.body.error);
        }
  });
}

function showTypingIndicatorToUser(senderId, isTyping) {
  var senderAction = isTyping ? 'typing_on' : 'typing_off';
  request({
    url: FACEBOOK_SEND_MESSAGE_URL,
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      sender_action: senderAction
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending typing indicator to user: ' + error);
    } else if (response.body.error){
      console.log('Error sending typing indicator to user: ' + response.body.error);
    }
  });
}

function getMovieDetails(senderId, movieName) {
  showTypingIndicatorToUser(senderId, true);
  var message = 'Found details on ' + movieName;
  mdb.searchMovie({ query: movieName }, (err, res) => {
    showTypingIndicatorToUser(senderId, false);
    if (err) {
      console.log('Error using movieDB: ' + err);
      sendMessageToUser(senderId, 'Error finding details on ' + movieName);
    } else {
      console.log(res);
      if (res.results) {
        if (res.results.length > 0) {
          var result = res.results[0];
          var movieName  = result.original_title
          var posterPath = result.poster_path
          sendMessageToUser(senderId, movieName + ": " + posterPath);
        } else {
          sendMessageToUser(senderId, 'Could not find any informationg on ' + movieName);
        }
      } else {
        sendMessageToUser(senderId, message);
      }
    }
  });
}


app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
