module.exports = (req, res, next) => {
  if (!req.user || !req.user.userId || !req.user._id) {
    return res.status(401).send({ errorMsg: 'you must be logged in to perform this action.' });
  }
  next();
};
