import React from 'react';
import { connect } from 'react-redux';
import * as ROUTES from '../constants/route-const';
import { switchRoute } from '../app-state/actions/routerActions';
import PropTypes from 'prop-types';
import autoBind from 'react-autobind';

import { bindActionCreators } from 'redux';
import { CreateJobDetailsCard } from '../components/CreateJobDetailsCard';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import { routerActions, ConnectedRouter } from 'react-router-redux';

class ProposerCreateAJob extends React.Component {
  constructor(props) {
    super(props);

    const templateToStartWith = templatesRepo.filter(
      task => props.match.params.templateId === task.id
    );
    const startingWithTemplate = templateToStartWith.length > 0;
    this.state = {
      isStartingWithTemplate: startingWithTemplate,
      currentStepperIndex: startingWithTemplate ? 1 : 0,
      chosenTemplate: startingWithTemplate ? templateToStartWith[0] : null
    };
    autoBind(this, 'goBack', 'handleSubmit');
  }

  goBack(e) {
    const { a_routerActions } = this.props;
    const y = ConnectedRouter;
    e.preventDefault();
    // to go back to where you came from xxx todo https://github.com/ReactTraining/react-router/issues/5597
    // this.props.a_routerActions.goBack();

    // until then
    this.props.a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
  }
  handleSubmit(e) {
    e.preventDefault();
    // to go back to where you came from xxx todo https://github.com/ReactTraining/react-router/issues/5597
    // this.props.a_routerActions.goBack();
    // until then
    //  this.props.a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    const jobDetails = {
      title: this.state.chosenTemplate.title,
      imageUrl: this.state.chosenTemplate.imageUrl
    };

    return (
      <section className="section mainSectionContainer">
        <div className="container" id="bdb-proposer-content">
          <CreateJobDetailsCard
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
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_routerActions: bindActionCreators(routerActions, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(ProposerCreateAJob);
