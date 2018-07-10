const fs = require('fs');

var watermarker = require("../classes/watermarker");

async function watermarkSingle(res, baseImgUri, wmImgUri, options) {

    try {
        let watermarkedResult = await watermarker.watermark(baseImgUri, wmImgUri, options);

        res.writeHead(200, {
            "Content-Disposition": `filename=${watermarkedResult.filename}`,
            'Content-Type': 'image/png'
        });
        res.end(watermarkedResult.data, 'binary'); // Send the file data to the browser.

    } catch (err) {
        console.log(err);

    }
}

module.exports.watermarkSingle = watermarkSingle;