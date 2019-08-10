import React, { createRef } from 'react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import ReactDOM from 'react-dom';

import 'cropperjs/dist/cropper.css';
const MAX_FILE_SIZE_IN_MB = 1000000 * 3; //3MB

export default class UploaderComponent extends React.Component {
  constructor(props) {
    super(props);
    const { thumb } = props;
    this.state = { showCropper: thumb ? true : false, thumb: thumb ? thumb : null };
    this.reader = new FileReader();
    this.dropzoneRef = createRef();
  }

  componentWillUnmount() {
    const { thumb } = this.state;
    // clean up memory
    if (thumb && thumb.preview) {
      debugger;
      window.URL.revokeObjectURL(thumb.preview);
    }

    this.reader = null;
  }

  componentDidMount() {
    debugger;
    if (!this.props.thumb) {
      this.dropzoneRef &&
        this.dropzoneRef.current &&
        this.dropzoneRef.current.open &&
        this.dropzoneRef.current.open();
    }
  }
  onDrophandler = (files) => {
    // do nothing if no files
    if (!files || !(files.length > 0)) {
      return;
    }

    this.reader.onloadend = () => {
      this.setState({ thumb: this.reader.result, showCropper: true });
    };
    this.reader.readAsDataURL(files[0]);
  };

  toggleCroppingOn = () => {
    this.setState({ showCropper: true });
  };

  dataURItoBlob = (dataURI) => {
    try {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);
      // separate out the mime component
      var mimeString = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var dw = new DataView(ab);
      for (var i = 0; i < byteString.length; i++) {
        dw.setUint8(i, byteString.charCodeAt(i));
      }
      // write the ArrayBuffer to a blob, and you're done
      return new Blob([ab], { type: mimeString });
    } catch (e) {
      console.logt('error parsing file ' + e);
    }
  };

  clearImage = () => {
    this.setState({ showCropper: false, thumb: null, showThumbNail: false });
  };

  saveCrop = () => {
    try {
      const croppedImg = this.refs.cropper.getCroppedCanvas().toDataURL();
      const updatedFile = this.dataURItoBlob(croppedImg);

      this.reader.onloadend = () => {
        this.setState({ thumb: this.reader.result });
      };
      this.reader.readAsDataURL(updatedFile);
    } catch (e) {
      console.error('could not crop the image will upload the original img instead');
    }
  };
  done = () => {
    const { onDoneCropping } = this.props;
    const { thumb } = this.state;

    onDoneCropping && onDoneCropping(thumb);
  };

  render() {
    const { closeDialog } = this.props;
    const { thumb, showCropper } = this.state;

    return ReactDOM.createPortal(
      <div className="modal is-active">
        <div onClick={closeDialog} className="modal-background" />
        <div className="modal-card">
          <section style={{ minHeight: '18rem' }} className="modal-card-body">
            <Dropzone
              style={!showCropper ? {} : { height: 0 }}
              className={!showCropper ? '' : 'is-invisible'}
              ref={this.dropzoneRef}
              multiple={false}
              maxSize={MAX_FILE_SIZE_IN_MB}
              accept={'image/*'}
              id="filesToUpload"
              name="filesToUpload"
              onDrop={this.onDrophandler}
            >
              <React.Fragment>
                <div className="section VerticalAligner bdb-img-upload-placeholder">
                  <a
                    style={{
                      pointerEvents: 'none',
                      borderRadius: '100%',
                      height: 58,
                    }}
                    className="button is-success is-large"
                  >
                    <span>
                      <i className="fa fa-camera" aria-hidden="true" />
                    </span>
                  </a>
                </div>
              </React.Fragment>
            </Dropzone>

            {showCropper && (
              <Cropper
                ref="cropper"
                src={thumb}
                checkOrientation={true}
                guides={false}
                className="bdb-img-upload-placeholder"
                modal={false}
                background={false}
                rotatable
                autoCrop
                autoCropArea={1}
                // viewMode={1}
                minCanvasHeight={23}
                minCropBoxHeight={32}
              />
            )}
          </section>

          {showCropper && (
            <footer className="modal-card-foot ">
              <React.Fragment>
                <button onClick={closeDialog} className="button">
                  Cancel
                </button>
                {/* <button onClick={this.clearImage} className="button is-danger is-outlined">
                  <span className="icon">
                    <i className="far fa-trash-alt" />
                  </span>
                  <span>Clear</span>
                </button> */}
                <button onClick={this.saveCrop} className="button is-info">
                  <span className="icon">
                    <i className="fas fa-crop-alt" />
                  </span>
                  <span>Crop</span>
                </button>
                <button onClick={this.done} className="button is-success">
                  <span>Done</span>
                </button>
              </React.Fragment>
            </footer>
          )}
        </div>
      </div>,
      document.querySelector('#bidorboo-root-modals'),
    );
  }
}
// {showThumbNail && !showCropper && (
//   <ThumbsCollection
//     clickHandler={this.removeFileAndOpenFileSelector}
//     acceptedFile={thumb}
//   />
//

class Thumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { file, clickHandler } = this.props;
    const { loading } = this.state;
    if (!file) {
      return null;
    }
    if (loading) {
      return <p>loading...</p>;
    }

    return <img onClick={clickHandler} className="bdb-img-profile-pic" src={file} />;
  }
}
