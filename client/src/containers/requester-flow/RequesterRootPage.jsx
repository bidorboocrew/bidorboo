import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { showLoginDialog } from '../../app-state/actions/uiActions';
import { getAllActiveRequestsTemplateCards } from '../../bdb-tasks/getAllRequestsTemplateCards';
import WhatCanWeHelpWith from '../../assets/images/WhatCanWeHelpWith.png';

class RequesterRoot extends React.Component {
  constructor(props) {
    super(props);
    this.AllActiveTasks = getAllActiveRequestsTemplateCards({ ...props }).map((task, index) => {
      return (
        <div
          style={{ margin: '3rem' }}
          key={index}
          className="column is-narrow isforCards slide-in-bottom-small"
        >
          {task}
        </div>
      );
    });
  }

  render() {
    return (
      <React.Fragment>
        <section className="hero has-text-centered  is-success is-bold is-small">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title">Need Help With Your Chores?</h1>
              <h2 className="subtitle">
                Select from our list of service and we will connect you with Taskers in your area
              </h2>
            </div>
          </div>
        </section>
        <div className="columns is-centered is-multiline">{this.AllActiveTasks}</div>
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
  return { dispatch, showLoginDialog: bindActionCreators(showLoginDialog, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequesterRoot);
