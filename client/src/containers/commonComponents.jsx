import React, { useState } from 'react';

import moment from 'moment';
import AddToCalendar from 'react-add-to-calendar';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute, goBackToPreviousRoute } from '../utils';

import TASKS_DEFINITIONS from '../bdb-tasks/tasksDefinitions';
export const REQUEST_STATES = {
  OPEN: 'OPEN',
  AWARDED: 'AWARDED',
  DISPUTED: 'DISPUTED',
  AWARDED_JOB_CANCELED_BY_BIDDER: 'AWARDED_JOB_CANCELED_BY_BIDDER',
  AWARDED_JOB_CANCELED_BY_REQUESTER: 'AWARDED_JOB_CANCELED_BY_REQUESTER',
  CANCELED_OPEN: 'CANCELED_OPEN',
  DONE: 'DONE',
  PAIDOUT: 'PAIDOUT',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  PAYMENT_TO_BANK_FAILED: 'PAYMENT_TO_BANK_FAILED',
  ARCHIVE: 'ARCHIVE',
};

export const BID_STATES = {
  OPEN: 'OPEN',
  AWARDED: 'AWARDED',
  AWARDED_SEEN: 'AWARDED_SEEN',
  AWARDED_BID_CANCELED_BY_TASKER: 'AWARDED_BID_CANCELED_BY_TASKER',
  DISPUTED: 'DISPUTED',
  AWARDED_BID_CANCELED_BY_REQUESTER: 'AWARDED_BID_CANCELED_BY_REQUESTER',
  DONE: 'DONE',
  PAYMENT_RELEASED: 'PAYMENT_RELEASED',
  PAYMENT_TO_BANK_FAILED: 'PAYMENT_TO_BANK_FAILED',
  ARCHIVE: 'ARCHIVE',
};

export const POINT_OF_VIEW = {
  REQUESTER: 'REQUESTER',
  TASKER: 'TASKER',
};

export const BIDORBOO_SERVICECHARGE_FOR_REQUESTER = 0.06;

export const getDaysSinceCreated = (createdAt) => {
  let daysSinceCreated = '';
  try {
    daysSinceCreated = createdAt ? moment.duration(moment().diff(moment(createdAt))).humanize() : 0;
  } catch (e) {
    //xxx we dont wana fail simply cuz we did not get the diff in time
    console.error(e);
  }
  return daysSinceCreated;
};

export const findAvgBidInBidList = (bidsList) => {
  let hasBids = bidsList && bidsList.length > 0;

  if (hasBids) {
    const bidsTotal = bidsList
      .map((bid) => bid.bidAmount.value)
      .reduce((accumulator, bidAmount) => accumulator + bidAmount);
    return Math.ceil(bidsTotal / bidsList.length);
  }
  return null;
};

export const AvgBidDisplayLabelAndValue = ({ bidsList }) => {
  let minBid = findAvgBidInBidList(bidsList);
  let avgBidLabel = minBid ? (
    <DisplayLabelValue labelText="Avg Bid" labelValue={`${minBid}$ (CAD)`} />
  ) : (
    <DisplayLabelValue labelText="Avg Bid" labelValue={`Be the first bidder!`} />
  );
  return avgBidLabel;
};

export const DisplayLabelValue = ({ labelText, labelValue, renderHelpComponent = () => null }) => {
  return (
    <div className="group">
      <label className="label hasSelectedValue">{labelText}</label>
      <div className="control">{labelValue}</div>
      {renderHelpComponent()}
    </div>
  );
};

export const CountDownComponent = (props) => {
  const { startingDate } = props;
  return <div className="help">{`* ${moment(startingDate).fromNow()}`}</div>;
};

