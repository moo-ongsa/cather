const socket = io('/')
const videoGrid = document.getElementById('video-grid')

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
const myPeer = new Peer(undefined, {
    secure: true,
    // host: "/",
    host: "cather-peerjs-server.herokuapp.com",
    port: 443,
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream)

    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })

    socket.on('user-connected', userId => {
        console.log("🚀 ~ file: script.js ~ line 27 ~ userId", userId)
        connectToNewUser(userId, stream)
    })
})

socket.on('user-disconnected', userId => {
    console.log("🚀 ~ user-disconnected userId", userId, " peers", peers)
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    videoGrid.append(video)
}