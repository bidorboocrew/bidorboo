import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllMyOpenJobs, deleteJobById } from '../../app-state/actions/jobActions';

import MyJobsList from '../../components/proposer-components/MyJobsList';

class MyJobs extends React.Component {
  componentDidMount() {
    this.props.a_getAllMyOpenJobs();
  }

  render() {
    const { myOpenJobsList, userDetails, a_selectJob, a_deleteJobById } = this.props;
    return (
      <div className="slide-in-left bdbPage">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#9C89B8' }} className="hero-body">
            <div className="container is-fluid">
              <h1 style={{ color: 'white' }} className="title">
                My Posted Requests
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
              <MyJobsList
                userDetails={userDetails}
                jobsList={myOpenJobsList}
                deleteJob={a_deleteJobById}
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
    myOpenJobsList: jobsReducer.myOpenJobsList,
    isLoading: jobsReducer.isLoading,
    userDetails: userModelReducer.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_getAllMyOpenJobs: bindActionCreators(getAllMyOpenJobs, dispatch),
    a_deleteJobById: bindActionCreators(deleteJobById, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyJobs);
