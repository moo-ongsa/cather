class Boundary {
    //16x16 but a map is zoom 400% so 16x16 -> 64x64
    static width = 64
    static height = 64
    constructor({ position }) {
        this.position = position
        this.width = 64
        this.height = 64
    }

    draw() {
        canvasContext.fillStyle = 'rgba(255,0,0,0)' //rgba(255,0,0,0.5)
        canvasContext.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}