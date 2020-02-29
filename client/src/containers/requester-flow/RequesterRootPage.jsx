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
        <section className="hero has-text-centered is-small">
          <div style={{ paddingBottom: 0 }} className="hero-body">
            <div className="container has-text-centered">
              <img style={{ width: 280 }} src={WhatCanWeHelpWith} alt="Placeholder" />
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
