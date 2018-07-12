var watermarker = require("../classes/watermarker");

async function watermarkMemory(res, baseImgUri, wmImgUri, options) {

    try {

        watermarkedResult = await watermarker.watermark(baseImgUri, wmImgUri, options);
        
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Disposition': 'inline; filename=' + watermarkedResult.filename,
            'Content-Length': watermarkedResult.data.length
        });
        res.end(watermarkedResult.data, 'binary');

    } catch (err) {
        console.log(err);

    }
}

async function watermarkDisk(res, baseImgUri, wmImgUri, options) {

    try {
        watermarkedResult = await watermarker.watermark(baseImgUri, wmImgUri, options);
        res.redirect('/files/uploads/img/after/'+watermarkedResult.filename);
    } catch (err) {
        console.log(err);
    }
}

module.exports.watermarkMemory = watermarkMemory;
module.exports.watermarkDisk = watermarkDisk;