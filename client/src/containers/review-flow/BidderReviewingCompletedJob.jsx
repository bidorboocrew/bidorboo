import React from 'react';
import ReactStars from 'react-stars';
import TextareaAutosize from 'react-autosize-textarea';

import ReviewAwardedBidPage from '../bidder-flow/ReviewAwardedBidPage';
export default class ProposerReviewingCompletedJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      accuracyOfPostRating: 0,
      punctualityRating: 0,
      communicationRating: 0,
      mannerRating: 0,
      starCount: 0,
      acRatingClicked: false,
      proRatingClicked: false,
      onTimeRatingClicked: false,
      mannerRatingClicked: false,
    };
  }

  componentDidMount() {}

  accuracyOfPostChange = (newRating) => {
    if (!this.state.acRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, acRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });
    this.setState({ accuracyOfPostRating: newRating });
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

  render() {
    const bodyContent = () => {
      return (
        <React.Fragment>
          <div className="content">
            <div>
              QUALITY OF WORK
              <ReactStars
                //id="accuracyOfPost"
                half={false}
                count={5}
                value={this.state.accuracyOfPostRating}
                onChange={this.accuracyOfPostChange}
                size={50}
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
                color2={'#ffd700'}
              />
            </div>

            <br />
            <label className="label">Add a personal comment</label>
            <TextareaAutosize
              className="textarea is-marginless is-paddingless"
              style={{
                resize: 'none',
                border: 'none',
                color: '#4a4a4a',
                height: 'auto',
                padding: '1rem !important',
                minHeight: 100,
              }}
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
            <form onSubmit={() => null}>
              <div className="card-content">
                {bodyContent()}
                <button
                  className="button is-success is-large"
                  disabled={!this.state.isValid}
                  onClick={() => {
                    // onSubmit();
                  }}
                >
                  Submit Review
                </button>
              </div>
            </form>
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
          <ReviewAwardedBidPage isReadOnlyView {...this.props} />
        </div>
      </section>
    );
  }
}
