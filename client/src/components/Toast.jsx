// xxx said review this or use a pre existing toast class
// there is some unnecessary complexity in using the state that I dont have time to review

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import autoBind from 'react-autobind';
import ReactTimeout from 'react-timeout';

const toastDisplayDuration = 2500;
class Toast extends React.Component {
  static propTypes = {
    toastDetails: PropTypes.shape({
      type: PropTypes.oneOf(['success', 'warning', 'error', 'info']),
      msg: PropTypes.string,
      toastId: PropTypes.string
    })
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
      'notification space',
      { 'slide-in-blurred-top-reversed': this.state.shouldRemoveOldToast },
      { 'slide-in-blurred-top': !this.state.shouldRemoveOldToast },
      { 'is-success': type === 'success' },
      { 'is-info': type === 'info' },
      { 'is-warning': type === 'warning' },
      { 'is-danger': type === 'error' }
    );
    //force it to go off in 3 secs
    if (displayToast && !this.state.shouldRemoveOldToast) {
      this.props.setTimeout(() => {
        this.autoCloseToast();
      }, toastDisplayDuration);
    }
    if (this.state.shouldRemoveOldToast) {
      this.props.setTimeout(() => {
        this.setState({ shouldRemoveOldToast: false });
      });
    }
    return (
      displayToast && (
        <div
          style={{
            position: 'absolute',
            top: '3.5rem',
            right: 0,
            zIndex: 99999
          }}
          className={toastTheme}
        >
          <button
            onClick={() => {
              this.userCloseToast();
            }}
            className="delete"
          />
          {msg}
        </div>
      )
    );
  }
}

export default ReactTimeout(Toast);
