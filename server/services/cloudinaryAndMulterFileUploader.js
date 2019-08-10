// file upload https://cloudinary.com/documentation/node_image_upload
const cloudinary = require('cloudinary');
const multer = require('multer');
const path = require('path');

const MAX_FILE_SIZE_IN_MB = 1000000 * 3; //3MB
const EXPECTED_FILE_INPUT_ID_IN_THE_FORM = 'filesToUpload';

const TEMP_FILE_STORAGE = path.resolve(__dirname, '../../uploadsTempDir');
const ALLOWED_FILE_EXTENSIONS_MIME_TYPE = /image\/(?:jpg|gif|png|tiff|bmp|jpeg)/;

const keys = require('../config/keys');

const storage = multer.memoryStorage();

const multerWithConfigs = multer({
  limits: {
    fileSize: MAX_FILE_SIZE_IN_MB,
    parts: 3,
  },
  dest: TEMP_FILE_STORAGE,
  fileFilter: (req, file, cb) => {
    // https://github.com/expressjs/multer/isues/114
    // replace this with regex to match image/*
    const isAllowedFileType =
      file && file.mimetype && ALLOWED_FILE_EXTENSIONS_MIME_TYPE.test(file.mimetype);

    if (!isAllowedFileType) {
      // ignore files that are not allowed
      //https://github.com/expressjs/multer
      cb(null, false);
    } else {
      cb(null, true);
    }
  },
}).array(EXPECTED_FILE_INPUT_ID_IN_THE_FORM, 3);

module.exports = (app) => {
  // configure multer for handling form file input and intermediate storage
  app.use(multerWithConfigs);

  // configure cloudinary to upload files to cloud
  cloudinary.config({
    cloud_name: keys.cloudinaryCloudName,
    api_key: keys.cloudinaryPublicApiKey,
    api_secret: keys.cloudinarySecretApiKey,
  });
};
