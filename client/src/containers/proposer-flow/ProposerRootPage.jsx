import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { showLoginDialog } from '../../app-state/actions/uiActions';
import { getAllActiveRequestsTemplateCards } from '../../bdb-tasks/getAllRequestsTemplateCards';

class ProposerRoot extends React.Component {
  constructor(props) {
    super(props);
    this.AllActiveTasks = getAllActiveRequestsTemplateCards({ ...props }).map((task, index) => {
      return (
        <div key={index} className="column is-narrow isforCards slide-in-bottom-small">
          {task}
        </div>
      );
    });
  }

  render() {
    const { isForHomepage = false } = this.props;
    return (
      <React.Fragment>
        <section className={`hero ${isForHomepage ? 'is-success is-bold' : 'is-white'}`}>
          <div className="hero-body has-text-centered">
            <div className="container">
              <h1 style={{ marginBottom: 0 }} className="title">
                What service are you looking for?
              </h1>
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
  return {
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposerRoot);
