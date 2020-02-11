const express = require('express')
const {Canvas} = require('canvas-constructor')
const fs = require('fs')
const request = require('request')
const app = express()
const port = 3003
const fade = fs.readFileSync('template-fade.png')
const bg = fs.readFileSync('template.png')

function download(uri, filename, callback) {
    request.head(uri, function () {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
    })
}

app.use(express.json())

app.post('/convert', function (req, res) {
    const canvas = new Canvas(1920, 720)

    download(req.body.url, 'file.png', function () {
        if (req.body.url.includes("youtube.com")) canvas.addImage(fs.readFileSync('file.png'), 600, -125, 1300, 965,)
        else canvas.addImage(fs.readFileSync('file.png'), 960, 0, 1280, 720,)
        canvas.addImage(fade, 0, 0, 1400, 720)
            .setColor("#FFFFFF")
            .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
            .setTextFont('35pt Ubuntu')
            .addText('Added to the queue', 10, 45)
            .setTextFont('42pt Ubuntu')
            .addWrappedText(req.body.title, 10, 120, 580)
            .setTextFont('35pt Ubuntu')
            .addText('Length: ' + calcLength(req.body.length), 10, 650)
            .addText('Requested by ' + req.body.author, 10, 700, 450)

        res.type('png')
        res.send(canvas.toBuffer())
        try {
            fs.unlinkSync('file.png')
        } catch (err) {
            console.error('failed to remove file' + err)
        }
    })
})

app.post('/np', function (req, res) {
    const canvas = new Canvas(1920, 720)
        .addImage(bg, 0, 0, 1920, 720)
        .setColor("white")
        .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
        .setTextFont('55pt Ubuntu')
        .setTextAlign("center")
        .addWrappedText(req.body.title, 960, 300, 1850)
        .beginPath()
        .setColor('red')
        .addRect(210, 500, calcSongProgress(req.body.position, req.body.duration), 100)

    res.type('png')
    res.send(canvas.toBuffer())
})

function calcSongProgress(position, duration) {
    let width = 1500
    let percent = duration / position
    return width / percent
}

function calcLength(length) {
    let minutes = Math.floor(length / 60000)
    let seconds = ((length % 60000) / 1000).toFixed(0)
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds
}

app.listen(port, () => console.log(`Server listening on port ${port}`))
