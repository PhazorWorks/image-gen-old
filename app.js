const express = require('express')
const {Canvas} = require('canvas-constructor')
const fs = require('fs')
const request = require('request')
const app = express()
const port = 3003
const fade = fs.readFileSync('assets/images/template-fade.png')
const bg = fs.readFileSync('assets/images/template.png')
const progFade = fs.readFileSync('assets/images/fade.png')

function download(uri, filename, callback) {
    request.head(uri, function () {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
    })
}

app.use(express.json())

app.post('/convert', async function (req, res) {
    const canvas = new Canvas(1920, 720)
    if (req.body.uri.includes('youtube.com')) {
        download(getYoutubeThumbnailUri(req.body.identifier), 'file.png', function () {
            canvas.addImage(fs.readFileSync('file.png'), 600, -125, 1300, 965,)
                .addImage(fade, 0, 0, 1800, 720)
                .setColor("#FFFFFF")
                .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
                .setTextFont('35pt Ubuntu')
                .addText('Added to the queue', 10, 45)
                .setTextFont('42pt Ubuntu')
                .addWrappedText(req.body.title, 10, 120, 580)
                .setTextFont('35pt Ubuntu')
                .addText('Length: ' + calcLength(req.body.duration), 10, 650)
                .addText('Requested by ' + req.body.author, 10, 700, 450)
            res.type('png')
            res.send(canvas.toBuffer())
            try {
                fs.unlinkSync('file.png')
            } catch (err) {
                console.error('failed to remove file' + err)
            }
        })
        return
    } else canvas.addImage(bg, 0, 0, 1920, 720,)
        .setColor("#FFFFFF")
        .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
        .setTextFont('35pt Ubuntu')
        .setTextAlign("center")
        .addWrappedText('Added to the queue', 960, 45, 1850)
        .setTextFont('55pt Ubuntu')
        .addWrappedText(req.body.title, 960, 250, 1850)
        .setTextFont('35pt Ubuntu')
        .setTextAlign("left")
        .addWrappedText('Length: ' + calcLength(req.body.duration), 500, 700, 500)
        .addText('Requested by ' + req.body.author, 980, 700, 450)
    res.type('png')
    res.send(canvas.toBuffer())
    return
})

app.post('/np', async function (req, res) {
    const canvas = new Canvas(1920, 720)
        .addImage(bg, 0, 0, 1920, 720)
        .setColor("white")
        .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
        .setTextFont('55pt Ubuntu')
        .setTextAlign("center")
        .addWrappedText(req.body.title, 960, 200, 1850)
        .addText(calcLength(req.body.position) + "/" + calcLength(req.body.duration), 960, 400, 1850)

    req.body.position < 5000 ?
        canvas.addText('The song has just started', 950, 575) :
        canvas.addImage(progFade, 210, 500, calcSongProgress(req.body.position, req.body.duration), 50)

    res.type('png')
    res.send(canvas.toBuffer())
})

function getYoutubeThumbnailUri(identifier) {
    return 'https://img.youtube.com/vi/%s/hqdefault.jpg'.replace('%s', identifier)
}

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
