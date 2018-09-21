// file upload https://cloudinary.com/documentation/node_image_upload
const cloudinary = require('cloudinary');
const multer = require('multer');
const path = require('path');

const EXPECTED_FILE_INPUT_ID_IN_THE_FORM = 'filesToUpload';
const TEMP_FILE_STORAGE = path.resolve(__dirname, '../uploadsTempDir');


const keys = require('../config/keys');
const upload = multer({ dest: TEMP_FILE_STORAGE });

module.exports = app => {
  // configure multer for handling form file input and intermediate storage
  app.use(upload.array(EXPECTED_FILE_INPUT_ID_IN_THE_FORM));

  // configure cloudinary to upload files to cloud
  cloudinary.config({
    cloud_name: keys.cloudinaryCloudName,
    api_key: keys.cloudinaryPublicApiKey,
    api_secret: keys.cloudinarySecretApiKey
  });
};
