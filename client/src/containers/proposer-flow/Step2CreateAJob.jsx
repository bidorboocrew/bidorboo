import React from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import { addJob } from '../../app-state/actions/jobActions';
import { switchRoute } from '../../utils';
import NewJobForm from '../../components/forms/NewJobForm';
import ProposerStepper from './ProposerStepper';
import UploadJobPictures from './Step3UploadJobPictures';
import ReviewAndPost from './Step4ReviewAndPost';
class CreateAJob extends React.Component {
  constructor(props) {
    super(props);

    let templateToStartWith = null;
    if (props.match && props.match.params && props.match.params.templateId) {
      templateToStartWith = templatesRepo[props.match.params.templateId];
    }

    this.state = {
      chosenTemplate: templateToStartWith,
      currentStepNumber: 2,
    };
    this.collectedJobDetails = { initialDetails: {}, jobImages: [] };
    autoBind(
      this,
      'goBack',
      'collectInitialJobDetails',
      'collectJobImageDetails',
      'goBackToCollectingInitialJobDetails',
      'goBackToCollectingImages',
      'postJob',
    );
  }

  goBack(e) {
    e.preventDefault();
    // until then
    switchRoute(ROUTES.CLIENT.PROPOSER.root);
  }
  collectInitialJobDetails(values) {
    debugger;
    this.collectedJobDetails.initialDetails = values;
    this.setState({ currentStepNumber: 3 });
  }

  collectJobImageDetails(imageArray) {
    this.collectedJobDetails.jobImages = imageArray;
  }

  // final step
  postJob() {
    debugger;
    this.props.a_addJob(this.collectedJobDetails);
  }

  render() {
    const jobDetails = {
      title: this.state.chosenTemplate.title,
      imageUrl: this.state.chosenTemplate.imageUrl,
      id: this.state.chosenTemplate.id,
      suggestedDetailsText: this.state.chosenTemplate.suggestedDetailsText,
    };
    const { currentStepNumber } = this.state;
    return (
      <React.Fragment>
        <ProposerStepper currentStepNumber={currentStepNumber} />

        <div className="container">
          <div
            style={{
              marginBottom: '1rem',
              marginTop: '1rem',
              borderBottom: '1px solid #bdbdbd',
              boxShadow: 'none',
            }}
            className="card noShadow"
          >
            <div className="card-content">
              <h1 className="title">{jobDetails.title} Request</h1>
              {currentStepNumber === 2 && (
                <React.Fragment>
                  <UploadJobPictures
                    collectedDetails={this.collectedJobDetails}
                    onUpdateImages={this.collectJobImageDetails}
                  />
                  <NewJobForm
                    fromTemplateIdField={jobDetails.id}
                    jobTitleField={jobDetails.title}
                    suggestedDetailsText={jobDetails.suggestedDetailsText}
                    onGoBack={this.goBack}
                    onNext={this.collectInitialJobDetails}
                  />
                </React.Fragment>
              )}
              {currentStepNumber === 3 && (
                <ReviewAndPost
                  jobDetails={this.collectedJobDetails}
                  onCancel={this.goBack}
                  onGoBack={this.goBackToCollectingImages}
                  onSubmit={this.postJob}
                />
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    a_addJob: bindActionCreators(addJob, dispatch),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(CreateAJob);
