// YOUR CODE HERE:
// debugger;
var app = {};

var username;
var friendList = [];

app.init = () => {
  var rooms = app.getRooms();
  
  $('#roomSelect').on('change', event => {
    // console.log('whatever');
    console.log(event);
    app.clearMessages();
    var room = $('#roomSelect option:selected').text();
    app.fetch(room);
  });

  app.$send = $('#send');
  app.$send.on('submit', app.handleSubmit);
};

app.server = 'https://api.parse.com/1/classes/messages';

app.escapeHtml = string => {
  // if no more escaping needed
  // return string
  
  string = string.replace(/\//g, '');
  
  string = string.replace(/&/g, '');
  string = string.replace(/</g, '');
  string = string.replace(/>/g, '');
  /*
  //string.replace(/"/g, '');
  //string.replace(/'/g, '');
  string = string.replace(/"  "/g, '');
  */
  string = string.replace(/script/g, 'p');

  return string;
  // if (string) { 
  //   if (!string.includes('<')) {
  //     return string;
  //   }

  //   // look for the first instance to escape
  //   var firstBracket = string.indexOf('<');
  //   var nextBracket = string.indexOf('>');

  //   string = string.slice(0, firstBracket) + string.slice(nextBracket + 1);

  //   return app.escapeHtml(string);
  // }
};


app.fetch = (room) => {
  $.ajax({
    method: 'GET',
    url: app.server,
    data: 'limit=1000&order=-updatedAt',
    success: (function( msg ) {
      
      // instead of rendermessage here
      // 
      var roomMsg = _.filter(msg.results, function(item) {
        return item.roomname === room;
      });
      console.log(roomMsg);
      roomMsg.forEach(item => {
        app.renderMessage(item);
      });
    })
  });
};
//


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
};


app.handleSubmit = (event) => {
  var text = document.getElementById('message').value;
  var message = {
    'username': username,
    'text': text,
    'roomname': 'lobby'
  };
  app.send(message);
  event.preventDefault();
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
    room = app.escapeHtml(room);
    $('#roomSelect').append('<option>' + room + '</option>');
  }
};


// app.getScriptMessages = () => {
//   $.ajax({
//     method: 'GET',
//     url: app.server,
//     data: {limit=1000&keys=roomname},
//     success: (function( msg ) {

//       rooms = _.uniq(_.map(msg.results, function(item) {
//         return item.roomname;
//       }));

//       rooms.forEach(room => {
//         app.renderRoom(room);
//       });
//     })
//   });
// };




window.onload = function() {
  username = window.location.search.slice(10);
  app.init();
  
  // setTimeout(app.clearMessages, 1000);
};