const uploader = require("./services/uploader")

module.exports = function(app) {
  app.get("/", (req, res) => {
    // You'll create your note here.
    res.send("Hello")
  })

  app.post("/upload", (req, res) => {
    console.log(req)
    try {
      uploader.upload(req, res, __dirname + "/files/img/before")
    } catch (err) {
      console.log(err)
    }
  })
}
