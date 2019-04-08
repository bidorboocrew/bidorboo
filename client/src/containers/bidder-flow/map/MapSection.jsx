import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MapWithAMarkerClusterer from './MapWithAMarkerClusterer';
import { selectJobToBidOn } from '../../../app-state/actions/bidsActions';
import { showLoginDialog } from '../../../app-state/actions/uiActions';

class MapSection extends React.Component {
  render() {
    const {
      selectJobToBidOn,
      mapCenterPoint,
      isLoggedIn,
      showLoginDialog,
      userDetails,
      jobsList,
    } = this.props;

    return jobsList ? (
      <MapWithAMarkerClusterer
        selectJobToBidOn={selectJobToBidOn}
        mapCenterPoint={mapCenterPoint}
        isLoggedIn={isLoggedIn}
        showLoginDialog={showLoginDialog}
        userDetails={userDetails}
        jobsList={jobsList}
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
    selectJobToBidOn: bindActionCreators(selectJobToBidOn, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapSection);
