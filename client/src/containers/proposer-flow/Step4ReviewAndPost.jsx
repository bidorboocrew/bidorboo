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

    return <div className="card">NOT IMPLEMENTED YET</div>;
  }
}
