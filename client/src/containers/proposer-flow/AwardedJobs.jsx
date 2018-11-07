import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllMyAwardedJobs } from '../../app-state/actions/jobActions';

import AwardedJobsList from '../../components/proposer-components/AwardedJobsList';

class MyJobs extends React.Component {
  componentDidMount() {
    this.props.a_getAllMyAwardedJobs();
  }

  render() {
    const { myAwardedJobsList, userDetails } = this.props;
    return (
      <div className="slide-in-left" id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#9C89B8' }} className="hero-body has-text-centered">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                My Awarded Jobs
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
              <AwardedJobsList
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyJobs);
