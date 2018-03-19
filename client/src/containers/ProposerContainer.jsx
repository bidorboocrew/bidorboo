import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { bidorbooDefaultTasks } from '../constants/bidorbooDefaultTasks';
import { getAllJobs } from '../app-state/actions/jobActions';

class ProposerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      selectedFilterTag: ''
    };
  }

  componentDidMount() {
    //fireup job request
    this.props.a_getAllJobs();
  }

  render() {
    const { s_isLoading, s_userJobsList, s_error } = this.props;
    const defaultTasks = bidorbooDefaultTasks.map(defaultTask => (
      <BidOrBooDefaultTask key={defaultTask.id} {...defaultTask} />
    ));

    return (
      <div id="bdb-proposer-content">
        <section className="section">
          <div className="container">
            {/* xxxxxxxxxxxxxxxxxxxxx top section xxxxxxxxxxxxxxxxxxxxx */}
            <nav className="level">
              <div className="level-left">
                <div className="level-item">
                  <div className="subtitle is-5">
                    <strong>Jobs</strong>' search
                  </div>
                </div>
                <div style={{ flexBasis: '100%' }} className="level-item">
                  <div style={{ flexBasis: '100%' }} className="field">
                    <div className="control">
                      <input
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
              <div id="job-types">
                <div className="bdb-section-title">Your Existing Jobs</div>
              </div>
              <div className="bdb-section-body" id="existing-jobs">
                <div className="columns">
                  <div className="column">
                    {s_isLoading && <div className="bdb-spinner" />}
                    {s_isLoading && s_error && (<div>error fetching your jobs {s_error}</div>)}
                    {!s_isLoading &&
                      !(s_userJobsList.length > 0) && (
                        <div className="is-size-6 has-text-grey-light">
                           <span style={{padding:5}}>You do not have any posted jobs .</span>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div className="container">
              <div id="job-types">
                <div className="bdb-section-title">Use a Teamplate</div>
              </div>
              <div className="bdb-section-body" id="existing-jobs">
                <div className="columns">{defaultTasks}</div>
              </div>
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

class BidOrBooDefaultTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false
    };
    this.alterHoverState = val => {
      this.setState({ isHover: val });
    };
  }

  render() {
    const { title, subtitle, description, imageUrl } = this.props;

    return (
      <div
        className="column is-one-third-tablet
      is-one-quarter-desktop bdbCardComponent"
      >
        <div className="card">
          <div className="card-image">
            <figure className="image is-3by4">
              <img src={imageUrl} alt={subtitle} />
            </figure>
          </div>
          <div className="card-content">
            <h1 className="bdb-section-title">{title}</h1>
            <div className="content">
              <div className="descriptoin-section">{description}</div>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <a className="button is-primary" disabled>
                  {/* <i className="far fa-edit" style={{ fontSize: 12 }} /> */}
                  <span style={{ marginLeft: 4 }}>
                    <i className="fa fa-plus fa-w-14" /> Request Now
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
