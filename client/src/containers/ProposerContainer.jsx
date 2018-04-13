import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { BidOrBooDefaultTasks } from '../components/BidOrBooDefaultTasks';
import { CreateJob } from '../components/CreateJob';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import { getAllJobs } from '../app-state/actions/jobActions';
import Stepper from 'react-stepper-horizontal';
import NewJobForm from '../components/forms/NewJobForm';

class ProposerContainer extends React.Component {
  constructor(props) {
    super(props);

    const templateToStartWith = templatesRepo.filter(
      task => props.match.params.templateId === task.id
    );
    const startingWithTemplate = templateToStartWith.length > 0;
    debugger;
    this.state = {
      isStartingWithTemplate: startingWithTemplate,
      currentStepperIndex: startingWithTemplate ? 1 : 0,
      chosenTemplate: startingWithTemplate ? templateToStartWith[0] : null,
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

    const filterBySearchTerm =
      this.state.searchTerm && this.state.searchTerm.length >= 0;

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

                {this.state.currentStepperIndex === 0 && (
                  <BidOrBooDefaultTasks />
                )}
                {this.state.currentStepperIndex === 1 && (
                  <NewJobForm
                  title={this.state.chosenTemplate.title}
                    imageUrl={this.state.chosenTemplate.imageUrl}
                    onCancel={this.toggleEditProfile}
                    onSubmit={vals => this.closeFormAndSubmit(vals)}
                  />
                )}

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
