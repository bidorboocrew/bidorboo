import React from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { bindActionCreators } from 'redux';

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
    autoBind(this, 'goBack', 'handleSubmit');
  }

  goBack(e) {
    e.preventDefault();
    // until then
    switchRoute(ROUTES.CLIENT.PROPOSER.root);
  }
  handleSubmit(values) {
    this.props.a_addJob(values);
  }

  render() {
    const jobDetails = {
      title: this.state.chosenTemplate.title,
      imageUrl: this.state.chosenTemplate.imageUrl,
      id: this.state.chosenTemplate.id,
      suggestedDetailsText: this.state.chosenTemplate.suggestedDetailsText,
    };

    return (
      <section className="bdbPage slide-in-left">
        <div className="container">
            {/* <div style={{ marginTop: '1rem' }} className="container">
              <nav style={{ marginLeft: '1rem' }} className="breadcrumb" aria-label="breadcrumbs">
                <ul>
                  <li>
                    <a onClick={this.goBack}>Service Templates</a>
                  </li>
                  <li className="is-active">
                    <a aria-current="page">{jobDetails.title}</a>
                  </li>
                </ul>
              </nav>
            </div> */}
            <div className="card-content bdb-addMarginForActionSheet">
              <h1 className="title">{jobDetails.title} Request</h1>
              <NewJobForm
                fromTemplateIdField={jobDetails.id}
                jobTitleField={jobDetails.title}
                suggestedDetailsText={jobDetails.suggestedDetailsText}
                onCancel={this.goBack}
                onSubmit={(vals) => this.handleSubmit(vals)}
              />
            </div>
          </div>
      </section>
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
  mapDispatchToProps
)(CreateAJob);
