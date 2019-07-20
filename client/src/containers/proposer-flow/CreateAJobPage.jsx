import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addJob } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import GenericRequestForm from '../../bdb-tasks/GenericRequestForm';

const creatJobsByIdMap = {
  [`bdbHouseCleaning`]: (props) => {
    return <GenericRequestForm requestTemplateId={'bdbHouseCleaning'} {...props} />;
  },
  [`bdbCarDetailing`]: (props) => {
    return <GenericRequestForm requestTemplateId={'bdbCarDetailing'} {...props} />;
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
      <div className="columns is-centered is-mobile slide-in-right">
        <div className="column limitLargeMaxWidth">
          {/* create job based on ID */}
          {creatJobsByIdMap[`${chosenTemplate}`] &&
            creatJobsByIdMap[`${chosenTemplate}`](this.props)}
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
