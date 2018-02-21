const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

exports.encryptData = data => {
  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) {
      return { errorMessage: 'Failed To Encrypt', details: err };
    }

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return { errorMessage: 'Failed To Hash', details: err };
      }
      return hash;
    });
  });
};

exports.compareEncryptedWithClearData = (clearData, encryptedData) => {
  bcrypt.compare(clearData, encryptedData, (err, isMatch) => {
    if (err) {
      return { errorMessage: 'Failed To Compare data', details: err };
    }
    return isMatch;
  });
};
