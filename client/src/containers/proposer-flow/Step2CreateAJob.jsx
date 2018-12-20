import React from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { bindActionCreators } from 'redux';
import axios from 'axios';

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

    //// This is how we make a call to notification. this is just a test. everytime you post we send a notification
    //We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      // Do we already have a push message subscription?
      serviceWorkerRegistration.pushManager
        .getSubscription()
        .then((subscription) => {
          axios
            .post('/api/pushNotification', {
              data: JSON.stringify(subscription),
              payLoad: this.collectedJobDetails,
              headers: {
                'content-type': 'application/json',
              },
            })
            .catch((err) => console.error('Push subscription error: ', err));

          if (!subscription) {
            // We aren’t subscribed to push, so set UI
            // to allow the user to enable push
            return;
          }

          // // Keep your server in sync with the latest subscriptionId
          // sendSubscriptionToServer(subscription);

          // showCurlCommand(subscription);
        })
        .catch(function(err) {
          console.log('Error during getSubscription()', err);
        });
    });

    ///
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
              <PicturesUploaderContainer
                collectedDetails={this.collectedJobDetails}
                onImageChange={this.collectJobImageDetails}
              />
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
        <ProposerStepper currentStepNumber={currentStepNumber} />

        <div className="container bdbPage pageWithStepper desktop">{content()}</div>
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
