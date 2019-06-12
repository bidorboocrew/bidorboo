import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addJob } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';

import { TASKS_DEFINITIONS, HouseCleaningCreateJob } from '../../bdb-tasks/index';
import GenericJobForm from '../../bdb-tasks/GenericJobForm';

const creatJobsByIdMap = {
  [`bdbjob-house-cleaning`]: (props) => {
    return <HouseCleaningCreateJob {...props} />;
  },
  [`bdbjob-car-detailing`]: (props) => {
    return <GenericJobForm requestTemplateId={'bdbjob-car-detailing'} {...props} />;
  },
};

class CreateAJobPage extends React.Component {
  constructor(props) {
    super(props);
    let templateJobId = null;
    if (props.match && props.match.params && props.match.params.templateId) {
      templateJobId = props.match.params.templateId;
    }

    this.state = {
      chosenTemplate: templateJobId,
    };
  }

  render() {
    const { chosenTemplate } = this.state;

    return (
      <div className="container is-widescreen">
        <div className="columns is-centered">
          <div className="column">
            {/* create job based on ID */}
            {creatJobsByIdMap[`${chosenTemplate}`] &&
              creatJobsByIdMap[`${chosenTemplate}`](this.props)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer }) => {
  return {
    currentUserDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addJob: bindActionCreators(addJob, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateAJobPage);
