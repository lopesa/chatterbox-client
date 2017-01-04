// YOUR CODE HERE:
var app = {};

var username;
var friendList = [];

app.init = () => {
  var rooms = app.getRooms();
  
  $('#roomSelect').on('change', event => {
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
  // escapes special characters
  if (string) {
    string = string.replace(/\//g, '');
    string = string.replace(/&/g, '');
    string = string.replace(/</g, '');
    string = string.replace(/>/g, '');
    string = string.replace(/script/g, 'p');
  } else { 
    string = '';
  }
  return string;
};


app.fetch = (room) => {
  $.ajax({
    method: 'GET',
    url: app.server,
    data: 'limit=1000&order=-updatedAt',
    success: (function( msg ) {
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


app.renderMessage = item => {

  $('#chats').append(`<p><button class="username btn-default btn-xs" onclick=app.handleUsernameClick($(this))>${item.username}</button>: ${app.escapeHtml(item.text)}</p>`);
  /*
  $('.username').on('click', event =>{
    console.log(event);
    app.handleUsernameClick($(event.target).text());
  });
  */
};

app.handleUsernameClick = (obj) => {
  if (friendList.indexOf(obj.text()) === -1) {
    friendList.push(obj.text());
  }
  var id = obj.text();
  var friendbuttons = $('button').filter(function () { 
    return $(this).text() === id;
  });
  
  $(friendbuttons).removeClass('btn btn-default').addClass('btn btn-primary');
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



window.onload = function() {
  username = window.location.search.slice(10);
  app.init();
};