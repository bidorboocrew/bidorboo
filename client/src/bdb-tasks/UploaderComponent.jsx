import React, { createRef } from 'react';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';
import ReactDOM from 'react-dom';

const MAX_FILE_SIZE_IN_MB = 1000000 * 10; //10MB

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
      window.URL.revokeObjectURL(thumb.preview);
    }

    this.reader = null;
  }

  componentDidMount() {
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
      alert('you can only use one img file at a time');
      return;
    }

    // https://zocada.com/compress-resize-images-javascript-browser/
    this.reader.onloadend = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const width = 600;
        const scaleFactor = width / img.width;
        const height = img.height * scaleFactor;

        let elem = document.createElement('canvas');
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, width, img.height * scaleFactor);

        const imgAsDataUrl = ctx.canvas.toDataURL(img);
        this.setState(() => ({ thumb: imgAsDataUrl, showCropper: true }));
      };
    };

    this.reader.onerror = (error) => console.log('reader1' + error);
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
    const croppedImg = this.refs.cropper.getCroppedCanvas().toDataURL();
    this.setState({ thumb: croppedImg });
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
          <section className="modal-card-body">
            <div className="columns is-vcentered">
              <div className="column">
                <Dropzone
                  onDropRejected={(e) => {
                    alert('this file is not accepted must be an img file less than 10MB');
                  }}
                  accept="image/*"
                  style={!showCropper ? {} : { height: 0 }}
                  className={!showCropper ? '' : 'is-invisible'}
                  ref={this.dropzoneRef}
                  multiple={false}
                  maxSize={MAX_FILE_SIZE_IN_MB}
                  id="filesToUpload"
                  name="filesToUpload"
                  onDropAccepted={this.onDrophandler}
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
                      <button
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
                      </button>
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
                    modal={true}
                    background={false}
                    rotatable
                    autoCrop
                    autoCropArea={1}
                    style={{ height: '16rem', width: '100%', background: '#eeeeee' }}
                  />
                )}
              </div>
            </div>
          </section>

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
              <button disabled={!thumb} onClick={this.saveCrop} className="button is-info">
                <span className="icon">
                  <i className="fas fa-crop-alt" />
                </span>
                <span>Crop</span>
              </button>
              <button disabled={!thumb} onClick={this.done} className="button is-success">
                <span>Done</span>
              </button>
            </React.Fragment>
          </footer>
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
