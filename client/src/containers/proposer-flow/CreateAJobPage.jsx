import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShowMoreText from 'react-show-more-text';

import * as ROUTES from '../../constants/frontend-route-consts';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import { addJob } from '../../app-state/actions/jobActions';
import { switchRoute } from '../../utils';
import NewJobForm from '../../components/forms/NewJobForm';

class CreateAJobPage extends React.Component {
  constructor(props) {
    super(props);

    let templateToStartWith = null;
    if (props.match && props.match.params && props.match.params.templateId) {
      templateToStartWith = templatesRepo[props.match.params.templateId];
    }

    this.state = {
      chosenTemplate: templateToStartWith,
    };
  }

  goBack = (e) => {
    e.preventDefault();
    switchRoute(ROUTES.CLIENT.PROPOSER.root);
  };

  postJob = (values) => {
    const { a_addJob } = this.props;
    a_addJob({ initialDetails: { ...values } });
  };

  render() {
    const { chosenTemplate } = this.state;

    const jobDetails = {
      title: chosenTemplate.title,
      imageUrl: chosenTemplate.imageUrl,
      id: chosenTemplate.id,
      suggestedDetailsText: chosenTemplate.suggestedDetailsText,
    };

    return (
      <React.Fragment>
        <div className="container is-widescreen bidorbooContainerMargins">
          <div className="card">
            <section style={{ borderBottom: '1px solid #eee' }} className="hero is-small is-white">
              <div className="hero-body">
                <div className="title has-text-dark">{jobDetails.title} Request</div>
                <ShowMoreText className="has-text-grey" lines={2} more="Show more" less="Show less">
                  {this.state.chosenTemplate.description}
                </ShowMoreText>
              </div>
            </section>

            <div className="card-content">
              <br />
              <NewJobForm
                fromTemplateIdField={jobDetails.id}
                jobTitleField={jobDetails.title}
                suggestedDetailsText={jobDetails.suggestedDetailsText}
                onGoBack={this.goBack}
                onNext={this.postJob}
              />
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
)(CreateAJobPage);
