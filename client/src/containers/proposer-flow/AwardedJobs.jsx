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
      <div className="slide-in-left bdbPage">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#9C89B8' }} className="hero-body">
            <div className="container is-fluid">
              <h1 style={{ color: 'white' }} className="title">
                Requests Queue
              </h1>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container is-fluid">
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
const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    error: jobsReducer.error,
    myAwardedJobsList: jobsReducer.myAwardedJobsList,
    isLoading: jobsReducer.isLoading,
    userDetails: userReducer.userDetails,
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
