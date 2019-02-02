/**
 *
 * https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js#L628
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMyPastProvidedServices } from '../app-state/actions/userModelActions';

import { Spinner } from '../components/Spinner';

class PastProvidedServices extends React.Component {
  componentDidUpdate(prevProps) {
    // it was not logged in and now it is
    if (!prevProps.isLoggedIn && this.props.isLoggedIn) {
      this.props.a_getMyPastProvidedServices();
    }
  }

  render() {
    const { isLoggedIn } = this.props;

    if (!isLoggedIn) {
      return (
        <div className="container is-widescreen bidorbooContainerMargins">
          <Spinner isLoading size={'large'} />
        </div>
      );
    }

    return (
      <div className="container is-widescreen bidorbooContainerMargins">
        <div>under construction</div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    myPastProvidedServices: userReducer.myPastProvidedServices,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getMyPastProvidedServices: bindActionCreators(getMyPastProvidedServices, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PastProvidedServices);
