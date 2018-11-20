import React from 'react';
import autoBind from 'react-autobind';

export default class UploadJobPictures extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedImages: props.collectedDetails.jobImages || [],
      showUploadModal: false,
    };
    autoBind(this, 'toggleUploadImageModal');
  }

  toggleUploadImageModal() {
    if (window.BidOrBoo && window.BidOrBoo.getProfileUploaderWidget) {
      this.setState({ showUploadModal: !this.state.showUploadModal }, () => {
        this.state.showUploadModal
          ? window.BidOrBoo.getJobImgUploaderWidget(
              (err, result) => {
                debugger;
                if (result && result.event === 'success' && result.info) {
                  // what to do
                  const imageArray = [...this.state.uploadedImages, result.info];
                  this.setState({ uploadedImages: imageArray, showUploadModal: false });
                  this.props.onUpdateImages(imageArray);
                }
                window.BidOrBoo.getJobImgUploaderWidget().close({ quiet: true });
              },
              () => {
                this.toggleUploadImageModal;
              },
              '123454',
            ).open()
          : window.BidOrBoo.getJobImgUploaderWidget().close({ quiet: true });
      });
    }
  }
  render() {
    const { uploadedImages } = this.state;

    const previewContent = [];
    for (let i = 0; i < 6; i++) {
      const temp = (
        <div key={Math.random()} className="column is-one-third">
          {!uploadedImages[i] && (
            <div
              style={{ height: '100%', background: '#EEEEEE', border: '1px dashed grey' }}
              className="section"
            >
              <div className="has-text-centered">
                <a
                  style={{ borderRadius: '100%' }}
                  onClick={this.toggleUploadImageModal}
                  className="button is-success is-meduim"
                >
                  <span>
                    <i className="fa fa-camera" aria-hidden="true" />
                  </span>
                </a>
              </div>
            </div>
          )}
          {uploadedImages[i] && (
            <div style={{ height: '100%' }} className="section">
              <figure className="image">
                <img src={`${uploadedImages[i].secure_url}`} />
              </figure>
            </div>
          )}
        </div>
      );

      previewContent.push(temp);
    }

    return (
      <React.Fragment>
        <div class="field">
          <div class="label">upload Images</div>
        </div>
        <div className="columns  is-multiline">{previewContent}</div>
      </React.Fragment>
    );
  }
}
