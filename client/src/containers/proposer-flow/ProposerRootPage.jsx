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
        <div
          style={{ background: 'transparent', marginBottom: 0 }}
          className="tabs is-large is-centered"
        >
          <ul>
            <li>
              <a>
                <span className="icon is-large">
                  <i className="far fa-plus-square" aria-hidden="true" />
                </span>
                <span>REQUEST A SERVICE</span>
              </a>
            </li>
          </ul>
        </div>
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