export const JobTitleText = ({ title, iconClass }) => {
  return (
    <div style={{ flexGrow: 1 }} className="title">
      <span className="icon">
        <i className={`${iconClass}`} />
      </span>
      <span style={{ marginLeft: 8 }}>{title}</span>
    </div>
  );
};
export const UserImageAndRating = ({ userDetails, clipUserName = false, large = false }) => {
  let temp = userDetails
    ? userDetails
    : { profileImage: { url: '' }, displayName: '--', rating: { globalRating: 'no rating' } };

  const { profileImage, displayName, rating } = temp;
  let trimmedDisplayName = displayName;
  if (clipUserName) {
    trimmedDisplayName =
      displayName && displayName.length > 20 ? `${displayName.substring(0, 20)}...` : displayName;
  }

  return (
    <article
      style={{
        cursor: 'pointer',
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(userDetails._id));
      }}
      className="media limitHeight"
    >
      <figure style={{ margin: '0 8px 0 0' }} className="media-left">
        <img
          className={`image ${large ? 'is-64x64' : 'is-48x48'} `}
          style={{
            borderRadius: '100%',
            width: `${large ? 64 : 48}`,
            height: `${large ? 64 : 48}`,
            boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
          }}
          src={profileImage.url}
          alt="image"
        />
      </figure>

      <div className="media-content">
        <div className="content">
          <div className={`${large ? 'is-size-6' : 'is-size-6'}`}>{trimmedDisplayName}</div>

          {rating.globalRating === 'No Ratings Yet' || rating.globalRating === 0 ? (
            <div className="has-text-grey" style={{ lineHeight: '52px', fontSize: 16 }}>
              <span className="icon">
                <i className="far fa-star" />
              </span>
              <span>--</span>
            </div>
          ) : (
            <div className="has-text-dark" style={{ lineHeight: '52px', fontSize: 16 }}>
              <span className="icon">
                <i className="fas fa-star" />
              </span>
              <span>{rating.globalRating}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export const CenteredUserImageAndRating = ({
  userDetails,
  clipUserName = false,
  large = false,
  isCentered = true,
}) => {
  let temp = userDetails
    ? userDetails
    : { profileImage: { url: '' }, displayName: '--', rating: { globalRating: 'no rating' } };

  const { profileImage, displayName, rating } = temp;
  let trimmedDisplayName = displayName;
  if (clipUserName) {
    trimmedDisplayName =
      displayName && displayName.length > 20 ? `${displayName.substring(0, 20)}...` : displayName;
  }
  return (
    <div
      style={{
        flexWrap: 'wrap',
        display: 'flex',
        width: '100%',
        cursor: 'pointer',
        alignItems: isCentered ? 'center' : '',
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(userDetails._id));
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          overflow: ' hidden',
          margin: isCentered ? 'auto' : '',
        }}
      >
        <figure style={{ margin: '0.5rem' }} className="media-left">
          <img
            className={`image ${large ? 'is-64x64' : 'is-48x48'} `}
            style={{
              borderRadius: '100%',
              width: `${large ? 64 : 48}`,
              height: `${large ? 64 : 48}`,
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
            }}
            src={profileImage.url}
            alt="image"
          />
        </figure>

        <div className="content">
          <div className={`${large ? 'is-size-5' : 'is-size-6'}`}>{trimmedDisplayName}</div>

          {rating.globalRating === 'No Ratings Yet' || rating.globalRating === 0 ? (
            <div className="has-text-warning" style={{ lineHeight: '52px', fontSize: 16 }}>
              <span className="icon">
                <i className="far fa-star" />
              </span>
              <span className="has-text-dark">--</span>
            </div>
          ) : (
            <div className="has-text-warning" style={{ lineHeight: '52px', fontSize: 16 }}>
              <span className="icon">
                <i className="fas fa-star" />
              </span>
              <span className="has-text-dark">{rating.globalRating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  // return (
  //   <div
  //     style={{
  //       cursor: 'pointer',
  //       display: 'flex',
  //       alignItems: 'center',
  //       margin: isCentered ? 'auto' : '',
  //       width: '13rem',
  //       overflow: 'hidden',
  //     }}
  //     onClick={(e) => {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       switchRoute(ROUTES.CLIENT.dynamicUserProfileForReview(userDetails._id));
  //     }}
  //   >
  //     <figure style={{ margin: '0 8px 0 0' }} className="media-left">
  //       <img
  //         className={`image ${large ? 'is-64x64' : 'is-48x48'} `}
  //         style={{
  //           borderRadius: '100%',
  //           width: `${large ? 64 : 48}`,
  //           height: `${large ? 64 : 48}`,
  //           boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
  //         }}
  //         src={profileImage.url}
  //         alt="image"
  //       />
  //     </figure>

  //     <div className="content">
  //       <div className={`${large ? 'is-size-5' : 'is-size-6'}`}>{trimmedDisplayName}</div>

  //       {rating.globalRating === 'No Ratings Yet' || rating.globalRating === 0 ? (
  //         <div className="has-text-grey" style={{ lineHeight: '52px', fontSize: 16 }}>
  //           <span className="icon">
  //             <i className="far fa-star" />
  //           </span>
  //           <span>--</span>
  //         </div>
  //       ) : (
  //         <div className="has-text-dark" style={{ lineHeight: '52px', fontSize: 16 }}>
  //           <span className="icon">
  //             <i className="fas fa-star" />
  //           </span>
  //           <span>{rating.globalRating}</span>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
};

export const CardTitleAndActionsInfo = ({
  jobState,
  templateId,
  bidsList = [],
  userAlreadyView = false,
  userAlreadyBid = false,
  isOnMapView = false,
  job,
}) => {
  const { ID, ICON } = TASKS_DEFINITIONS[templateId];
  const areThereAnyBidders = bidsList && bidsList.length > 0;

  const viewCount = !job || !job.viewedBy || !job.viewedBy.length > 0 ? 0 : job.viewedBy.length;

  let bidsCountLabel = 'No bids';
  if (bidsList.length === 1) {
    bidsCountLabel = '1 bid';
  }
  if (bidsList.length > 1) {
    bidsCountLabel = `${bidsList.length} bids`;
  }

  const avgBid = findAvgBidInBidList(bidsList);

  const isAwarded = `${jobState ? jobState : ''}` && `${jobState}`.toLowerCase() === 'awarded';
  return (
    <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
      <div style={{ width: 80, display: 'inline-block' }}>
        <div>
          <div className="icon">
            <i className="far fa-eye" />
          </div>
          <div className={`help  ${userAlreadyView ? 'has-text-weight-semibold' : ''}`}>
            {viewCount > 1 || viewCount === 0 ? `${viewCount} Views` : `${viewCount} View`}
          </div>
        </div>
      </div>
      <div style={{ width: 80, display: 'inline-block' }}>
        <div className="has-text-grey">
          <div className="icon">
            <i className="fas fa-hand-paper" />
          </div>
          <div className="help">{bidsCountLabel}</div>
        </div>
      </div>
      <div style={{ width: 80, display: 'inline-block' }}>
        <div>
          <div />
          <div className="has-text-weight-semibold">{avgBid > 0 ? avgBid : '--'}</div>
          <div className="help">Avg Bid</div>
        </div>
      </div>
      {/* <div style={{ width: 80, display: 'inline-block' }}>
        {userAlreadyBid && (
          <div>
            <div />
            <div className="icon">
              <i className="fas fa-dollar-sign" />
            </div>
            <div className="help">You've Bid</div>
          </div>
        )}
      </div> */}
    </div>
  );
};

const timeToTextMap = {
  '10': 'flexible, anytime',
  '8': 'morning',
  '12': 'afternoon',
  '17': 'evening',
};
export const StartDateAndTime = ({ date, renderHelpComponent }) => {
  const startingDate = moment(date).format('DD/MMM/YYYY');
  const selectedTime = `${moment(date).get('hour')}`;
  let timeText = 'flexible, anytime';
  switch (`${selectedTime}`) {
    case '10':
      timeText = 'flexible, anytime';
      break;
    case '8':
      timeText = 'morning.';
      break;
    case '12':
      timeText = 'afternoon.';
      break;
    case '17':
      timeText = 'evening.';
      break;
    default:
      timeText = 'flexible, anytime';
      break;
  }

  return (
    <DisplayLabelValue
      labelText="Start Date"
      labelValue={`${startingDate} - ${timeText}`}
      renderHelpComponent={renderHelpComponent}
    />
  );
};

export class LocationLabelAndValue extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addressText: 'loading address...',
    };
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    const { location, useShortAddress } = this.props;
    if (!location || location.length !== 2) {
      console.error('error location is invalid');
      return null;
    }

    window.BidorBoo = window.BidorBoo || {};
    let geocoder;
    if (!window.BidorBoo.geocoder) {
      geocoder = new window.google.maps.Geocoder();
      window.BidorBoo.geocoder = Object.freeze(geocoder);
    } else {
      geocoder = window.BidorBoo.geocoder;
    }

    if (window.google && geocoder && location && location.length === 2) {
      const longitude = location[0];
      const lattitude = location[1];

      //https://developers.google.com/maps/documentation/javascript/examples/geocoding-reverse
      geocoder.geocode(
        {
          location: { lat: parseFloat(lattitude), lng: parseFloat(longitude) },
        },
        (results, status) => {
          // xxx handle the various error (api over limit ...etc)
          if (status !== window.google.maps.GeocoderStatus.OK) {
            alert(status);
          }
          // This is checking to see if the Geoeode Status is OK before proceeding
          if (status === window.google.maps.GeocoderStatus.OK) {
            let address = results[0].formatted_address;
            if (address && !address.toLowerCase().includes('canada')) {
              alert('Sorry! Bid or Boo is only available in Canada.');
            } else {
              //xxx find a way to unsubscribe from geocoding async call if component unmounted

              let shortAddressString = address;
              if (address && address.length > 0) {
                if (useShortAddress) {
                  //example 92 Woodbury Crescent, Ottawa, ON K1G 5E2, Canada => [92 Woodbury Crescent, Ottawa ...]
                  const addressPieces = address.split(',');
                  if (addressPieces.length > 2) {
                    shortAddressString = `${addressPieces[0]} , ${addressPieces[1]}`;
                  }
                }
              }
              try {
                if (this._isMounted) {
                  this.setState({
                    addressText: shortAddressString,
                  });
                }
              } catch (e) {
                console.log('ignore this for now xxxx saeed fix');
              }
            }
          }
        },
      );
    }
  }
  render() {
    const { location } = this.props;

    if (!location || location.length !== 2) {
      alert('error location is invalid');
      return null;
    }

    return (
      <div className="group">
        <label className="label hasSelectedValue">Location Near</label>
        <div className="control">{this.state.addressText}</div>
        <p className="help">*This is an approximate location</p>
      </div>
    );
  }
}

export const DisplayShortAddress = ({ addressText, renderHelpComponent = () => null }) => {
  if (addressText && addressText.length > 0) {
    let shortAddressString = addressText;
    //example 92 Woodbury Crescent, Ottawa, ON K1G 5E2, Canada => [92 Woodbury Crescent, Ottawa ...]
    const addressPieces = addressText.split(',');
    if (addressPieces.length > 2) {
      shortAddressString = `${addressPieces[0]} , ${addressPieces[1]}`;
      return (
        <DisplayLabelValue
          labelText={'Address'}
          labelValue={shortAddressString}
          renderHelpComponent={renderHelpComponent}
        />
      );
    }
  }
  return null;
};

export const AddAwardedJobToCalendar = ({ job, extraClassName = '' }) => {
  if (!job) {
    return null;
  }

  const { startingDateAndTime, addressText, templateId } = job;

  const { email, phone, displayName } = job._ownerRef;

  const emailContact = email && email.emailAddress ? `${email.emailAddress}` : '';
  const phoneContactNumber = phone && phone.phoneNumber ? ` or ${phone.phoneNumber}` : '';

  const title = `BidOrBoo: ${TASKS_DEFINITIONS[templateId] &&
    TASKS_DEFINITIONS[templateId].TITLE} request`;
  const description = `You are going to help ${displayName} fulfil a ${title} request. To get in touch contact them at ${emailContact} ${phoneContactNumber}`;

  const selectedTime = `${moment(startingDateAndTime).get('hour')}`;
  let startTime = moment(startingDateAndTime).startOf('day');
  let endTime = moment(startingDateAndTime).endOf('day');

  switch (`${selectedTime}`) {
    case '10':
      startTime = moment(startingDateAndTime).startOf('day');
      endTime = moment(startingDateAndTime).endOf('day');
      break;
    case '8':
      startTime = moment(startingDateAndTime);
      endTime = moment(startingDateAndTime).add(4, 'h');
      break;
    case '12':
      startTime = moment(startingDateAndTime);
      endTime = moment(startingDateAndTime).add(5, 'h');
      break;
    case '17':
      startTime = moment(startingDateAndTime);
      endTime = moment(startingDateAndTime).endOf('day');
      break;
    default:
      startTime = moment(startingDateAndTime).startOf('day');
      endTime = moment(startingDateAndTime).endOf('day');
      break;
  }
  let event = {
    title,
    description,
    location: addressText,
    startTime: `${startTime}`,
    endTime: `${endTime}`,
  };
  return (
    <AddToCalendar
      listItems={[{ apple: 'iCal' }, { google: 'Google' }, { outlook: 'Outlook' }]}
      displayItemIcons={false}
      event={event}
      buttonLabel={'Add to Calendar'}
      buttonClassClosed={`button is-info ${extraClassName}`}
    />
  );
};

export const TaskSpecificExtras = ({ extras, templateId }) => {
  if (!extras || !templateId) {
    return null;
  }
  let taskDetails = TASKS_DEFINITIONS[templateId];
  if (!taskDetails || !taskDetails.ID || !taskDetails.extras) {
    return null;
  }

  // renderAllExtraFieldsBased on the input from the task
  const taskExtraFields = taskDetails.extras();
  let renderedTaskSpecificFields = [];

  Object.keys(extras).forEach((extraDetailKey) => {
    const userSelectedValue = extras[extraDetailKey];

    if (taskExtraFields[extraDetailKey]) {
      renderedTaskSpecificFields.push(
        taskExtraFields[extraDetailKey].renderSelection(userSelectedValue),
      );
    }
  });

  return renderedTaskSpecificFields;
};

export const VerifiedVia = ({
  userDetails,
  isCentered = true,
  smallfont = true,
  showAll = false,
}) => {
  const {
    stripeConnect = { isVerified: false },
    phone = { isVerified: false },
    email = { isVerified: false },
    isGmailUser = false,
    isFbUser = false,
    clearCriminalHistory = false,
    govId = { isVerified: false },
  } = userDetails;

  const atLeastOneVerification =
    isFbUser ||
    isGmailUser ||
    phone.isVerified ||
    email.isVerified ||
    stripeConnect.isVerified ||
    clearCriminalHistory;

  return (
    <div
      style={{ width: 150, margin: isCentered ? 'auto' : '' }}
      className={`${isCentered ? 'has-text-centered' : ''}`}
    >
      <label className="label">verifications</label>

      {isFbUser && (
        <div className="verificationBadge isActive">
          <span title="Verified by facebook" className="icon">
            <i className="fab fa-facebook has-text-success" />
          </span>
        </div>
      )}
      {isGmailUser && (
        <div className="verificationBadge isActive">
          <span title="Verified by gmail" className="icon">
            <i className="fab fa-google has-text-success" />
          </span>
        </div>
      )}
      {phone.isVerified && (
        <div className="verificationBadge isActive">
          <span title="Verified by phone" className="icon">
            <i className="fas fa-mobile-alt has-text-success" />
          </span>
        </div>
      )}
      {email.isVerified && (
        <div className="verificationBadge isActive">
          <span title="Verified by email" className="icon">
            <i className="far fa-envelope has-text-success" />
          </span>
        </div>
      )}

      {govId && govId.isVerified && (
        <div className="verificationBadge isActive">
          <span title="Verified goverment ID" className="icon">
            <i className="fas fa-id-card has-text-success" />
          </span>
        </div>
      )}
      {stripeConnect.isVerified && (
        <div className="verificationBadge isActive">
          <span title="Verified by bank account" className="icon">
            <i className="fas fa-dollar-sign has-text-success" />
          </span>
        </div>
      )}

      {clearCriminalHistory && (
        <div className="verificationBadge isActive">
          <span title="Verified by criminal check" className="icon">
            <i className="fas fa-gavel has-text-success" />
          </span>
        </div>
      )}

      {showAll && (
        <>
          {!phone.isVerified && (
            <div className="verificationBadge notActive">
              <span title="Verified by phone" className="icon">
                <i className="fas fa-mobile-alt has-text-grey" />
              </span>
            </div>
          )}
          {!email.isVerified && (
            <div className="verificationBadge notActive">
              <span title="Verified by email" className="icon">
                <i className="far fa-envelope has-text-grey" />
              </span>
            </div>
          )}
          {!govId ||
            (!govId.isVerified && (
              <div className="verificationBadge notActive">
                <span title="Verified goverment ID" className="icon">
                  <i className="fas fa-id-card has-text-grey" />
                </span>
              </div>
            ))}
          {!stripeConnect.isVerified && (
            <div className="verificationBadge notActive">
              <span title="Verified by bank account" className="icon">
                <i className="fas fa-dollar-sign has-text-grey" />
              </span>
            </div>
          )}
          {!clearCriminalHistory && (
            <div className="verificationBadge notActive">
              <span title="Verified by criminal check" className="icon">
                <i className="fas fa-gavel has-text-grey" />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const SummaryStartDateAndTime = ({ date }) => {
  const startingDate = moment(date).format('DD/MMM');

  return (
    <div className="group">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontWeight: 500,
          fontSize: 16,
          maxWidth: 300,
          margin: 'auto',
        }}
      >
        <div style={{ borderRight: '1px solid lightgrey', padding: 10, flex: '1 1 0' }}>
          {startingDate}
        </div>
        <div style={{ padding: 10, flex: '1 1 0' }}>{moment(date).fromNow()}</div>
      </div>
    </div>
  );
};
export const AwaitingOnTasker = () => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            flexGrow: 0,
            fontSize: 16,
            width: 28,
            marginRight: 8,
          }}
        >
          <div className="icon">
            <i style={{ width: 15 }} className="far fa-clock" />
          </div>
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          Waiting For Taskers
        </div>

        {/* <div className="help">*Check Back soon!</div> */}
      </div>
    </div>
  );
};

export const PastdueExpired = () => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            fontSize: 16,
            borderRadius: '100%',
            border: '1px solid #ef2834',
            width: 28,
            background: '#ef2834',
            color: '#ef2834',
            marginRight: 8,
            display: 'inline-block',
          }}
        >
          1
        </div>

        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          Past Due - Expired
        </div>
      </div>
      {/* <div>
        <div className="help">*BidOrBoo will auto delete this task</div>
      </div> */}
    </div>
  );
};

