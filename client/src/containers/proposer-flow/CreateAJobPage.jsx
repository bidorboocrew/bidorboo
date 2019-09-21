import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { postNewJob, uploadTaskImages } from '../../app-state/actions/jobActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { RenderBackButton } from '../commonComponents';
import GenericRequestForm from '../../bdb-tasks/GenericRequestForm';

const creatJobsByIdMap = {
  [`bdbHouseCleaning`]: (props) => {
    return <GenericRequestForm requestTemplateId={'bdbHouseCleaning'} {...props} />;
  },
  [`bdbCarDetailing`]: (props) => {
    return <GenericRequestForm requestTemplateId={'bdbCarDetailing'} {...props} />;
  },
  [`bdbPetSittingWalking`]: (props) => {
    return <GenericRequestForm requestTemplateId={'bdbPetSittingWalking'} {...props} />;
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
      <div className="columns is-centered is-mobile">
        <div className="column limitLargeMaxWidth slide-in-right">
          <RenderBackButton />
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
    postNewJob: bindActionCreators(postNewJob, dispatch),
    uploadTaskImages: bindActionCreators(uploadTaskImages, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateAJobPage);
