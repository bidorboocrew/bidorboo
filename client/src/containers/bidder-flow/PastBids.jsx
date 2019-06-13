/**
 *
 * https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js#L628
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactStars from 'react-stars';

import { getMyPastProvidedServices } from '../../app-state/actions/userModelActions';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { Spinner } from '../../components/Spinner';

import { DisplayLabelValue, StartDateAndTime } from '../commonComponents';

import tasksDefinitions from '../../bdb-tasks/tasksDefinitions';

class PastBids extends React.Component {
  componentDidUpdate(prevProps) {
    // it was not logged in and now it is
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.props.getMyPastProvidedServices();
    }
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      this.props.getMyPastProvidedServices();
    }
  }
  render() {
    const { isLoggedIn, myPastProvidedServices, myPastProvidedServicesIsLoading } = this.props;

    if (!isLoggedIn || myPastProvidedServicesIsLoading) {
      return (
        <div className="container is-widescreen">
          <Spinner isLoading size={'large'} />
        </div>
      );
    }

    let AllTheServicesProvidedByThisUser = null;
    if (myPastProvidedServices && myPastProvidedServices.length > 0) {
      AllTheServicesProvidedByThisUser = myPastProvidedServices.map((serviceDetail, index) => {
        return <RequestSummary index={index} key={serviceDetail._id} {...serviceDetail} />;
      });
    }

    AllTheServicesProvidedByThisUser = AllTheServicesProvidedByThisUser ? (
      AllTheServicesProvidedByThisUser
    ) : (
      <EmptyHistory />
    );
    return (
      <React.Fragment>
        <div className="container is-widescreen">{AllTheServicesProvidedByThisUser}</div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    myPastProvidedServices: userReducer.myPastProvidedServices,
    userDetails: userReducer.myPastProvidedServices,
    myPastProvidedServicesIsLoading: userReducer.myPastProvidedServicesIsLoading,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getMyPastProvidedServices: bindActionCreators(getMyPastProvidedServices, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PastBids);

const EmptyHistory = () => {
  return (
    <div className="column">
      <div className="card">
        <div style={{ padding: '1rem' }} className="card-content">
          <div className="content has-text-centered">
            <label className="label">Seems you don't have any completed jobs yet. Go on and</label>
            <br />
            <div>
              <a
                className="button is-link is-medium"
                onClick={() => switchRoute(ROUTES.CLIENT.BIDDER.root)}
              >
                Start Bidding
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

class RequestSummary extends React.Component {
  render() {
    const {
      jobId,
      proposerId,
      proposerReview,
      proposerSubmitted,
      bidderSubmitted,
      index,
    } = this.props;

    const { startingDateAndTime, templateId, state } = jobId;
    const { ratingCategories } = proposerReview;

    const ratingMapping = {};
    ratingCategories.forEach((rating) => {
      ratingMapping[`${rating.category}`] = rating.rating;
    });

    const didISubmitReview = bidderSubmitted;
    const didProposerSubmitReview = proposerSubmitted;

    const bothSubmittedReview = bidderSubmitted && proposerSubmitted;
    return (
      <div className="column">
        <div className="card">
          <div style={{ padding: '1rem' }} className="card-content">
            <div className="content">
              <h1 className="is-size-5">#{index} Task Summary</h1>
              <div className={`is-clipped disabled`}>
                <div style={{ paddingBottom: '0.5rem' }} className="card-content">
                  <div className="content">
                    <DisplayLabelValue
                      labelText={'Request Type'}
                      labelValue={`${
                        tasksDefinitions[templateId].TITLE
                      } Task`}
                    />

                    <StartDateAndTime date={startingDateAndTime} />
                    <DisplayLabelValue labelText={'Final Status'} labelValue={`${state}`} />

                    <label className="label">You Earned</label>
                    <div className="is-size-5 is-success">{`${jobId.processedPayment.bidderPayout /
                      100}$ (CAD)`}</div>
                  </div>
                </div>
              </div>

              <h1 className="is-size-5">Task Review</h1>
              <div className={`is-clipped disabled`}>
                <div style={{ paddingBottom: '0.5rem' }} className="card-content">
                  {!didISubmitReview && <PleaseSubmitYourReview />}

                  {!didProposerSubmitReview && (
                    <ReviewComments comment="Review is Pending. Requester did not finish the review  Yet  " />
                  )}

                  {bothSubmittedReview && (
                    <ReviewComments
                      commenterDisplayName={proposerId.displayName}
                      commenterProfilePicUrl={proposerId.profileImage.url}
                      comment={proposerReview.personalComment}
                    />
                  )}
                </div>
              </div>

              {bothSubmittedReview && (
                <div className={`is-clipped disabled`}>
                  <div style={{ paddingBottom: '0.5rem' }} className="card-content">
                    <div>
                      QUALITY OF WORK
                      <ReactStars
                        className="ReactStars"
                        half
                        count={5}
                        edit={false}
                        size={25}
                        color1={'lightgrey'}
                        color2={'#ffd700'}
                        value={ratingMapping['QUALITY_OF_WORK']}
                      />
                    </div>

                    <div>
                      PUNCTULAITY:
                      <ReactStars
                        style={{ cursor: 'pointer', display: 'inline-block' }}
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
                        style={{ cursor: 'pointer', display: 'inline-block' }}
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
                        style={{ cursor: 'pointer', display: 'inline-block' }}
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
        Your Review will be revealed when both the Requester and the Tasker (YOU) submit your
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
