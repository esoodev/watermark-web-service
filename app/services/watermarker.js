const fs = require('fs'),
    gm = require('gm'),
    uniqid = require('uniqid');

const Canvas = require('canvas'),
    Image = Canvas.Image


function watermarkLocal(res, baseImgUri, wmImgUri, options) {

    // Watermark position.
    let wmLoc = (options && options.wmLoc) ? options.wmLoc : '0,0'
    // 0,0 for wmSize uses actual image dimensions.
    let wmSize = (options && options.wmSize) ? options.wmSize : '0,0'
    // Watermark gravity : NorthWest, North, NorthEast, West, Center, East, SouthWest, South, or SouthEast
    let wmGravity = (options && options.wmGravity) ? options.wmGravity : 'SouthEast'

    let outputFile = (options && options.outputFile) ? options.outputFile : `${__dirname}/${uniqid()}.jpg`

    gm(baseImgUri).
    gravity(wmGravity).
    draw([`image Over ${wmLoc} ${wmSize} "` + wmImgUri + '"']).
    noProfile().
    write(outputFile, function (err) {

        if (err) throw err;

        try {
            fs.readFile(outputFile, function (err, data) {
                if (err) throw err;
                var img = new Canvas.Image;
                img.src = data;

                // Initialiaze a new Canvas with the same dimensions
                // as the image, and get a 2D drawing context for it.
                let canvas = new Canvas(img.width, img.height);
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, img.width, img.height);

                res.write('<html><body>');
                res.write('<img src= \'' + canvas.toDataURL() + '\' />');
                res.write('</body></html>');
                res.end();
            });
        } catch (err) {
            throw err;
        }

    });
}

module.exports.watermarkLocal = watermarkLocal;