var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

app.get('/', function (req, res) {
  res.send('Welcome to chat application ')
})
let users = []

const addNewUser = (user) => {
  users.push(user)
}
const removeUser = (id) => {
  return users.filter(user => user.id !== id)
}

io.on('connection', (socket) => {
  socket.emit('YOUR_ID', socket.id)
  addNewUser({ id: socket.id })
  io.emit('RECEIVE_USERS', users)

  // if someone asks for id
  socket.on('GET_ID', function (data) {
    socket.emit('YOUR_ID', socket.id)
  })

  // when someone sends a message
  // sending it to relavent user
  socket.on('SEND_MESSAGE', function (data) {
    console.log('send message called', data.to, data.message)
    io.to(`${data.to}`).emit('RECEIVE_MESSAGE', data)
  })

  // when client asks for all  available users
  socket.on('GET_USERS', (data) => {
    socket.emit('RECEIVE_USERS', users)
  })

  // on disconnect close the socket
  socket.on('disconnect', () => {
    console.log('disconnect called', socket.id)
    users = removeUser(socket.id)
  })
})
server.listen(5000, function () {
  console.log('listening on *:5000')
})
