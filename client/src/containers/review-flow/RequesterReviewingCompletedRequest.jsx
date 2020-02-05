import React from 'react';
import ReactStars from 'react-stars';
import { connect } from 'react-redux';
import * as A from '../../app-state/actionTypes';

import TextareaAutosize from 'react-autosize-textarea';
import axios from 'axios';

import * as ROUTES from '../../constants/frontend-route-consts';
import { goBackToPreviousRoute, throwErrorNotification } from '../../utils';
import { CenteredUserImageAndRating } from '../commonComponents.jsx';
import { Spinner } from '../../components/Spinner.jsx';
export class RequesterReviewingCompletedRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qualityOfWorkRating: 0,
      punctualityRating: 0,
      communicationRating: 0,
      mannerRating: 0,
      personalComment: '',
      userToBeRated: null,
    };
    if (this.props.match && this.props.match.params && this.props.match.params.requestId) {
      this.requestId = this.props.match.params.requestId;
    } else {
      goBackToPreviousRoute();
      return null;
    }
  }

  componentWillUnmount() {
    document.querySelector('body').setAttribute('style', 'background:#eeeeee');
  }

  componentDidMount() {
    document.querySelector('body').setAttribute('style', 'background:white');

    const { dispatch } = this.props;
    axios
      .get(ROUTES.API.REQUEST.GET.awardedRequestFullDetailsForRequester, {
        params: { requestId: this.requestId },
      })
      .then((resp) => {
        // update recently added request
        if (resp && resp.data) {
          if (resp.data._awardedBidRef._taskerRef) {
            this.setState({ userToBeRated: resp.data._awardedBidRef._taskerRef });
          } else {
            dispatch({
              type: A.UI_ACTIONS.SHOW_TOAST_MSG,
              payload: {
                toastDetails: {
                  type: 'error',
                  msg: 'Failed to fetch Tasker details',
                },
              },
            });
          }
        }
      })
      .catch(() => {
        dispatch({
          type: A.UI_ACTIONS.SHOW_TOAST_MSG,
          payload: {
            toastDetails: {
              type: 'error',
              msg: 'Invalid review request! please go back to your request inbox',
            },
          },
        });
      });
  }

  submitReview = () => {
    const {
      qualityOfWorkRating,
      punctualityRating,
      communicationRating,
      mannerRating,
      personalComment,
    } = this.state;
    const { dispatch } = this.props;

    const cleanPerosnalComment = personalComment && personalComment.trim();

    if (qualityOfWorkRating === 0) {
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg: 'please fill in a value for the Accuracy of posting category',
          },
        },
      });
    } else if (punctualityRating === 0) {
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg: 'please fill in a value for the punctuality  category',
          },
        },
      });
    } else if (communicationRating === 0) {
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg: 'please fill in a value for the communication category',
          },
        },
      });
    } else if (mannerRating === 0) {
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg: 'please fill in a value for the manners category',
          },
        },
      });
    } else if (
      !cleanPerosnalComment ||
      cleanPerosnalComment.length < 10 ||
      cleanPerosnalComment.length > 100
    ) {
      dispatch({
        type: A.UI_ACTIONS.SHOW_TOAST_MSG,
        payload: {
          toastDetails: {
            type: 'error',
            msg:
              'please add a personal comment with at least 10 characters and no more than 100 chars',
          },
        },
      });
    } else {
      // SUBMIT REVIEW
      axios
        .put(ROUTES.API.REVIEW.PUT.requesterSubmitReview, {
          data: {
            requestId: this.requestId,
            qualityOfWorkRating: this.state.qualityOfWorkRating,
            punctualityRating: this.state.punctualityRating,
            communicationRating: this.state.communicationRating,
            mannerRating: this.state.mannerRating,
            personalComment: this.state.personalComment,
          },
        })
        .then(() => {
          goBackToPreviousRoute();

          dispatch({
            type: A.UI_ACTIONS.SHOW_TOAST_MSG,
            payload: {
              toastDetails: {
                type: 'success',
                msg: 'Thank you for submitting your review. Good luck BidOrBooing',
              },
            },
          });
        })
        .catch((error) => {
          throwErrorNotification(dispatch, error);
        });
    }
  };
  qualityOfWorkChange = (newRating) => {
    this.setState({ qualityOfWorkRating: newRating });
  };

  punctualityChange = (newRating) => {
    if (!this.state.proRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, proRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });

    this.setState({ punctualityRating: newRating });
  };
  communicationChange = (newRating) => {
    if (!this.state.onTimeRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, onTimeRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });

    this.setState({ communicationRating: newRating });
  };
  mannerChange = (newRating) => {
    if (!this.state.mannerRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, mannerRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });

    this.setState({ mannerRating: newRating });
  };

  personalCommentOnChange = (e) => {
    const fieldValue = e.target.value;
    this.setState({ personalComment: fieldValue });
  };

  render() {
    const { userToBeRated } = this.state;

    const bodyContent = () => {
      return (
        <div className="content">
          <div>QUALITY OF WORK</div>
          <div>
            <ReactStars
              className="ReactStars"
              half={false}
              count={5}
              value={this.state.qualityOfWorkRating}
              onChange={this.qualityOfWorkChange}
              size={50}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          </div>
          <div>PUNCTUALITY</div>
          <div>
            <ReactStars
              className="ReactStars"
              half={false}
              count={5}
              value={this.state.punctualityRating}
              onChange={this.punctualityChange}
              size={50}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          </div>
          <div>COMMUNICATION</div>
          <div>
            <ReactStars
              className="ReactStars"
              half={false}
              count={5}
              value={this.state.communicationRating}
              onChange={this.communicationChange}
              size={50}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          </div>
          <div>MANNERS</div>
          <div>
            <ReactStars
              className="ReactStars"
              half={false}
              count={5}
              value={this.state.mannerRating}
              onChange={this.mannerChange}
              size={50}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          </div>
          <div>ADD A PERSONAL COMMENT</div>
          <TextareaAutosize
            className="textarea is-marginless"
            style={{
              resize: 'none',
              color: '#363636',
              height: 'auto',
              padding: '0.5rem',
              minHeight: 100,
            }}
            value={this.state.personalComment}
            onChange={this.personalCommentOnChange}
            placeholder="The Tasker was professional and did a great request ...etc"
          />
          <div className="help">* note this will be visible to all users</div>
        </div>
      );
    };

    return (
      <div style={{ background: 'white' }} className="container is-widescreen has-text-centered">
        {!userToBeRated && (
          <Spinner renderLabel={'fetching Tasker Details'} isLoading isDark={false} />
        )}
        {userToBeRated && (
          <>
            <section className="hero is-small is-dark">
              <div className="hero-body">
                <div className="container is-widescreen">
                  <h2 className="title">Rate The Tasker</h2>
                </div>
              </div>
            </section>
            <br></br>
            <section className="has-text-centered">
              <CenteredUserImageAndRating userDetails={userToBeRated} large isCentered />
            </section>

            <div className="card-content limitLargeMaxWidth">
              {bodyContent()}
              <button
                style={{ marginLeft: 12, marginTop: 12, width: '14rem' }}
                className="button is-success"
                onClick={this.submitReview}
              >
                <span className="icon">
                  <i className="fas fa-check"></i>
                </span>
                <span>Submit Review</span>
              </button>

              <button
                style={{ marginLeft: 12, marginTop: 12, width: '14rem' }}
                className="button has-text-dark"
                onClick={() => {
                  goBackToPreviousRoute();
                }}
              >
                <span className="icon">
                  <i className=" far fa-clock"></i>
                </span>
                <span>Remind Me Later</span>
              </button>
            </div>
          </>
        )}
        <br></br> <br></br>
      </div>
    );
  }
}

export default connect(null, null)(RequesterReviewingCompletedRequest);
