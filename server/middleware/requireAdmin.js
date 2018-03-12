module.exports = (req, res, next) => {
  if(!req.user || !req.user.userId != "10102122975013661"){
   // return res.status(403).send({error: 'You are forbidden from performing this operation'});
  }
  next();
}
