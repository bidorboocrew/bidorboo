import React from 'react';
import { Formik } from 'formik';
import yup from 'yup';
import Dropzone from 'react-dropzone';
import axios from 'axios';

const dropzoneStyle = {
  width: '100%',
  height: 'auto',
  borderWidth: 2,
  borderColor: 'rgb(102, 102, 102)',
  borderStyle: 'dashed',
  borderRadius: 5
};
const MAX_FILE_SIZE_IN_MB = 1000000 * 5; //5MB
export const FileUploader = () => (
  <div className="container">
    <Formik
      initialValues={{
        files: [],
        filesToUpload: []
      }}
      render={({ values, handleSubmit, setFieldValue }) => (
        <form
          action="/job/uploadImages"
          encType="multipart/form-data"
          method="post"
        >
          <div className="form-group">
            <label>Multiple files</label>
            <Dropzone
              maxSize={MAX_FILE_SIZE_IN_MB}
              style={dropzoneStyle}
              accept="image/*"
              name="filesToUpload"
              onDrop={acceptedFiles => {
                // do nothing if no files
                if (acceptedFiles.length === 0) {
                  return;
                }
                // on drop we add to the existing files
                setFieldValue('files', values.files.concat(acceptedFiles));
              }}
            >
              {({
                isDragActive,
                isDragReject,
                acceptedFiles,
                rejectedFiles
              }) => {
                if (isDragActive) {
                  return 'This file is authorized';
                }

                if (isDragReject) {
                  return 'This file is not authorized';
                }

                if (values.files.length === 0) {
                  return <p>Try dragging a file here!</p>;
                }

                return values.files.map((file, i) => (
                  <Thumb key={i} file={file} />
                ));
              }}
            </Dropzone>
          </div>
          <button type="submit" className="btn btn-primary">
            UPLOAD
          </button>
        </form>
      )}
    />
  </div>
);

class Thumb extends React.Component {
  state = {
    loading: false,
    thumb: undefined
  };

  componentWillReceiveProps(nextProps) {
    if (!nextProps.file) {
      return;
    }

    this.setState({ loading: true }, () => {
      let reader = new FileReader();
      debugger;
      reader.onloadend = () => {
        this.setState({ loading: false, thumb: reader.result });
      };
      reader.readAsDataURL(nextProps.file);
    });
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
