const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const {
  addUser,
  getUsersInRoom,
  getUser,
  removeUser,
} = require('./utils/users');
const { generateMessage } = require('./utils/messages');

io.on('connection', (socket) => {
  console.log('connect:', socket.id);

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });
    if (error) {
      return callback(error);
    }
    socket.join(user.roomname);

    socket.emit(
      'message',
      generateMessage('관리자', `${user.roomname} 방에 오신 걸 환영합니다.`)
    );

    socket.broadcast
      .to(user.roomname)
      .emit(
        'message',
        generateMessage('관리자', `${user.username} 님이 입장했습니다.`)
      );

    io.to(user.roomname).emit('roomData', {
      roomname: user.roomname,
      users: getUsersInRoom(user.roomname),
    });
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.roomname).emit(
      'message',
      generateMessage(user.username, message)
    );

    callback();
  });

  socket.on('disconnect', () => {
    console.log('disconnect:', socket.id);

    const user = removeUser(socket.id);
    if (user) {
      io.to(user.roomname).emit(
        'message',
        generateMessage('관리자', `${user.username} 님이 퇴장했습니다.`)
      );

      io.to(user.roomname).emit('roomData', {
        roomname: user.roomname,
        users: getUsersInRoom(user.roomname),
      });
    }
  });
});

const path = require('path');
const publicDirectoryPath = path.join(__dirname, '../public');
app.use(express.static(publicDirectoryPath));

const port = 4000;
server.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
