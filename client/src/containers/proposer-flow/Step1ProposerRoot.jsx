import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BidOrBooGenericTasks from '../../components/BidOrBooGenericTasks';

import { showLoginDialog } from '../../app-state/actions/uiActions';
import ProposerStepper from './ProposerStepper';

class ProposerRoot extends React.Component {
  render() {
    const { a_showLoginDialog, isLoggedIn } = this.props;

    return (
      <React.Fragment>
        {/* <ProposerStepper currentStepNumber={1} /> */}
        <section className="section">
          <div className="columns  is-multiline is-mobile">
            <BidOrBooGenericTasks showLoginDialog={a_showLoginDialog} isLoggedIn={isLoggedIn} />
          </div>
        </section>
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProposerRoot);
