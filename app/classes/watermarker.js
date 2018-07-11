const fs = require('fs');

var Point = require('./Point');

var Jimp = require('jimp');
var uniqid = require('uniqid');
var mime = require('mime-types');

async function watermark(baseImgUri, wmImgUri, options) {

    // Options
    let wmX = (options && options.wmX) ? options.wmX : 0,
        wmY = (options && options.wmY) ? options.wmY : 0,
        opacity = (options && options.opacity) ? options.opacity : .5,
        gravity = (options && options.gravity) ? options.gravity : 'NorthEast';
        
    let resultDest = (options && options.resultDest) ? options.resultDest : false,
        resultFilename = (options && options.resultFilename) ? options.resultFilename : `${uniqid()}.${mime.extension(Jimp.MIME_PNG)}`;
        deleteBaseImg = (options && options.deleteBaseImg) ? options.deleteBaseImg : false;

    try {
        imgs = await _readImgs(baseImgUri, wmImgUri)
        baseImg = imgs[0]
        wmImg = imgs[1]

        // Dimensions and gravity
        let baseImgDim = new Point(baseImg.bitmap.width, baseImg.bitmap.height),
            wmImgDim = new Point(wmImg.bitmap.width, wmImg.bitmap.height),
            displacement = _translateGravity(gravity, baseImgDim, wmImgDim)

        let result = await baseImg.composite(wmImg.opacity(opacity), displacement.x + wmX, displacement.y + wmY);

        if (deleteBaseImg)
            _deleteFile(baseImgUri);

        if (resultDest) {
            try {
                result.write(resultDest + resultFilename)
            } catch (err) {
                reject(err);
            }
        }

        return new Promise((resolve, reject) => {
            result.getBuffer(Jimp.MIME_PNG, (err, buf) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                resolve({
                    filename: resultFilename,
                    data: buf
                });
            });
        });


    } catch (err) {
        console.log(err);
        return (err);
    }

}

function _translateGravity(gravity, baseImgXY, wmImgXY) {

    let displacement = new Point(0, 0);

    switch (gravity) {
        case "Center":
            return baseImgXY.subtractPoint(wmImgXY).scale(.5);
        case "SouthEast":
            return baseImgXY.subtractPoint(wmImgXY);
        case "SouthWest":
            return baseImgXY.subtractXY(baseImgXY.x, wmImgXY.y);
        case "NorthEast":
            return displacement;
        case "NorthWest":
            return baseImgXY.subtractXY(wmImgXY.x, baseImgXY.y);
        default:
            return displacement;
    }

}

function _deleteFile(fileLoc) {
    fs.unlink(fileLoc, (err) => {
        if (err) console.log(err);
        else
            console.log('deleted ' + fileLoc);
    });
}

function _readImgs(baseImgUri, wmImgUri) {
    return new Promise((resolve, reject) => {
        try {
            Promise.all([Jimp.read(baseImgUri), Jimp.read(wmImgUri)]).then((imgs) => {
                resolve(imgs);
            })
        } catch (err) {
            reject(err)
        }
    });
}

module.exports.watermark = watermark;