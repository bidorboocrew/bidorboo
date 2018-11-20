import React from 'react';
import autoBind from 'react-autobind';
import FileUploader from './FileUploader';
export default class UploadJobPictures extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedImages: props.collectedDetails.jobImages || [],
      showUploadModal: false,
    };
    autoBind(this, 'toggleUploadImageModal');
  }

  onImageChange = (index, file) => {
    const temp = [...this.state.uploadedImages];
    temp[index] = file || null;
    this.setState({ uploadedImages: temp });
  };

  render() {
    const { uploadedImages } = this.state;

    const previewContent = [];
    for (let i = 0; i < 6; i++) {
      const temp = (
        <div key={Math.random()} className="column is-one-third">
          {!uploadedImages[i] && <FileUploader imgIndex={i} onImageChange={this.onImageChange} />}
        </div>
      );
      previewContent.push(temp);
    }

    return (
      <React.Fragment>
        <div className="field">
          <div className="label">upload Images</div>
        </div>
        <div
          style={{ borderRadius: 4, background: 'rgba(33, 33, 33, 0.1)' }}
          className="columns is-multiline is-centered"
        >
          {previewContent}
        </div>
      </React.Fragment>
    );
  }
}
