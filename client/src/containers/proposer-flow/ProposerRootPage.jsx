import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { showLoginDialog } from '../../app-state/actions/uiActions';
import { getAllActiveRequestsTemplateCards } from '../../bdb-tasks/getAllRequestsTemplateCards';

class ProposerRoot extends React.Component {
  constructor(props) {
    super(props);
    this.AllActiveTasks = getAllActiveRequestsTemplateCards().map((task, index) => {
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
        <section className="hero is-transparent is-small has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ marginBottom: 0, fontWeight: 300 }} className="title">
                What Service are you looking for?
              </h1>
            </div>
          </div>
        </section>
        <div className="columns is-centered is-mobile is-multiline">{this.AllActiveTasks}</div>
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
