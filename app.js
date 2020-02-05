const express = require('express')
const app = express()
const port = 3333
const {Canvas} = require('canvas-constructor')

app.use(express.json())

app.post('/', function (request, response) {
    const canvas = new Canvas(500, 200)
    canvas
        .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
        .setTextFont('10pt Ubuntu')
        .addText('Added to the queue', 10, 10)
        .setTextFont('20pt Ubuntu')
        .addText(request.body.title, 10, 35, 450)
        .setTextFont('10pt Ubuntu')
        .addText('Requested by ' + request.body.author, 10, 180, 450)
    response.type('jpg')
    response.send(canvas.toBuffer())
})

app.listen(port)