export const TaskersAvailable = ({ numberOfAvailableTaskers }) => {
  return (
    <div className="group has-text-centered">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            fontSize: 16,
            borderRadius: '100%',
            width: 28,
            background: '#6b88e0',
            color: 'white',
            marginRight: 8,
            alignItems: 'center',
            display: 'inline-block',
          }}
        >
          {numberOfAvailableTaskers}
        </div>
        <div
          style={{
            fontSize: 16,
            display: 'inline-block',
          }}
        >
          {numberOfAvailableTaskers > 1 ? 'Taskers Available' : 'Tasker Available'}
        </div>
      </div>
      {/* <div>
        <div className="help">*Review And Award A Tasker</div>
      </div> */}
    </div>
  );
};

export const AssignedTasker = ({ displayName }) => {
  // let taskerName = displayName;
  // if (taskerName && taskerName.length > 8) {
  //   taskerName = taskerName.substring(0, 7) + '..';
  // }
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            fontSize: 16,
            width: 28,
            marginRight: 8,
            alignItems: 'center',
            display: 'inline-block',
            backgroundColor: '#26ca70',
            borderRadius: '100%',
          }}
        >
          <div className="icon">
            <i style={{ width: 18 }} className="fas fa-user-tie" />
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            display: 'inline-block',
          }}
        >
          Tasker is Assigned
        </div>
        {/* <div>
          <div className="help">*Contact Tasker To finalize details</div>
        </div> */}
      </div>
    </div>
  );
};

