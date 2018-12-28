import React from 'react';
import ReactStars from 'react-stars';
import { withFormik } from 'formik';
import * as Yup from 'yup';
import { TextAreaInput } from '../components/forms/FormsHelpers';

import { templatesRepo } from '../constants/bidOrBooTaskRepo';

export default class ReviewPage extends React.Component {
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

  render() {
    const acRatingChanged = (newRating) => {
      if (!this.state.acRatingClicked)
        this.setState({ starCount: this.state.starCount + 1, acRatingClicked: true }, () => {
          if (this.state.starCount === 5) this.setState({ isValid: true });
        });
      this.setState({ acRatingValue: newRating });
    };

    const proRatingChanged = (newRating) => {
      if (!this.state.proRatingClicked)
        this.setState({ starCount: this.state.starCount + 1, proRatingClicked: true }, () => {
          if (this.state.starCount === 5) this.setState({ isValid: true });
        });

      this.setState({ proRatingValue: newRating });
    };

    const onTimeRatingChanged = (newRating) => {
      if (!this.state.onTimeRatingClicked)
        this.setState({ starCount: this.state.starCount + 1, onTimeRatingClicked: true }, () => {
          if (this.state.starCount === 5) this.setState({ isValid: true });
        });

      this.setState({ onTimeRatingValue: newRating });
    };

    const mannerRatingChanged = (newRating) => {
      if (!this.state.mannerRatingClicked)
        this.setState({ starCount: this.state.starCount + 1, mannerRatingClicked: true }, () => {
          if (this.state.starCount === 5) this.setState({ isValid: true });
        });

      this.setState({ mannerRatingValue: newRating });
    };

    const cleanRatingChanged = (newRating) => {
      if (!this.state.cleanRatingClicked)
        this.setState({ starCount: this.state.starCount + 1, cleanRatingClicked: true }, () => {
          if (this.state.starCount === 5) this.setState({ isValid: true });
        });

      this.setState({ cleanRatingValue: newRating });
    };

    const proposerContent = () => {
      return (
        <div>
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={proposer.profileImage.url} alt="Placeholder image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">{title}</p>
              <p className="subtitle is-half">{proposer.displayName}</p>
            </div>
          </div>
          <div className="content">
            <p className="heading">
              <div>Date of completion: {startingDateAndTime.date}</div>
            </p>
          </div>
        </div>
      );
    };
    const bidderContent = () => {
      return (
        <div>
          <div className="media">
            <div className="media-left">
              <figure className="image is-48x48">
                <img src={profileImage.url} alt="Placeholder image" />
              </figure>
            </div>
            <div className="media-content">
              <p className="title is-4">{title}</p>
              <p className="subtitle is-half">{displayName}</p>
            </div>
          </div>
          <div className="content">
            <p className="heading">
              <div>Date of completion: {startingDateAndTime.date}</div>
            </p>
            <p className="heading" />
          </div>
        </div>
      );
    };
    const bodyContent = () => {
      return (
        <div>
          <div className="content">
            <p className="heading">
              <div>
                ACCURACY OF POST:
                <ReactStars
                  //id="accuracyOfPost"
                  half={false}
                  count={5}
                  value={this.state.acRatingValue}
                  onChange={acRatingChanged}
                  size={24}
                  color2={'#ffd700'}
                />
              </div>
            </p>
            <p className="heading">
              <div>
                PROFICIENCY:
                <ReactStars
                  half={false}
                  count={5}
                  value={this.state.proRatingValue}
                  onChange={proRatingChanged}
                  size={24}
                  color2={'#ffd700'}
                />
              </div>
            </p>
            <p className="heading">
              <div>
                ON TIME:
                <ReactStars
                  half={false}
                  count={5}
                  value={this.state.onTimeRatingValue}
                  onChange={onTimeRatingChanged}
                  size={24}
                  color2={'#ffd700'}
                />
              </div>
            </p>
            <p className="heading">
              <div>
                MANNERS:
                <ReactStars
                  half={false}
                  count={5}
                  value={this.state.mannerRatingValue}
                  onChange={mannerRatingChanged}
                  size={24}
                  color2={'#ffd700'}
                />
              </div>
            </p>
            <p className="heading">
              <div>
                CLEANLINESS:
                <ReactStars
                  half={false}
                  count={5}
                  value={this.state.cleanRatingValue}
                  onChange={cleanRatingChanged}
                  size={24}
                  color2={'#ffd700'}
                />
              </div>
            </p>
            <p className="heading">
              {/* <TextAreaInput
                id="reviewText"
                type="text"
                label=""
                placeholder="Sample: Hey, this was a great service for a great price..."
                // error={touched.reviewText && errors.reviewText}
                // onChange={handleChange}
                // onBlur={handleBlur}
              /> */}
              <textarea
                className="textarea"
                placeholder="e.g. This was a great service for a great price..."
              />
            </p>
          </div>
        </div>
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

    const {
      job,
      bid,
      bidder,
      proposer,
      isForProposer,
      handleSubmit,
      onSubmit,
      touched,
      errors,
      handleChange,
      handleBlur,
    } = this.props;
    const { startingDateAndTime, fromTemplateId, title } = job._postedJobsRef[0];
    const { profileImage, displayName } = bidder;
    // const { profileImage, displayName } = proposer;
    return (
      <div className="slide-in-left" id="bdb-review-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: 'purple' }} className="hero-body  has-text-centered">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Review this Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Give your feedback about this job.
              </h2>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
          <div className="container">
            <div className="columns  is-multiline is-mobile">
              <div className="column is-half">
                <div className="card">
                  <header className="card-header">
                    <p className="card-header-title">Submit Review</p>
                  </header>
                  <div className="card-image">
                    <figure className="image is-3by3">
                      <img
                        src={
                          templatesRepo[fromTemplateId] && templatesRepo[fromTemplateId].imageUrl
                            ? templatesRepo[fromTemplateId].imageUrl
                            : 'https://vignette.wikia.nocookie.net/kongregate/images/9/96/Unknown_flag.png/revision/latest?cb=20100825093317'
                        }
                        alt="Placeholder image"
                      />
                    </figure>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="card-content">
                      {isForProposer && proposerContent()}
                      {!isForProposer && bidderContent()}
                      {bodyContent()}
                      {bodyFooter()}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
