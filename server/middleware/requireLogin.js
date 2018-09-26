module.exports = (req, res, next) => {
  if (req.user && req.user.userId) {
    next();
  } else {
    return res
      .status(401)
      .send({ error: 'You must Be Logged in to perform this action.' });
  }
};