export const JobCardTitle = ({ img, icon, title, meatballMenu }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: '1.25rem' }}>
      <div
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',

          overflow: 'hidden',
          margin: 'auto',
        }}
      >
        <figure style={{ margin: 0 }} className="media-left">
          <img style={{ height: 64, width: 64, objectFit: 'cover' }} src={img} alt="task image" />
        </figure>

        <div className="content">
          <span style={{ fontSize: 28 }}>{title}</span>
        </div>
      </div>

      {meatballMenu && <div style={{ alignSelf: 'flex-start' }}>{meatballMenu()}</div>}
    </div>
  );

  // return (
  //   <div style={{ display: 'flex' }}>
  //     <div style={{ flexGrow: 1 }} className="title">
  //       <img src={img} style={{ height: 'auto', width: 64, objectFit: 'cover' }} />

  //       <span style={{ marginLeft: 7 }}>{title}</span>
  //     </div>
  //
  //   </div>
  // );
};

export const CancelledBy = ({ name, refundAmount }) => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
          // background: 'lightgrey',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            flexGrow: 0,
            fontSize: 16,
            borderRadius: '100%',
            border: '1px solid #ef2834',
            width: 28,
            background: '#ef2834',
            marginRight: 8,
          }}
        >
          <div className="icon">
            <i style={{ width: 18, color: 'white' }} className="far fa-frown" />
          </div>
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          {`Cancelled by ${name}`}
        </div>
      </div>
      {/* <div>
        <div className="help">*BidorBoo will refund you ${refundAmount}%</div>
      </div> */}
    </div>
  );
};

