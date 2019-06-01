import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import {
  getAllActiveRequestsTemplateCards,
  getAllUpcomingTemplateCards,
} from '../../bdb-tasks/getAllRequestsTemplateCards';

class ProposerRoot extends React.Component {
  constructor(props) {
    super(props);
    this.AllActiveTasks = getAllActiveRequestsTemplateCards(props).map((task, index) => {
      return (
        <div key={index} className="column">
          {task}
        </div>
      );
    });

    this.AllUpcomingTasks = getAllUpcomingTemplateCards(props).map((task, index) => {
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
            </div>
          </div>
        </section>
        <hr className="divider" />
        <div className="columns is-centered is-multiline">{this.AllActiveTasks}</div>

        <div className="columns is-centered is-multiline">{this.AllUpcomingTasks}</div>
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
