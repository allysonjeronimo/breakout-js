let canvas = document.querySelector('canvas')
let context = canvas.getContext('2d')

// dimensions
canvas.width = 480
canvas.height = 320

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

let x = canvas.width/2
let y = canvas.height-16

// game loop

setInterval(gameLoop, 10)

function gameLoop() {

    x += 2
    y -= 2

    clear()

    renderRectangle(10, 10, 30, 30, colors.darkGreen, colors.green)
    renderCircle(x, y, 16, colors.darkPink, colors.pink)
}


// render

function clear(){
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