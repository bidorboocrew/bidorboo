import React from 'react';
import ReactStars from 'react-stars';
import moment from 'moment';
import AddToCalendar from 'react-add-to-calendar';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import jobTemplateIdToDefinitionObjectMapper from '../bdb-tasks/jobTemplateIdToDefinitionObjectMapper';

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
    <DisplayLabelValue labelText="Avg Bid:" labelValue={`${minBid}$ (CAD)`} />
  ) : (
    <DisplayLabelValue labelText="Avg Bid:" labelValue={`No Bids yet!`} />
  );
  return avgBidLabel;
};

export const DisplayLabelValue = ({ labelText, labelValue, renderHelpComponent = () => null }) => {
  return (
    <div className="field">
      <label className="label">{labelText}</label>
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
    <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
      <span className="icon">
        <i className={`${iconClass}`} />
      </span>
      <span style={{ marginLeft: 4 }}>{title}</span>
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
      displayName && displayName.length > 8 ? `${displayName.substring(0, 8)}...` : displayName;
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
      <figure style={{ margin: '0 6px 0 0' }} className="media-left">
        <p className={`image ${large ? 'is-64x64' : 'is-48x48'} `}>
          <img
            style={{
              width: `${large ? 64 : 48}`,
              height: `${large ? 64 : 48}`,
              boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)',
            }}
            src={profileImage.url}
            alt="image"
          />
        </p>
      </figure>

      <div className="media-content">
        <div className="content">
          <div className={`${large ? 'is-size-6' : 'is-size-6'}`}>{trimmedDisplayName}</div>

          {rating.globalRating === 'No Ratings Yet' || rating.globalRating === 0 ? (
            <p className="is-size-7">No Ratings Yet</p>
          ) : (
            <ReactStars
              style={{ cursor: 'pointer' }}
              className="is-size-7"
              half
              count={5}
              value={rating.globalRating}
              edit={false}
              size={large ? 35 : 20}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          )}
        </div>
      </div>
    </article>
  );
};

