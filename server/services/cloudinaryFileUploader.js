// file upload https://cloudinary.com/documentation/node_image_upload
var cloudinary = require('cloudinary');
const keys = require('../config/keys');

module.exports = () => {
  cloudinary.config({
    cloud_name: keys.cloudinaryCloudName,
    api_key: keys.cloudinaryPublicApiKey,
    api_secret: keys.cloudinarySecretApiKey
  });
};
