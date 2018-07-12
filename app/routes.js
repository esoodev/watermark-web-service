const fs = require('fs');

var watermarkService = require("./services/watermarkService");

var uniqid = require('uniqid');
var mime = require('mime-types');
var multer = require("multer"),
  diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {

      // Multiple file upload batch identification.
      let batchId = req.query.batchId;

      // Create new directory for file upload if batchId exits.
      let dir = `${__dirname}/files/uploads/temp${batchId?'/'+batchId: ''}`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      cb(null, dir)

    },
    filename: function (req, file, cb) {
      cb(null, uniqid() + '.' + mime.extension(file.mimetype))
    }
  }),
  memoryStorage = multer.memoryStorage();

module.exports = function (app) {
  app.get("/", (req, res) => {
    // You'll create your note here.
    res.send("Hello")
  })

  /*
  File Upload Disk - Start
  */
  app.get('/upload/single/disk', function (req, res) {
    res.sendFile(__dirname + "/upload-single-disk.html");
  });

  var cpUploadDisk = multer({
    storage: diskStorage
  }).fields([{
    name: 'background',
    maxCount: 1
  }, {
    name: 'watermark',
    maxCount: 1
  }])

  app.post('/api/upload/single/disk', cpUploadDisk, function (req, res) {

    let files = req.files;

    if (!files || !files.watermark || !files.background) {
      console.log("No file received");
      return res.send({
        success: false
      });

    } else {

      // let background = req.files.background[0].buffer;
      let background = req.files.background[0].path;
      let watermark = req.files.watermark[0].path;

      console.log(background);
      

      watermarkService.watermarkDisk(res, background, watermark, {
        wmX: Number(req.body.wmX),
        wmY: Number(req.body.wmY),
        opacity: Number(req.body.opacity),
        deleteBaseImg: false,
        deleteWmImg: false,
        resultDest: `${__dirname}/files/uploads/img/after/`,
        resultFilename: req.body.resultFilename,
        gravity: req.body.gravity
      });
    }
  })
  /*
  File Upload Disk - End
  */

  /*
  File Upload Memory - Start
  */
  app.get('/upload/single/memory', function (req, res) {
    res.sendFile(__dirname + "/upload-single-memory.html");
  });

  var cpUploadMemory = multer({
    storage: memoryStorage
  }).fields([{
    name: 'background',
    maxCount: 1
  }, {
    name: 'watermark',
    maxCount: 1
  }])

  app.post('/api/upload/single/memory', cpUploadMemory, function (req, res) {

    let files = req.files;

    console.log(req.body.gravity);
    console.log(req.body.wmX);
    

    if (!files || !files.watermark || !files.background) {
      console.log("No file received");
      return res.send({
        success: false
      });

    } else {

      let background = req.files.background[0].buffer;
      let watermark = req.files.watermark[0].buffer;

      watermarkService.watermarkMemory(res, background, watermark, {
        wmX: Number(req.body.wmX),
        wmY: Number(req.body.wmY),
        opacity: Number(req.body.opacity),
        deleteBaseImg: false,
        deleteWmImg: false,
        resultDest: `${__dirname}/files/uploads/img/after/`,
        resultFilename: req.body.resultFilename,
        gravity: req.body.gravity
      });
    }
  })
  /*
  File Upload Memory - End
  */

}