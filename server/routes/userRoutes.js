const userDataAccess = require('../data-access/userDataAccess');
const ROUTES = require('./route_constants');

module.exports = app => {
  const x = ROUTES.API.GET_CURRENTUSER;
    app.get(ROUTES.API.GET_CURRENTUSER, (req, res) => {
      debugger;
      res.send(req.user);
    });

};