export const DisputedBy = ({ name }) => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            flexGrow: 0,
            fontSize: 16,
            borderRadius: '100%',
            border: '1px dashed #ef2834',
            width: 28,
            marginRight: 8,
          }}
        >
          <div className="icon">
            <i style={{ width: 18, color: '#ef2834' }} className="fas fa-heart-broken" />
          </div>
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          {`Disputed by ${name}`}
        </div>
        <div>
          <div className="help is-danger">*BidorBooCrew will resolve this ASAP</div>
        </div>
      </div>
    </div>
  );
};

export const TaskCost = ({ cost }) => {
  return (
    <div className="group">
      <label className="label hasSelectedValue">You Paid</label>
      <div className="control">${cost}</div>
    </div>
  );
};

export const BidAmount = ({ renderHelp, bidAmount }) => {
  return (
    <div className="group">
      <label className="label hasSelectedValue">Bid Amount</label>
      <div className="control">${bidAmount}</div>
      {renderHelp && renderHelp()}
    </div>
  );
};

export const TaskIsFulfilled = () => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
          // background: 'lightgrey',
        }}
      >
        <div
          style={{
            display: 'inline-block',
            flexGrow: 0,
            fontSize: 16,
            borderRadius: '100%',
            width: 28,
            background: '#00d1b2',
            marginRight: 8,
          }}
        >
          <div className="icon">
            <i style={{ width: 18, color: 'white' }} className="far fa-smile-beam" />
          </div>
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          {`Task is Fullfilled`}
        </div>
      </div>
      {/* <div>
      <div className="help">*BidorBoo will refund you ${refundAmount}%</div>
    </div> */}
    </div>
  );
};

