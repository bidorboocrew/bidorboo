import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { postNewRequest, uploadTaskImages } from '../../app-state/actions/requestActions';
import { showLoginDialog } from '../../app-state/actions/uiActions';
import { RenderBackButton } from '../commonComponents';
import GenericRequestForm from '../../bdb-tasks/GenericRequestForm';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

const creatRequestsByIdMap = {
  ['bdbMoving']: (props) => {
    return <GenericRequestForm requestTemplateId={'bdbMoving'} {...props} />;
  },
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

class CreateARequestPage extends React.Component {
  constructor(props) {
    super(props);
    let templateRequestId = null;
    if (props.match && props.match.params && props.match.params.templateId) {
      templateRequestId = props.match.params.templateId;
    }

    this.state = {
      chosenTemplate: templateRequestId,
    };
  }

  render() {
    const { chosenTemplate } = this.state;

    if (!creatRequestsByIdMap[`${chosenTemplate}`]) {
      return switchRoute(ROUTES.CLIENT.REQUESTER.root);
    }
    return (
      <div className="columns is-centered is-mobile">
        <div className="column limitLargeMaxWidth slide-in-right">
          <RenderBackButton />
          {/* create request based on ID */}
          {creatRequestsByIdMap[`${chosenTemplate}`](this.props)}
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
    dispatch,
    postNewRequest: bindActionCreators(postNewRequest, dispatch),
    uploadTaskImages: bindActionCreators(uploadTaskImages, dispatch),
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateARequestPage);
