const users = [];

const addUser = ({ id, username, roomname }) => {
  username = username.trim();
  roomname = roomname.trim();

  if (!username || !roomname) {
    return {
      error: '사용자와 대화방 이름을 입력해주세요.',
    };
  }

  const existingUser = users.find((user) => {
    return user.roomname === roomname && user.username === username;
  });
  if (existingUser) {
    return {
      error: '해당 대화방에 동일한 이름을 가진 사용자가 이미 존재합니다.',
    };
  }

  const user = {
    id,
    username,
    roomname,
  };
  users.push(user);

  return { user };
};

const getUsersInRoom = (roomname) => {
  roomname = roomname.trim();

  const result = users.filter((user) => {
    return user.roomname === roomname;
  });

  return result;
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

module.exports = { addUser, getUsersInRoom, getUser, removeUser };
