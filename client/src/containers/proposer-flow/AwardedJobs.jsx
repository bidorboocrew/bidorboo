import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllMyAwardedJobs, selectJob } from '../../app-state/actions/jobActions';

import MyJobsList from '../../components/proposer-components/MyJobsList';

class MyJobs extends React.Component {
  componentDidMount() {
    this.props.a_getAllMyAwardedJobs();
  }

  render() {
    const { myAwardedJobsList, userDetails, a_selectJob } = this.props;
    return (
      <div className="slide-in-left" id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#e98969' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                My Posted Jobs
              </h1>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
          <div className="container">
            <div
              // style={{ alignItems: 'flex-end' }}
              className="columns is-multiline"
            >
              <MyJobsList
                selectJobHandler={a_selectJob}
                userDetails={userDetails}
                jobsList={myAwardedJobsList}
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
    error: jobsReducer.error,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    isLoading: jobsReducer.isLoading,
    userDetails: userModelReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getAllMyAwardedJobs: bindActionCreators(getAllMyAwardedJobs, dispatch),
    a_selectJob: bindActionCreators(selectJob, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyJobs);
