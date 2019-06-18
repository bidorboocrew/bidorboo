// cron jobs . cleanup tasks to run on the server
// https://scotch.io/tutorials/nodejs-cron-jobs-by-examples
// https://www.npmjs.com/package/cron-parser

const { jobDataAccess } = require('../data-access/jobDataAccess');
const CronJob = require('cron').CronJob;
// http://pm2.keymetrics.io/docs/usage/environment/

module.exports = (app) => {
  /**
   * Tasks that we would wana run
   *
   * - update expired jobs and all relevant details (Expired)
   * - checkout any jobs that are scheduled for tomorrow and send reminder to owners about the jobs
   * - payout any completed jobs that are approved and reviewed
   * - backup the DB everynight
   */

  if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE === '0') {
    // *second (0 - 59, optional)    *minute (0 - 59)    *hour (0 - 23)    *day of month (1 - 31)    *month (1 - 12)    *day of week (0 - 7) (0 or 7 is Sun)
    // clean jobs at midnight
    new CronJob(
      '00 00 00 * * *',
      async () => {
        try {
          const cleanExpiredJobs = await jobDataAccess.BidOrBooAdmin.CleanUpAllExpiredNonAwardedJobs();
          console.log('running cron job: expiredJobs ' + new Date());
        } catch (e) {
          console.log('running cron job: CleanUpAllExpiredNonAwardedJobs ' + JSON.stringify(e));
        }
      },
      null,
      true,
      'America/Toronto'
    );

    // run at midnight pm every day of the week
    // Notify anyone who is assigned a task via email and sms at 8pm
    new CronJob(
      '00 00 20 * * *',
      async () => {
        try {
          const NotifyAboutUpcomingJobs = await jobDataAccess.BidOrBooAdmin.SendRemindersForUpcomingJobs();
          console.log('running cron: jobsToBeNotifiedAbout ' + new Date());
        } catch (e) {
          console.log('running cron job: SendRemindersForUpcomingJobs ' + JSON.stringify(e));
        }
      },
      null,
      true,
      'America/Toronto'
    );
    return;
  }
};

if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE === '1') {
  // *second (0 - 59, optional)    *minute (0 - 59)    *hour (0 - 23)    *day of month (1 - 31)    *month (1 - 12)    *day of week (0 - 7) (0 or 7 is Sun)
  // CleanUpAllBidsAssociatedWithDoneJobs at 3am
  new CronJob(
    '00 00 03 * * *',
    async () => {
      try {
        const cleanExpiredJobs = await jobDataAccess.BidOrBooAdmin.CleanUpAllBidsAssociatedWithDoneJobs();
        console.log('running cron job: expiredJobs ' + new Date());
      } catch (e) {
        console.log('running cron job: CleanUpAllBidsAssociatedWithDoneJobs ' + JSON.stringify(e));
      }
    },
    null,
    true,
    'America/Toronto'
  );

  // CleanUpAllBidsAssociatedWithDoneJobs at 3am
  new CronJob(
    '00 00 03 * * *',
    async () => {
      try {
        const cleanExpiredJobs = await jobDataAccess.BidOrBooAdmin.CleanUpAllBidsAssociatedWithDoneJobs();
        console.log('running cron job: CleanUpAllBidsAssociatedWithDoneJobs ' + new Date());
      } catch (e) {
        console.log('running cron job: CleanUpAllBidsAssociatedWithDoneJobs ' + JSON.stringify(e));
      }
    },
    null,
    true,
    'America/Toronto'
  );
}
