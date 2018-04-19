import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import BidOrBooGenericTasks from './BidOrBooGenericTasks';
import { getAllJobs } from '../app-state/actions/jobActions';
import Stepper from 'react-stepper-horizontal';

class ProposerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      selectedFilterTag: '',
      displayedJobs: []
    };

    this.updateSearchTerm = e => {
      e.preventDefault();
      const newSearchTerm = e.target.value ? e.target.value.trim() : '';
      this.setState({ ...this.state, searchTerm: newSearchTerm });
    };
  }

  componentDidMount() {
    //fireup job request
    // this.props.a_getAllJobs();
  }

  render() {
    const filterBySearchTerm =
      this.state.searchTerm && this.state.searchTerm.length >= 0;

    if (filterBySearchTerm) {
      //show tasks that contain any part of the search term
    }

    return (
      <section className="section mainSectionContainer">
        <div className="container" id="bdb-proposer-content">
          <div className="container">
            <div>
              <Stepper
                size={27}
                activeColor={'rgb(0, 209, 178)'}
                steps={[
                  { title: 'Pick a Template' },
                  { title: 'Fill In Details' },
                  { title: 'Post it!' }
                ]}
                activeStep={this.state.currentStepperIndex}
              />
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">
                <BidOrBooGenericTasks />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
const mapStateToProps = ({ jobsReducer, routerReducer }) => {
  return {
    s_currentRoute: routerReducer.currentRoute,
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
