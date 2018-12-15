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
import PicturesUploaderContainer from './PicturesUploaderContainer';
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
    autoBind(this, 'goBack', 'collectJobImageDetails', 'postJob');
  }

  goBack(e) {
    e.preventDefault();
    // until then
    switchRoute(ROUTES.CLIENT.PROPOSER.root);
  }

  collectJobImageDetails(index, imgFile) {
    this.collectedJobDetails.jobImages[index] = imgFile;
  }

  // final step
  postJob(values) {
    this.collectedJobDetails.initialDetails = values;
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

    const content = () => (
      <div className="card noShadow is-clipped">
        <section className="hero is-small is-dark">
          <div
            style={{
              position: 'relative',
              height: '6rem',
              backgroundImage: `url("${jobDetails.imageUrl}")`,
            }}
            className="hero-body"
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                bottom: 0,
                /* height: 24px, */
                width: ' 100%',
                background: 'rgba(54,54,54,0.7)',
                padding: '0.25rem 1.5rem',
              }}
              className="container"
            >
              <div className="title has-text-white">{jobDetails.title} Request</div>
            </div>
          </div>
        </section>

        <div className="card-content ">
          <p className="has-text-grey">{this.state.chosenTemplate.description}</p>
          <br />
          {currentStepNumber === 2 && (
            <React.Fragment>
              {/* <PicturesUploaderContainer
                collectedDetails={this.collectedJobDetails}
                onImageChange={this.collectJobImageDetails}
              /> */}
              <NewJobForm
                fromTemplateIdField={jobDetails.id}
                jobTitleField={jobDetails.title}
                suggestedDetailsText={jobDetails.suggestedDetailsText}
                onGoBack={this.goBack}
                onNext={this.postJob}
              />
            </React.Fragment>
          )}
          {currentStepNumber === 3 && <div />}
        </div>
      </div>
    );

    return (
      <React.Fragment>
        {/* <ProposerStepper currentStepNumber={currentStepNumber} /> */}
        {/* <div className="container bdbPage pageWithStepper mobile">{content()}</div> */}
        <section className="section">
          <div className="container bdbPage">{content()}</div>
        </section>
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
