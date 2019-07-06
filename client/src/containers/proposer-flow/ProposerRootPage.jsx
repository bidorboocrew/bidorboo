import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

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
        <div key={index} className="column is-narrow isforCards">
          {task}
        </div>
      );
    });

    this.AllUpcomingTasks = getAllUpcomingTemplateCards(props).map((task, index) => {
      return (
        <div key={index} className="column is-narrow isforCards">
          {task}
        </div>
      );
    });
  }

  render() {

    return (
      <React.Fragment>
        <section className="hero is-white">
          <div className="hero-body">
            <div className="has-text-centered">
              <h1 className="title">What Service do you need?</h1>
            </div>
          </div>
        </section>
        <div className="columns is-centered is-multiline is-mobile">
          {this.AllActiveTasks}
        </div>
        <br />

        {/* <div className="columns forJobSummary is-centered is-multiline is-mobile">
          {this.AllUpcomingTasks}
        </div> */}
      </React.Fragment>
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
