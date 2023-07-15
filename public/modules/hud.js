class Hud {
    static lineheight = 15;

    constructor({ room, userId, userPeerId }) {
        this.room = room || ''
        this.userId = userId || ''
        this.userPeerId = userPeerId || ''
        this.lineheight = 15;
    }

    draw() {
        let x, y = 15;

        const text = `room_id: ${this.room}
        user_id: ${this.userId}
        user_peer_id: ${this.userPeerId}
        `

        var lines = text.replace(/^\s+|\s+$/gm, '').split('\n');

        canvasContext.fillStyle = 'rgba(125,125,255,0.5)'
        canvasContext.fillRect(0, 0, canvas.width, y / 2 + this.lineheight * lines.length);
        canvasContext.font = '15px sans-serif';
        canvasContext.fillStyle = '#fff';
        canvasContext.textAlign = "start";

        for (let i = 0; i < lines.length; i++) {
            canvasContext.fillText(lines[i], 15, y + (i * this.lineheight));
        }
    }

    clearHud() {
        this.room = ''
        this.userId = ''
        this.userPeerId = ''
    }
}