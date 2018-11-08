// xxx said review this or use a pre existing toast class
// there is some unnecessary complexity in using the state that I dont have time to review

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autoBind from 'react-autobind';
import ReactTimeout from 'react-timeout';

const toastDisplayDuration = 3000;

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
    autoBind(this, 'userCloseToast', 'autoCloseToast');
  }

  userCloseToast() {
    this.props.clearTimeout();
    this.setState({ shouldRemoveOldToast: true });
  }
  autoCloseToast() {
    this.props.clearTimeout();
    this.setState({ shouldRemoveOldToast: true });
  }

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
      { 'is-danger': type === 'error' }
    );
    //force it to go off in 3 secs unelss if you are a error toast . we leave you forever
    if (displayToast && type !== 'error' && !shouldRemoveOldToast) {
      this.props.setTimeout(() => {
        this.autoCloseToast();
      }, toastDisplayDuration);
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
            zIndex: 99999,
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
        </div>
      )
    );
  }
}

export default ReactTimeout(Toast);
