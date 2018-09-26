//handle all user data manipulations
const mongoose = require('mongoose');
var GeoJSON = require('mongoose-geojson-schema');

const utils = require('../utils/utilities');

const UserModel = mongoose.model('UserModel');
const JobModel = mongoose.model('JobModel');
const BidModel = mongoose.model('BidModel');

const applicationDataAccess = require('../data-access/applicationDataAccess');

const { AppHealthSchemaId } = require('../models/zModalConstants');

exports.bidDataAccess = {
  getAllBidsForUser: userId => {
    const populatePostedJobsOptions = {
      path: '_postedBids',
      options: {
        // limit: 4, ///xxxx saidm you gotta do something to get the next jobs .. but maybe initially remove the limit ?
        sort: { createdAt: -1 }
      },
      populate: {
        path: '_job',
        populate: {
          path: '_ownerId',
          select: { _id: 1, displayName: 1, globalRating: 1, profileImage:1 }
        }
      }
    };

    return UserModel.findById(userId)
      .populate(populatePostedJobsOptions)
      .lean(true)
      .exec();
  },
  postNewBid: ({ jobId, bidAmount, bidderId, userCurrency = 'CAD' }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newBid = await new BidModel({
          _bidderId: bidderId,
          _job: jobId,
          state: 'OPEN',
          hasJobOwnerSeenThis: false,
          bidAmount: { value: bidAmount, currency: userCurrency }
        }).save();

        const bidDetailsPopulateOptions = {
          path: '_job',
          populate: {
            path: '_ownerId',
            select: { _id: 1, displayName: 1, globalRating: 1 }
          }
        };

        //update the user and job model with this new bid
        const bidWithDetails = await Promise.all([
          JobModel.findOneAndUpdate(
            { _id: jobId },
            {
              $push: { _bidsList: newBid._id }
            },
            { new: true }
          )
            .lean(true)
            .exec(),
          UserModel.findOneAndUpdate(
            { _id: bidderId },
            {
              $push: { _postedBids: newBid._id }
            },
            { new: true }
          )
            .lean(true)
            .exec(),
          BidModel.findById(newBid._id)
            .populate(bidDetailsPopulateOptions)
            .lean(true)
            .exec()
        ]);

        //index2 is the bid with details populated
        resolve(bidWithDetails[2]);
      } catch (e) {
        reject(e);
      }
    });
  }
};
