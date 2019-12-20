const { requestDataAccess } = require('../data-access/requestDataAccess');

module.exports = async (req, res, next) => {
  try {
    let requestId = null;
    if (req.body && req.body.data && req.body.data.requestId) {
      requestId = req.body.data.requestId;
    } else if (req.query && req.query.requestId) {
      requestId = req.query.requestId;
    } else {
      return res
        .status(400)
        .send({ errorMsg: 'failed to validate request owner', details: `${e}` });
    }

    if (!requestId) {
      return res.status(403).send({
        errorMsg: 'missing paramerters requestId . can not confirm that you are the request Owner.',
      });
    }

    const userId = req.user._id.toString();
    const requestOwner = await requestDataAccess.isRequestOwner(userId, requestId);
    if (requestOwner && requestOwner._id) {
      next();
    } else {
      return res
        .status(403)
        .send({ errorMsg: 'only the request Owner can perform this operation.' });
    }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate is request owner', details: `${e}` });
  }
};
