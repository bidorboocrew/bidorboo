/**
 *
 * https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js#L628
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMyPastRequestedServices } from '../app-state/actions/userModelActions';
import { DisplayLabelValue, StartDateAndTime } from './commonComponents';
import ReactStars from 'react-stars';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { Spinner } from '../components/Spinner';

import jobIdToDefinitionObjectMapper from '../bdb-tasks/jobIdToDefinitionObjectMapper';

class PastRequestedServices extends React.Component {
  componentDidUpdate(prevProps) {
    // it was not logged in and now it is
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.props.getMyPastRequestedServices();
    }
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.getMyPastRequestedServices();
    }
  }
  render() {
    const { isLoggedIn, myPastRequestedServices, myPastRequestedServicesIsLoading } = this.props;

    if (!isLoggedIn || myPastRequestedServicesIsLoading) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading size={'large'} />
        </div>
      );
    }

    let AllTheRequestsByThisUser = null;
    if (myPastRequestedServices && myPastRequestedServices.length > 0) {
      AllTheRequestsByThisUser = myPastRequestedServices.map((requestDetails, index) => {
        return (
          <RequestsTabSummaryCard key={requestDetails._id} index={index} {...requestDetails} />
        );
      });
    }

    AllTheRequestsByThisUser = AllTheRequestsByThisUser ? (
      AllTheRequestsByThisUser
    ) : (
      <EmptyHistory />
    );

    return (
      <React.Fragment>
        <section className="hero is-white">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Past Requested Services</h1>
            </div>
          </div>
        </section>
        <div className="container is-widescreen">
          <div>{AllTheRequestsByThisUser}</div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    myPastRequestedServices: userReducer.myPastRequestedServices,
    userDetails: userReducer.myPastProvidedServices,
    myPastRequestedServicesIsLoading: userReducer.myPastRequestedServicesIsLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getMyPastRequestedServices: bindActionCreators(getMyPastRequestedServices, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PastRequestedServices);

const EmptyHistory = () => {
  return (
    <div className="card">
      <div style={{ padding: '1rem' }} className="card-content">
        <div className="content has-text-centered">
          <div>You have no past fulfilled tasks. Go ahead and</div>
          <br />
          <div>
            <a
              className="button is-success"
              onClick={() => switchRoute(ROUTES.CLIENT.PROPOSER.root)}
            >
              Request a Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

class RequestsTabSummaryCard extends React.Component {
  render() {
    const { jobId, bidderId, bidderReview, proposerSubmitted, bidderSubmitted, index } = this.props;

    const { startingDateAndTime, fromTemplateId, state } = jobId;
    const { ratingCategories } = bidderReview;

    const ratingMapping = {};
    ratingCategories.forEach((rating) => {
      ratingMapping[`${rating.category}`] = rating.rating;
    });

    const didISubmitReview = proposerSubmitted;
    const didBidderSubmitReview = bidderSubmitted;

    const bothSubmittedReview = bidderSubmitted && proposerSubmitted;
    return (
      <div style={{ margin: '1rem 0' }}>
        <div className="card">
          <div style={{ padding: '1rem' }} className="card-content">
            <div className="content">
              <h1 className="is-size-5">#{index} Task Summary</h1>
              <div className={`is-clipped disabled`}>
                <div style={{ paddingBottom: '0.5rem' }} className="card-content">
                  <div className="content">
                    <DisplayLabelValue
                      labelText={'Request Type'}
                      labelValue={`${jobIdToDefinitionObjectMapper[fromTemplateId].TITLE} Task`}
                    />

                    <StartDateAndTime date={startingDateAndTime} />
                    <DisplayLabelValue labelText={'Final Status'} labelValue={`${state}`} />

                    <label className="label">You Paid</label>
                    <div className="is-size-5 is-success">{`${jobId.processedPayment.proposerPaid /
                      100} CAD`}</div>
                  </div>
                </div>
              </div>

              <h1 className="is-size-5">Task Review</h1>
              <div className={`is-clipped disabled`}>
                <div style={{ paddingBottom: '0.5rem' }} className="card-content">
                  {!didISubmitReview && <PleaseSubmitYourReview />}

                  {!didBidderSubmitReview && (
                    <ReviewComments comment="Review is Pending. Bidder did not finish the review  Yet  " />
                  )}

                  {bothSubmittedReview && (
                    <ReviewComments
                      commenterDisplayName={bidderId.displayName}
                      commenterProfilePicUrl={bidderId.profileImage.url}
                      comment={bidderReview.personalComment}
                    />
                  )}
                </div>
              </div>

              {bothSubmittedReview && (
                <div className={`is-clipped disabled`}>
                  <div style={{ paddingBottom: '0.5rem' }} className="card-content">
                    <div>
                      ACCURACY OF POST
                      <ReactStars
                        half
                        count={5}
                        edit={false}
                        size={25}
                        color1={'lightgrey'}
                        color2={'#ffd700'}
                        value={ratingMapping['ACCURACY_OF_POST']}
                      />
                    </div>

                    <div>
                      PUNCTULAITY:
                      <ReactStars
                        half
                        count={5}
                        edit={false}
                        size={25}
                        color1={'lightgrey'}
                        color2={'#ffd700'}
                        value={ratingMapping['PUNCTULAITY']}
                      />
                    </div>
                    <div>
                      COMMUNICATION:
                      <ReactStars
                        half
                        count={5}
                        edit={false}
                        size={25}
                        color1={'lightgrey'}
                        color2={'#ffd700'}
                        value={ratingMapping['COMMUNICATION']}
                      />
                    </div>
                    <div>
                      MANNERS:
                      <ReactStars
                        half
                        count={5}
                        edit={false}
                        size={25}
                        color1={'lightgrey'}
                        color2={'#ffd700'}
                        value={ratingMapping['MANNERS']}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const PleaseSubmitYourReview = () => {
  return (
    <div className="field">
      <label>
        Your Review will be revealed when both (YOU) the Requester and the Bidder submit your
        reviews
      </label>

      <a
        onClick={() => alert('not added yet')}
        className="button is-link is-medium heartbeatInstant"
      >
        Submit Your Review
      </a>
    </div>
  );
};

const ReviewComments = ({ commenterDisplayName, commenterProfilePicUrl, comment }) => {
  return (
    <article
      style={{ cursor: 'default', border: '1px solid #ededed', padding: 2 }}
      className="media"
    >
      <figure style={{ margin: '0.5rem' }} className="media-left">
        <p className="image is-64x64">
          <img src={commenterProfilePicUrl} />
        </p>
      </figure>
      <div style={{ padding: '0.5rem' }} className="media-content">
        <div className="content">
          <div>{commenterDisplayName} wrote:</div>
          <p>{comment}</p>
        </div>
      </div>
    </article>
  );
};
