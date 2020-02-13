// cron requests . cleanup tasks to run on the server
// https://scotch.io/tutorials/nodejs-cron-requests-by-examples
// https://www.npmjs.com/package/cron-parser

// https://www.npmjs.com/package/cron

const { requestDataAccess } = require('../data-access/requestDataAccess');
const CronJob = require('cron').CronJob;
// http://pm2.keymetrics.io/docs/usage/environment/

module.exports = () => {
  if (process.env.NODE_ENV === 'production') {
    if (process.env.NODE_APP_INSTANCE === '0') {
      // *second (0 - 59, optional)    *minute (0 - 59)    *hour (0 - 23)    *day of month (1 - 31)    *month (1 - 12)    *day of week (0 - 7) (0 or 7 is Sun)
      // clean requests at midnight
      new CronJob(
        // '0 0 0 * * *',
        '0 0 */3 * * *',
        () => {
          console.log('start running cron request: CleanUpAllExpiredNonAwardedRequests');
          requestDataAccess.BidOrBooAdmin.CleanUpAllExpiredNonAwardedRequests();
        },
        () => console.log('end running cron request: CleanUpAllExpiredNonAwardedRequests'),
        true,
        'America/Toronto'
      ).start();

      // run at midnight pm every day of the week
      // Notify anyone who is assigned a task via email and sms at 8pm
      new CronJob(
        '0 0 20 * * *',
        () => {
          console.log('start running cron request: SendRemindersForUpcomingRequests');
          requestDataAccess.BidOrBooAdmin.SendRemindersForUpcomingRequests();
        },
        () => console.log('end running cron request: SendRemindersForUpcomingRequests'),
        true,
        'America/Toronto'
      ).start();
      return;
    }

    if (process.env.NODE_APP_INSTANCE === '1') {
      new CronJob(
        // '0 0 03 * * *',
        '0 0 */4 * * *',
        () => {
          console.log('start running cron request: CleanUpAllBidsAssociatedWithDoneRequests');
          requestDataAccess.BidOrBooAdmin.CleanUpAllBidsAssociatedWithDoneRequests();
        },
        () => console.log('end running cron request: CleanUpAllBidsAssociatedWithDoneRequests'),
        true,
        'America/Toronto'
      ).start();
    }

    if (process.env.NODE_APP_INSTANCE === '2') {
      new CronJob(
        '0 0 */12 * * *',
        () => {
          console.log(
            'start running cron request: InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct'
          );

          requestDataAccess.BidOrBooAdmin.nagRequesterToConfirmRequest();
        },
        () =>
          console.log(
            'end running cron request: InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct ' +
              new Date()
          ),
        true,
        'America/Toronto'
      ).start();
    }

    if (process.env.NODE_APP_INSTANCE === '2') {
      new CronJob(
        '0 0 */12 * * *',
        () => {
          console.log('start running cron request: archiveAfter5Days');

          requestDataAccess.BidOrBooAdmin.archiveAfter5Days();
        },
        () => console.log('end running cron request: archiveAfter5Days ' + new Date()),
        true,
        'America/Toronto'
      ).start();
    }

    if (process.env.NODE_APP_INSTANCE === '3') {
      new CronJob(
        // '0 0 */6 * * *',
        '0 0 20 * * *',
        () => {
          console.log('start running cron request: SendPayoutsToBanks');
          requestDataAccess.BidOrBooAdmin.SendPayoutsToBanks();
        },
        () => console.log('end running cron request: SendPayoutsToBanks'),
        true,
        'America/Toronto'
      ).start();
    }
  }
};
