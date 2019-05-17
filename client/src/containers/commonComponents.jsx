import React from 'react';
import ReactStars from 'react-stars';
import moment from 'moment';
import AddToCalendar from 'react-add-to-calendar';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import jobTemplateIdToDefinitionObjectMapper from '../bdb-tasks/jobTemplateIdToDefinitionObjectMapper';

const geocoder = new window.google.maps.Geocoder();

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
    <DisplayLabelValue labelText="Avg Bid:" labelValue={`None yet!`} />
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

export const JobTitleText = ({ title }) => {
  return <p className="is-size-6 has-text-weight-semibold">{title}</p>;
};
export const UserImageAndRating = ({ userDetails }) => {
  let temp = userDetails
    ? userDetails
    : { profileImage: { url: '' }, displayName: '--', rating: { globalRating: 'no rating' } };

  const { profileImage, displayName, rating } = temp;
  let trimmedDisplayName =
    displayName && displayName.length > 10 ? `${displayName.substring(0, 8)}...` : displayName;
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
      className="media"
    >
      <figure style={{ margin: '0 6px 0 0' }} className="media-left">
        <p className="image is-48x48">
          <img
            style={{ boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.34)' }}
            src={profileImage.url}
            alt="image"
          />
        </p>
      </figure>

      <div className="media-content">
        <div className="content">
          <p className="is-size-6">{trimmedDisplayName}</p>

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
              size={20}
              color1={'lightgrey'}
              color2={'#ffd700'}
            />
          )}
          {/* <p style={{ textDecoration: 'underline' }} className="is-size-7">
          click to view full profile
        </p> */}
        </div>
      </div>
    </article>
  );
};

export const CardTitleWithBidCount = ({
  jobState,
  fromTemplateId,
  bidsList = [],
  userAlreadyView = false,
  userAlreadyBid = false,
}) => {
  const areThereAnyBidders = bidsList && bidsList.length > 0;
  const bidsCountLabel = `${bidsList ? bidsList.length : 0} bids`;
  const isAwarded = `${jobState ? jobState : ''}` && `${jobState}`.toLowerCase() === 'awarded';
  return (
    <React.Fragment>
      <div className="is-size-4 has-text-weight-semibold">
        {jobTemplateIdToDefinitionObjectMapper[fromTemplateId].TITLE}
      </div>
      <div>
        <a>
          {userAlreadyBid && (
            <span title="You've Bid Already" style={{ marginRight: 4 }} className="has-text-grey">
              <span className="icon">
                <i className="fas fa-money-check-alt" />
              </span>
            </span>
          )}
          {userAlreadyView && (
            <span
              title="You've Seen this Already"
              style={{ marginRight: 4 }}
              className="has-text-grey"
            >
              <span className="icon">
                <i className="far fa-eye" />
              </span>
            </span>
          )}
          {!isAwarded && (
            <span
              title="Bids Count"
              className={`${areThereAnyBidders ? 'has-text-success' : 'has-text-grey'}`}
            >
              <span className="icon">
                <i className="fas fa-hand-paper" />
              </span>
              <span>{bidsCountLabel}</span>
            </span>
          )}
          {isAwarded && <span className={'has-text-info has-text-weight-bold'}>Awarded</span>}
        </a>
      </div>
    </React.Fragment>
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

  const selectedTime = moment(date).get('hour');
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

  if (selectedTime && selectedTime > 0) {
    timeText = timeToTextMap[`${selectedTime}`];
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
  }

  componentDidMount() {
    const { location } = this.props;
    if (!location || location.length !== 2) {
      alert('error location is invalid');
      return null;
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
              this.setState({
                addressText: address,
              });
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
        <div className="control is-success">{this.state.addressText}</div>
        <p className="help">*For safety purposes location is approximate.</p>
      </div>
    );
  }
}

export const StepsForRequest = ({ step }) => {
  return (
    <ul className="steps has-content-centered is-horizontal">
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

export const StepsForTasker = ({ step }) => {
  return (
    <ul className="steps has-content-centered is-horizontal">
      <li className={`steps-segment ${step === 1 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fas fa-crosshairs" />
          </span>
        </span>
        <div className="steps-content">
          <p>Select a Job</p>
        </div>
      </li>
      <li className={`steps-segment ${step === 2 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="fas fa-pencil-alt" />
          </span>
        </span>
        <div className="steps-content">
          <p>Bid On it</p>
        </div>
      </li>
      {/* <li className={`steps-segment ${step === 3 ? 'is-active' : ''}`}>
        <span className="steps-marker">
          <span className="icon">
            <i className="far fa-clock" />
          </span>
        </span>
        <div className="steps-content">
          <p>Get Awarded</p>
        </div>
      </li> */}
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
      <li className="steps-segment">
        <span className="steps-marker">
          <span className="icon">
            <i className="fa fa-usd" />
          </span>
        </span>
        <div className="steps-content">
          <p>Do it and get paid</p>
        </div>
      </li>
    </ul>
  );
};

export const DisplayShortAddress = ({ addressText }) => {
  if (addressText && addressText.length > 0) {
    let shortAddressString = addressText;
    //example 92 Woodbury Crescent, Ottawa, ON K1G 5E2, Canada => [92 Woodbury Crescent, Ottawa ...]
    const addressPieces = addressText.split(',');
    if (addressPieces.length > 2) {
      shortAddressString = `${addressPieces[0]} , ${addressPieces[1]}`;
      return <DisplayLabelValue labelText={'Address'} labelValue={shortAddressString} />;
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
      buttonClassClosed="button is-success is-outlined"
    />
  );
};
