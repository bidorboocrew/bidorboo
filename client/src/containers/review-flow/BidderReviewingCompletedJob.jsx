import React from 'react';
import ReactStars from 'react-stars';
import TextareaAutosize from 'react-autosize-textarea';
import axios from 'axios';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import ReviewAwardedBidPage from '../bidder-flow/ReviewAwardedBidPage';

export default class ProposerReviewingCompletedJob extends React.Component {
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
        })
        .catch((error) => {
          alert('submitting the review failed ' + error);
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
      <section className="section">
        <section className="hero is-small is-dark">
          <div className="container">
            <div className="hero-body">
              <div className="container">
                <h2 style={{ color: 'white' }} className="subtitle">
                  Give your feedback about Task and the Task owner
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
                style={{ marginLeft: 12, marginTop: 12 }}
                className="button is-success is-medium"
                onClick={this.submitReview}
              >
                Submit Review
              </button>

              <button
                style={{ marginLeft: 12, marginTop: 12 }}
                className="button is-outlined has-text-dark"
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.HOME);
                }}
              >
                remind me later
              </button>
            </div>
          </div>
        </section>
        <section className="hero is-small is-dark ">
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
          <ReviewAwardedBidPage isReadOnlyView {...this.props} />
        </div>
      </section>
    );
  }
}
