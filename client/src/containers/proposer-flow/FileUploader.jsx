import React from 'react';
import Dropzone from 'react-dropzone';
import { withFormik } from 'formik';
import autoBind from 'react-autobind';

const MAX_FILE_SIZE_IN_MB = 1000000 * 3; //3MB

export default class FileUploader extends React.Component {
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
      if (this.props.onImageChange) {
        const { onImageChange, imgIndex } = this.props;
        onImageChange(imgIndex, this.state.acceptedFile);
      }
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
    const { showThumbNail, acceptedFile } = this.state;
    return (
      <React.Fragment>
        <div className="form-group">
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
                  //   onClick={() => open()}
                  style={{ marginTop: '25%', pointerEvents: 'none', borderRadius: '100%' }}
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
      </React.Fragment>
    );
  }
}

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
      <div className="has-text-centered">
        <img
          style={{ height: 300, width: '100%' }}
          onClick={clickHandler}
          src={thumb}
          alt={file.name}
          className="image"
        />
      </div>
    );
  }
}
