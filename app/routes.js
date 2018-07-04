const watermarker = require("./services/watermarker"),
  multer = require("multer"),
  upload = multer({
    dest: __dirname + '/files/uploads/'
  });


module.exports = function (app) {
  app.get("/", (req, res) => {
    // You'll create your note here.
    res.send("Hello")
  })

  app.get("/watermark", (req, res) => {
    watermarker.watermarkLocal(res, __dirname + '/files/uploads/img/before/bear.jpg', __dirname + '/files/watermark/watermark.png', {
      wmLoc: '0,0',
      wmSize: '0,0',
      wmGravity: 'SouthEast'
    });
  })

  app.post("/watermark/upload", upload.array('photos', 12), function (req, res, next) {
    // req.files is array of `photos` files
    // req.body will contain the text fields, if there were any
    if (!req.file) {
      console.log("No file received");
      return res.send({
        success: false
      });

    } else {
      console.log('file received');
      return res.send({
        success: true
      })
    }
  })

}