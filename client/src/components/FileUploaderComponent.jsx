import React from 'react';
import Dropzone from 'react-dropzone';
import { withFormik } from 'formik';
import autoBind from 'react-autobind';

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
    this.state = { showThumbNail: false, acceptedFile: {} };
    this.dropzoneRef = React.createRef();
    autoBind(this, 'onDrophandler');
  }

  onDrophandler(files) {
    // do nothing if no files
    if (!files || !(files.length > 0)) {
      return;
    }
    // on drop we add to the existing files
    this.setState({ showThumbNail: true, acceptedFile: files[0] }, () => {
      this.props.setFieldValue('fileField', this.state.acceptedFile, false);
    });
  }

  removeFileAndOpenFileSelector = () => {
    // remove image
    this.setState({ showThumbNail: false, acceptedFile: {} }, () => {
      this.dropzoneRef && this.dropzoneRef.current.open && this.dropzoneRef.current.open();
    });
  };

  componentWillUnmount() {
    const { acceptedFile } = this.state;
    // clean up memory
    acceptedFile ? window.URL.revokeObjectURL(acceptedFile.preview) : null;
  }

  render() {
    const { handleSubmit, values } = this.props;
    const { showThumbNail, acceptedFile } = this.state;

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
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
            // style={dropzoneStyle}
            accept={[
              'image/jpg',
              'image/gif',
              'image/png',
              'image/tiff',
              'image/bmp',
              'image/jpeg',
            ]}
            id="filesToUpload"
            name="filesToUpload"
            onDrop={this.onDrophandler}
          >
            <React.Fragment>
              <div
                style={{
                  cursor: 'pointer',
                  height: 300,
                  background: 'white',
                  border: '1px dashed grey',
                }}
                className="section has-text-centered"
              >
                <a
                  type="submit"
                  style={{
                    marginTop: '10%',
                    pointerEvents: 'none',
                    borderRadius: '100%',
                    height: 45,
                  }}
                  className="button is-success is-meduim  "
                >
                  <span>
                    <i className="fa fa-camera" aria-hidden="true" />
                  </span>
                </a>
              </div>
            </React.Fragment>
          </Dropzone>

          {showThumbNail && (
            <ThumbsCollection
              clickHandler={this.removeFileAndOpenFileSelector}
              acceptedFile={acceptedFile}
            />
          )}
        </div>
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(values, { ...this.props });
          }}
          type="submit"
          className="button is-primary"
        >
          UPLOAD
        </button>
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
      thumb: undefined,
    };
  }
  componentDidMount() {
    const { file } = this.props;
    if (file) {
      let reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
  render() {
    const { file, clickHandler } = this.props;
    const { loading, thumb } = this.state;
    if (!file) {
      return null;
    }
    if (loading) {
      return <p>loading...</p>;
    }
    return (
      <div
        onClick={clickHandler}
        className="bdbImageAsBackground"
        style={{
          background: `url('${thumb}')`,
        }}
      />
    );
  }
}
