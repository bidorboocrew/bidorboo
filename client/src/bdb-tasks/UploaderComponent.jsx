import React, { createRef } from 'react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import ReactDOM from 'react-dom';
// https://github.com/blueimp/JavaScript-Load-Image#api
import loadImage from 'blueimp-load-image';

const MAX_FILE_SIZE_IN_MB = 1000000 * 10; //10MB

export default class UploaderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { thumb: null, showCropper: false };
    this.dropzoneRef = React.createRef();
  }

  componentDidMount() {
    if (!this.props.thumb) {
      this.dropzoneRef &&
        this.dropzoneRef.current &&
        this.dropzoneRef.current.open &&
        this.dropzoneRef.current.open();
    }
  }
  componentWillUnmount() {
    const { acceptedFile, croppedFile } = this.state;
    // clean up memory
    if (acceptedFile) {
      window.URL.revokeObjectURL(acceptedFile.preview);
    }
    if (croppedFile) {
      window.URL.revokeObjectURL(croppedFile);
    }
  }

  onDrophandler = (files) => {
    if (!files || !(files.length > 0)) {
      return;
    }

    loadImage(
      files[0],
      (loadedImg) => {
        // let elem = document.querySelector('.form-group.has-text-centered');
        // elem.appendChild(loadedImg);

        const ctx = loadedImg.getContext('2d');

        const imgAsDataUrl = ctx.canvas.toDataURL(loadedImg);
        this.setState(() => ({ thumb: imgAsDataUrl, showCropper: true }));
      },
      {
        orientation: true,
        contain: true,
        maxWidth: 300,
        maxHeight: 250,
        minWidth: 100,
        minHeight: 50,
        canvas: true,
      },
    );
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
      console.error('error parsing img ' + e);
    }
  };

  saveCrop = (e) => {
    e.preventDefault();
    const imgAsDataUrl = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.setState(() => ({ thumb: imgAsDataUrl }));
  };

  clearImage = () => {
    this.setState({ showCropper: false, thumb: null, showThumbNail: false });
  };

  done = () => {
    const { onDoneCropping } = this.props;
    const { thumb } = this.state;
    const blob = this.dataURItoBlob(thumb);
    onDoneCropping && onDoneCropping(thumb, blob);
  };

  render() {
    const { closeDialog } = this.props;
    const { thumb, showCropper } = this.state;

    return ReactDOM.createPortal(
      <div className="modal is-active">
        <div onClick={closeDialog} className="modal-background" />
        <div className="modal-card">
          <header className="modal-card-head">
            <div className="modal-card-title">Upload a Picture</div>
            <button onClick={closeDialog} className="delete" aria-label="close" />
          </header>
          <section className="modal-card-body">
            {!showCropper && (
              <Dropzone
                accept={'image/*'}
                style={{}}
                ref={this.dropzoneRef}
                multiple={false}
                maxSize={MAX_FILE_SIZE_IN_MB}
                id="filesToUpload"
                name="filesToUpload"
                onDrop={this.onDrophandler}
                onDropRejected={(file, event) =>
                  alert(
                    'File not accepted, must be an image file less than 10MB ' +
                      `${event && event}` +
                      `${file && file}`,
                  )
                }
              >
                <React.Fragment>
                  <div className="section VerticalAligner bdb-img-upload-placeholder">
                    <a
                      type="submit"
                      style={{
                        pointerEvents: 'none',
                        borderRadius: '100%',
                        height: 70,
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
            )}

            {showCropper && (
              <Cropper
                ref="cropper"
                src={thumb}
                checkOrientation={true}
                guides={false}
                className="bdb-img-upload-placeholder"
                modal={true}
                background={false}
                rotatable
                autoCrop
                autoCropArea={1}
                style={{ height: '16rem', width: '100%', background: '#eeeeee' }}
              />
            )}
          </section>

          <footer className="modal-card-foot ">
            <button onClick={closeDialog} className="button">
              Cancel
            </button>

            <button disabled={!thumb} onClick={this.saveCrop} className="button is-info">
              <span className="icon">
                <i className="fas fa-crop-alt" />
              </span>
              <span>Crop</span>
            </button>
            <button disabled={!thumb} onClick={this.done} className="button is-success">
              <span>Done</span>
            </button>
          </footer>
        </div>
      </div>,
      document.querySelector('#bidorboo-root-modals'),
    );
  }
}
