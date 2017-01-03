// YOUR CODE HERE:
var app = {};

app.init = () => {
  app.fetch();
  app.getRooms();
};

app.server = 'https://api.parse.com/1/classes/messages';

app.escapeHtml = string => {
  // if no more escaping needed
  // return string
  if (string) {
    if (!string.includes('<')) {
      return string;
    }

    // look for the first instance to escape
    var firstBracket = string.indexOf('<');
    var nextBracket = string.indexOf('>');

    string = string.slice(0, firstBracket) + string.slice(nextBracket + 1);

    return app.escapeHtml(string);
  }
};


app.fetch = () => {
  $.ajax({
    method: 'GET',
    url: app.server,
    data: 'order=-updatedAt',
    success: (function( msg ) {
      // console.log(msg);
      msg.results.forEach(item => {
        $('#chats').append('<p>' + item.createdAt.slice(0, 19) + ' ' + item.username + ': ' + app.escapeHtml(item.text) + '<p>');
      });
    })
  });
};
//
app.generateMessage = () => {
  var text = document.getElementById('messageText').value;
  var message = {
    'username': username,
    'text': text,
    'roomname': 'lobby'
  };
  return message;
};





//
app.send = (msg) => {

  //event.preventDefault();
  //console.log(event);
  var message = JSON.stringify(msg);
  //message = document.getElementById('messageText') === null ? ' ' : document.getElementById('messageText').value;
  //console.log(username + ' ' + message);


  $.ajax({
    type: 'POST',
    url: app.server,
    data: message
  });
    // .done(function(msg) {
    //   console.log('Data Saved');
    // });
  return false;
};

app.getRooms = () => {
  $.ajax({
    method: 'GET',
    url: app.server,
    data: 'limit=1000',
    success: (function( msg ) {

      console.log(typeof msg);
      msg.results.forEach((item) => {
        console.log(item.roomname);
      });

    })
  });
};

// example from test of the method name we need to use
// app.renderRoom('superLobby');

var username;

window.onload = function() {
  username = window.location.search.slice(10);
  app.init();
};