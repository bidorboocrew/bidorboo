import React from 'react';
import Dropzone from 'react-dropzone';
import { withFormik } from 'formik';
import Cropper from 'react-cropper';
import loadImage from 'blueimp-load-image';
import 'cropperjs/dist/cropper.css';
const MAX_FILE_SIZE_IN_MB = 1000000 * 10; //10MB

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
        maxWidth: 200,
        maxHeight: 400,
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
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      //New Code
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

  uploadImg = (values) => {
    try {
      const croppedImg = this.state.thumb;
      const updatedFile = this.dataURItoBlob(croppedImg);
      this.props.setFieldValue('fileField', updatedFile, false);
      this.props.handleSubmit(values, this.props);
    } catch (e) {
      console.error('could not crop the image will upload the original img instead');
    }
  };

  dismissCrop = (e) => {
    e.preventDefault();
    this.setState(
      () => ({ showCropper: false, croppedFile: {} }),
      () => this.props.closeDialog(),
    );
  };

  onUpdateCropping = (file) => {
    try {
      if (file) {
        this.setState({ croppedFile: file });
      }
    } catch (e) {
      console.error('failed to crop' + e);
    }
  };

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
        </div>

        <footer style={{ paddingBottom: 0, background: 'white' }} className="modal-card-foot ">
          <button onClick={this.dismissCrop} className="button">
            Cancel
          </button>
          <button onClick={this.saveCrop} className="button is-info">
            <span className="icon">
              <i className="fas fa-crop-alt" />
            </span>
            <span>Crop</span>
          </button>
          <button
            onClick={(values) => {
              this.uploadImg(values);
            }}
            type="submit"
            className="button is-success"
          >
            {`Upload`}
          </button>
        </footer>
      </form>
    );
  }
}

export default formikEnhancer(MyForm);
