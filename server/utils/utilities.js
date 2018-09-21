const cloudinary = require('cloudinary');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

exports.encryptData = async dataToEncrypt => {
  // generate a salt
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    return bcrypt.hash(dataToEncrypt, salt);
  } catch (err) {
    return { errorMsg: 'Failed To encrypt the password', details: err };
  }
};

exports.compareEncryptedWithClearData = async (clearData, encryptedData) => {
  return bcrypt.compare(clearData, encryptedData);
};

// handles uploading file, returns file details + deletes temp file + calls back
exports.uploadFileToCloudinary = async (filePath, callbackFunc) => {
  return new Promise(async (resolve, reject) => {
    try {
      await cloudinary.v2.uploader.upload(
        filePath,
        async (error, result) => {
          // delete temporary intermediate file stored in TEMP_FILE_STORAGE
          try {
            await unlinkAsync(filePath + '/saas');
            callbackFunc(error, result);
            resolve(true);
          } catch (e) {
            reject(e);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
};
