const formidable = require("formidable"),
  http = require("http"),
  util = require("util"),
  fs = require("fs");

var exports = (module.exports = {});

exports.upload = function(req, res, dir) {
  // Check for trailing '/' in dir
  if (dir[dir.length - 1] != "/") {
    dir = dir + "/";
  }

  // Temporaily save the file and later rename it.
  var form = new formidable.IncomingForm({
    uploadDir: dir + "/temp/"
  });

  form.parse(req, function(err, fields, files) {
    if (!files.filetoupload.name) {
      res.writeHead(400, { "content-type": "application/json" });
      res.write(
        JSON.stringify({
          status_code: 400,
          error: "File is not included."
        })
      );
      res.end();
      return;
    }

    if (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.write(
        JSON.stringify({
          status_code: 500,
          error: err
        })
      );
      res.end();
      return;
    }

    var oldpath = files.filetoupload.path;
    var newpath = dir + files.filetoupload.name;
    // TODO check trailing '/' after dir.

    fs.rename(oldpath, newpath, function(err) {
      if (err) {
        res.writeHead(500, { "content-type": "application/json" });
        res.write(
          JSON.stringify({
            status_code: 500,
            error: err
          })
        );
        res.end();
        return;
      }
      
      res.writeHead(200, { "content-type": "application/json" });
      res.write(
        JSON.stringify({
          status_code: 200,
          message: "File uploaded and moved!",
          file_name: files.filetoupload.name,
          inspect: util.inspect({ fields: fields, files: files })
        })
      );
      res.end();
      return;
    });
  });
};
