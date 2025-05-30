// xxx said review this or use a pre existing toast class
// there is some unnecessary complexity in using the state that I dont have time to review

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactTimeout from 'react-timeout';

const toastDisplayDuration = 3000;
const errorToastDisplayDuration = 10000;

class Toast extends React.Component {
  static propTypes = {
    toastDetails: PropTypes.shape({
      type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
      msg: PropTypes.string,
      toastId: PropTypes.string,
    }),
  };
  static defaultProps = {
    type: 'error',
  };

  constructor(props) {
    super(props);
    this.state = { shouldRemoveOldToast: false };
  }

  userCloseToast = () => {
    this.props.clearTimeout();
    this.setState({ shouldRemoveOldToast: true });
  };
  autoCloseToast = () => {
    this.props.clearTimeout();
    this.setState({ shouldRemoveOldToast: true });
  };

  componentWillUnmount() {
    this.props.clearTimeout();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const closeExistingToast = nextState.shouldRemoveOldToast === true;
    if (closeExistingToast) {
      //we must render with the new info
      return true;
    }
    //only render when new toasts have diff IDs to remove duplicate
    const { toastDetails: currentToastDetails } = this.props;
    const { toastId: currentToastId } = currentToastDetails;
    const { toastDetails: newToastDetails } = nextProps;
    const { toastId: newToastId } = newToastDetails;

    const weDoHaveAToast = currentToastDetails !== newToastDetails;
    const newToastHaveDifferntId = currentToastId !== newToastId;

    return weDoHaveAToast && newToastHaveDifferntId;
  }
  render() {
    const { toastDetails } = this.props;
    const { type, msg } = toastDetails;
    const { shouldRemoveOldToast } = this.state;

    const displayToast = !!(type && type.length > 0 && msg && msg.length > 0);

    const toastTheme = classNames(
      'notification',
      { 'slide-out-bottom': shouldRemoveOldToast },
      { 'slide-in-bottom': !shouldRemoveOldToast },
      { 'is-success': type === 'success' },
      { 'is-info': type === 'info' },
      { 'is-warning': type === 'warning' },
      { 'is-danger': type === 'error' },
    );
    //force it to go off in 3 secs unelss if you are a error toast . we leave you forever
    if (displayToast && !shouldRemoveOldToast) {
      this.props.setTimeout(
        () => {
          this.autoCloseToast();
        },
        type !== 'error' ? toastDisplayDuration : errorToastDisplayDuration,
      );
    }
    if (shouldRemoveOldToast) {
      this.props.setTimeout(() => {
        this.setState({ shouldRemoveOldToast: false });
      });
    }
    return (
      displayToast && (
        <div
          style={{
            zIndex: 9999999,
            position: 'fixed',
            bottom: -24,
            right: 0,
            width: '100%',
            borderRadius: 0,
            maxHeight: '50%',
          }}
          className={toastTheme}
        >
          <button
            onClick={() => {
              this.userCloseToast();
            }}
            className="delete"
          />

          {msg && typeof msg === 'string' ? msg : JSON.stringify(msg)}
          {displayToast && type === 'error' && (
            <>
              {/* <button
                style={{ margin: 6 }}
                className="button is-small is-dark"
                onClick={() => window.location.reload()}
              >
                <span className="icon">
                  <i className="fas fa-redo" />
                </span>
                <span>Reload</span>
              </button> */}
              <button
                style={{ marginLeft: 6 }}
                className="button is-info is-small"
                onClick={() => {
                  if (window.fcWidget && !window.fcWidget.isOpen()) {
                    document.querySelector('#bob-ChatSupport') &&
                      document.querySelector('#bob-ChatSupport').click();
                    // window.fcWidget.open();
                  }
                }}
              >
                <span className="icon">
                  <i className="far fa-comment-dots" />
                </span>
                <span>Chat with Support</span>
              </button>
            </>
          )}
          {/* {displayToast && type === 'error' && (
            <button
              style={{ margin: 6 }}
              className="button is-small"
              onClick={() => this.userCloseToast()}
            >
              <span className="icon">
                <i className="far fa-times-circle" />
              </span>
              <span>Close</span>
            </button>
          )} */}
        </div>
      )
    );
  }
}

export default ReactTimeout(Toast);
