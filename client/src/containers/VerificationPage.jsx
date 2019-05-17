import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import { showLoginDialog } from '../app-state/actions/uiActions';

import { Spinner } from '../components/Spinner';

class Verification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      verificationSuccess: '',
    };
  }

  verifyPhone = async () => {
    try {
      const { match } = this.props;
      const { code } = match.params;

      const verifyReq = await axios.post(ROUTES.API.USER.POST.verifyPhone, {
        data: { code },
      });

      if (verifyReq && verifyReq.data && verifyReq.data.success) {
        this.setState({ verificationSuccess: 'success', isLoading: false });
      } else {
        this.setState({ verificationSuccess: 'fail', isLoading: false });
      }
    } catch (e) {
      alert('we are unable toverify your number, please contact bidorboocrew@gmail.com');
      this.setState({ verificationSuccess: 'fail', isLoading: false });
    }
  };

  verifyEmail = async () => {
    try {
      const { match } = this.props;
      const { code } = match.params;

      const verifyReq = await axios.post(ROUTES.API.USER.POST.verifyEmail, {
        data: { code },
      });

      if (verifyReq && verifyReq.data && verifyReq.data.success) {
        this.setState({ verificationSuccess: 'success', isLoading: false });
      } else {
        this.setState({ verificationSuccess: 'fail', isLoading: false });
      }
    } catch (e) {
      alert('we are unable to verify your email, please contact bidorboocrew@gmail.com');
      this.setState({ verificationSuccess: 'fail', isLoading: false });
    }
  };

  componentDidMount() {
    const { match, showLoginDialog, isLoggedIn } = this.props;
    const { code, field } = match.params;
    if (!isLoggedIn) {
      showLoginDialog(true);
    } else {
      showLoginDialog(false);

      if (!code || !field) {
        switchRoute(`${ROUTES.CLIENT.HOME}`);
      } else {
        switch (field) {
          case 'Email':
            this.verifyEmail();
            break;
          case 'Phone':
            this.verifyPhone();
            break;
          default:
            switchRoute(`${ROUTES.CLIENT.MY_PROFILE.basicSettings}`);
            break;
        }
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // only update if user was not logged in and they are
    // or if the verificatoin is done
    return (
      this.props.isLoggedIn !== nextProps.isLoggedIn || this.state.isLoading !== nextState.isLoading
    );
  }

  render() {
    const { match, isLoggedIn } = this.props;
    const { field } = match.params;
    const { isLoading, verificationSuccess } = this.state;

    if (isLoggedIn && isLoading) {
      switch (field) {
        case 'Email':
          this.verifyEmail();
          break;
        case 'Phone':
          this.verifyPhone();
          break;
        default:
          switchRoute(`${ROUTES.CLIENT.HOME}`);
          break;
      }
    }
    return (
      <div className="container is-widescreen">
        <section>
          <Spinner isLoading={isLoading} size={'large'} />
          {verificationSuccess === 'success' && (
            <section style={{ margin: '-0.5rem' }} className="hero is-fullheight is-success">
              <div className="hero-body">
                <div className="container is-widescreen">
                  <h1 className="title">{`We Have Successfullly verified Your ${field}`}</h1>

                  <br />
                  <a
                    className="button is-dark"
                    onClick={(e) => {
                      e.preventDefault();
                      switchRoute(`${ROUTES.CLIENT.MY_PROFILE.basicSettings}`);
                    }}
                  >
                    <span className="icon">
                      <i className="far fa-user" />
                    </span>
                    <span>My Profile</span>
                  </a>
                </div>
              </div>
            </section>
          )}
          {verificationSuccess === 'fail' && (
            <section style={{ margin: '-0.5rem' }} className="hero is-fullheight is-danger">
              <div className="hero-body">
                <div className="container is-widescreen">
                  <h1 className="title">{`Failed to verify your ${field}`}</h1>
                  <p>
                    go to your profile page to request a new code or contact us at
                    bidorboocrew@gmail.com
                  </p>
                  <br />
                  <a
                    className="button is-dark"
                    onClick={(e) => {
                      e.preventDefault();
                      switchRoute(`${ROUTES.CLIENT.MY_PROFILE.basicSettings}`);
                    }}
                  >
                    <span className="icon">
                      <i className="far fa-user" />
                    </span>
                    <span>My Profile</span>
                  </a>
                </div>
              </div>
            </section>
          )}
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ userReducer, uiReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
    shouldShowLoginDialog: uiReducer.shouldShowLoginDialog,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Verification);
