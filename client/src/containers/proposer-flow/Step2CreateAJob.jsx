import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShowMore from 'react-show-more';

import * as ROUTES from '../../constants/frontend-route-consts';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import { addJob } from '../../app-state/actions/jobActions';
import { switchRoute } from '../../utils';
import NewJobForm from '../../components/forms/NewJobForm';

class CreateAJob extends React.Component {
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
        <section className="section">
          <div className="container">
            <div className="card noShadow">
              <section className="hero is-small is-dark">
                <div className="hero-body">
                  <div className="container">
                    <div className="title has-text-white">{jobDetails.title} Request</div>
                  </div>
                </div>
              </section>

              <div className="card-content">
                <ShowMore
                  className="has-text-grey"
                  lines={2}
                  more="Show more"
                  less="Show less"
                  anchorclassName=""
                >
                  {this.state.chosenTemplate.description}
                </ShowMore>
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
