import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getAllJobs } from '../app-state/actions/jobActions';
// import { switchRoute } from '../app-state/actions/routerActions';
import PostedJobCard from '../components/PostedJobCard';





class ProposerMyJobs extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    //this.props.a_getAllJobs();
  }
  render() {
    const{s_userPostedJobsList} = this.props;
    return (
      <div className="fade-in" id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#e98969' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                My Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Get the work done for the best price possible.
              </h2>
            </div>
          </div>
        </section>
        <section className="section mainSectionContainer">
          <div className="container">
            <div className="columns is-multiline">
              <PostedJobCard jobsList={s_userPostedJobsList}/>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer }) => {
  return {
    s_error: jobsReducer.error,
    s_userPostedJobsList: jobsReducer.userPostedJobsList,
    s_isLoading: jobsReducer.isLoading
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_getAllJobs: bindActionCreators(getAllJobs, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposerMyJobs);
