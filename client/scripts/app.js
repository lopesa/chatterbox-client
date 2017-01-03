// YOUR CODE HERE:
// debugger;
var app = {};

var username;
var friendList = [];

app.init = () => {
  var rooms = app.getRooms();
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


app.fetch = (room) => {
  $.ajax({
    method: 'GET',
    url: app.server,
    data: 'order=-updatedAt',
    success: (function( msg ) {
      
      // instead of rendermessage here
      // 
      var roomMsg = _.filter(msg.results, function(item) {
        return item.roomname === room;
      });
      roomMsg.forEach(item => {
        app.renderMessage(item);
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


app.renderMessage = item => {

  $('#chats').append(`<p><button class=username>${item.username}</button>: ${app.escapeHtml(item.text)}</p>`);
  $('.username').on('click', event =>{
    // console.log(event);
    app.handleUsernameClick($(event.target).text());
    // console.log(event);
  });

};

app.handleUsernameClick = (username) => {
  if (friendList.indexOf(username) === -1) {
    friendList.push(username);
  }
  console.log(friendList);
};




app.send = (msg) => {

  var message = JSON.stringify(msg);

  $.ajax({
    type: 'POST',
    url: app.server,
    data: message
  });
  return false;
};

app.getRooms = () => {
  var rooms;

  $.ajax({
    method: 'GET',
    url: app.server,
    data: 'limit=1000&keys=roomname',
    success: (function( msg ) {

      rooms = _.uniq(_.map(msg.results, function(item) {
        return item.roomname;
      }));

      rooms.forEach(room => {
        app.renderRoom(room);
      });
    })
  });
  return rooms;
};

app.clearMessages = () => {

  $('#chats').empty();

};

app.renderRoom = room => {
  if (room !== undefined) {
    $('#roomSelect').append('<option>' + room + '</option>');
  }
};





window.onload = function() {
  username = window.location.search.slice(10);
  app.init();

  $('#roomSelect').on('change', event => {
    // console.log('whatever');
    console.log(event);
    app.clearMessages();
    var room = $('#roomSelect option:selected').text();
    app.fetch(room);
  });

  
  
  // setTimeout(app.clearMessages, 1000);
};