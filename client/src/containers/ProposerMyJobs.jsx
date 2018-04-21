import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spinner } from '../components/Spinner';
import { getAllJobs } from '../app-state/actions/jobActions';
import { switchRoute } from '../app-state/actions/routerActions';

class ProposerMyJobs extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.a_getAllJobs();
  }
  render() {
    const { a_switchRoute } = this.props;
    return (
      <div id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#e98969' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Post Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Get the work done for the best price possible.
              </h2>
            </div>
          </div>
        </section>
        <section className="section mainSectionContainer">
          <div className="container">
            <div className="columns is-multiline" />
          </div>
        </section>
      </div>
    );
  }
}
const mapStateToProps = ({ jobsReducer }) => {
  return {
    s_error: jobsReducer.error,
    s_userJobsList: jobsReducer.userJobsList,
    s_isLoading: jobsReducer.isLoading
  };
};
const mapDispatchToProps = dispatch => {
  return {
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_getAllJobs: bindActionCreators(getAllJobs, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposerMyJobs);
