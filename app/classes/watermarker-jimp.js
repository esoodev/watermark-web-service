const fs = require('fs');

var Jimp = require('jimp');
var uniqid = require('uniqid');
var mime = require('mime-types');

async function watermark(baseImgUri, wmImgUri, options) {

    let opacity = (options && options.opacity) ? options.opacity : .5

    try {
        imgs = await _readImgs(baseImgUri, wmImgUri)
        baseImg = imgs[0]
        wmImg = imgs[1]

        // If watermark position is not set, put it in the middle.
        let wmX = (options && options.wmX) ? options.wmX : (baseImg.bitmap.width - wmImg.bitmap.width) / 2;
        let wmY = (options && options.wmY) ? options.wmY : (baseImg.bitmap.height - wmImg.bitmap.height) / 2;

        let result = await baseImg.composite(wmImg.opaque().opacity(opacity), wmX, wmY)

        return new Promise((resolve, reject) => {
            result.getBuffer(Jimp.MIME_PNG, (err, buf) => {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                resolve({
                    filename: `${uniqid()}.${mime.extension(Jimp.MIME_PNG)}`,
                    data: buf
                });
            });
        });


    } catch (err) {
        console.log(err);

        return (err);
    }

}

// Returns Point, denoting the width and height of the image.
async function getDimesions(imgUri) {
    try {
        let img = await Jimp.read(baseImgUri)
        return ({
            xy: new Point(img.bitmap.width, img.bitmap.height),
            img: img
        });
    } catch (err) {
        return (err);
    }
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
module.exports.getDimesions = getDimesions;