export const ArchiveTask = ({ displayName = '' }) => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            flexGrow: 0,
            fontSize: 16,
            borderRadius: '100%',
            border: '1px solid #353535',
            width: 28,
            background: '#353535',
            marginRight: 8,
            color: '#353535',
          }}
        >
          1
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          Archived
        </div>
      </div>
      {/* <div>
      <div className="help">*BidorBoo will refund you ${refundAmount}%</div>
    </div> */}
    </div>
  );
};

export const BidsTableVerifiedVia = ({ userDetails }) => {
  const {
    stripeConnect = { isVerified: false },
    phone = { isVerified: false },
    email = { isVerified: false },
    isGmailUser = false,
    isFbUser = false,
    clearCriminalHistory = false,
    govId = { isVerified: false },
  } = userDetails;

  const atLeastOneVerification =
    isFbUser ||
    isGmailUser ||
    phone.isVerified ||
    email.isVerified ||
    stripeConnect.isVerified ||
    clearCriminalHistory;

  return (
    <div>
      {!atLeastOneVerification && <label className="has-text-grey">Unverified User</label>}
      {isFbUser && (
        <div className="verificationBadge isActive small">
          <span title="Verified by facebook" className="icon">
            <i className="fab fa-facebook has-text-success" />
          </span>
        </div>
      )}
      {isGmailUser && (
        <div className="verificationBadge isActive small">
          <span title="Verified by gmail" className="icon">
            <i className="fab fa-google has-text-success" />
          </span>
        </div>
      )}
      {phone.isVerified && (
        <div className="verificationBadge isActive small">
          <span title="Verified by phone" className="icon">
            <i className="fas fa-mobile-alt has-text-success" />
          </span>
        </div>
      )}
      {email.isVerified && (
        <div className="verificationBadge isActive small">
          <span title="Verified by email" className="icon">
            <i className="far fa-envelope has-text-success" />
          </span>
        </div>
      )}

      {govId && govId.isVerified && (
        <div className="verificationBadge isActive small">
          <span title="Verified goverment ID" className="icon">
            <i className="fas fa-id-card has-text-success" />
          </span>
        </div>
      )}
      {stripeConnect.isVerified && (
        <div className="verificationBadge isActive small">
          <span title="Verified by bank account" className="icon">
            <i className="fas fa-dollar-sign has-text-success" />
          </span>
        </div>
      )}

      {clearCriminalHistory && (
        <div className="verificationBadge isActive small">
          <span title="Verified by criminal check" className="icon">
            <i className="fas fa-gavel has-text-success" />
          </span>
        </div>
      )}
    </div>
  );
};

