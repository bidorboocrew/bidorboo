const cloudinary = require('cloudinary');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

exports.encryptData = async (dataToEncrypt) => {
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    return bcrypt.hash(dataToEncrypt, salt);
  } catch (e) {
    return { errorMsg: 'Failed To encrypt the password', details: e };
  }
};

exports.compareEncryptedWithClearData = async (clearData, encryptedData) => {
  return bcrypt.compare(clearData, encryptedData);
};

// handles uploading file, returns file details + deletes temp file + calls back
exports.uploadFileToCloudinary = async (filePath, options, callbackFunc) => {
  return new Promise(async (resolve, reject) => {
    try {
      await cloudinary.v2.uploader.upload(filePath, options, async (error, result) => {
        // delete temporary intermediate file stored in TEMP_FILE_STORAGE
        try {
          await unlinkAsync(filePath);
          callbackFunc(error, result);
          resolve(true);
        } catch (e) {
          reject(e);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

// handles uploading file, returns file details + deletes temp file + calls back
exports.signCloudinaryParams = async (paramsToSign) => {
  return new Promise(async (resolve, reject) => {
    try {
      const signed = await cloudinary.utils.api_sign_request(paramsToSign, 'tWu-VkF7Dpn1b_AC5H9ymd2T_ak');
      resolve(signed);
    } catch (e) {
      reject(e);
    }
  });
};