export const CardTitleAndActionsInfo = ({
  jobState,
  fromTemplateId,
  bidsList = [],
  userAlreadyView = false,
  userAlreadyBid = false,
  isOnMapView = false,
}) => {
  const areThereAnyBidders = bidsList && bidsList.length > 0;

  let bidsCountLabel = 'No bids';
  if (bidsList.length === 1) {
    bidsCountLabel = '1 bid';
  }
  if (bidsList.length > 1) {
    bidsCountLabel = `${bidsList.length} bids`;
  }

  const isAwarded = `${jobState ? jobState : ''}` && `${jobState}`.toLowerCase() === 'awarded';
  return (
    <nav style={{ marginBottom: 8 }} className="level is-mobile">
      <div className="level-left">
        <div className="level-item">
          <div className={`${isOnMapView ? 'is-size-6' : 'is-size-5'} has-text-weight-bold`}>
            <span className="icon">
              <i className="fas fa-home" />
            </span>
            <span style={{ marginLeft: 4 }}>
              {jobTemplateIdToDefinitionObjectMapper[fromTemplateId].TITLE}
            </span>
          </div>
        </div>
      </div>
      {!isOnMapView && (
        <React.Fragment>
          <div className="level-right">
            <div className="level-item has-text-centered">
              {userAlreadyView && (
                <div>
                  <div className="icon">
                    <i className="far fa-eye" />
                  </div>
                  <div className="help">Viewed</div>
                </div>
              )}
            </div>
            <div className="level-item has-text-centered">
              {!isAwarded && !userAlreadyBid && (
                <div className="has-text-grey">
                  <div className="icon">
                    <i className="fas fa-hand-paper" />
                  </div>
                  <div className="help">{bidsCountLabel}</div>
                </div>
              )}
            </div>
            <div className="level-item has-text-centered">
              {userAlreadyBid && (
                <div>
                  <div className="icon">
                    <i className="fas fa-money-check-alt" />
                  </div>
                  <div className="help">Already Bid</div>
                </div>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </nav>
  );
};

const timeToTextMap = {
  '10': 'flexible, anytime.',
  '8': 'morning',
  '12': 'afternoon',
  '17': 'evening',
};
export const StartDateAndTime = ({ date, renderHelpComponent }) => {
  const startingDate = moment(date).format('DD/MMM/YYYY');
  const selectedTime = `${moment(date).get('hour')}`;
  let timeText = 'flexible, anytime.';
  switch (`${selectedTime}`) {
    case '10':
      timeText = 'flexible, anytime.';
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
      timeText = 'flexible, anytime.';
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
      <div className="field">
        <label className="label">Location Near:</label>
        <div className="control">{this.state.addressText}</div>
        <p className="help">* Exact location is not displayed for privacy reasons</p>
      </div>
    );
  }
}

export const StepsForRequest = ({ step, isSmall }) => {
  return (
    <ul className={`steps has-content-centered is-horizontal ${isSmall ? 'is-small' : ''} `}>
      <li className={`steps-segment ${step === 1 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fas fa-pencil-alt" />
          </span>
        </span>
        <div className="steps-content">
          <p>Fill Details</p>
        </div>
      </li>
      <li className={`steps-segment ${step === 2 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="far fa-clock" />
          </span>
        </span>
        <div className="steps-content">
          <p>Recieve Bids</p>
        </div>
      </li>
      <li className={`steps-segment ${step === 3 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fa fa-usd" />
          </span>
        </span>
        <div className="steps-content">
          <p>Choose a Tasker</p>
        </div>
      </li>
      {/* <li className="steps-segment">
        <span className="steps-marker">
          <span className="icon">
            <i className="far fa-comments" />
          </span>
        </span>
        <div className="steps-content">
          <p>Finalize the details</p>
        </div>
      </li> */}
      <li className="steps-segment is-dashed">
        <span className="steps-marker">
          <span className="icon">
            <i className="fas fa-check-circle" />
          </span>
        </span>
        <div className="steps-content">
          <p>Get it done</p>
        </div>
      </li>
    </ul>
  );
};

export const StepsForTasker = ({ step, isMoreDetails, isSmall }) => {
  return (
    <ul className={`steps has-content-centered is-horizontal ${isSmall ? 'is-small' : ''}`}>
      <li className={`steps-segment ${step === 1 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fas fa-crosshairs" />
          </span>
        </span>
        <div className="steps-content">
          <p className={`${isSmall ? 'help' : ''}`}>Select a Job</p>
        </div>
      </li>
      <li
        className={`steps-segment ${isMoreDetails ? 'is-dashed' : ''} ${
          step === 2 ? 'is-active' : ''
        }`}
      >
        <span className="steps-marker">
          <span className="icon">
            <i className="fas fa-pencil-alt" />
          </span>
        </span>
        <div className="steps-content">
          <p className={`${isSmall ? 'help' : ''}`}>Bid On it</p>
        </div>
      </li>
      {isMoreDetails && (
        <li className={`steps-segment ${step === 3 ? 'is-active' : ''}`}>
          <span className="steps-marker">
            <span className="icon">
              <i className="fas fa-check" />
            </span>
          </span>
          <div className="steps-content">
            <p className={`${isSmall ? 'help' : ''}`}>Requester Selects a Tasker</p>
          </div>
        </li>
      )}
      <li className={`steps-segment ${step === 4 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fa fa-usd" />
          </span>
        </span>
        <div className="steps-content">
          <p className={`${isSmall ? 'help' : ''}`}>Do it and get paid</p>
        </div>
      </li>
    </ul>
  );
};

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

export const AddAwardedJobToCalendar = ({ job }) => {
  if (!job) {
    return null;
  }

  const { startingDateAndTime, addressText, fromTemplateId } = job;

  const { email, phone, displayName } = job._ownerRef;

  const emailContact = email && email.emailAddress ? `${email.emailAddress}` : '';
  const phoneContactNumber = phone && phone.phoneNumber ? ` or ${phone.phoneNumber}` : '';

  const title = `BidOrBoo: ${jobTemplateIdToDefinitionObjectMapper[fromTemplateId].TITLE} request`;
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
      buttonClassClosed="button is-outlined is-small"
    />
  );
};

export const EffortLevel = ({ extras }) => {
  return extras && extras.effort ? (
    <DisplayLabelValue labelText="Effort" labelValue={extras.effort} />
  ) : (
    <DisplayLabelValue labelText="Effort" labelValue={'Not Specified'} />
  );
};

export const VerifiedVia = ({ userDetails, isCentered = true }) => {
  const {
    stripeConnect = { isVerified: false },
    phone = { isVerified: false },
    email = { isVerified: false },
    isGmailUser = false,
    isFbUser = false,
    clearCriminalHistory = false,
  } = userDetails;

  const atLeastOneVerification =
    isFbUser ||
    isGmailUser ||
    phone.isVerified ||
    email.isVerified ||
    stripeConnect.isVerified ||
    clearCriminalHistory;

  return (
    <div className="field">
      {atLeastOneVerification && <label className="help">Verifications</label>}
      {!atLeastOneVerification && <label className="help">Unverified</label>}

      <div className={`control ${isCentered ? 'has-text-centered' : ''}`}>
        {isFbUser && (
          <span title="Verified by facebook" className="icon">
            <i className={`fab fa-facebook ${isFbUser ? 'has-text-link' : 'has-text-grey'}`} />
          </span>
        )}
        {isGmailUser && (
          <span title="Verified by gmail" className="icon">
            <i className={`fab fa-google ${isGmailUser ? 'has-text-danger' : 'has-text-grey'}`} />
          </span>
        )}
        {phone.isVerified && (
          <span title="Verified by phone" className="icon">
            <i
              className={`fas fa-phone ${phone.isVerified ? 'has-text-success' : 'has-text-grey'}`}
            />
          </span>
        )}
        {email.isVerified && (
          <span title="Verified by email" className="icon">
            <i
              className={`far fa-envelope ${
                email.isVerified ? 'has-text-success' : 'has-text-grey'
              }`}
            />
          </span>
        )}
        {stripeConnect.isVerified && (
          <span title="Verified by bank account" className="icon">
            <i
              className={`fas fa-money-check-alt ${
                stripeConnect.isVerified ? 'has-text-success' : 'has-text-grey'
              }`}
            />
          </span>
        )}
        {clearCriminalHistory && (
          <span title="Verified by criminal check" className="icon">
            <i
              className={`fas fa-balance-scale ${
                clearCriminalHistory ? 'has-text-success' : 'has-text-grey'
              }`}
            />
          </span>
        )}
      </div>
    </div>
  );
};
