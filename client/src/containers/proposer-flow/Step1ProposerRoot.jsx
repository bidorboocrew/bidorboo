import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BidOrBooGenericTasks from '../../components/BidOrBooGenericTasks';

import { showLoginDialog } from '../../app-state/actions/uiActions';
import ProposerStepper from './ProposerStepper';

class ProposerRoot extends React.Component {
  // componentDidMount() {
  //   // const { a_showLoginDialog, match } = this.props;
  //   // const shouldShowLoginDialog = match.params.showLoginDialog;
  //   // if (shouldShowLoginDialog === 'true') {
  //   //   a_showLoginDialog(true);
  //   // }
  // }

  render() {
    const { a_showLoginDialog, isLoggedIn } = this.props;
    // 768 is bulma mobile size
    const classToApply =
      window.innerWidth > 768
        ? 'container bdbPage pageWithStepper desktop'
        : 'container bdbPage pageWithStepper mobile';
    return (
      <React.Fragment>
        <ProposerStepper currentStepNumber={1} />
        <div className={`${classToApply}`}>
          <div className="columns is-multiline">
            <BidOrBooGenericTasks showLoginDialog={a_showLoginDialog} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = ({ authReducer }) => {
  return {
    isLoggedIn: authReducer.isLoggedIn,
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
