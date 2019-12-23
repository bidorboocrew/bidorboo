const userDataAccess = require('../data-access/userDataAccess');

module.exports = async (req, res, next) => {
  try {
    next();
    //   const currentUser = await userDataAccess.findOneByUserId(req.user.userId, { virtuals: true });

    //   if (currentUser && currentUser._id && currentUser.canBid) {
    //     next();
    //   } else {
    //     return res.status(401).send({
    //       errorMsg:
    //         'you are not allowed to bid. You must go to your profile page to verify your phone and email then setup your payout bank details',
    //     });
    //   }
  } catch (e) {
    return res
      .status(400)
      .send({ errorMsg: 'failed to validate is uesr ability to bid', details: `${e}` });
  }
};
