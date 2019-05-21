// cron jobs . cleanup tasks to run on the server
// https://scotch.io/tutorials/nodejs-cron-jobs-by-examples
// https://www.npmjs.com/package/cron-parser

const { jobDataAccess } = require('../data-access/jobDataAccess');
const CronJob = require('cron').CronJob;

module.exports = (app) => {
  // http://pm2.keymetrics.io/docs/usage/environment/
  if (process.env.NODE_APP_INSTANCE !== '0') {
    return;
  }
  /**
   * Tasks that we would wana run
   *
   * - update expired jobs and all relevant details (Expired)
   * - checkout any jobs that are scheduled for tomorrow and send reminder to owners about the jobs
   * - payout any completed jobs that are approved and reviewed
   * - backup the DB everynight
   */

  // run at 1230 am every day of the week
  // CleanUpAllExpiredJobs

  // *second (0 - 59, optional)    *minute (0 - 59)    *hour (0 - 23)    *day of month (1 - 31)    *month (1 - 12)    *day of week (0 - 7) (0 or 7 is Sun)
  // new CronJob(
  //   '00 00 00 * * *',
  //   async () => {
  //     if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE === '0') {
  //       const cleanExpiredJobs = await jobDataAccess.BidOrBooAdmin.CleanUpAllExpiredJobs();
  //       console.log('running cron job: expiredJobs ' + new Date());
  //     }
  //   },
  //   null,
  //   true,
  //   'America/Toronto'
  // );

  // run at midnight pm every day of the week
  // Notify anyone who is assigned a task via email and sms
  // new CronJob(
  //   '00 00 00 * * *',
  //   async () => {
  //     if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE === '0') {
  //       const NotifyAboutUpcomingJobs = await jobDataAccess.BidOrBooAdmin.SendRemindersForUpcomingJobs();
  //       console.log('running cron: jobsToBeNotifiedAbout ' + new Date());
  //     }
  //   },
  //   null,
  //   true,
  //   'America/Toronto'
  // );
};
