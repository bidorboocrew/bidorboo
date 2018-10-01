module.exports = (req, res, next) => {
  if (!req.user || !req.user.userId != process.env.ADMIN_ID) {
    // return res.status(403).send({errorMsg: 'You are forbidden from performing this operation'});
  }
  next();
};
