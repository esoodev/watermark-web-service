const fs = require('fs');

var gm = require('gm');
var uniqid = require('uniqid');
var PNG = require('pngjs').PNG;


function watermark(baseImgUri, wmImgUri, options) {

    return new Promise((resolve, reject) => {
        // Watermark position.
        let wmLoc = (options && options.wmLoc) ? options.wmLoc : '0,0'

        // 0,0 for wmSize uses actual image dimensions.
        let wmSize = (options && options.wmSize) ? options.wmSize : '0,0'

        // Watermark gravity : NorthWest, North, NorthEast, West, Center, East, SouthWest, South, or SouthEast

        let wmGravity = (options && options.wmGravity) ? options.wmGravity : 'SouthEast'
        // Result image format
        let resImgFormat = (options && options.resImgFormat) ? options.resImgFormat : 'png'

        // Delete original image
        let deleteOriginal = (options && options.deleteOriginal) ? options.deleteOriginal : false;

        gm(baseImgUri).
        gravity(wmGravity).
        draw([`image Over ${wmLoc} ${wmSize} "` + wmImgUri + '"']).
        noProfile().
        toBuffer(resImgFormat, function (err, buffer) {
            if (err) reject(err);

            if (deleteOriginal) {
                // Assuming that 'path/file.txt' is a regular file.
                fs.unlink(baseImgUri, (err) => {
                    if (err) reject(err);
                    console.log(`${baseImgUri} was deleted`);
                });
            }

            resolve({
                filename: `${uniqid()}.${resImgFormat}`,
                data: buffer
            });
        });
    });

}


module.exports.watermark = watermark;