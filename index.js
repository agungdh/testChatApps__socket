var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "test_chat_app"
});

con.connect(function(err) {
  if (err) throw err;
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('sendChat', function(data = null){
  	con.query('SELECT * FROM users WHERE username = ?', [data.username], function (error, results, fields) {
	  if (error) throw error;
	  if (results.length != 0) {
  		console.log(`
	  		username: ${data.username} \n
	  		message: ${data.message} \n
	  		userID: ${data.userID} \n
	  		toUser: ${results[0].id} \n
		`);
	    io.emit('receiveChat__' + results[0].id, data.message);	
  	}
	});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});