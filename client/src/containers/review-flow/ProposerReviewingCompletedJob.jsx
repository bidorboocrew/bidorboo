import React from 'react';
import ReactStars from 'react-stars';
import TextareaAutosize from 'react-autosize-textarea';

export default class ProposerReviewingCompletedJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      acRatingValue: 0,
      cleanRatingValue: 0,
      proRatingValue: 0,
      onTimeRatingValue: 0,
      mannerRatingValue: 0,
      starCount: 0,
      acRatingClicked: false,
      cleanRatingClicked: false,
      proRatingClicked: false,
      onTimeRatingClicked: false,
      mannerRatingClicked: false,
    };
  }

  componentDidMount() {}

  acRatingChanged = (newRating) => {
    if (!this.state.acRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, acRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });
    this.setState({ acRatingValue: newRating });
  };

  proRatingChanged = (newRating) => {
    if (!this.state.proRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, proRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });

    this.setState({ proRatingValue: newRating });
  };
  onTimeRatingChanged = (newRating) => {
    if (!this.state.onTimeRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, onTimeRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });

    this.setState({ onTimeRatingValue: newRating });
  };
  mannerRatingChanged = (newRating) => {
    if (!this.state.mannerRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, mannerRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });

    this.setState({ mannerRatingValue: newRating });
  };
  cleanRatingChanged = (newRating) => {
    if (!this.state.cleanRatingClicked)
      this.setState({ starCount: this.state.starCount + 1, cleanRatingClicked: true }, () => {
        if (this.state.starCount === 5) this.setState({ isValid: true });
      });

    this.setState({ cleanRatingValue: newRating });
  };

  render() {
    const bodyContent = () => {
      return (
        <React.Fragment>
          <div className="content">
            <div>
              ACCURACY OF POST:
              <ReactStars
                //id="accuracyOfPost"
                half={false}
                count={5}
                value={this.state.acRatingValue}
                onChange={this.acRatingChanged}
                size={40}
                color2={'#ffd700'}
              />
            </div>

            <div>
              PROFICIENCY:
              <ReactStars
                half={false}
                count={5}
                value={this.state.proRatingValue}
                onChange={this.proRatingChanged}
                size={40}
                color2={'#ffd700'}
              />
            </div>
            <div>
              ON TIME:
              <ReactStars
                half={false}
                count={5}
                value={this.state.onTimeRatingValue}
                onChange={this.onTimeRatingChanged}
                size={40}
                color2={'#ffd700'}
              />
            </div>
            <div>
              MANNERS:
              <ReactStars
                half={false}
                count={5}
                value={this.state.mannerRatingValue}
                onChange={this.mannerRatingChanged}
                size={40}
                color2={'#ffd700'}
              />
            </div>
            <div>
              CLEANLINESS:
              <ReactStars
                half={false}
                count={5}
                value={this.state.cleanRatingValue}
                onChange={this.cleanRatingChanged}
                size={40}
                color2={'#ffd700'}
              />
            </div>
            <br />
            <label>Write your Feedback</label>
            <TextareaAutosize
              className="textarea is-marginless is-paddingless"
              style={{
                resize: 'none',
                border: 'none',
                color: '#4a4a4a',
                height: 'auto',
                padding: '1rem',
                minHeight: 100,
              }}
              placeholder="The tasker did a great job .. etc"
            />
          </div>
        </React.Fragment>
      );
    };
    const bodyFooter = () => {
      return (
        <div>
          <footer className="card-footer">
            <button
              className="button is-success is-fullwidth "
              disabled={!this.state.isValid}
              onClick={() => {
                // onSubmit();
              }}
            >
              Submit Review
            </button>
          </footer>
        </div>
      );
    };

    return (
      <section className="section">
        <section className="hero is-small">
          <div className="container">
            <div style={{ backgroundColor: 'purple' }} className="hero-body">
              <div className="container">
                <h1 style={{ color: 'white' }} className="title">
                  Review this Jobs
                </h1>
                <h2 style={{ color: 'white' }} className="subtitle">
                  Give your feedback about this job.
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
                {bodyFooter()}
              </div>
            </form>
          </div>
        </section>
      </section>
    );
  }
}
