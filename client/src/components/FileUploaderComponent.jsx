import React from 'react';
import Dropzone from 'react-dropzone';
import { withFormik } from 'formik';
import autoBind from 'react-autobind';

const dropzoneStyle = {
  width: '100%',
  height: 'auto',
  minHeight: '250px',
  borderWidth: 2,
  borderColor: 'rgb(102, 102, 102)',
  borderStyle: 'dashed',
  borderRadius: 5
};
const MAX_FILE_SIZE_IN_MB = 1000000 * 5; //5MB

const formikEnhancer = withFormik({
  handleSubmit: (payload, { setSubmitting, props }) => {
    debugger;
    props.uploadFilesAction(payload.files);
    props.closeDialog();
    setSubmitting(false);
  },
  mapPropsToValues: ({ user }) => ({
    files: []
  }),
  displayName: 'FileUploaderForm'
});

class MyForm extends React.Component {
  constructor(props) {
    super(props);

    autoBind(this, 'onDrophandler');
  }

  onDrophandler(acceptedFiles) {
    debugger;
    const { setFieldValue, values } = this.props;
    // do nothing if no files
    if (acceptedFiles.length === 0) {
      console.log('if (acceptedFiles.length === 0) {');
      return;
    }
    // on drop we add to the existing files
    const newFile = values.files.concat(acceptedFiles);
    setFieldValue('files', newFile);
  }

  render() {
    const {
      values,
      touched,
      errors,
      dirty,
      handleChange,
      handleBlur,
      handleSubmit,
      handleReset,
      isSubmitting,
      setFieldValue
    } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <Dropzone
            multiple={false}
            maxSize={MAX_FILE_SIZE_IN_MB}
            style={dropzoneStyle}
            accept={[
              'image/jpg',
              'image/gif',
              'image/png',
              'image/tiff',
              'image/bmp',
              'image/jpeg'
            ]}
            id="filesToUpload"
            name="filesToUpload"
            onDrop={this.onDrophandler}
          >
            <ThumbsCollection {...this.props} />
          </Dropzone>
        </div>
        <br />
        <button type="submit" className="button is-primary">
          UPLOAD
        </button>
      </form>
    );
  }
}

export default formikEnhancer(MyForm);
const ThumbsCollection = ({ values }) => {
  let AllThumbnails =
    values.files && values.files.length > 0 ? (
      values.files.map((file, i) => {
        debugger;
        return (
          <React.Fragment>
            <Thumb key={i} file={file} />
            <br />
          </React.Fragment>
        );
      })
    ) : (
      <div style={{ textAlign: 'center', padding: 20 }}>
        Drag and drop your files here, or tap to upload a file
      </div>
    );
  return AllThumbnails;
};

class Thumb extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      thumb: undefined
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
    const { file } = this.props;
    const { loading, thumb } = this.state;
    if (!file) {
      return null;
    }
    if (loading) {
      return <p>loading...</p>;
    }
    return (
      <img
        src={thumb}
        alt={file.name}
        className="img-thumbnail mt-2"
        height={200}
        width={200}
      />
    );
  }
}

({ isDragActive, isDragReject, acceptedFiles, rejectedFiles, values }) => {
  debugger;
  if (isDragActive) {
    console.log('This file is authorized isDragActive');

    return 'This file is authorized';
  }

  if (isDragReject) {
    console.log('This file is authorized isDragReject');

    return 'This file is not authorized';
  }

  // if (values.files.length === 0) {
  //   //debugger;
  //   console.log('values.files.length === 0');

  //   return <p>Try dragging a file here!</p>;
  // }

  return values.files.map((file, i) => <Thumb key={i} file={file} />);
};
