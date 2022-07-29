const canvas = document.getElementById('canvas-cather')
const canvasContext = canvas.getContext('2d')
canvas.width = 960
canvas.height = 470



//inintial data 
let lastKey = ''
let keyPressed = ''
let waterAnimationTimeframe = 0
const conllisionsMap = [] //cather_style_map width tiles = 58
const boundaries = []
const localStorageOffset = JSON.parse(localStorage.getItem('offset'))
const offset = {
    x: localStorageOffset?.x || -800,
    y: localStorageOffset?.y || -780,
}
const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
}

for (let i = 0; i < collisions.length; i += 58) {
    conllisionsMap.push(collisions.slice(i, 58 + i))
}

conllisionsMap.forEach((row, i) => {
    row.forEach((symbol, j) => {
        if (symbol === 236) {
            boundaries.push(
                new Boundary({
                    position: {
                        x: j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
                    }
                }))
        }
    })
})

const backgroundImage = new Image()
backgroundImage.src = './img/cather_style_map.png'

const playerDownImage = new Image()
playerDownImage.src = './img/cat_walk_down.png'

const playerUpImage = new Image()
playerUpImage.src = './img/cat_walk_up.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/cat_walk_left.png'

const playerRightImage = new Image()
playerRightImage.src = './img/cat_walk_right.png'

const foregroundImage = new Image()
foregroundImage.src = './img/cather_style_foreground_map.png'

const backgroundWater1Image = new Image()
backgroundWater1Image.src = './img/cather_style_water_1_map.png'

const backgroundWater2Image = new Image()
backgroundWater2Image.src = './img/cather_style_water_2_map.png'

const backgroundWater3Image = new Image()
backgroundWater3Image.src = './img/cather_style_water_3_map.png'

const backgroundWater4Image = new Image()
backgroundWater4Image.src = './img/cather_style_water_4_map.png'


const background = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: backgroundImage,
})

const player = new Sprite({
    position: {
        x: canvas.width / 2 - 256 / 4 / 2,
        y: canvas.height / 2 - 64 / 2
    },
    image: playerDownImage,
    frames: { max: 4 },
    sprites: {
        up: playerUpImage,
        left: playerLeftImage,
        right: playerRightImage,
        down: playerDownImage,
    }
})

const foreground = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: foregroundImage,
})

const water = new Sprite({
    position: {
        x: offset.x,
        y: offset.y,
    },
    image: backgroundWater1Image,
    sprites: {
        water1: backgroundWater1Image,
        water2: backgroundWater2Image,
        water3: backgroundWater3Image,
        water4: backgroundWater4Image,
    }
})


const playerMovement = {
    up: () => {
        movables.forEach(movable => {
            movable.position.y += 3
        })
    },
    upAndRight: () => {
        movables.forEach(movable => {
            movable.position.y += 2
            movable.position.x -= 2
        })
    },
    upAndLeft: () => {
        movables.forEach(movable => {
            movable.position.y += 2
            movable.position.x += 2
        })
    },
    down: () => {
        movables.forEach(movable => {
            movable.position.y -= 3
        })
    },
    downAndRight: () => {
        movables.forEach(movable => {
            movable.position.y -= 2
            movable.position.x -= 2
        })
    },
    downAndLeft: () => {
        movables.forEach(movable => {
            movable.position.y -= 2
            movable.position.x += 2
        })
    },
    left: () => {
        movables.forEach(movable => {
            movable.position.x += 3
        })
    },
    right: () => {
        movables.forEach(movable => {
            movable.position.x -= 3
        })
    }
}

function waterAnimation() {
    water.image = water.sprites['water' + ((waterAnimationTimeframe % 4) + 1)]
    waterAnimationTimeframe++
    setTimeout(waterAnimation, 1000);
}


function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.position.x + rectangle1.width >= rectangle2.position.x
        && rectangle1.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.position.y + rectangle1.width >= rectangle2.position.y
        && rectangle1.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function checkBoundaries(boundaries) {
    let moving = true
    player.moving = true
    for (let i = 0; i < boundaries.length; i++) {
        const boundary = boundaries[i]
        const position = {
            x: boundary.position.x + (keys.a.pressed
                ? 3
                : keys.d.pressed
                    ? -3
                    : 0
            ),
            y: boundary.position.y + (keys.w.pressed
                ? 3
                : keys.s.pressed
                    ? -3
                    : 0
            ),
        }
        if (
            rectangularCollision({
                rectangle1: player,
                rectangle2: {
                    ...boundary,
                    position
                }
            })
        ) {
            moving = false
            break
        }
    }

    return moving
}