export const BSawaitingOnRequester = () => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            flexGrow: 0,
            fontSize: 16,
            width: 28,
            marginRight: 8,
          }}
        >
          <div className="icon">
            <i style={{ width: 15 }} className="far fa-clock" />
          </div>
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          Awaiting On Requester
        </div>
        <div className="help">*Check Back soon!</div>
      </div>
    </div>
  );
};

export const BSPastDueExpired = () => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            fontSize: 16,
            borderRadius: '100%',
            border: '1px solid #ef2834',
            width: 28,
            background: '#ef2834',
            color: '#ef2834',
            marginRight: 8,
            display: 'inline-block',
          }}
        >
          1
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          Past Due - Expired
        </div>
        <div className="help">* Task Was not awarded to anyone</div>
      </div>
    </div>
  );
};

export const BSAwardedToSomeoneElse = () => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            fontSize: 16,
            borderRadius: '100%',
            border: '1px solid #35335',
            width: 28,
            marginRight: 8,
            display: 'inline-block',
          }}
        >
          <div className="icon">
            <i style={{ width: 18 }} className="far fa-frown" />
          </div>
        </div>

        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          Bid Rejected
        </div>
        <div className="help">*Task Was awarded to someone else</div>
      </div>
    </div>
  );
};

export const BSTaskerAwarded = ({ isPastDue }) => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            fontSize: 16,
            width: 28,
            marginRight: 8,
            alignItems: 'center',
            display: 'inline-block',
            backgroundColor: '#26ca70',
            borderRadius: '100%',
          }}
        >
          <div className="icon">
            <i style={{ width: 18 }} className="fas fa-dollar-sign" />
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            display: 'inline-block',
          }}
        >
          Your Bid Won
        </div>
        <div className="help">{`${
          !isPastDue ? 'Contact Requester To finalize details' : 'Confirm completion'
        }`}</div>
      </div>
    </div>
  );
};

