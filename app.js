var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server)

app.get('/', function(req, res){
  res.send('Hi there ');
});
let users = []

const addNewUser = (user) => {
    users.push(user)
}
const removeUser = (id) => {
    return users.filter(user => user.id!==id)
}




io.on('connection', (socket) => {
    console.log(socket.id)
    io.emit('YOUR_ID', socket.id)
    addNewUser({id:socket.id})
    socket.emit('RECEIVE_USERS', users)
    socket.on('GET_ID', function (data) {
        console.log('get id called')
        socket.emit('YOUR_ID', socket.id)
    })
    socket.on('SEND_MESSAGE', function (data) {
        console.log('send message called')
        socket.emit('RECEIVE_MESSAGE', data)
    })
    socket.on('GET_USERS',  (data) => {
        socket.emit('RECEIVE_USERS', users)
    })
    socket.on('disconnect',  () => {
        console.log('disconnect called', socket.id)
        users=removeUser(socket.id)
    })
})
server.listen(5000, function(){
    console.log('listening on *:5000');
  });   




