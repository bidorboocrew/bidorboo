import React from 'react';
import { connect } from 'react-redux';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../app-state/actions/routerActions';
import autoBind from 'react-autobind';
import { bindActionCreators } from 'redux';
import { CreateJobDetailsCard } from '../components/CreateJobDetailsCard';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import { routerActions } from 'react-router-redux';
import { addJob } from '../app-state/actions/jobActions';
class ProposerCreateAJob extends React.Component {
  constructor(props) {
    super(props);

    let templateToStartWith= null;
    if(props.match && props.match.params && props.match.params.templateId){
      templateToStartWith = templatesRepo[props.match.params.templateId];
    }

    this.state = {
      chosenTemplate: templateToStartWith
    };
    autoBind(this, 'goBack', 'handleSubmit');
  }

  goBack(e) {
    // const { a_routerActions } = this.props;
    e.preventDefault();
    // to go back to where you came from xxx todo https://github.com/ReactTraining/react-router/issues/5597
    // this.props.a_routerActions.goBack();

    // until then
    this.props.a_switchRoute(ROUTES.FRONTENDROUTES.PROPOSER.root);
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
      id: this.state.chosenTemplate.id
    };

    return (
      <section className="mainSectionContainer slide-in-left">
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
    a_routerActions: bindActionCreators(routerActions, dispatch),
    a_addJob: bindActionCreators(addJob, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(ProposerCreateAJob);
