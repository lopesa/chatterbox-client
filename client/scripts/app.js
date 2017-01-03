// YOUR CODE HERE:
var app = {};

app.init = () => {

};

app.fetch = () => {
  $.ajax({
    method: 'GET',
    url: 'https://api.parse.com/1/classes/messages',
    data: 'order=-updatedAt',
    success: (function( msg ) {
      console.log(msg);
      msg.results.forEach(item => {
        $('#chats').append('<p>' + item.createdAt.slice(0, 19) + ' ' + item.username + ': ' + item.text + '<p>');
      });
    })
  });
};

app.fetch();

// $('#msg').submit(function(event) {
//   event.preventDefault();
//   console.log('message');
// });

app.send = (event) => {
  event.preventDefault();
  console.log(event);

  var message = document.getElementById('messageText').value;
  console.log(username + ' ' + message);
  $.ajax({
    method: 'POST',
    url: 'https://api.parse.com/1/classes/messages',
    data: JSON.stringify({
      'username': username,
      'text': message,
      'roomname': 'lobby'
    })
  })
    .done(function(msg) {
      console.log('Data Saved');
    });


  //fetch new message from form
  // e.preventDefault();
  // console.log($('#msg newmsg'));
  // console.log(e);
  // console.log('test');
  /*
  $.ajax({
    method: 'POST',
    url: 'https://api.parse.com/1/classes',
    success: (function( msg ) {
      console.log(msg);
    })
  });
  */
};

var username;

window.onload = function() {
  username = window.location.search.slice(10);
};