var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server)

app.get('/', function(req, res){
  res.send('Hi there ');
});

io.on('connection', (socket) => {
    console.log(socket.id)
    socket.on('SEND_MESSAGE', function (data) {
        io.emit('RECEIVE_MESSAGE', data)
    })
})
server.listen(5000, function(){
    console.log('listening on *:5000');
  });




