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

export const FileUploader = () => (
  <div className="container">
    <Formik
      initialValues={{
        files: []
      }}
      onSubmit={values => {
        debugger;
        values.files &&
        values.files.length > 0 &&
        axios.post(
          '/job/uploadImages',
          {
            data: values.files
          },
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        // alert(
        //   JSON.stringify(
        //     {
        //       files: values.files.map(file => ({
        //         formData.append(`file`)
        //       }))
        //     },
        //     null,
        //     2
        //   )
        // );
      }}
      validationSchema={yup.object().shape({
        recaptcha: yup.array()
      })}
      render={({ values, handleSubmit, setFieldValue }) => (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Multiple files</label>
            <Dropzone
              style={dropzoneStyle}
              accept="image/*"
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
            submit
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
