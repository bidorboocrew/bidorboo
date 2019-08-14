const assert = require('assert');
const mongoose = require('mongoose');

describe('Creating records', () => {
  it('test stuff ', async (done) => {
    assert(1 === 1);
    const UserModel = mongoose.model('UserModel');
    const findpeople = await UserModel.findOneAndUpdate(
      {
        _id: { $in: ['5d532b53de8b1605049ed148'] },
      },
      { $pull: { _postedBidsRef: { $in: ['5d5389c9ebcf2c272414317a'] } } }
    )
      .lean()
      .exec();
    console.log(findpeople);
    done();
  });
});
