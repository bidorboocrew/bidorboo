import React from 'react';
import ReactStars from 'react-stars';
import { connect } from 'react-redux';

import TextareaAutosize from 'react-autosize-textarea';
import axios from 'axios';
import * as A from '../../app-state/actionTypes';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import ReviewAwardedBidPage from '../bidder-flow/ReviewAwardedBidPage';

export class BidderReviewingCompletedJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accuracyOfPostRating: 0,
      punctualityRating: 0,
      communicationRating: 0,
      mannerRating: 0,
      personalComment: '',
    };
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
        .put(ROUTES.API.REVIEW.PUT.bidderSubmitReview, {
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

  render() {
    const bodyContent = () => {
      return (
        <React.Fragment>
          <p>
            Congratulations on fulfilling a job via our BidOrBoo platform. Rating and Reviews are
            the best way to grow our community and provide the best quality services ever.
          </p>
          <br />
          <label className="label">Please Rate the Task owner:</label>
          <div className="content">
            <div>
              ACCURACY OF POST
              <ReactStars
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
            <div className="help">*note this will be visible to all users</div>
          </div>
        </React.Fragment>
      );
    };
    return (
      <React.Fragment>
        <section className="hero is-small is-dark">
          <div className="container is-widescreen">
            <div className="hero-body">
              <div className="container is-widescreen">
                <h2 style={{ color: 'white' }} className="subtitle">
                  Give your feedback about Task and the Task owner
                </h2>
              </div>
            </div>
          </div>
        </section>
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
                switchRoute(ROUTES.CLIENT.HOME);
              }}
            >
              remind me later
            </button>
          </div>
        </div>
        <section className="hero is-small is-dark ">
          <div className="container is-widescreen">
            <div className="hero-body">
              <div className="container is-widescreen">
                <h2 style={{ color: 'white' }} className="subtitle">
                  Referenced Task Details
                </h2>
              </div>
            </div>
          </div>
        </section>
        <div className="container is-widescreen">
          <ReviewAwardedBidPage isReadOnlyView {...this.props} />
        </div>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  null,
)(BidderReviewingCompletedJob);
