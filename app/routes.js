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
  upload = multer({
    storage: diskStorage
  })

module.exports = function (app) {
  app.get("/", (req, res) => {
    // You'll create your note here.
    res.send("Hello")
  })

  /*
  File Upload - Start
  */
  app.get('/upload/single', function (req, res) {
    res.sendFile(__dirname + "/upload-single.html");
  });

  app.post('/api/upload/single', upload.single("photo"), function (req, res) {

    let file = req.file;
    // console.log(file);

    let watermark = __dirname + '/files/img/watermark-2.png';

    if (!file) {
      console.log("No file received");
      return res.send({
        success: false
      });

    } else {
      watermarkService.watermarkSingle(res, file.path, watermark, {
        wmLoc: '0,0',
        wmSize: '0,0',
        wmGravity: 'SouthEast',
        resImgFormat: 'png',
        deleteOriginal: true
      });
    }
  })


  app.get('/upload/multiple', function (req, res) {
    // res.sendFile(__dirname + "/upload-multiple.html");
    res.setHeader('Content-Type', 'text/html');
    res.write(`
    <!DOCTYPE html>

    <html>
    
    <head>
      <title>Multiple file upload.</title>
    </head>
    
    <body>
      <form id="uploadForm" enctype="multipart/form-data" action="/api/upload/multiple?batchId=${uniqid()}" method="post">
        <input type="file" name="photos" multiple />
        <input type="submit" value="Upload Image" name="submit">
        <input type='text' id='random' name='random'>
        <br>
        <span id="status"></span>
      </form>
    </body>
    
    </html>`);
    res.end();
  });

  app.post('/api/upload/multiple', upload.array("photos", 12), function (req, res, cb) {

    let files = req.files;

    if (!files) {
      console.log("No files received");
      return res.send({
        success: false
      });
    } else {
      return res.send({
        files: files,
        success: true
      })
    }
  })
  /*
  File Upload - End
  */

}