import React from 'react';
import Dropzone from 'react-dropzone';
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
              <div className="section VerticalAligner bdb-img-upload-placeholder">
                <a
                  type="submit"
                  style={{
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
    return <img onClick={clickHandler} src={`${thumb}`} className="bdb-cover-img" />;
  }
}
