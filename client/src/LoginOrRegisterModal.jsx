import React from 'react';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import * as ROUTES from './constants/frontend-route-consts';
// import LocalLoginForm from './components/forms/LocalLoginForm';
// import RegistrationForm from './components/forms/RegistrationForm';

// import { registerNewUser, bidOrBooLogin } from './app-state/actions/authActions';
import { CoolBidOrBooTitle } from './containers/commonComponents.jsx';
import { switchRoute } from './utils';
export default class LoginOrRegisterModal extends React.Component {
  render() {
    const { isActive, handleCancel } = this.props;

    const redirectedFromUrl = `${window.location.pathname || '/'}`;
    return isActive ? (
      <div className="modal is-active">
        <div onClick={handleCancel} className="modal-background" />
        <div className="modal-content has-text-centered">
          <div style={{ background: 'white', padding: '1rem' }}>
            <CoolBidOrBooTitle></CoolBidOrBooTitle>

            <p className="subtitle">Login or Register as a new user to proceed</p>
            <button
              onClick={() => {
                handleCancel();
                return switchRoute(ROUTES.CLIENT.LOGIN_OR_REGISTER, {
                  isLoggedIn: false,
                  redirectedFromUrl,
                });
              }}
              className="button is-success"
            >
              Go to Login page
            </button>
            <div className="help">You will be redirected back to this page after you login</div>
          </div>
        </div>
        <button onClick={handleCancel} className="modal-close is-large" aria-label="close" />
      </div>
    ) : null;
  }
}

// const mapStateToProps = ({ userReducer, uiReducer }) => {
//   return {
//     isLoggedIn: userReducer.isLoggedIn,
//   };
// };
// const mapDispatchToProps = (dispatch) => {
//   return {
//     bidOrBooLogin: bindActionCreators(bidOrBooLogin, dispatch),
//     registerNewUser: bindActionCreators(registerNewUser, dispatch),
//   };
// };

// export default connect(mapStateToProps, mapDispatchToProps)(LoginOrRegisterModal);
