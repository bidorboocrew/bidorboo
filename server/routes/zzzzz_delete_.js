// const applicationDataAccess = require('../data-access/applicationDataAccess');
// const { jobDataAccess } = require('../data-access/jobDataAccess');

// const requireAdmin = require('../middleware/requireAdmin');

// module.exports = (app, logger) => {
//   // Special function to initialize our core schemas (APP WIDE global schemas)
//   // app.get(
//   //   '/bdbApp/initializeAppGlobalSchemas',
//   //   requireAdmin,
//   //   async (req, res, done) => {
//   //     try {
//   //       const initializingAppHealthModel = await applicationDataAccess.AppHealthModel.initialize();
//   //       const initializingAppJobsModel = await applicationDataAccess.AppJobsModel.initialize();
//   //       const initializingAppUsersModel = await applicationDataAccess.AppUsersModel.initialize();

//   //       res.send({ details: 'populated base models for your entire app succeeded' });
//   //       done(null);
//   //     } catch (e) {
//   //       res.send({ details: e });
//   //       done(null);
//   //     }
//   //   }
//   // );

//   app.get('/bdbApp/populatejob', async (req, res, done) => {
//     try {
//       let details = {
//         _ownerRef: '5aab3f36278b6733b05dda18',
//         detailedDescription:
//           'this will be an interesting task . I hope I can handle this shit oh no no no no no yes yes yes lol',
//         location: {
//           type: 'Point',
//           coordinates: [parseFloat(0), parseFloat(0)]
//         }
//       };
//       // add tasks
//       for (let i = 1; i <= 180; i++) {
//         let addTaskDetails = {
//           ...details,
//           title: 'Job number ' + i,
//           location: {
//             type: 'Point',
//             coordinates: [parseFloat(i/100000), parseFloat(0)]
//           }
//         };
//         jobDataAccess.addAJob(addTaskDetails);
//       }
//       for (let i = 1; i <= 180; i++) {
//         let addTaskDetails = {
//           ...details,
//           title: 'Job number ' + i + 180,
//           location: {
//             type: 'Point',
//             coordinates: [parseFloat(-1 * (i/100000)), parseFloat(0)]
//           }
//         };
//         jobDataAccess.addAJob(addTaskDetails);
//       }

//       res.send({
//         details: 'done populating jobs'
//       });
//       done(null);
//     } catch (e) {
//       res.send({ details: e });
//       done(null);
//     }
//   });

//   app.get('/bdbApp/getnearme', async (req, res, done) => {
//     try {
//       const geonearme = await jobDataAccess.getJobsNear([0,0]);

//       res.send({
//         details: geonearme
//       });
//       done(null);
//     } catch (e) {
//       res.send({ details: e });
//       done(null);
//     }
//   });
// };
