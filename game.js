// Doc: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Move_the_ball

// colors
let colors = {
    red: '#ff5555',
    darkRed: '#591d1d',
    green: '#50fa7b',
    darkGreen: '#185227',
    pink: '#ff79c6',
    darkPink: '#5c2a47'
}

// gameObjects
const renderer = new Renderer(480, 320)
const input = new Input()

const ball = createCircle(
    renderer.screenBounds().right / 2,
    renderer.screenBounds().bottom - 40,
    8, colors.darkPink, colors.pink
)

const paddle = createRectangle(
    renderer.screenBounds().right / 2 - 32,
    renderer.screenBounds().bottom - 32,
    64,
    16,
    colors.darkGreen,
    colors.green
)

const bricks = createBricks()

function createBricks() {
    let bricks = []
    let brickRows = 5
    let brickColumns = 10
    let brickPadding = 5
    let brickWidth = (renderer.screenBounds().right / brickColumns) - (2 * brickPadding)
    let brickHeight = 15

    // init
    for (let r = 0; r < brickRows; r++) {
        for (let c = 0; c < brickColumns; c++) {
            let newBrick = createRectangle(
                brickPadding + (c * (brickWidth + brickPadding * 2)),
                brickPadding + (r * (brickHeight + brickPadding * 2)),
                brickWidth,
                brickHeight,
                colors.darkRed,
                colors.red
            )
            bricks.push(newBrick)
        }
    }

    return {
        bricks,
        draw() {
            bricks.forEach(b => {
                renderer.renderRectangle(b.x, b.y, b.width, b.height, b.color, b.outlineColor)
            })
        }
    }

}

// game loop

let interval = setInterval(gameLoop, 10)

function gameLoop() {

    // update objects
    ball.update()
    paddle.update()

    // collision with paddle
    if(ball.checkCollision(paddle)){
        ball.speedY *= -1
    }
    // collision with bricks
    for(let i = 0; i < bricks.bricks.length; i++){
        if(ball.checkCollision(bricks.bricks[i])){
            ball.speedY *= -1
            bricks.bricks.splice(i, 1)
            break
        }
    }


    // render objects
    renderer.clear()

    bricks.draw()
    ball.draw()
    paddle.draw()
}

function createRectangle(x, y, width, height, color, outlineColor) {
    return {
        x, y, width, height, color, outlineColor,
        speedX: 4, speedY: 0,
        update() {
            // check input and update position
            if (input.keyPressed('ArrowRight')) {
                this.x += this.speedX
            }
            if (input.keyPressed('ArrowLeft')) {
                this.x -= this.speedX
            }

            // check bounds
            if (this.x + this.width > renderer.screenBounds().right) {
                this.x = renderer.screenBounds().right - this.width
            }
            if (this.x < renderer.screenBounds().left) {
                this.x = renderer.screenBounds().left
            }

        },
        draw() {
            renderer.renderRectangle(this.x, this.y, this.width, this.height, this.color, this.outlineColor)
        }
    }
}

function createCircle(x, y, radius, color, outlineColor) {
    return {
        x, y, radius, color, outlineColor,
        speedX: 1, speedY: -1,
        update() {
            // check bounds
            if (this.x + this.speedX + this.radius > renderer.screenBounds().right ||
                this.x + this.speedX - this.radius < renderer.screenBounds().left) {
                this.speedX *= -1
            }
            if (this.y + this.speedY - this.radius < renderer.screenBounds().top) {
                this.speedY *= -1
            }
            if (this.y + this.speedY + this.radius > renderer.screenBounds().bottom) {
                // game over
                alert('Game Over!')
                document.location.reload()
                clearInterval(interval)
            }

            // move
            this.x += this.speedX
            this.y += this.speedY

            // collision with paddle?
        },
        checkCollision(other) {
            if (this.x + this.radius >= other.x && this.x - this.radius <= other.x + other.width &&
                this.y + this.radius >= other.y && this.y - this.radius <= other.y + other.height) {
                return true
            }
            return false
        },
        draw() {
            renderer.renderCircle(this.x, this.y, this.radius, this.color, this.outlineColor)
        }
    }
}

// renderer

function Renderer(width, height) {

    let canvas = document.querySelector('canvas')
    let context = canvas.getContext('2d')

    // dimensions
    canvas.width = width
    canvas.height = height

    function screenBounds() {
        return { top: 0, right: canvas.width, bottom: canvas.height, left: 0 }
    }

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height)
    }

    function renderCircle(x, y, radius, color, outlineColor) {
        if (outlineColor) {
            context.beginPath()
            context.arc(x, y, radius, 0, Math.PI * 2)
            context.strokeStyle = hexToRgb(outlineColor)
            context.lineWidth = 2
            context.stroke()
            context.closePath()
        }
        if (color) {
            context.beginPath()
            context.arc(x, y, radius, 0, Math.PI * 2)
            context.fillStyle = hexToRgb(color)
            context.fill()
            context.closePath()
        }
    }

    function renderRectangle(x, y, width, height, color, outlineColor) {
        if (outlineColor) {
            context.lineWidth = 2
            context.strokeStyle = hexToRgb(outlineColor)
            context.strokeRect(x, y, width, height)
        }
        if (color) {
            context.fillStyle = hexToRgb(color)
            context.fillRect(x, y, width, height)
        }
    }

    function hexToRgb(hex, alpha) {
        hex = hex.replace('#', '');
        var r = parseInt(hex.length == 3 ? hex.slice(0, 1).repeat(2) : hex.slice(0, 2), 16);
        var g = parseInt(hex.length == 3 ? hex.slice(1, 2).repeat(2) : hex.slice(2, 4), 16);
        var b = parseInt(hex.length == 3 ? hex.slice(2, 3).repeat(2) : hex.slice(4, 6), 16);
        if (alpha) {
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
        }
        else {
            return 'rgb(' + r + ', ' + g + ', ' + b + ')';
        }
    }

    return {
        clear,
        renderCircle,
        renderRectangle,
        screenBounds
    }
}

// input

function Input() {
    let currentKeys = []

    window.addEventListener('keydown', function (e) {
        let index = currentKeys.indexOf(e.key)
        if (index == -1) {
            currentKeys.push(e.key)
        }
    })

    window.addEventListener('keyup', function (e) {
        let index = currentKeys.indexOf(e.key)
        if (index != -1) {
            currentKeys.splice(index, 1)
        }
    })

    function keyPressed(key) {
        return currentKeys.indexOf(key) != -1
    }

    return {
        keyPressed
    }
}

