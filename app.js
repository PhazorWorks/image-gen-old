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
    let url;
    if (req.body.url.includes("youtube.com")) {
        url = util.format("https://img.youtube.com/vi/%s/maxresdefault.jpg", req.body.identifier)
    }
    download(url, 'file.png', function () {
        canvas
            .addImage(fs.readFileSync('file.png'), 200, 0, 300, 169,)
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