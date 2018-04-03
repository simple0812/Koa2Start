var formidable = require('formidable');

exports.parseForm = function(req) {
  return new Promise((resolve, reject) => {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files){
      if(err){
        reject(err);
        return;
      }

      resolve({fields, files});
    });
  });
};