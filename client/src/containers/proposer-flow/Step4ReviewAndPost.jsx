import React from 'react';

export default class ReviewAndPost extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadedImages: [],
    };
  }
  render() {
    const { jobDetails, onCancel, onGoBack, onNext } = this.props;

    return (
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">Add Images</p>
        </header>
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <button>hello</button>
            </div>
            <div className="media-content">
              <p className="title is-4">John Smith</p>
              <p className="subtitle is-6">@johnsmith</p>
            </div>
          </div>
          <div className="content">
            <div className="columns is-multiline">
              <div className="column is-one-quarter">First column</div>
              <div className="column is-one-quarter">Second column</div>
              <div className="column is-one-quarter">Third column</div>
              <div className="column is-one-quarter">Fourth column</div>
            </div>
          </div>
        </div>
        <footer className="card-footer">
          <a href="#" className="card-footer-item">
            Save
          </a>
          <a href="#" className="card-footer-item">
            Edit
          </a>
          <a href="#" className="card-footer-item">
            Delete
          </a>
        </footer>
      </div>
    );
  }
}
