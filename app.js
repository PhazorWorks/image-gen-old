const express = require('express')
const app = express()
const port = 3333
const { Canvas } = require('canvas-constructor')

app.use(express.json());

app.post('/', function(request, response){
    const canvas = new Canvas(500,200)
    canvas
        .addText(request.body.author, 250, 100)
    console.log(request.body.type)
    response.type('jpg')
    response.send(canvas.toBuffer())
})

app.listen(port)