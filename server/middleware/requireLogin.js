module.exports = (req, res, next) => {
  if(!req.user){
    //in the future redirect to login page
    return res.status(401).send({error: 'You must Be Logged in.'});
  }
  next();
}
