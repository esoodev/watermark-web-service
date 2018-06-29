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
    if (err) {
      res.end();
      throw err;
    }

    var oldpath = files.filetoupload.path;
    var newpath = dir + files.filetoupload.name;
    // TODO check trailing '/' after dir.

    fs.rename(oldpath, newpath, function(err) {
      if (err) {
        res.end();
        throw JSON.stringify(files.filetoupload);
      }
      res.writeHead(200, { "content-type": "text/plain" });
      res.write("File uploaded and moved!\n\n");
      res.end(util.inspect({ fields: fields, files: files }));
    });
  });
};
