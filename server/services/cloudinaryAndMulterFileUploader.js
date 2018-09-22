// file upload https://cloudinary.com/documentation/node_image_upload
const cloudinary = require('cloudinary');
const multer = require('multer');
const path = require('path');

const EXPECTED_FILE_INPUT_ID_IN_THE_FORM = 'filesToUpload';
const TEMP_FILE_STORAGE = path.resolve(__dirname, '../uploadsTempDir');
const ALLOWED_FILE_EXTENSIONS_MIME_TYPE = /image\/(?:jpg|gif|png|tiff|bmp|jpeg)/;

const keys = require('../config/keys');

const multerWithConfigs = multer({
  dest: TEMP_FILE_STORAGE,
  fileFilter: (req, file, cb) => {
    // https://github.com/expressjs/multer/isues/114
    // replace this with regex to match image/*
    const isAllowedFileType =
      file &&
      file.mimetype &&
      ALLOWED_FILE_EXTENSIONS_MIME_TYPE.test(file.mimetype);

    if (!isAllowedFileType) {
      // ignore files that are not allowed

      // TODO in the future we can even send an error  to the user
      // return cb(new Error('Only image files are allowed'));
    } else {
      cb(null, true);
    }
  }
});

module.exports = app => {
  // configure multer for handling form file input and intermediate storage
  app.use(multerWithConfigs.array(EXPECTED_FILE_INPUT_ID_IN_THE_FORM));

  // configure cloudinary to upload files to cloud
  cloudinary.config({
    cloud_name: keys.cloudinaryCloudName,
    api_key: keys.cloudinaryPublicApiKey,
    api_secret: keys.cloudinarySecretApiKey
  });
};
