const express = require("express");

const serverless = require("serverless-http");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const { v4: uuidV4 } = require("uuid");
const PORT = process.env.PORT || 8000;
var roomList = [];
// var users = [];
var currentUserId = "";

// set the view engine to ejs
app.set("view engine", "ejs");
// app.use(express.static("public"));
app.use('/netlify/server')

app.get("/", (req, res) => {
  // res.redirect(`/${uuidV4()}`)
  res.redirect("/wattingRoom");
});

app.get("/favicon.ico", (req, res) => {
  return "faveicon";
});

app.get("/newRoom", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/wattingRoom", (req, res) => {
  // console.log("roomList", roomList);
  res.render("wattingRoom", {
    roomList: JSON.stringify(roomList),
    // users: JSON.stringify(users),
    // currentUserId: JSON.currentUserId(currentUserId),
  });
  // console.log(
  //   "🚀 ~ file: server.js ~ line 21 ~ app.get ~  JSON.stringify(roomList) ",
  //   JSON.stringify(roomList)
  // );
  // res.redirect(`/${uuidV4()}`)
});

app.get("/game", (req, res) => {
  res.render("game", { roomId: req.params.room });
});

// app.get('/:room.:userPeerId', (req, res) => {
//     res.render('room', { roomId: req.params.room, userPeerId: req.params.userPeerId })
// })

app.get("/:room", (req, res) => {
  const roomId = req.params.room;

  // console.log("🚀 ~ file: server.js ~ line 39 ~ app.get ~ roomId", roomId);
  const users = app.get("users");
  console.log("🚀 ~ file: server.js ~ line 55 ~ app.get ~ users", users);

  if (!users.hasOwnProperty(currentUserId)) {
    users[currentUserId] = {
      position: {
        x: -800,
        y: -700,
      },
    };
    app.set("users", users);
  }
  res.render("room", {
    roomId,
    users: JSON.stringify(users),
    currentUserId: JSON.stringify(currentUserId),
  });

  if (!roomList.map((room) => room.roomId).includes(roomId) || true) {
    roomList.unshift({ roomId, timeStamp: new Date() });
  }
});

//on user enter to voice room
io.on("connection", (socket) => {
  currentUserId = uuidV4();
  socket.on("update-user-velocity", (id, user) => {
    const users = app.get("users");
    // console.log("🚀 ~ file: server.js ~ line 79 ~ socket.on ~ user", users);

    // console.log("🚀 ~ file: server.js ~ line 84 ~ socket.on ~ { ...users, [id]: user }", { ...users, [id]: user })

    app.set("users", { ...users, [id]: user });
  });
  socket.on("join-room", (roomId, userPeerId) => {
    socket.join(roomId);
    console.log(
      "🚀 ~ file: server.js:89 ~ socket.on ~ userPeerId:",
      userPeerId
    );
    console.log("🚀 ~ file: server.js:90 ~ socket.on ~ roomId:", roomId);
    // console.log(
    //   "🚀 ~ file: server.js ~ line 29 ~ socket.on ~ socket",
    //   socket.rooms
    // );

    // const x = socket.broadcast.to(roomId).emit('user-connected', userPeerId)
    socket.broadcast.to(roomId).emit("user-connected", userPeerId);
    // console.log(
    //   "🚀 ~ file: server.js ~ line 56 ~ socket.on ~ userPeerId",
    //   userPeerId
    // );

    // socket.on('disconnecting', async function (reason) {
    //     console.log("🚀 ~ file: server.js ~ line 50 ~ reason", reason)
    //     socket.broadcast.to(roomId).emit('user-disconnecting', userPeerId)
    // })

    socket.on("disconnect", () => {
      console.log("disconnect");
      const users = app.get("users");
      // console.log("🚀 ~ file: server.js ~ line 106 ~ socket.on ~ users", users);
      if (users.hasOwnProperty(currentUserId)) {
        delete users[currentUserId];
      }
      socket.broadcast.to(roomId).emit("user-disconnected", userPeerId);
    });

    socket.on("exit-room", () => {
      console.log("exit-room");
      io.to(roomId).emit("user-exit-room", userPeerId);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running. ${PORT}`);
  app.set("users", {});
});
