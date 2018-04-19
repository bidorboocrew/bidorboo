import React from 'react';
import { connect } from 'react-redux';
import * as ROUTES from '../constants/route-const';
import { switchRoute } from '../app-state/actions/routerActions';



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
      chosenTemplate: startingWithTemplate ? templateToStartWith[0] : null,
    };

    this.goBack = (e) => {
      debugger;
      const {a_routerActions} = this.props;
      const y = ConnectedRouter;
      debugger;
      e.preventDefault();
      // to go back to where you came from xxx todo https://github.com/ReactTraining/react-router/issues/5597
      // this.props.a_routerActions.goBack();

      // until then
       this.props.a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
    };
  }

  render() {
    return (
      <section className="section mainSectionContainer">
        <div className="container" id="bdb-proposer-content">
          <CreateJobDetailsCard
            title={this.state.chosenTemplate.title}
            imageUrl={this.state.chosenTemplate.imageUrl}
            onCancel={this.goBack}
            onSubmit={vals => this.closeFormAndSubmit(vals)}
          />
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
    a_switchRoute: bindActionCreators(switchRoute, dispatch),
    a_routerActions: bindActionCreators(routerActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposerCreateAJob);