const movables = [background, ...boundaries, foreground, water]

function animate() {
    window.requestAnimationFrame(animate)
    water.draw()
    background.draw()
    boundaries.forEach(boundary => {
        boundary.draw()
    })
    player.draw()
    foreground.draw()


    let moving = true
    player.moving = false

    if (keys.w.pressed && ['w', 'wd', 'wa'].includes(lastKey)) {
        moving = checkBoundaries(boundaries)
        player.image = player.sprites.up
        if (moving && lastKey === 'w') {
            playerMovement.up()
        } else if (moving && lastKey === 'wd') {
            playerMovement.upAndRight()
        } else if (moving && lastKey === 'wa') {
            playerMovement.upAndLeft()
        }
    }
    else if (keys.a.pressed && ['a', 'wa', 'sa'].includes(lastKey)) {
        moving = checkBoundaries(boundaries)
        player.image = player.sprites.left
        if (moving && lastKey === 'a') {
            playerMovement.left()
        } else if (moving && lastKey === 'wa') {
            playerMovement.upAndLeft()
        } else if (moving && lastKey === 'sa') {
            playerMovement.downAndLeft()
        }
    }
    else if (keys.s.pressed && ['s', 'sa', 'sd'].includes(lastKey)) {
        moving = checkBoundaries(boundaries)
        player.image = player.sprites.down
        if (moving && lastKey === 's') {
            playerMovement.down()
        } else if (moving && lastKey === 'sa') {
            playerMovement.downAndLeft()
        } else if (moving && lastKey === 'sd') {
            playerMovement.downAndRight()
        }
    }
    else if (keys.d.pressed && ['d', 'wd', 'sd'].includes(lastKey)) {
        moving = checkBoundaries(boundaries)
        player.image = player.sprites.right
        if (moving && lastKey === 'd') {
            playerMovement.right()
        } else if (moving && lastKey === 'wd') {
            playerMovement.upAndRight()
        } else if (moving && lastKey === 'sd') {
            playerMovement.downAndRight()
        }
    }
}
animate()
waterAnimation()


window.addEventListener('keypress', (e) => {

    switch (e.code) {
        case 'KeyW':
            keys.w.pressed = true
            lastKey = 'w'
            if (keys.d.pressed) {
                lastKey = 'wd'
            } else if (keys.a.pressed) {
                lastKey = 'wa'
            }
            break
        case 'KeyA':
            keys.a.pressed = true
            lastKey = 'a'
            if (keys.w.pressed) {
                lastKey = 'wa'
            } else if (keys.s.pressed) {
                lastKey = 'sa'
            }
            break
        case 'KeyS':
            keys.s.pressed = true
            lastKey = 's'
            if (keys.d.pressed) {
                lastKey = 'sd'
            } else if (keys.a.pressed) {
                lastKey = 'sa'
            }
            break
        case 'KeyD':
            keys.d.pressed = true
            lastKey = 'd'
            if (keys.w.pressed) {
                lastKey = 'wd'
            } else if (keys.s.pressed) {
                lastKey = 'sd'
            }
            break
    }
})

window.addEventListener('keyup', (e) => {
    localStorage.setItem('offset', JSON.stringify({ x: movables[0].position.x, y: movables[0].position.y }))
    switch (e.code) {
        case 'KeyW':
            keys.w.pressed = false
            if (['wa', 'wd'].includes(lastKey)) {
                lastKey = lastKey.replace('w', '')
            }
            break
        case 'KeyA':
            keys.a.pressed = false
            if (['wa', 'sa'].includes(lastKey)) {
                lastKey = lastKey.replace('a', '')
            }
            break
        case 'KeyS':
            keys.s.pressed = false
            if (['sa', 'sd'].includes(lastKey)) {
                lastKey = lastKey.replace('s', '')
            }
            break
        case 'KeyD':
            keys.d.pressed = false
            if (['wd', 'sd'].includes(lastKey)) {
                lastKey = lastKey.replace('d', '')
            }
            break
    }
})