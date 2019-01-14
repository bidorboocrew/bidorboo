// cron jobs . cleanup tasks to run on the server
// https://scotch.io/tutorials/nodejs-cron-jobs-by-examples

const { jobDataAccess } = require('../data-access/jobDataAccess');
const CronJob = require('cron').CronJob;

module.exports = (app) => {
  /**
   * Tasks that we would wana run
   *
   * - update expired jobs and all relevant details (Expired)
   * - checkout any jobs that are scheduled for tomorrow and send reminder to owners about the jobs
   * - payout any completed jobs that are approved and reviewed
   * - backup the DB everynight
   */

  //
  CleanUpAllExpiredJobs = new CronJob('1 * * * * *', async () => {
    const expiredJobs = await jobDataAccess.BidOrBooAdmin.CleanUpAllExpiredJobs();
    console.log('You will see this message every minute');
  });

  //

  CleanUpAllExpiredJobs.start();
};
