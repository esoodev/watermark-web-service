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

  form.on('part', function (part) {
    console.log(part);

    // if (![some condition I want to be met]) {
    //   form.emit('error', new Error('File upload canceled by the server.'));
    //   return;
    // }
    // ...code to handle the uploading process normally...
  });


  form.on('error', (err) => {
    console.log('hi');
  });
  // form.on('end', () => {
  //   console.log("finished");
  // });

  form.parse(req, function (err, fields, files) {
    try {
      _uploadHandleError({
        files: files,
        err: err,
        checkTypes: checkTypes
      });
    } catch (uploadErr) {
      form.emit('error');
      // console.log(uploadErr);

      // res.set({
      //   "Content-Type": "application/json",
      // })
      // res.status(err.status_code).send(
      //   JSON.stringify({
      //     status_code: err.status_code,
      //     message: err.message
      //   }));
    }
    // var oldpath = files.filetoupload.path;
    // var newpath = dir + files.filetoupload.name;

    // fs.rename(oldpath, newpath, function (err) {
    //   // File rename error handling.
    //   if (err) {
    //     throw JSON.stringify({
    //       status_code: 500,
    //       message: err
    //     });
    //   }
    // });
  });
}

/**
 * On upload complete.
 */
function _uploadOnComplete() {
  // res.set({
  //   "Content-Type": "application/json",
  // })
  // res.status(200).send(
  //   JSON.stringify({
  //     status_code: 200,
  //     message: "File uploaded and moved!"
  //   }));
  return JSON.stringify({
    status_code: 200,
    message: "File uploaded and moved!"
  })
};

/**
 * On upload error.
 */
function _uploadOnError(err) {
  // res.set({
  //   "Content-Type": "application/json",
  // })
  // res.status(500).send(
  //   JSON.stringify({
  //     status_code: 500,
  //     message: err
  //   }));
  return JSON.stringify({
    status_code: 500,
    message: err
  });

};

function _uploadHandleError(data) {

  let files = data.files;
  let err = data.err;
  let checkTypes = data.checkTypes;

  /**
   * Handle error when file name is null.
   */
  if (!files.filetoupload.name) {
    throw JSON.stringify({
      status_code: 400,
      message: "File is not included."
    });
  }

  /**
   * Handle error when file type is invalid.
   */
  if (checkTypes) {
    if (!_fileIsTypes(files.filetoupload, checkTypes)) {
      throw JSON.stringify({
        status_code: 400,
        message: "File type is invalid."
      });
    }
  }

  /**
   * Misc error handling.
   */
  if (err) {
    throw JSON.stringify({
      status_code: 500,
      message: err
    });
  }
}

function _fileIsTypes(filetoupload, types) {
  let fileType = filetoupload.type
  return types.includes(fileType.substr(0, fileType.indexOf('/')));
}

module.exports.upload = upload;