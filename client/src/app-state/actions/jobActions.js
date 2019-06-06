import * as A from '../actionTypes';
import * as ROUTES from '../../constants/frontend-route-consts';
import axios from 'axios';
import { switchRoute, throwErrorNotification } from '../../utils';

export const updateBooedBy = (jobDetails) => (dispatch) =>
  dispatch({
    type: A.JOB_ACTIONS.UPDATE_JOB_VIEWED_BY,
    payload: axios
      .put(ROUTES.API.JOB.PUT.updateBooedBy, {
        data: {
          jobId: jobDetails._id,
        },
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const getAllMyRequests = () => (dispatch) =>
  dispatch({
    type: A.JOB_ACTIONS.GET_ALL_MY_REQUESTS,
    payload: axios.get(ROUTES.API.JOB.GET.getAllMyRequests),
  });

export const getAllMyOpenJobs = () => (dispatch) =>
  dispatch({
    type: A.JOB_ACTIONS.GET_ALL_MY_OPEN_JOBS,
    payload: axios.get(ROUTES.API.JOB.GET.myOpenJobs),
  });

export const cancelJobById = (jobId) => (dispatch) => {
  const req = dispatch({
    type: A.JOB_ACTIONS.DELETE_JOB_BY_ID,
    payload: axios.delete(ROUTES.API.JOB.DELETE.myJobById, { data: { jobId: jobId } }),
  });

  req.then((resp) => {
    if (resp && resp.value && resp.value.data) {
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'success',
            msg: 'Service Request was sucessfully deleted.',
          },
        },
      });

      switchRoute(`${ROUTES.CLIENT.PROPOSER.myOpenJobs}`);
    }
  });
};

export const getAllMyAwardedJobs = () => (dispatch) => {
  dispatch({
    type: A.JOB_ACTIONS.GET_ALL_MY_AWARDED_JOBS,
    payload: axios.get(ROUTES.API.JOB.GET.myAwardedJobs),
  });
};
export const searchJobsToBidOn = (values) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: values,
  });

  dispatch({
    type: A.JOB_ACTIONS.GET_ALL_POSTED_JOBS_VIA_SEARCH,
    payload: axios.post(ROUTES.API.JOB.POST.updateSearchThenSearchJobs, postData, config),
  });
};

export const getAllJobsToBidOn = () => (dispatch) => {
  dispatch({
    type: A.JOB_ACTIONS.GET_ALL_POSTED_JOBS,
    payload: axios.get(ROUTES.API.JOB.GET.alljobsToBidOn),
  });
};

