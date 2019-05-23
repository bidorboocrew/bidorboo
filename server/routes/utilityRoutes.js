const ROUTES = require('../backend-route-constants');
const requireLogin = require('../middleware/requireLogin');
const utils = require('../utils/utilities');

module.exports = (app) => {
  app.get(ROUTES.API.UTILS.GET.signCloudinaryRequest, requireLogin, async (req, res) => {
    try {
      const params_to_sign = req.query;

      const signedParams = await utils.signCloudinaryParams(params_to_sign);
      res.send({ signature: signedParams });
    } catch (e) {
      return res.status(400).send({ errorMsg: 'Failed To upload profile img', details: `${e}` });
    }
  });
};
