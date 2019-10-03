import React from 'react';
import Dropzone from 'react-dropzone';
import { withFormik } from 'formik';
import autoBind from 'react-autobind';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
const MAX_FILE_SIZE_IN_MB = 1000000 * 3; //3MB

const formikEnhancer = withFormik({
  handleSubmit: (payload, { props }) => {
    if (payload && payload.fileField) {
      props.uploadFilesAction(payload.fileField);
    }
    props.closeDialog();
  },
  displayName: 'FileUploaderForm',
});

class MyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showThumbNail: false, thumb: null, showCropper: false };
    this.dropzoneRef = React.createRef();
    autoBind(
      this,
      'onDrophandler',
      'toggleCroppingOn',
      'saveCrop',
      'dismissCrop',
      'onUpdateCropping',
      'dataURItoBlob',
    );

    this.reader = new FileReader();
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

    this.reader = null;
  }

  onDrophandler(files) {
    // do nothing if no files
    if (!files || !(files.length > 0)) {
      return;
    }

    this.reader.onloadend = () => {
      this.setState({ thumb: this.reader.result, showCropper: true });
    };
    this.reader.readAsDataURL(files[0]);

    // on drop we add to the existing files
    this.setState({ showThumbNail: true, acceptedFile: files[0] }, () => {
      this.props.setFieldValue('fileField', this.state.acceptedFile, false);
    });
  }

  removeFileAndOpenFileSelector = () => {
    // // remove image
    // this.setState({ showThumbNail: false, acceptedFile: {} }, () => {
    //   this.dropzoneRef && this.dropzoneRef.current.open && this.dropzoneRef.current.open();
    // });
  };

  toggleCroppingOn() {
    this.setState({ showCropper: true });
  }

  dataURItoBlob(dataURI) {
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
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      //Old Code
      //write the ArrayBuffer to a blob, and you're done
      //var bb = new BlobBuilder();
      //bb.append(ab);
      //return bb.getBlob(mimeString);

      //New Code
      return new Blob([ab], { type: mimeString });
    } catch (e) {
      console.error('could not crop the image will upload the original img instead blob creation');
    }
  }

  saveCrop(values) {
    try {
      const croppedImg = this.refs.cropper.getCroppedCanvas().toDataURL();
      const updatedFile = this.dataURItoBlob(croppedImg);
      this.props.setFieldValue('fileField', updatedFile, false);
      this.props.handleSubmit(values, this.props);
    } catch (e) {
      console.error('could not crop the image will upload the original img instead');
    }
  }

  dismissCrop() {
    this.setState({ showCropper: false, croppedFile: {} });
  }

  onUpdateCropping(file) {
    try {
      if (file) {
        this.setState({ croppedFile: file });
      }
    } catch (e) {
      console.error('failed to crop' + e);
    }

    // this.setState({ croppedFile: file });
  }

  render() {
    const { handleSubmit, values, closeDialog } = this.props;
    const { showThumbNail, thumb, showCropper } = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <div style={{ minHeight: 200 }} className="form-group has-text-centered">
          <input
            id="files"
            className="input is-invisible"
            type="hidden"
            value={values.files || ''}
          />
          <Dropzone
            style={!showThumbNail ? {} : { height: 0 }}
            className={!showThumbNail ? '' : 'is-invisible'}
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
                  type="submit"
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
              <div className="help">Upload A New Profile Pic</div>
            </React.Fragment>
          </Dropzone>

          {showThumbNail && !showCropper && (
            <ThumbsCollection
              clickHandler={this.removeFileAndOpenFileSelector}
              acceptedFile={thumb}
              onUpdateCropping={this.onUpdateCropping}
            />
          )}
          {showCropper && (
            <Cropper
              ref="cropper"
              src={thumb}
              // style={{ height: '18.75rem', width: '100%' }}
              checkOrientation={true}
              guides={false} // crop={this._crop}
              className="bdb-img-upload-placeholder"
              modal={true}
              background={false}
              minContainerHeight={180}
              minCanvasHeight={180}
            />
          )}
        </div>

        <footer style={{ paddingBottom: 0, background: 'white' }} className="modal-card-foot ">
          {showCropper && (
            <React.Fragment>
              <button onClick={this.dismissCrop} className="button">
                dismisss
              </button>
              <button
                onClick={(values) => {
                  this.saveCrop(values);
                }}
                type="submit"
                className="button is-success"
              >
                {`Save & Upload`}
              </button>
            </React.Fragment>
          )}
          {!showCropper && (
            <React.Fragment>
              <button onClick={closeDialog} className="button">
                Cancel
              </button>
              {showThumbNail && (
                <button onClick={this.toggleCroppingOn} className="button is-info">
                  <span className="icon">
                    <i className="fas fa-crop-alt" />
                  </span>
                  <span>Crop</span>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(values, { ...this.props });
                }}
                type="submit"
                className="button is-success"
              >
                <span className="icon">
                  <i className="fas fa-cloud-upload-alt" />
                </span>
                <span>Upload</span>
              </button>
            </React.Fragment>
          )}
        </footer>
      </form>
    );
  }
}

export default formikEnhancer(MyForm);

export const ThumbsCollection = ({ acceptedFile, clickHandler }) => {
  let AllThumbnails = acceptedFile ? (
    <Thumb clickHandler={clickHandler} file={acceptedFile} />
  ) : null;
  return AllThumbnails;
};

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
