const express = require('express')
const {Canvas} = require('canvas-constructor')
const fs = require('fs')
const request = require('request')
const util = require('util')
const app = express()
const port = 3003
const bg = fs.readFileSync('template.png')

let download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
    })
}

app.use(express.json())
app.post('/', function (req, res) {
    const canvas = new Canvas(500, 169)
    download(req.body.url, 'file.png', function () {
        if (req.body.url.includes("youtube.com")) {
            canvas.addImage(fs.readFileSync('file.png'), 200, -28, 300, 225,)
        } else {
            canvas.addImage(fs.readFileSync('file.png'), 200, 0, 300, 169,)
        }
        canvas
            .addImage(bg, 0, 0, 400, 169)
            .setColor("#FFFFFF")
            .addTextFont('assets/Ubuntu-Regular.ttf', 'Ubuntu')
            .setTextFont('10pt Ubuntu')
            .addText('Added to the queue', 10, 15)
            .setTextFont('12pt Ubuntu')
            .addWrappedText(req.body.title, 10, 40, 200)
            .setTextFont('10pt Ubuntu')
            .addText('Length: ' + calculateLength(req.body.length), 10, 139)
            .addText('Requested by ' + req.body.author, 10, 159, 450)
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
