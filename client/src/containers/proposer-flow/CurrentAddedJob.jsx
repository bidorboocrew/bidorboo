import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../app-state/actions/routerActions';
import { addJob } from '../../app-state/actions/jobActions';
import { Proptypes_jobModel } from '../../client-server-interfaces';
import MyCurrentPostedJobCardWithDetails from '../../components/proposer-components/MyCurrentPostedJobCardWithDetails';

class CurrentAddedJob extends React.Component {
  static propTypes = {
    s_recentlyUpdatedJob: Proptypes_jobModel
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const { a_switchRoute, s_recentlyUpdatedJob, s_userDetails } = this.props;

    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a
                  onClick={() => {
                    a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.myjobs);
                  }}
                >
                  My Jobs
                </a>
              </li>
              <li className="is-active">
                <a aria-current="page">Current Job</a>
              </li>
            </ul>
          </nav>
        </div>
        <section className="mainSectionContainer slide-in-left">
          <div className="container" id="bdb-proposer-content">
            <div className="columns">
              <div className="column is-8 is-offset-2">
                <MyCurrentPostedJobCardWithDetails
                  userDetails={s_userDetails}
                  switchRoute={a_switchRoute}
                  jobDetails={s_recentlyUpdatedJob}
                />
              </div>
            </div>
          </div>
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userModelReducer }) => {
  return {
    s_recentlyUpdatedJob: jobsReducer.recentlyUpdatedJob,
    s_userDetails: userModelReducer.userDetails
  };
};

const mapDispatchToProps = dispatch => {
  return {
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_addJob: bindActionCreators(addJob, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentAddedJob);
