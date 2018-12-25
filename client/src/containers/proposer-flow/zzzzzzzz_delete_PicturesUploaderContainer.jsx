import React from 'react';
import autoBind from 'react-autobind';
import JobImageFileUploader from './z_delete_JobImageFileUploader';
export default class PicturesUploaderContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imagesToUpload: props.collectedDetails.jobImages || [],
      showUploadModal: false,
    };
  }



  render() {
    const {onImageChange} = this.props;
    const previewContent = [];
    for (let i = 0; i < 5; i++) {
      const temp = (
        <div key={Math.random()} className="column is-one-fifth">
          <JobImageFileUploader imgIndex={i} onImageChange={onImageChange} />
        </div>
      );
      previewContent.push(temp);
    }

    return (
      <React.Fragment>
        <div className="field">
          <div className="label has-text-weight-normal">upload Images</div>
        </div>
        <div
          style={{ borderRadius: 4, background: 'rgba(33, 33, 33, 0.1)' }}
          className="columns  is-multiline"
        >
          {previewContent}
        </div>
      </React.Fragment>
    );
  }
}