export const BSWaitingOnRequesterToConfirm = ({ isPastDue }) => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            fontSize: 16,
            width: 28,
            marginRight: 8,
            alignItems: 'center',
            display: 'inline-block',
            backgroundColor: '#26ca70',
            borderRadius: '100%',
          }}
        >
          <div className="icon">
            <i style={{ width: 18 }} className="fas fa-user-tie" />
          </div>
        </div>
        <div
          style={{
            fontSize: 16,
            display: 'inline-block',
          }}
        >
          Awaiting Confirmation
        </div>
        <div className="help">We contacted the Requester to confirm completion</div>
      </div>
    </div>
  );
};

export const BSTaskIsDone = () => {
  return (
    <div className="group">
      <div
        style={{
          fontWeight: 500,
          fontSize: 16,
          padding: 5,
        }}
      >
        <div
          style={{
            fontSize: 16,
            borderRadius: '100%',
            border: '1px solid #4285f4',
            width: 28,
            background: '#4285f4',
            color: '#4285f4',
            marginRight: 8,
            display: 'inline-block',
          }}
        >
          1
        </div>
        <div
          style={{
            display: 'inline-block',
            fontSize: 16,
          }}
        >
          Task Is Done
        </div>
        <div className="help">* You've completed This</div>
      </div>
    </div>
  );
};
// https://github.com/leandrowd/react-responsive-carousel
export const TaskImagesCarousel = ({ taskImages, isLarge = false }) => {
  if (taskImages && taskImages.length > 0) {
    taskImages = taskImages.map((taskImage, i) => (
      <div key={i}>
        <img
          style={{ objectFit: 'contain', height: isLarge ? '16rem' : '8rem' }}
          src={taskImage.url}
        />
      </div>
    ));

    return (
      <Carousel
        showThumbs={false}
        showArrows={true}
        infiniteLoop
        // centerMode
      >
        {taskImages}
      </Carousel>
    );
  }
  return null;
};

export const RenderBackButton = () => {
  return (
    <a style={{ margin: '0 0 1rem 0' }} className="button" onClick={() => goBackToPreviousRoute()}>
      <span className="icon is-large">
        <i className="fas fa-chevron-left" />
      </span>
    </a>
  );
};
// https://github.com/FormidableLabs/nuka-carousel
// export const TaskImagesCarousel = ({ taskImages }) => {

//   if (taskImages && taskImages.length > 0) {
//     let carouselImg = taskImages.map((taskImage) => <img src={taskImage.url} />);

//     return (
//       <Carousel
//         renderCenterLeftControls={({ previousSlide }) => (
//           <button className="button is-danger is-outlined" onClick={previousSlide}>
//             <i className="fas fa-arrow-left" />
//           </button>
//         )}
//         renderCenterRightControls={({ nextSlide }) => (
//           <button className="button is-danger is-outlined" onClick={nextSlide}>
//             <i className="fas fa-arrow-right" />
//           </button>
//         )}
//       >
//         {carouselImg}
//       </Carousel>
//     );
//   }
//   return null;
// };

export const redirectBasedOnJobState = ({ state, _id: jobId }) => {
  switch (state) {
    case REQUEST_STATES.OPEN:
      switchRoute(ROUTES.CLIENT.PROPOSER.dynamicReviewRequestAndBidsPage(jobId));
      break;
    default:
      switchRoute(ROUTES.CLIENT.PROPOSER.dynamicSelectedAwardedJobPage(jobId));
      break;
  }
};