export const getPostedJobDetails = (jobId) => (dispatch) =>
  dispatch({
    type: A.JOB_ACTIONS.GET_POSTED_JOB_DETAILS_BY_ID,
    payload: axios
      .get(ROUTES.API.JOB.GET.myJobById, { params: { jobId } })
      .then((resp) => {
        if (resp && resp.data) {
          dispatch({
            type: A.JOB_ACTIONS.SELECT_ACTIVE_POSTED_JOB,
            payload: { data: resp.data },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });

export const searchByLocation = (userSearchQuery) => (dispatch) => {
  const serverSearchQuery = {
    searchLocation: userSearchQuery.locationField,
    searchRaduis: userSearchQuery.searchRadiusField * 1000, // translate to KM
    jobTypeFilter: userSearchQuery.filterJobsByCategoryField, // list of categories to exclude from the search
  };

  dispatch({
    type: A.JOB_ACTIONS.SEARCH_JOB,
    payload: serverSearchQuery,
  });
  dispatch({
    type: A.JOB_ACTIONS.SEARCH_JOB,
    payload: axios
      .post(ROUTES.API.JOB.POST.searchJobs, {
        data: {
          searchParams: serverSearchQuery,
        },
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const getAwardedBidFullDetails = (jobId) => (dispatch) => {
  dispatch({
    type: A.JOB_ACTIONS.GET_JOB_FULL_DETAILS_BY_ID,
    payload: axios
      .get(ROUTES.API.JOB.GET.jobFullDetailsById, { params: { jobId } })
      .then((resp) => {
        // update recently added job
        if (resp && resp.data) {
          dispatch({
            type: A.JOB_ACTIONS.SELECT_AWARDED_JOB,
            payload: { data: resp.data },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const proposerConfirmsJobCompletion = (jobId) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: {
      jobId,
    },
  });

  dispatch({
    type: A.JOB_ACTIONS.PROPOSER_CONFIRMS_JOB_COMPLETION,
    payload: axios
      .put(ROUTES.API.JOB.PUT.proposerConfirmsJobCompleted, postData, config)
      .then((resp) => {
        // update recently added job
        if (resp && resp.data) {
          // xxxx update without reload
          window.location.reload();
          // navigate to review page
          // switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${jobId}`);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const proposerDisputesJob = ({ proposerDispute }) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: {
      jobId: proposerDispute.jobId,
      proposerDispute,
    },
  });

  dispatch({
    type: A.JOB_ACTIONS.PROPOSER_DISPUTES_JOB,
    payload: axios
      .put(ROUTES.API.JOB.PUT.proposerDisputeJob, postData, config)
      .then((resp) => {
        // update recently added job
        if (resp && resp.data) {
          // xxxx update without reload
          window.location.reload();
          // navigate to review page
          // switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${jobId}`);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const taskerDisputesJob = ({ taskerDispute }) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: {
      jobId: taskerDispute.jobId,
      taskerDispute,
    },
  });

  dispatch({
    type: A.JOB_ACTIONS.BIDDER_DISPUTES_JOB,
    payload: axios
      .put(ROUTES.API.JOB.PUT.bidderDisputeJob, postData, config)
      .then((resp) => {
        // update recently added job
        if (resp && resp.data) {
          // xxxx update without reload
          window.location.reload();
          // navigate to review page
          // switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${jobId}`);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const bidderConfirmsJobCompletion = (jobId) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = JSON.stringify({
    data: {
      jobId,
    },
  });

  dispatch({
    type: A.JOB_ACTIONS.BIDDER_CONFIRMS_JOB_COMPLETION,
    payload: axios
      .put(ROUTES.API.JOB.PUT.bidderConfirmsJobCompleted, postData, config)
      .then((resp) => {
        // update recently added job
        if (resp && resp.data && resp.data.success) {
          // xxxx update he bid without refresh
          window.location.reload();
          // navigate to review page
          // switchRoute(`${ROUTES.CLIENT.PROPOSER.selectedAwardedJobPage}/${jobId}`);
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

export const markBidAsSeen = (jobId, bidId) => (dispatch) => {
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };
  const postData = {
    data: {
      jobId,
      bidId,
    },
  };

  const response = dispatch({
    type: A.JOB_ACTIONS.REQUEST_MARK_BID_AS_SEEN,
    payload: axios.put(ROUTES.API.BID.PUT.markBidAsSeen, postData, config),
  });
  response.then(({ value }) => {
    if (value) {
      dispatch({
        type: A.JOB_ACTIONS.MARK_BID_AS_SEEN,
        payload: { jobId, bidId },
      });
    }
  });
};

export const addJob = (jobDetails, recaptchaField) => (dispatch) => {
  return dispatch({
    type: A.JOB_ACTIONS.ADD_NEW_JOB,
    payload: axios
      .post(ROUTES.API.JOB.POST.newJob, {
        recaptchaField,
        data: {
          jobDetails,
        },
      })
      .then((resp) => {
        //on successful creation of a job redirect the user to my jobs
        if (resp.data && resp.data._id) {
          switchRoute(`${ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(resp.data._id)}`);
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'Service Request was sucessfully created.',
              },
            },
          });
        }
      })
      .catch((error) => {
        throwErrorNotification(dispatch, error);
      }),
  });
};

/**
 * example add job with images
 */

// export const addJobWithImages = ({ initialDetails, jobImages }) => (dispatch) => {
//   const {
//     locationField,
//     detailedDescriptionField,
//     dateField,
//     hoursField,
//     minutesField,
//     periodField,
//     durationOfJobField,
//     addressTextField,
//     fromTemplateIdField,
//   } = initialDetails;
//   //map form fields to the mongodb schema expected fields
//   // for more ddetails look at jobModel.js

//   //  offset the location for security
//   // https://www.npmjs.com/package/haversine-offset
//   let lng = -75.6972; //ottawa
//   let lat = 45.4215;
//   try {
//     lng = parseFloat(locationField.lng);
//     lat = parseFloat(locationField.lat);
//     let preOffset = { latitude: lat, longitude: lng };
//     let offset = {
//       x: Math.floor(Math.random() * Math.floor(1000)),
//       y: Math.floor(Math.random() * Math.floor(1000)),
//     };

//     let postOffset = haversineOffset(preOffset, offset);

//     if (postOffset.lat > 0) {
//       lat = Math.min(postOffset.lat, 90).toFixed(5);
//     } else if (postOffset.lat < 0) {
//       lat = Math.max(postOffset.lat, -90).toFixed(5);
//     }
//     if (postOffset.lng > 0) {
//       lng = Math.min(postOffset.lng, 180).toFixed(5);
//     } else if (postOffset.lng < 0) {
//       lng = Math.max(postOffset.lng, -180).toFixed(5);
//     }
//   } catch (e) {
//     console.log('failed to create location default to ottawa'); //if not set to ottawa coords
//   }

//   const mapFieldsToSchema = {
//     detailedDescription: detailedDescriptionField,
//     location: {
//       type: 'Point',
//       coordinates: [parseFloat(lng), parseFloat(lat)],
//     },
//     startingDateAndTime: {
//       date: moment.utc(dateField).toDate(),
//       hours: hoursField,
//       minutes: minutesField,
//       period: periodField,
//     },
//     durationOfJob: durationOfJobField,
//     addressText: addressTextField,
//     state: 'OPEN',
//     fromTemplateId: fromTemplateIdField,
//   };

//   return dispatch({
//     type: A.JOB_ACTIONS.ADD_NEW_JOB,
//     payload: axios
//       .post(ROUTES.API.JOB.POST.newJob, {
//         data: {
//           jobDetails: mapFieldsToSchema,
//         },
//       })
//       .then((resp) => {
//         //on successful creation of a job redirect the user to my jobs
//         if (resp.data && resp.data._id) {
//           let data = new FormData();
//           const validImageFiles =
//             jobImages &&
//             jobImages.filter((imgFile) => {
//               return imgFile ? true : false;
//             });

//           validImageFiles &&
//             validImageFiles.length > 0 &&
//             validImageFiles.forEach((file) => {
//               data.append('filesToUpload', file, 'jobImages');
//             });
//           const config = {
//             headers: { 'content-type': 'multipart/form-data' },
//           };
//           data.append('jobId', resp.data._id);
//           if (validImageFiles.length > 0) {
//             dispatch({
//               type: A.JOB_ACTIONS.ADD_NEW_JOB,
//               payload: axios.put(ROUTES.API.JOB.PUT.jobImage, data, config).then((resp2) => {
//                 if (resp2 && resp2.data.success && resp2.data.jobId) {
//
//                   dispatch({
//                     type: A.UI_ACTIONS.SHOW_TOAST_MSG,
//                     payload: {
//                       toastDetails: {
//                         type: 'success',
//                         msg: 'Service Request was sucessfully created.',
//                       },
//                     },
//                   });
//                 }
//                 // switch route to show the currently added job
//               }),
//             });
//           } else {
//             dispatch({
//               type: A.UI_ACTIONS.SHOW_TOAST_MSG,
//               payload: {
//                 toastDetails: {
//                   type: 'success',
//                   msg: 'Service Request was sucessfully created.',
//                 },
//               },
//             });
//           }
//         }
//       })
//       .catch((error) => {
//         throwErrorNotification(dispatch, error);
//       }),
//   });
// };
