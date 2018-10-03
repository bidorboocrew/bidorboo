import React from 'react';
import { connect } from 'react-redux';
import autoBind from 'react-autobind';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../../constants/frontend-route-consts';

import { CreateAJobCard } from '../../components/proposer-components/CreateAJobCard';
import { templatesRepo } from '../../constants/bidOrBooTaskRepo';
import { addJob } from '../../app-state/actions/jobActions';
import { switchRoute } from '../../utils';

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

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const jobDetails = {
      title: this.state.chosenTemplate.title,
      imageUrl: this.state.chosenTemplate.imageUrl,
      id: this.state.chosenTemplate.id,
      suggestedDetailsText: this.state.chosenTemplate.suggestedDetailsText,
    };

    return (
      <section className="mainSectionContainer slide-in-left">
        <div className="container" id="bdb-proposer-content">
          <CreateAJobCard
            jobDetails={jobDetails}
            onCancel={this.goBack}
            onSubmit={this.handleSubmit}
          />
        </div>
      </section>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    a_addJob: bindActionCreators(addJob, dispatch),
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(CreateAJob);
