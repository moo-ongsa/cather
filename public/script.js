const socket = io("/");
const videoGrid = document.getElementById("video-grid");

/*
localhost 
    host: "/",
    path: "cather",
    port: 9000,
heroku
    host: "https://cather-peer-server.herokuapp.com"
    path: "cather",
    port: 9000,
*/

let peers = {};
var currentUserPeerId = "";
var currentUserVideoStreamId = "";

navigator.getMedia =
  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia;

function connectViaPeer(zone) {
  // const myPeer = new Peer(undefined, {
  //   secure: true,
  //   host: "catherpeerjs.netlify2.app",
  //   path: "/cather",
  //   port: 9000,
  // });
  const myPeer = new Peer(undefined, {
    host: "/",
    // path: "cather",
    port: 9000,
  });
  console.log("🚀 ~ file: script.js:37 ~ connectViaPeer ~ myPeer:", myPeer);
  // const myPeer = new Peer();
  const myVideo = document.createElement("video");
  myVideo.muted = true;

  socket.on("user-disconnected", (userPeerId) => {
    // console.log(
    //   "🚀 ~ user-disconnected userPeerId",
    //   userPeerId,
    //   " peers",
    //   peers
    // );
    if (peers[userPeerId]) {
      peers[userPeerId].close();
      // delete peers[userPeerId]
    }
  });

  myPeer.on("open", (id) => {
    console.log("🚀 ~ file: script.js ~ line 38 ~ connectViaPeer ~ id", id);
    socket.emit("join-room", `${ROOM_ID}-${zone}`, id);
    currentUserPeerId = id;
    hud.userId = CURRENT_USER_ID;
    hud.userPeerId = id;
    hud.room = `${ROOM_ID}-${zone}`;
  });

  myPeer.on("exitRoom", (id) => {
    console.log("AMINO OK");
  });

  socket.on("test", (userPeerId) => {
    // console.log("🚀 ~test", userPeerId);
    // connectToNewUser(userPeerId, stream)
  });

  myPeer.on("connection", (event) => {
    // console.log(
    //   "🚀 ~ file: script.js ~ line 77 ~ connectViaPeer ~ event",
    //   event
    // );
  });

  if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
    navigator.userMedia = navigator.mozGetUserMedia || navigator.getUserMedia;
    if (!navigator.userMedia) {
      alert("Please Update or Use Different Browser");
      return;
    }
    navigator.userMedia(
      {
        video: true,
      },
      (stream) => showCam(stream),
      (err) => showErr(err)
    );
    return;
  }

  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: true,
    })
    .then((stream) => {
      console.log(
        "🚀 ~ file: script.js ~ line 50 ~ connectViaPeer ~ stream",
        stream
      );
      addVideoStream(myVideo, stream);
      currentUserVideoStreamId = stream.id;

      myPeer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });

        call.on("close", () => {
          video.remove();
        });
        peers[call.peer] = call;
      });

      socket.on("user-connected", (userPeerId) => {
        console.log("🚀 ~ file: script.js ~ line 27 ~ userPeerId", userPeerId);
        connectToNewUser(userPeerId, stream);
      });

      socket.on("user-exit-room", async (userPeerId) => {
        console.log("🚀 ~ file: exit room", userPeerId);
        console.log("peer", peers);

        if (peers[userPeerId]) {
          peers[userPeerId].close();
          delete peers[userPeerId];
        }
        if (userPeerId === currentUserPeerId) {
          // await dataConnection.close()
          // await socket.disconnect()
          // await socket.connect()
          await myPeer.disconnect();

          // await myPeer.destroy();

          // await myPeer.reconnect()
        }
        // connectToNewUser(userPeerId, stream);
      });
    });

  function showCam(stream) {
    let video = document.querySelector("video");
    video.srcObject = stream;
  }

  function showErr(err) {
    let message =
      err.name === "NotFoundError"
        ? "Please Attach Camera"
        : err.name === "NotAllowedError"
        ? "Please Grant Permission to Access Camera"
        : err;
    alert(message);
  }

  async function connectToNewUser(userPeerId, stream) {
    console.log("myPeer", myPeer, "stream", stream, "userPeerId", userPeerId);
    // await myPeer.reconnect()
    if (myPeer._disconnected) {
      // await myPeer.reconnect();
    } else {
      const call = myPeer.call(userPeerId, stream);
      console.log(
        "🚀 ~ file: script.js ~ line 116 ~ connectToNewUser ~ peers[userPeerId]",
        peers[userPeerId]
      );
      console.log(
        "🚀 ~ file: script.js ~ line 81 ~ connectToNewUser ~ call",
        call
      );
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
      call.on("close", () => {
        video.remove();
      });
      peers[userPeerId] = call;
    }
  }

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.id = stream.id;
    console.log("play");
    video.addEventListener("loadedmetadata", () => {
      console.log("play");
      video.play();
    });
    videoGrid.append(video);
  }
}
function test() {
  console.log("moo");
}

async function updatedUserVelocity(id, user) {
  await socket.emit("update-user-velocity", id, user);
}

async function disconnectCurrentUser(zone) {
  while (videoGrid.firstChild) {
    videoGrid.removeChild(videoGrid.lastChild);
  }

  console.log("moo ja hana ka");
  await socket.emit("exit-room");
  // await socket.disconnect()
  // await socket.connect()
  hud.clearHud();
  // peers = {}

  // DataConnection.close()
}

function exitRoom() {
  myPeer.exitRoom();
}
