// cron requests . cleanup tasks to run on the server
// https://scotch.io/tutorials/nodejs-cron-requests-by-examples
// https://www.npmjs.com/package/cron-parser

const { requestDataAccess } = require('../data-access/requestDataAccess');
const CronJob = require('cron').CronJob;
// http://pm2.keymetrics.io/docs/usage/environment/

module.exports = () => {
  /**
   * Tasks that we would wana run
   *
   * - update expired requests and all relevant details (Expired)
   * - checkout any requests that are scheduled for tomorrow and send reminder to owners about the requests
   * - payout any completed requests that are approved and reviewed
   * - backup the DB everynight
   */

  if (process.env.NODE_ENV === 'production') {
    console.log('CRON REQUESTS INITIATED');

    if (process.env.NODE_APP_INSTANCE === '0') {
      // *second (0 - 59, optional)    *minute (0 - 59)    *hour (0 - 23)    *day of month (1 - 31)    *month (1 - 12)    *day of week (0 - 7) (0 or 7 is Sun)
      // clean requests at midnight
      new CronJob(
        '00 00 00 * * *',
        async () => {
          try {
            //  handled
            console.log('start running cron request: CleanUpAllExpiredNonAwardedRequests');
            console.time('CleanUpAllExpiredNonAwardedRequests');
            await requestDataAccess.BidOrBooAdmin.CleanUpAllExpiredNonAwardedRequests();
            console.timeEnd('CleanUpAllExpiredNonAwardedRequests');
            console.log('end running cron request: CleanUpAllExpiredNonAwardedRequests');
          } catch (e) {
            console.log(
              'running cron request: CleanUpAllExpiredNonAwardedRequests ' + JSON.stringify(e)
            );
          }
        },
        () => console.log('end running cron request: CleanUpAllExpiredNonAwardedRequests'),
        true,
        'America/Toronto'
      ).start();

      // run at midnight pm every day of the week
      // Notify anyone who is assigned a task via email and sms at 8pm
      new CronJob(
        '00 00 20 * * *',
        async () => {
          try {
            // SAEED you dealt with this
            console.log('start running cron request: SendRemindersForUpcomingRequests');
            console.time('SendRemindersForUpcomingRequests');
            await requestDataAccess.BidOrBooAdmin.SendRemindersForUpcomingRequests();
            console.timeEnd('SendRemindersForUpcomingRequests');
            console.log('end running cron request: SendRemindersForUpcomingRequests');
          } catch (e) {
            console.log(
              'running cron request: SendRemindersForUpcomingRequests ' + JSON.stringify(e)
            );
          }
        },
        () => console.log('end running cron request: SendRemindersForUpcomingRequests'),
        true,
        'America/Toronto'
      ).start();
      return;
    }

    if (process.env.NODE_APP_INSTANCE === '1') {
      // *second (0 - 59, optional)    *minute (0 - 59)    *hour (0 - 23)    *day of month (1 - 31)    *month (1 - 12)    *day of week (0 - 7) (0 or 7 is Sun)

      new CronJob(
        '00 00 03 * * *',
        async () => {
          try {
            // SAEED you dealt with this
            console.log('start running cron request: CleanUpAllBidsAssociatedWithDoneRequests');
            console.time('CleanUpAllBidsAssociatedWithDoneRequests');
            await requestDataAccess.BidOrBooAdmin.CleanUpAllBidsAssociatedWithDoneRequests();
            console.timeEnd('CleanUpAllBidsAssociatedWithDoneRequests');
          } catch (e) {
            console.log(
              'running cron request: CleanUpAllBidsAssociatedWithDoneRequests ' + JSON.stringify(e)
            );
          }
        },
        () => console.log('end running cron request: CleanUpAllBidsAssociatedWithDoneRequests'),
        true,
        'America/Toronto'
      ).start();
    }

    if (process.env.NODE_APP_INSTANCE === '2') {
      new CronJob(
        '00 00 03 * * *',
        async () => {
          try {
            // SAEED you dealt with this
            console.log(
              'start running cron request: InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct ' +
                new Date()
            );
            console.time('InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct');
            await requestDataAccess.BidOrBooAdmin.nagRequesterToConfirmRequest();
            console.timeEnd('InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct');
          } catch (e) {
            console.log(
              'running cron request: InformRequesterThatMoneyWillBeAutoTransferredIfTheyDontAct ' +
                JSON.stringify(e)
            );
          }
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
    if (process.env.NODE_APP_INSTANCE === '3') {
      new CronJob(
        '00 00 */6 * * *',
        async () => {
          try {
            console.log('start running cron request: SendPayoutsToBanks');
            console.time('SendPayoutsToBanks');
            await requestDataAccess.BidOrBooAdmin.SendPayoutsToBanks();
            console.timeEnd('SendPayoutsToBanks');
          } catch (e) {
            console.log('running cron request: SendPayoutsToBanks ' + JSON.stringify(e));
          }
        },
        () => console.log('end running cron request: SendPayoutsToBanks'),
        true,
        'America/Toronto'
      ).start();
    }
  }
};
