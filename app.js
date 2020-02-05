const express = require('express')
const {Canvas} = require('canvas-constructor')
const fs = require('fs')
const app = express()
const port = 3333
const bg = fs.readFileSync('template.jpg')

app.use(express.json())

app.post('/', function (request, response) {
    const canvas = new Canvas(500, 200)
    canvas
        .addImage(bg, 0, 0, 500, 200)
        .setColor("#FFFFFF")
        .setShadowBlur(50)
        .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
        .setTextFont('10pt Ubuntu')
        .addText('Added to the queue', 10, 15)
        .setTextFont('20pt Ubuntu')
        .addText(request.body.title, 10, 40, 450)
        .setTextFont('10pt Ubuntu')
        .addText('Length: ' + calculateLength(request.body.length), 10, 170)
        .addText('Requested by ' + request.body.author, 10, 190, 450)
    response.type('jpg')
    response.send(canvas.toBuffer())
})

function calculateLength(millis) {
    var minutes = Math.floor(millis / 60000)
    var seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
}

app.listen(port)