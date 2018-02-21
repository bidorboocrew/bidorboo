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
  try {
    return bcrypt.compare(clearData, encryptedData);
    const x =0;
  } catch (err) {
    return { errorMsg: 'Failed To compare the password', details: err };
  }
};
