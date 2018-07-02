const formidable = require("formidable"),
  http = require("http"),
  util = require("util"),
  fs = require("fs");

function upload(req, res, dir, checkTypes) {
  // Check for trailing '/' in dir
  if (dir[dir.length - 1] != "/") {
    dir = dir + "/";
  }

  // Temporaily save the file and later rename it.
  var form = new formidable.IncomingForm({
    uploadDir: dir + "/temp/"
  });

  form.parse(req, function (err, fields, files) {

    if (!_uploadHandleError({
        req: req,
        res: res,
        dir: dir,
        checkTypes: checkTypes,
        err: err,
        fields: fields,
        files: files
      })) return;

    var oldpath = files.filetoupload.path;
    var newpath = dir + files.filetoupload.name;

    // File rename error handling.
    fs.rename(oldpath, newpath, function (err) {
      if (err) {
        throw JSON.stringify({
          content_type: "application/json",
          status_code: 500,
          error: err
        });
      }
    });
    res.set({
      "Content-Type": "application/json",
    })
    res.status(200).send(
      JSON.stringify({
        status_code: 200,
        message: "File uploaded and moved!",
        file_name: files.filetoupload.name,
        inspect: {
          fields: fields,
          files: files
        }
      }));
  });
}

function _uploadHandleError(data) {

  let req = data.req;
  let res = data.res;
  let dir = data.dir;
  let files = data.files;
  let err = data.err;
  let checkTypes = data.checkTypes;

  /**
   * Handle error when file name is null.
   */
  if (!files.filetoupload.name) {

    res.set({
      "Content-Type": "application/json",
    })
    res.status(400).send(
      JSON.stringify({
        status_code: 400,
        message: "File is not included."
      }));
    return false;
  }

  /**
   * Handle error when file type is invalid.
   */
  if (checkTypes) {
    if (!_fileIsTypes(files.filetoupload, [checkTypes])) {
      res.set({
        "Content-Type": "application/json",
      })
      res.status(400).send(
        JSON.stringify({
          status_code: 400,
          message: "File type is invalid."
        }));
      return false;
    }
  }

  /**
   * Misc error handling.
   */
  if (err) {
    res.set({
      "Content-Type": "application/json",
    })
    res.status(500).send(
      JSON.stringify({
        status_code: 500,
        error: err
      }));
    return false;
  }
}

function _fileIsTypes(filetoupload, types) {
  let fileType = filetoupload.type
  return types.includes(fileType.substr(0, fileType.indexOf('/')));
}

module.exports.upload = upload;