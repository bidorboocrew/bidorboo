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

  // run at 1230 am every day of the week
  // CleanUpAllExpiredJobs
  const CleanUpAllExpiredJobs = new CronJob(
    '00 30 00 * * *',
    async () => {
      const expiredJobs = await jobDataAccess.BidOrBooAdmin.CleanUpAllExpiredJobs();
      console.log('running cron job will see this message every day at 1130');
    },
    null,
    true,
    'America/Toronto',
    null,
    true
  );

  // run at 11 pm every day of the week
  // Notify anyone who is assigned a task via email and sms
  const NotifyAboutUpcomingJobs = new CronJob(
    '00 25 23 * * *',
    async () => {
      const jobsToBeNotifiedAbout = await jobDataAccess.BidOrBooAdmin.SendRemindersForUpcomingJobs();
      console.log('running cron job will see this message every day at 1130');
    },
    null,
    true,
    'America/Toronto',
    null,
    true
  );
};
