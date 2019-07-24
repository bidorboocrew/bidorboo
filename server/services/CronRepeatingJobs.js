// cron jobs . cleanup tasks to run on the server
// https://scotch.io/tutorials/nodejs-cron-jobs-by-examples
// https://www.npmjs.com/package/cron-parser

const { jobDataAccess } = require('../data-access/jobDataAccess');
const CronJob = require('cron').CronJob;
// http://pm2.keymetrics.io/docs/usage/environment/

module.exports = () => {
  /**
   * Tasks that we would wana run
   *
   * - update expired jobs and all relevant details (Expired)
   * - checkout any jobs that are scheduled for tomorrow and send reminder to owners about the jobs
   * - payout any completed jobs that are approved and reviewed
   * - backup the DB everynight
   */

  console.log('CRON JOBS INITIATED');

  if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE === '0') {
    // *second (0 - 59, optional)    *minute (0 - 59)    *hour (0 - 23)    *day of month (1 - 31)    *month (1 - 12)    *day of week (0 - 7) (0 or 7 is Sun)
    // clean jobs at midnight
    new CronJob(
      '00 00 00 * * *',
      async () => {
        try {
          console.log('start running cron job: CleanUpAllExpiredNonAwardedJobs ' + new Date());
          console.time('CleanUpAllExpiredNonAwardedJobs');
          await jobDataAccess.BidOrBooAdmin.CleanUpAllExpiredNonAwardedJobs();
          console.timeEnd('CleanUpAllExpiredNonAwardedJobs');
          console.log('end running cron job: CleanUpAllExpiredNonAwardedJobs ' + new Date());
        } catch (e) {
          console.log('running cron job: CleanUpAllExpiredNonAwardedJobs ' + JSON.stringify(e));
        }
      },
      () => console.log('end running cron job: CleanUpAllExpiredNonAwardedJobs ' + new Date()),
      true,
      'America/Toronto'
    ).start();

    // run at midnight pm every day of the week
    // Notify anyone who is assigned a task via email and sms at 8pm
    new CronJob(
      '00 00 20 * * *',
      async () => {
        try {
          console.log('start running cron job: SendRemindersForUpcomingJobs ' + new Date());
          console.time('SendRemindersForUpcomingJobs');
          await jobDataAccess.BidOrBooAdmin.SendRemindersForUpcomingJobs();
          console.timeEnd('SendRemindersForUpcomingJobs');
          console.log('end running cron job: SendRemindersForUpcomingJobs ' + new Date());
        } catch (e) {
          console.log('running cron job: SendRemindersForUpcomingJobs ' + JSON.stringify(e));
        }
      },
      () => console.log('end running cron job: SendRemindersForUpcomingJobs ' + new Date()),
      true,
      'America/Toronto'
    ).start();
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
        console.log('start running cron job: CleanUpAllBidsAssociatedWithDoneJobs ' + new Date());
        console.time('CleanUpAllBidsAssociatedWithDoneJobs');
        await jobDataAccess.BidOrBooAdmin.CleanUpAllBidsAssociatedWithDoneJobs();
        console.timeEnd('CleanUpAllBidsAssociatedWithDoneJobs');
      } catch (e) {
        console.log('running cron job: CleanUpAllBidsAssociatedWithDoneJobs ' + JSON.stringify(e));
      }
    },
    () => console.log('end running cron job: CleanUpAllBidsAssociatedWithDoneJobs ' + new Date()),
    true,
    'America/Toronto'
  ).start();

  new CronJob(
    '00 00 03 * * *',
    async () => {
      try {
        console.log(
          'start running cron job: InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct ' +
            new Date()
        );
        console.time('InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct');
        await jobDataAccess.BidOrBooAdmin.nagRequesterToConfirmJob();
        console.timeEnd('InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct');
      } catch (e) {
        console.log(
          'running cron job: InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct ' +
            JSON.stringify(e)
        );
      }
    },
    () =>
      console.log(
        'end running cron job: InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct ' +
          new Date()
      ),
    true,
    'America/Toronto'
  ).start();
}

if (process.env.NODE_ENV === 'production' && process.env.NODE_APP_INSTANCE === '2') {
  // *second (0 - 59, optional)    *minute (0 - 59)    *hour (0 - 23)    *day of month (1 - 31)    *month (1 - 12)    *day of week (0 - 7) (0 or 7 is Sun)
  // CleanUpAllBidsAssociatedWithDoneJobs at 3am
  // at 10pm submit payments
  new CronJob(
    '00 00 */6 * * *',
    async () => {
      try {
        console.log('start running cron job: SendPayoutsToBanks ' + new Date());
        console.time('SendPayoutsToBanks');
        await jobDataAccess.BidOrBooAdmin.SendPayoutsToBanks();
        console.timeEnd('SendPayoutsToBanks');
      } catch (e) {
        console.log('running cron job: SendPayoutsToBanks ' + JSON.stringify(e));
      }
    },
    () => console.log('end running cron job: SendPayoutsToBanks ' + new Date()),
    true,
    'America/Toronto'
  ).start();
}
