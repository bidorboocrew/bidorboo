import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { getAllRequestsTemplateCards } from '../../bdb-tasks/getAllRequestsTemplateCards';

class ProposerRoot extends React.Component {
  constructor(props) {
    super(props);
    this.AllTasks = getAllRequestsTemplateCards(props).map((task, index) => {
      return (
        <div key={index} className="column">
          {task}
        </div>
      );
    });
  }

  render() {
    const { isLoggedIn, userDetails } = this.props;

    return (
      <div className="container is-widescreen">
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 className="title">Request a Service</h1>
              <h2 className="subtitle">
                Start by filling out a service reqeuest and one of our BidOrBoo Taskers will do it
                for you
                {isLoggedIn && userDetails && !userDetails.autoDetectlocation && (
                  <React.Fragment>
                    <div style={{ marginTop: 6 }} className="help has-text-grey ">
                      For custom results enable auto detect location in
                    </div>
                    <a
                      style={{ marginTop: 0 }}
                      className="help has-text-link has-text-weight-semibold"
                      onClick={() => {
                        switchRoute(`${ROUTES.CLIENT.MY_PROFILE.basicSettings}`);
                      }}
                    >
                      {` profile settings`}
                    </a>
                  </React.Fragment>
                )}
              </h2>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="columns is-centered is-multiline">{this.AllTasks}</div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    userDetails: userReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProposerRoot);
