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
      debugger;
      if (verifyReq && verifyReq.data && verifyReq.data.success) {
        this.setState({ verificationSuccess: 'success', isLoading: false });
      } else {
        this.setState({ verificationSuccess: 'fail', isLoading: false });
      }
    } catch (e) {
      alert('we are unable to send the verification text, please contact bidorboocrew@gmail.com');
      this.setState({ verificationSuccess: 'fail', isLoading: false });
    }
  };

  verifyEmail = async () => {
    try {
      const { match } = this.props;
      const { code } = match.params;
      debugger;

      const verifyReq = await axios.post(ROUTES.API.USER.POST.verifyEmail, {
        data: { code },
      });

      if (verifyReq && verifyReq.data && verifyReq.data.success) {
        this.setState({ verificationSuccess: 'success', isLoading: false });
      } else {
        this.setState({ verificationSuccess: 'fail', isLoading: false });
      }
    } catch (e) {
      alert('we are unable to verify you, please contact bidorboocrew@gmail.com');
      this.setState({ verificationSuccess: 'fail', isLoading: false });
    }
  };

  componentDidMount() {
    const { match, a_showLoginDialog, isLoggedIn } = this.props;
    const { code, field } = match.params;
    debugger;
    if (!isLoggedIn) {
      a_showLoginDialog(true);
    } else {
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
            switchRoute(`${ROUTES.CLIENT.HOME}`);

            break;
        }
      }
    }
  }
  render() {
    const { match, isLoggedIn } = this.props;
    const { code, field } = match.params;
    const { isLoading, verificationSuccess } = this.state;

    if (!code || !field || !isLoggedIn) {
      return null;
    }

    debugger;
    return (
      <div id="bdb-home-content" className="bdbPage">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div>
              <h1 style={{ color: 'white' }} className="title">
                {`${field} Verification`}
              </h1>
            </div>
          </div>
        </section>

        <section className="section">
          <div>{isLoading && <Spinner isLoading={isLoading} size={'large'} />}</div>
          {verificationSuccess === 'success' && (
            <section class="hero is-success">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">{`SUCCESSFULLY verified your ${field}`}</h1>
                  <h2 class="subtitle">
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        switchRoute(`${ROUTES.CLIENT.HOME}`);
                      }}
                    >
                      go to home page
                    </a>
                  </h2>
                </div>
              </div>
            </section>
          )}
          {verificationSuccess === 'fail' && (
            <section class="hero is-danger">
              <div class="hero-body">
                <div class="container">
                  <h1 class="title">>{`Failed to verify your ${field}`}</h1>
                  <h2 class="subtitle">
                    login and go to myprofile to request a new code or contact us at
                    bidorboocrew@gmail.com
                  </h2>
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
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Verification);
