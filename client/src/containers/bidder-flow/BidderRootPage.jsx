import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn } from '../../app-state/actions/jobActions';

import { selectJobToBidOn } from '../../app-state/actions/bidsActions';
import { TAB_IDS } from './components/helperComponents';

import { Spinner } from '../../components/Spinner';

import MapSection from './map/MapSection';

import { showLoginDialog } from '../../app-state/actions/uiActions';

const google = window.google;

class BidderRootPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allowAutoDetect: false,
      displayedJobList: this.props.ListOfJobsToBidOn,
      showSideNav: false,
      obsessAboutMeToggle: false,
      mapCenterPoint: {
        lng: -75.6972,
        lat: 45.4215,
      },
    };
  }

  componentDidMount() {
    // const { isLoggedIn, a_getCurrentUser, a_getAllJobsToBidOn, userDetails } = this.props;
    // if (!isLoggedIn) {
    //   a_getCurrentUser();
    // } else {
    //   if (userDetails.autoDetectlocation && navigator && navigator.geolocation) {
    //     this.getCurrentAddress();
    //   }
    // }
    this.getCurrentAddress();

    // a_getAllJobsToBidOn();
  }

  toggleObsessAboutMeToggle = () => {
    this.setState({ obsessAboutMeToggle: !this.state.obsessAboutMeToggle });
  };
  getCurrentAddress = () => {
    // Try HTML5 geolocation.
    if (navigator && navigator.geolocation) {
      const getCurrentPositionOptions = {
        maximumAge: 5000,
        timeout: 5000,
        enableHighAccuracy: true,
      };
      const errorHandling = (e) => {
        console.error('can not auto detect address ' + e);
      };
      const successfulRetrieval = (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.updateMapCenter(pos);
      };

      //get the current location
      navigator.geolocation.getCurrentPosition(
        successfulRetrieval,
        errorHandling,
        getCurrentPositionOptions,
      );
    } else {
      console.log('no html 5 geo location');
    }
  };

  updateMapCenter = (pos) => {
    this.setState({
      mapCenterPoint: {
        ...pos,
      },
    });
  };
  toggleSideNav = () => {
    this.setState({ showSideNav: !this.state.showSideNav });
  };

  handleChange = () => {
    this.setState({ allowAutoDetect: !this.state.allowAutoDetect }, () => {
      navigator && navigator.geolocation && this.getCurrentAddress();
    });
  };

  render() {
    // if (isLoading) {
    //   return (
    //     <section className="section">
    //       <Spinner isLoading={isLoading} size={'large'} />
    //     </section>
    //   );
    // }

    const { mapCenterPoint } = this.state;

    return (
      <div>
        <nav
          style={{ background: '#00BF6F !important', color: 'white !important' }}
          className={`navbar is-fixed-top ${
            this.state.obsessAboutMeToggle ? 'color-change-2x' : ''
          }`}
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <a href={'/api/auth/google'} className="navbar-item">
              <img
                src="https://cdn.smassets.net/wp-content/themes/survey-monkey-theme/images/surveymonkey_logo_dark.svg?ver=1.108.0"
                width="112"
                height="64"
              />
            </a>
            <div className="navbar-item">
              <input
                id="switchRoundedSuccess"
                type="checkbox"
                name="switchRoundedSuccess"
                className="switch is-rounded is-info"
                onChange={this.toggleObsessAboutMeToggle}
                checked={this.state.obsessAboutMeToggle}
              />
              <label style={{ color: 'white', fontWeight: 600 }} htmlFor="switchRoundedSuccess">
                Obsession
              </label>
            </div>
          </div>
        </nav>
        <div id="placesmap" />
        <MapSection
          obsessAboutMe={this.state.obsessAboutMeToggle}
          mapCenterPoint={mapCenterPoint}
          {...this.props}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
    ListOfJobsToBidOn: jobsReducer.ListOfJobsToBidOn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch),
    a_getAllJobsToBidOn: bindActionCreators(getAllJobsToBidOn, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidderRootPage);
