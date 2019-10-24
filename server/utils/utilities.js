const cloudinary = require('cloudinary');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const keys = require('../config/keys');

const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const jobTemplatesDefinitions = require('./bdb-job-templates-definitions');

exports.encryptData = async (dataToEncrypt) => {
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    return bcrypt.hash(dataToEncrypt, salt);
  } catch (e) {
    return { errorMsg: 'Failed To encrypt the password', details: `${e}` };
  }
};

exports.compareEncryptedWithClearData = async (candidatePassword, encryptedPassword) => {
  return bcrypt.compare(candidatePassword, encryptedPassword);
};

// handles uploading file, returns file details + deletes temp file + calls back
//https://flaviocopes.com/how-to-remove-file-node/
// https://cloudinary.com/documentation/image_transformation_reference
exports.uploadFileToCloudinary = async (filePath, options, callbackFunc) => {
  return new Promise(async (resolve, reject) => {
    try {
      await cloudinary.v2.uploader.upload(filePath, options, async (error, result) => {
        callbackFunc && callbackFunc(error, result);
        resolve(true);
      });
    } catch (e) {
      console.log('BIDORBOO_ERROR: filed to uplod to cloudinary ' + JSON.stringify(e));
      reject(e);
    } finally {
      // delete temporary intermediate file stored in TEMP_FILE_STORAGE
      try {
        console.log(`BIDORBOOLOGGING: deleted temporary task file`);

        await unlinkAsync(filePath);

        callbackFunc && callbackFunc(null, null);
      } catch (e) {
        console.log(
          'BIDORBOO_ERROR: file at  (${filePath}) was not deleted successfully ' + JSON.stringify(e)
        );

        reject(e);
      }
    }
  });
};

// handles uploading file, returns file details + deletes temp file + calls back
exports.signCloudinaryParams = async (paramsToSign) => {
  return new Promise(async (resolve, reject) => {
    try {
      const signed = await cloudinary.utils.api_sign_request(
        paramsToSign,
        keys.cloudinarySecretApiKey
      );
      resolve(signed);
    } catch (e) {
      reject(e);
    }
  });
};

exports.detroyExistingImg = async (public_id) => {
  cloudinary.v2.uploader.destroy(public_id);
};
//   // delete all images in a folder
// const mongoUser_id = req.user._id.toString();

// await cloudinary.api.delete_resources_by_prefix(`${mongoUser_id}/Profile`, (error, result) => {
//   console.log(result, error);
// });

exports.jobTemplateIdToDefinitionObjectMapper = {
  [`${jobTemplatesDefinitions.HOUSE_CLEANING_DEF.ID}`]: jobTemplatesDefinitions.HOUSE_CLEANING_DEF,
  [`${jobTemplatesDefinitions.CAR_DETAILING_DEF.ID}`]: jobTemplatesDefinitions.CAR_DETAILING_DEF,
  [`${jobTemplatesDefinitions.PET_CARE_DEF.ID}`]: jobTemplatesDefinitions.PET_CARE_DEF,
};
