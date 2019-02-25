import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MapWithAMarkerClusterer from './MapWithAMarkerClusterer';
import { selectJobToBidOn } from '../../../app-state/actions/bidsActions';
import { showLoginDialog } from '../../../app-state/actions/uiActions';

class MapSection extends React.Component {
  render() {
    const {
      a_selectJobToBidOn,
      mapCenterPoint,
      isLoggedIn,
      a_showLoginDialog,
      userDetails,
      jobsList,
      obsessAboutMe
    } = this.props;

    return jobsList ? (
      <MapWithAMarkerClusterer
        selectJobToBidOn={a_selectJobToBidOn}
        mapCenterPoint={mapCenterPoint}
        isLoggedIn={isLoggedIn}
        showLoginDialog={a_showLoginDialog}
        userDetails={userDetails}
        jobsList={jobsList}
        obsessAboutMe={obsessAboutMe}
      />
    ) : null;
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch),
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapSection);
