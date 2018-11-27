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
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img src={proposer.profileImage.url} alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{title}</p>
              <p class="subtitle is-6">{proposer.displayName}</p>
            </div>
          </div>
          <div class="content">
            <p class="heading">
              <div>Date of completion: {startingDateAndTime.date}</div>
            </p>
          </div>
        </div>
      );
    };
    const bidderContent = () => {
      return (
        <div>
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img src={profileImage.url} alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{title}</p>
              <p class="subtitle is-6">{displayName}</p>
            </div>
          </div>
          <div class="content">
            <p class="heading">
              <div>Date of completion: {startingDateAndTime.date}</div>
            </p>
            <p class="heading" />
          </div>
        </div>
      );
    };
    const bodyContent = () => {
      return (
        <div>
          <div class="content">
            <p class="heading">
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
            <p class="heading">
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
            <p class="heading">
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
            <p class="heading">
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
            <p class="heading">
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
            <p class="heading">
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
                class="textarea"
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
          <footer class="card-footer">
            <button
              className="button is-primary is-fullwidth is-large"
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
            <div className="columns is-centered">
              <div className="column is-6">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">Submit Review</p>
                  </header>
                  <div class="card-image">
                    <figure class="image is-3by3">
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
                    <div class="card-content">
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
// const EnhancedForms = withFormik({
//   validationSchema: Yup.object().shape({
//     accuracyOfPost: Yup.mixed()
//       .required('amount is required.')
//       .test('accuracyOfPost', 'Name can only contain alphabits and numbers', (accuracyOfPost) => {
//         return accuracyOfPost.count > 0;
//       }),
//   }),
// });

//  EnhancedForms(ReviewPage);

// Example how to use this
// paste thie below into HomePage.jsx
// at the top of the pge unde render(
// then call the review page like this from the HomePage.jsx
//         <ReviewPage
// job={job}
// bid={bid}
// bidder={bidder}
// proposer={proposer}
// isForProposer={false}
// touched
// errors
// handleChange
// handleBlur
// />
// start dummy data
//    const bid = {
//     _id: '5be4408d3b59ce7784c2616a',
//     _postedBidsRef: [
//       {
//         _id: '5be659011a5fcb00675da498',
//         bidAmount: { currency: 'CAD', value: 55 },
//         isNewBid: false,
//         _bidderRef: '5be4408d3b59ce7784c2616a',
//         _jobRef: {
//           _id: '5be64fd1c701f93840dda6eb',
//           _bidsListRef: ['5be659011a5fcb00675da498'],
//           state: 'OPEN',
//           hideForUserIds: [],
//           location: { type: 'Point', coordinates: [-75.61419, 45.37178] },
//           startingDateAndTime: {
//             date: '2018-11-10T03:26:09.306Z',
//             hours: 1,
//             minutes: 0,
//             period: 'PM',
//           },
//           addressText: '238 Briston Private, Ottawa, ON K1G 5P9, Canada',
//           title: 'Lawn Mowing',
//           fromTemplateId: 'lawnMowing',
//           _ownerRef: {
//             _id: '5be3c423284542006779b12f',
//             profileImage: {
//               url:
//                 'https://lh6.googleusercontent.com/-iSeZ1UGp9dE/AAAAAAAAAAI/AAAAAAAATl0/IND4jh2gpwM/photo.jpg?sz=50',
//             },
//             displayName: 'Said Madi',
//           },
//           createdAt: '2018-11-10T03:26:09.689Z',
//           updatedAt: '2018-11-10T04:05:21.816Z',
//           __v: 0,
//         },
//         state: 'OPEN',
//         createdAt: '2018-11-10T04:05:21.812Z',
//         updatedAt: '2018-11-13T05:12:16.842Z',
//         __v: 0,
//       },
//       {
//         _id: '5be702208d162000677aaf14',
//         bidAmount: { currency: 'CAD', value: 1 },
//         isNewBid: false,
//         _bidderRef: '5be4408d3b59ce7784c2616a',
//         _jobRef: {
//           _id: '5be467b0284542006779b131',
//           _bidsListRef: ['5be702208d162000677aaf14'],
//           state: 'OPEN',
//           hideForUserIds: [],
//           location: { type: 'Point', coordinates: [-75.69915, 45.42256] },
//           startingDateAndTime: {
//             date: '2018-11-08T16:43:28.427Z',
//             hours: 1,
//             minutes: 0,
//             period: 'PM',
//           },
//           addressText: '240 Sparks St, Ottawa, ON K1P 6C9, Canada',
//           title: 'Tutoring',
//           fromTemplateId: 'Tutoring',
//           _ownerRef: {
//             _id: '5be3c423284542006779b12f',
//             profileImage: {
//               url:
//                 'https://lh6.googleusercontent.com/-iSeZ1UGp9dE/AAAAAAAAAAI/AAAAAAAATl0/IND4jh2gpwM/photo.jpg?sz=50',
//             },
//             displayName: 'Said Madi',
//           },
//           createdAt: '2018-11-08T16:43:28.966Z',
//           updatedAt: '2018-11-10T16:06:56.497Z',
//           __v: 0,
//         },
//         state: 'OPEN',
//         createdAt: '2018-11-10T16:06:56.483Z',
//         updatedAt: '2018-11-10T17:01:19.238Z',
//         __v: 0,
//       },
//     ],
//   };

//   const job = {
//     _postedJobsRef: [
//       {
//         _id: '5be658dd1a5fcb00675da497',
//         _bidsListRef: [
//           '5be6a0778d162000677aaf13',
//           '5be75778a551212adcbd0348',
//           '5be75778a551212adcbd0349',
//           '5be75779a551212adcbd034a',
//           '5be7581ea551212adcbd034d',
//           '5be761a3cd7fd50067755b25',
//         ],
//         state: 'AWARDED',
//         hideForUserIds: [],
//         detailedDescription: 'Hehshs',
//         location: {
//           type: 'Point',
//           coordinates: [-75.6972, 45.4215],
//         },
//         startingDateAndTime: {
//           date: '2018-11-10T04:04:45.229Z',
//           hours: 1,
//           minutes: 0,
//           period: 'PM',
//         },
//         title: 'Snow Removal',
//         fromTemplateId: 'snowRemoval',
//         _ownerRef: '5be4408d3b59ce7784c2616a',
//         createdAt: '2018-11-10T04:04:45.610Z',
//         updatedAt: '2018-11-12T02:56:00.409Z',
//         _awardedBidRef: '5be7581ea551212adcbd034d',
//       },
//     ],
//   };

//   const proposer = {
//     _id: '5be4408d3b59ce7784c2616a',
//     profileImage: {
//       url:
//         'https://lh5.googleusercontent.com/-Yq14_Lizr6s/AAAAAAAAAAI/AAAAAAAAB08/FVGKX5iAFIo/photo.jpg?sz=50',
//       public_id: null,
//     },
//     _postedJobsRef: [
//       '5be440e90258c0798d3266fe',
//       '5be443fc0258c0798d326702',
//       '5be658dd1a5fcb00675da497',
//     ],
//     _postedBidsRef: ['5be659011a5fcb00675da498', '5be702208d162000677aaf14'],
//     globalRating: null,
//     userRole: 'REGULAR',
//     hasAgreedToServiceTerms: false,
//     extras: null,
//     settings: null,
//     verified: false,
//     verificationIdImage: null,
//     bidCancellations: 0,
//     canBid: true,
//     canPost: true,
//     displayName: 'Yacoub Abdulla',
//     userId: '100941490865538492879',
//     email: 'yacoub.abdulla89@gmail.com',
//     membershipStatus: 'NEW_MEMBER',
//     _reviewsRef: [],
//     creditCards: [],
//     createdAt: '2018-11-08T13:56:29.120Z',
//     updatedAt: '2018-11-10T16:06:56.496Z',
//     __v: 0,
//   };

//   const bidder = {
//     _id: '5be4408d3b59ce7784c2616a',
//     profileImage: {
//       url:
//         'https://lh5.googleusercontent.com/-Yq14_Lizr6s/AAAAAAAAAAI/AAAAAAAAB08/FVGKX5iAFIo/photo.jpg?sz=50',
//       public_id: null,
//     },
//     _postedJobsRef: [
//       '5be440e90258c0798d3266fe',
//       '5be443fc0258c0798d326702',
//       '5be658dd1a5fcb00675da497',
//     ],
//     _postedBidsRef: ['5be659011a5fcb00675da498', '5be702208d162000677aaf14'],
//     globalRating: null,
//     userRole: 'REGULAR',
//     hasAgreedToServiceTerms: false,
//     extras: null,
//     settings: null,
//     verified: false,
//     verificationIdImage: null,
//     bidCancellations: 0,
//     canBid: true,
//     canPost: true,
//     displayName: 'Yacoub Abdulla',
//     userId: '100941490865538492879',
//     email: 'yacoub.abdulla89@gmail.com',
//     membershipStatus: 'NEW_MEMBER',
//     _reviewsRef: [],
//     creditCards: [],
//     createdAt: '2018-11-08T13:56:29.120Z',
//     updatedAt: '2018-11-10T16:06:56.496Z',
//     __v: 0,
//   };

//   //  END of dummy data
// )
