import React from 'react';
import ReactStars from 'react-stars';
import { connect } from 'react-redux';

import TextareaAutosize from 'react-autosize-textarea';
import axios from 'axios';
import * as A from '../../app-state/actionTypes';

import * as ROUTES from '../../constants/frontend-route-consts';
import { throwErrorNotification, goBackToPreviousRoute } from '../../utils';
import { CenteredUserImageAndRating } from '../commonComponents.jsx';
import { Spinner } from '../../components/Spinner.jsx';

export class TaskerReviewingCompletedRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accuracyOfPostRating: 0,
      punctualityRating: 0,
      communicationRating: 0,
      mannerRating: 0,
      personalComment: '',
      userToBeRated: null,
      requestId: null,
    };

    if (this.props.match && this.props.match.params && this.props.match.params.bidId) {
      this.bidId = this.props.match.params.bidId;
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
      .get(ROUTES.API.BID.GET.awardedBidDetailsForTasker, { params: { awardedBidId: this.bidId } })
      .then((resp) => {
        // update recently added request
        if (resp && resp.data) {
          if (resp.data._requestRef._ownerRef) {
            this.setState({
              userToBeRated: resp.data._requestRef._ownerRef,
              requestId: resp.data._requestRef._id,
            });
          } else {
            dispatch({
              type: A.UI_ACTIONS.SHOW_TOAST_MSG,
              payload: {
                toastDetails: {
                  type: 'error',
                  msg: 'Failed to fetch Requester details',
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
              msg: 'Invalid review request! please go back to your bids inbox',
            },
          },
        });
      });
  }

  accuracyOfPostChange = (newRating) => {
    this.setState({ accuracyOfPostRating: newRating });
  };

  punctualityChange = (newRating) => {
    this.setState({ punctualityRating: newRating });
  };
  communicationChange = (newRating) => {
    this.setState({ communicationRating: newRating });
  };
  mannerChange = (newRating) => {
    this.setState({ mannerRating: newRating });
  };

  personalCommentOnChange = (e) => {
    const fieldValue = e.target.value;
    this.setState({ personalComment: fieldValue });
  };

  submitReview = () => {
    const {
      accuracyOfPostRating,
      punctualityRating,
      communicationRating,
      mannerRating,
      personalComment,
    } = this.state;

    const { dispatch } = this.props;

    const cleanPerosnalComment = personalComment && personalComment.trim();

    if (accuracyOfPostRating === 0) {
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
      const { userToBeRated, requestId, ...ratingCategories } = this.state;
      // SUBMIT REVIEW
      axios
        .put(ROUTES.API.REVIEW.PUT.taskerSubmitReview, {
          data: {
            requestId,
            ...ratingCategories,
          },
        })
        .then(() => {
          goBackToPreviousRoute();
          dispatch &&
            dispatch({
              type: A.UI_ACTIONS.SHOW_TOAST_MSG,
              payload: {
                toastDetails: {
                  type: 'success',
                  msg: 'Thank you for submitting your review.',
                },
              },
            });
        })
        .catch((error) => {
          dispatch && throwErrorNotification(dispatch, error);
        });
    }
  };

  render() {
    const { userToBeRated } = this.state;

    const bodyContent = () => {
      return (
        <div className="content">
          <div>ACCURACY OF POST</div>
          <div>
            <ReactStars
              className="ReactStars"
              style={{ cursor: 'pointer', display: 'inline-block' }}
              half={false}
              count={5}
              value={this.state.accuracyOfPostRating}
              onChange={this.accuracyOfPostChange}
              size={50}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          </div>
          <div>
            <div>PUNCTUALITY</div>
            <ReactStars
              className="ReactStars"
              style={{ cursor: 'pointer', display: 'inline-block' }}
              half={false}
              count={5}
              value={this.state.punctualityRating}
              onChange={this.punctualityChange}
              size={50}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          </div>
          <div>
            <div>COMMUNICATION</div>
            <ReactStars
              className="ReactStars"
              style={{ cursor: 'pointer', display: 'inline-block' }}
              half={false}
              count={5}
              value={this.state.communicationRating}
              onChange={this.communicationChange}
              size={50}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          </div>
          <div>
            <div>MANNERS</div>
            <ReactStars
              className="ReactStars"
              style={{ cursor: 'pointer', display: 'inline-block' }}
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
            className="textarea is-marginless control"
            style={{
              resize: 'none',
              height: 'auto',
              padding: '0.5rem',
              minHeight: 100,
            }}
            value={this.state.personalComment}
            onChange={this.personalCommentOnChange}
            placeholder="The Requester was accurate in describing their request and very friendly...etc"
          />
          <div className="help">*Please use polite respectful language.</div>
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
                  <h2 className="title">Review The Requester</h2>
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
              <div className="help">
                Your review will not be displayed until both of you have completed submitting your
                reviews
              </div>
            </div>
          </>
        )}
        <br></br> <br></br>
      </div>
    );
  }
}

export default connect(null, null)(TaskerReviewingCompletedRequest);
