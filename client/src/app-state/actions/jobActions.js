import * as A from '../actionTypes';
import * as ROUTES from '../../constants/route-const';
import axios from 'axios';
import moment from 'moment';

export const getAllJobs = () => (dispatch, getState) =>
  dispatch({
    type: A.JOB_ACTIONS.GET_ALL_JOBS,
    payload: axios.get(ROUTES.BACKENDROUTES.USERAPI.JOB_ROUTES)
  });

export const getJobById = jobId => (dispatch, getState) =>
  dispatch({
    type: A.JOB_ACTIONS.GET_JOB_BY_ID,
    payload: axios
      .get(`${ROUTES.BACKENDROUTES.USERAPI.JOB_ROUTES}/${jobId}`)
      .then(job => {
        // debugger;
      })
      .catch(error => {
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Sorry That did not work, Please try again later.\n' + error
            }
          }
        });
      })
  });

export const deleteJob = jobId => (dispatch, getState) => {
  dispatch({
    type: A.JOB_ACTIONS.DELETE_JOB_BY_ID,
    payload: axios
      .delete(ROUTES.BACKENDROUTES.USERAPI.JOB_ROUTES, {
        data: {
          jobId: jobId
        }
      })
      .then(res => {
        // debugger;
      })
      .catch(error => {
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Sorry That did not work, Please try again later.\n' + error
            }
          }
        });
      })
  });
};

export const updateJobDetails = jobDetails => {
  return (dispatch, getState) => {
    // xxx said mapping between form fields to the job attributes
    // maybe we should hide this from the user and make it happen on the backend .
    // who cares for now tho
    // return dispatch({
    //   type: A.JOB_ACTIONS.UPDATE_EXISTING_JOB,
    //   payload: axios
    //     .put(ROUTES.BACKENDROUTES.USERAPI.JOB_ROUTES, {
    //       data: {
    //         jobDetails: jobDetails
    //       }
    //     })
    //     .then(job => {
    //       debugger;
    //     })
    //     .catch(e => {
    //       debugger;
    //     })
    // });
  };
};

export const addJob = jobDetails => (dispatch, getState) => {
  const {
    locationField,
    detailedDescriptionField,
    dateField,
    hoursField,
    minutesField,
    periodField,
    durationOfJobField,
    addressTextField,
    jobTitleField,
    fromTemplateIdField
  } = jobDetails;

  //map form fields to the mongodb schema expected fields
  // for more ddetails look at jobModel.js
  const mapFieldsToSchema = {
    detailedDescription: detailedDescriptionField,
    location: {
      type: 'Point',
      coordinates: [locationField.lat, locationField.lng]
    },
    startingDateAndTime: {
      date: moment.utc(dateField).toDate(),
      hours: hoursField,
      minutes: minutesField,
      period: periodField
    },
    durationOfJob: durationOfJobField,
    addressText: addressTextField,
    state: 'OPEN',
    title: jobTitleField,
    fromTemplateId: fromTemplateIdField
  };
  return dispatch({
    type: A.JOB_ACTIONS.ADD_NEW_JOB,
    payload: axios
      .post(ROUTES.BACKENDROUTES.USERAPI.JOB_ROUTES, {
        data: {
          jobDetails: mapFieldsToSchema
        }
      })
      .then(resp => {
        //on successful creation of a job redirect the user to my jobs
        if (resp.data && resp.data._id) {
          dispatch({
            type: A.ROUTE_ACTIONS.USER_TRIGGERED_LOCATION_CHANGE,
            payload: { currentRoute: ROUTES.FRONTENDROUTES.PROPOSER.myjobs }
          });
          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'Great! You have added your job successfully'
              }
            }
          });
        }
      })
      .catch(error => {
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Sorry That did not work, Please try again later.\n' + error
            }
          }
        });
      })
  });
};
