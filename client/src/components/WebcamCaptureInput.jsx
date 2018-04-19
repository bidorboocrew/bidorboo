//https://reactdatepicker.com/
import React from 'react';
import PropTypes from 'prop-types';
import Webcam from 'react-webcam';
import classNames from 'classnames';

export default class WebcamCaptureInput extends React.Component {
  // static propTypes = {
  //   onChangeEvent: PropTypes.func.isRequired,
  //   onBlurEvent: PropTypes.func.isRequired,
  //   id: PropTypes.string.isRequired,
  //   placeholder: PropTypes.string,
  // };
  static defaultProps = {
    placeholder: '',
    value: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.setRef = this.setWebcamRef.bind(this);
    this.capture = this.captureImage.bind(this);
    this.toggleDialog = this.showHideDialog.bind(this);
  }
  showHideDialog() {
    // debugger;
    this.setState({ openModal: !this.state.openModal });
  }
  setWebcamRef(webcamDomRef) {
    this.webcam = webcamDomRef;
  }
  captureImage() {
    const imageSrc = this.webcam.getScreenshot();
    console.log(imageSrc);
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
    this.props.onChangeEvent(date);
  }

  render() {
    const modalClassNames = classNames('modal', {
      'is-active': this.state.openModal
    });
    // const {
    //   // handleSelect,
    //   // onError,
    //   // onChangeEvent,
    //   // onBlurEvent,
    //   // id,
    //   // placeholder
    // } = this.props;
    return (
      <React.Fragment>
        <a onClick={e => this.toggleDialog()} className="button is-outline">
          <span className="icon">
            <i className="fa fa-camera fa-w-16" />
          </span>
          <span>Snap a picture</span>
        </a>
        <div className={modalClassNames}>
          <div
            onClick={e => this.toggleDialog()}
            className="modal-background"
          />
          <div style={{ overflow: 'hidden' }} className="modal-content">
            <div className="container">
              <Webcam
                audio={false}
                ref={this.setRef}
                screenshotFormat="image/jpeg"
              />
            </div>
            <div className="container has-text-centered">
              <a onClick={this.capture} className="button is-large is-primary">
                <span className="icon">
                  <i className="fa fa-camera fa-w-16" />
                </span>
              </a>
            </div>
          </div>
          <button
            onClick={e => this.toggleDialog()}
            className="modal-close is-large"
            aria-label="close"
          />
        </div>
      </React.Fragment>
    );
  }
}
