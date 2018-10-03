module.exports = (req, res, next) => {
  if (req.user && req.user.userId) {
    next();
  } else {
    return res
      .status(401)
      .send({ errorMsg: 'You must Be Logged in to perform this action.' });
  }
};
