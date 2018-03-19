const keys = require('../config/keys');

module.exports = (req, res, next) => {
  if(req.hostname != keys.allowedHostName){
    console.log('-----------------------'+req.hostname)
    return res.status(401).send({error: 'You must Be Logged in to perform this action.'});
  }
  next();
}
