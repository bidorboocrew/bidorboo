const userDataAccess = require('../data-access/userDataAccess');
const ROUTES = require('./route_constants');

module.exports = app => {
    app.get(ROUTES.API.GET_CURRENTUSER, (req, res) => {
      res.send(req.user);
    });

};
