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

const textScore = createText(10, 22, 'Arial', '18px', colors.green, 'left')
const textLives = createText(renderer.screenBounds().right/2, 22, 'Arial', '18px', colors.green, 'center')

function createText(x, y, font, size, color, align, defaultValue) {
    return {
        x, y, font, size, color, align, defaultValue,

        draw(value) {
            if (value) {
                defaultValue = value
            }
            renderer.renderText(x, y, font, size, color, align, defaultValue)
        }
    }
}

let score = 0
let lives = 3

// game loop

// let interval = setInterval(gameLoop, 10)

gameLoop()

function gameLoop() {

    // update objects
    ball.update()
    paddle.update()

    // collision with paddle
    if (ball.checkCollision(paddle)) {
        ball.speedY *= -1
    }
    // collision with bricks
    for (let i = 0; i < bricks.bricksArray.length; i++) {
        if (ball.checkCollision(bricks.bricksArray[i])) {
            score++
            ball.speedY *= -1
            bricks.bricksArray.splice(i, 1)
            break
        }
    }

    // check if win
    if (bricks.initialBricksAmount == score) {
        alert('You Win!!!')
        score = 0
        document.location.reload()
        //clearInterval(interval)
    }

    // render objects
    renderer.clear()

    bricks.draw()
    ball.draw()
    paddle.draw()
    textScore.draw('Score: ' + score)
    textLives.draw('Lives: ' + lives)

    requestAnimationFrame(gameLoop)
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

            // mouse position
            // let mousePosition = input.mousePosition()

            // if (mousePosition.x > renderer.screenBounds().left &&
            //     mousePosition.x < renderer.screenBounds().right) {

            //     if (mousePosition.x > this.x + this.width / 2) {
            //         this.x += this.speedX
            //     }
            //     if (mousePosition.x < this.x + this.width / 2) {
            //         this.x -= this.speedX
            //     }
            // }

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
        
        reset(){
            this.x = renderer.screenBounds().right/2,
            this.y = renderer.screenBounds().bottom-40
            this.speedX = 1
            this.speedY = -1
        },

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
                lives--
                this.reset()
                // reset ball position
                if (!lives) {
                    alert('Game Over!')
                    score = 0
                    document.location.reload()
                    clearInterval(interval)
                }
            }

            // move
            this.x += this.speedX
            this.y += this.speedY
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

function createBricks() {
    let bricksArray = []
    let brickRows = 8
    let brickColumns = 20
    let brickPadding = 5
    let brickWidth = (renderer.screenBounds().right / brickColumns) - (2 * brickPadding)
    let brickHeight = 15
    let topOffset = 28

    // init
    for (let r = 0; r < brickRows; r++) {
        for (let c = 0; c < brickColumns; c++) {
            let newBrick = createRectangle(
                brickPadding + (c * (brickWidth + brickPadding * 2)),
                brickPadding + (r * (brickHeight + brickPadding * 2)) + topOffset,
                brickWidth,
                brickHeight,
                colors.darkRed,
                colors.red
            )
            bricksArray.push(newBrick)
        }
    }

    return {
        bricksArray,
        initialBricksAmount: brickRows * brickColumns,
        draw() {
            bricksArray.forEach(b => {
                renderer.renderRectangle(b.x, b.y, b.width, b.height, b.color, b.outlineColor)
            })
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

    function renderText(x, y, font, size, color, align, value) {
        context.font = size + ' ' + font
        context.fillStyle = color
        context.textAlign = align
        context.fillText(value, x, y)
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
        renderText,
        screenBounds
    }
}

// input

function Input() {
    let currentKeys = []
    let currentMousePosition = {}

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

    window.addEventListener('mousemove', function (e) {
        currentMousePosition = {
            x: e.clientX, y: e.clientY
        }
    })

    function keyPressed(key) {
        return currentKeys.indexOf(key) != -1
    }

    function mousePosition() {
        return currentMousePosition
    }

    return {
        keyPressed,
        mousePosition
    }
}

