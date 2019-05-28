import React from 'react';
import ReactStars from 'react-stars';
import { connect } from 'react-redux';

import TextareaAutosize from 'react-autosize-textarea';
import axios from 'axios';
import * as A from '../../app-state/actionTypes';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

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
                  msg: 'Thank you for submitting your review.',
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
            <div>PUNCTULAITY</div>
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
          <div className="help">* note this will be visible to all users</div>
        </div>
      );
    };
    return (
      <div className="container is-widescreen has-text-centered">
        <section className="hero is-small">
          <div className="hero-body">
            <div className="container is-widescreen">
              <h2 className="title">Rate The Requester</h2>
            </div>
          </div>
        </section>
        <hr className="divider isTight" />
        <div className="card-content limitLargeMaxWidth">
          {bodyContent()}
          <button
            style={{ marginLeft: 12, marginTop: 12 }}
            className="button is-success is-medium"
            onClick={this.submitReview}
          >
            Submit Your Review
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
    );
  }
}

export default connect(
  null,
  null,
)(BidderReviewingCompletedJob);
