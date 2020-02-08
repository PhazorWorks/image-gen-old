const express = require('express')
const {Canvas} = require('canvas-constructor')
const fs = require('fs')
const request = require('request')
const app = express()
const port = 3003
const bg = fs.readFileSync('template.png')

function download(uri, filename, callback) {
    request.head(uri, function () {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
    })
}

app.use(express.json())

app.post('/', function (req, res) {
    const canvas = new Canvas(1920, 720)

    download(req.body.url, 'file.png', function () {
        if (req.body.url.includes("youtube.com")) canvas.addImage(fs.readFileSync('file.png'), 600, -125, 1400, 965,)
        else canvas.addImage(fs.readFileSync('file.png'), 960, 0, 1280, 720,)
        canvas.addImage(bg, 0, 0, 1400, 720)
            .setColor("#FFFFFF")
            .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
            .setTextFont('35pt Ubuntu')
            .addText('Added to the queue', 10, 45)
            .setTextFont('42pt Ubuntu')
            .addWrappedText(req.body.title, 10, 120, 580)
            .setTextFont('35pt Ubuntu')
            .addText('Length: ' + calculateLength(req.body.length), 10, 650)
            .addText('Requested by ' + req.body.author, 10, 700, 450)

        res.type('png')
        res.send(canvas.toBuffer())

    })
})

function calculateLength(millis) {
    let minutes = Math.floor(millis / 60000)
    let seconds = ((millis % 60000) / 1000).toFixed(0)
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
}

app.listen(port, () => console.log(`Server listening on port ${port}`))
