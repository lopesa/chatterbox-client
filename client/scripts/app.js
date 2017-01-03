// YOUR CODE HERE:
var app = {};

app.init = () => {

};

app.fetch = () => {
  $.ajax({
    method: 'GET',
    url: 'https://api.parse.com/1/classes/messages',
    success: (function( msg ) {
    // console.log(msg);
      msg.results.forEach(item => {
        $('#chats').append('<p>' + item.username + ': ' + item.text + '<p>');
      });
    })
  });
};

app.fetch();

$('#msg').submit(function(event) {
  event.preventDefault();
  console.log('message');
});

app.send = (event) => {
  console.log(event);

  var message = document.getElementById('messageText').value;
  
  $.ajax({
    method: 'POST',
    url: 'https://api.parse.com/1/classes', 
    data: {
      username: username,
      text: message,
      roomname: 'lobby'
    }
  })
    .done(function(msg) {
      alert('Data Saved');
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