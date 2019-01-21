import React from 'react';
import ReactStars from 'react-stars';
import TextareaAutosize from 'react-autosize-textarea';
import axios from 'axios';

import ReviewMyAwardedJobAndWinningBidPage from '../proposer-flow/ReviewMyAwardedJobAndWinningBidPage';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

export default class ProposerReviewingCompletedJob extends React.Component {
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
        .catch((error) => {
          alert('submitting the review failed ' + error);
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
    debugger;
    const fieldValue = e.target.value;
    this.setState({ personalComment: fieldValue });
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
          <label className="label">Please Rate the Tasker:</label>
          <div className="content">
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
            <div className="help">*note this will be visible to all users</div>
          </div>
        </React.Fragment>
      );
    };

    return (
      <section className="section">
        <section className="hero is-small is-dark">
          <div className="container">
            <div className="hero-body">
              <div className="container">
                <h2 style={{ color: 'white' }} className="subtitle">
                  Give your feedback about
                  <span className="is-size-4 has-text-weight-bold">
                    Tasker and the quality of thier work
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div className="card-content">
              {bodyContent()}
              <button
                className="button is-success is-large"
                disabled={!this.state.isValid}
                onClick={this.submitReview}
              >
                Submit Review
              </button>

              <button
                style={{ marginLeft: 12, marginTop: 12 }}
                className="button is-outlined is-medium has-text-dark"
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.HOME);
                }}
              >
                remind me later
              </button>
            </div>
          </div>
        </section>
        <section className="hero is-small is-dark">
          <div className="container">
            <div className="hero-body">
              <div className="container">
                <h2 style={{ color: 'white' }} className="subtitle">
                  Referenced Task Details
                </h2>
              </div>
            </div>
          </div>
        </section>
        <div className="container">
          <ReviewMyAwardedJobAndWinningBidPage isReadOnlyView {...this.props} />
        </div>
      </section>
    );
  }
}
