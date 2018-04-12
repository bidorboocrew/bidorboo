import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BidOrBooDefaultTasks } from '../components/BidOrBooDefaultTasks';
import { CreateJob } from '../components/CreateJob';
import { getAllJobs } from '../app-state/actions/jobActions';
import { Spinner } from '../components/Spinner';

class ProposerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      selectedFilterTag: '',
      displayedJobs: [],
      showCreateNewJob: false
    };
    this.updateSearchTerm = e => {
      e.preventDefault();
      const newSearchTerm = e.target.value ? e.target.value.trim() : '';
      this.setState({ ...this.state, searchTerm: newSearchTerm });
    };
    this.showCreateJobView = (e, shouldShow) => {
      e.preventDefault();
      this.setState({ ...this.state, showCreateNewJob: shouldShow });
    };
  }

  componentDidMount() {
    //fireup job request
    this.props.a_getAllJobs();
  }

  render() {
    const { s_isLoading, s_userJobsList, s_error } = this.props;

    const filterBySearchTerm =
      this.state.searchTerm && this.state.searchTerm.length >= 0;
    let displayedTasks = s_userJobsList;

    if (filterBySearchTerm) {
      //show tasks that contain any part of the search term
    }
    const createNewJob = () => {
      return (
        <CreateJob
          submitNewJobs={vals => {
            debugger;
          }}
        />
      );
    };
    const showDefaultView = () => {
      return (
        <div>
          <nav className="level">
            <div className="level-left">
              <div className="level-item">
                <div className="subtitle is-5">
                  <strong>Jobs</strong>' search
                </div>
              </div>
              <div style={{ flexBasis: '140%' }} className="level-item">
                <div style={{ flexBasis: '140%' }} className="field">
                  <div className="control">
                    <input
                      onChange={e => {
                        this.updateSearchTerm(e);
                      }}
                      className="input"
                      type="text"
                      placeholder="Search your jobs..."
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="level-right">
              <div className="level-item">
                <a
                  onClick={e => this.showCreateJobView(e, true)}
                  style={{ boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.14)' }}
                  className="button is-success"
                >
                  <i
                    style={{ marginRight: 4 }}
                    className="fa fa-plus fa-w-14"
                  />Request a Job
                </a>
              </div>
            </div>
          </nav>
          {/* xxxxxxxxxxxxxxxxxxxxx top section xxxxxxxxxxxxxxxxxxxxx */}
          <div className="container">
            <div id="my-jobs">
              {this.state.searchTerm.length > 0}

              <div className="bdb-section-title">Your Existing Jobs</div>
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">
                <div className="column">
                  <Spinner isLoading={s_isLoading} />
                  {s_isLoading &&
                    s_error && <div>error fetching your jobs {s_error}</div>}
                  {!s_isLoading &&
                    !(displayedTasks.length > 0) && (
                      <div className="is-size-6 has-text-grey-light">
                        {filterBySearchTerm
                          ? 'No results match your Search. Try to clear your search or use a less specific term '
                          : 'You do not have any posted jobs yet. You can start posting jobs by clicking on the request a job button'}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div id="template-jobs">
              <div className="bdb-section-title">BidorBoo Job Teamplates</div>
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">
                <BidOrBooDefaultTasks />
              </div>
            </div>
          </div>
        </div>
      );
    };
    return (
      <section className="section mainSectionContainer">
        <div className="container" id="bdb-proposer-content">
          {this.state.showCreateNewJob ? createNewJob() : showDefaultView()}
        </div>
      </section>
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
    a_getAllJobs: bindActionCreators(getAllJobs, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposerContainer);
