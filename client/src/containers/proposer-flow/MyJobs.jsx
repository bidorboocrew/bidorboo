import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllMyJobs } from '../../app-state/actions/jobActions';
import { switchRoute } from '../../app-state/actions/routerActions';
import MyPostedJobCard from '../../components/proposer-components/MyPostedJobCard';

class MyJobs extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.a_getAllMyJobs();
  }
  render() {
    const { s_myPostedJobsList, s_userDetails, a_switchRoute } = this.props;
    return (
      <div className="slide-in-left" id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#e98969' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                My Posted Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Get the work done for the best price possible.
              </h2>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
          <div className="container">
            <div
              // style={{ alignItems: 'flex-end' }}
              className="columns is-multiline"
            >
              <MyPostedJobCard
                userDetails={s_userDetails}
                switchRoute={a_switchRoute}
                jobsList={s_myPostedJobsList}
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    s_error: jobsReducer.error,
    s_myPostedJobsList: jobsReducer.myPostedJobsList,
    s_isLoading: jobsReducer.isLoading,
    s_userDetails: userModelReducer.userDetails
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_getAllMyJobs: bindActionCreators(getAllMyJobs, dispatch),
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyJobs);
