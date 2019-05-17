import React from 'react';
import ReactStars from 'react-stars';
import { connect } from 'react-redux';

import TextareaAutosize from 'react-autosize-textarea';
import axios from 'axios';
import * as A from '../../app-state/actionTypes';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute, goBackToPreviousRoute } from '../../utils';

export class ProposerReviewingCompletedJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qualityOfWorkRating: 0,
      punctualityRating: 0,
      communicationRating: 0,
      mannerRating: 0,
      personalComment: '',
    };
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
      alert('please fill in a value for the Accuracy of posting category');
    } else if (punctualityRating === 0) {
      alert('please fill in a value for the punctuality  category');
    } else if (communicationRating === 0) {
      alert('please fill in a value for the communication category');
    } else if (mannerRating === 0) {
      alert('please fill in a value for the manners category');
    } else if (
      !cleanPerosnalComment ||
      cleanPerosnalComment.length < 10 ||
      cleanPerosnalComment.length > 100
    ) {
      alert(
        'please add a personal comment with at least 10 charachters and no more than 100 chars',
      );
    } else {
      // SUBMIT REVIEW
      axios
        .put(ROUTES.API.REVIEW.PUT.proposerSubmitReview, {
          data: {
            ...this.props.match.params,
            ...this.state,
          },
        })
        .then(() => {
          switchRoute(ROUTES.CLIENT.HOME);
          dispatch &&
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
          dispatch &&
            dispatch({
              type: A.UI_ACTIONS.SHOW_TOAST_MSG,
              payload: {
                toastDetails: {
                  type: 'error',
                  msg: 'submitting the review failed please try again later .',
                },
              },
            });
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
    const bodyContent = () => {
      return (
        <div className="card">
          <div className="card-content">
            <div className="content">
              <div className="is-size-4 has-text-weight-bold">Rate Your Tasker</div>
              <hr className="divider isTight" />
              <div>
                QUALITY OF WORK
                <ReactStars
                  //id="accuracyOfPost"
                  half={false}
                  count={5}
                  value={this.state.qualityOfWorkRating}
                  onChange={this.qualityOfWorkChange}
                  size={50}
                  color1={'lightgrey'}
                  color2={'#ffd700'}
                />
              </div>

              <div>
                PUNCTULAITY:
                <ReactStars
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
                COMMUNICATION:
                <ReactStars
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
                MANNERS:
                <ReactStars
                  half={false}
                  count={5}
                  value={this.state.mannerRating}
                  onChange={this.mannerChange}
                  size={50}
                  color1={'lightgrey'}
                  color2={'#ffd700'}
                />
              </div>

              <br />
              <label className="label">Add a personal comment</label>
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
                placeholder="The tasker did a great job .. etc"
              />
              <div className="help">* This will be visible to all users</div>
            </div>
          </div>
        </div>
      );
    };

    return (
      <div className="container is-widescreen">
        <div className="card-content">
          {bodyContent()}
          <button
            style={{ marginLeft: 12, marginTop: 12 }}
            className="button is-success is-medium"
            onClick={this.submitReview}
          >
            Submit Review
          </button>

          <button
            style={{ marginLeft: 12, marginTop: 12 }}
            className="button is-outlined has-text-dark  is-medium"
            onClick={() => {
              goBackToPreviousRoute();
            }}
          >
            remind me later
          </button>
        </div>
      </div>
    );
  }
}

export default connect(
  null,
  null,
)(ProposerReviewingCompletedJob);
