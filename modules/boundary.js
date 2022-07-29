import { c } from '../index.js'

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
        c.fillStyle = 'transparent'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

export { Boundary }