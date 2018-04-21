import React from 'react';
import NewJobForm from './forms/NewJobForm';
import PropTypes from 'prop-types';

export class CreateJobDetailsCard extends React.Component {
  static propTypes = {
    jobDetails: PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };
  render() {
    const { jobDetails, onCancel, onSubmit } = this.props;
    return (
      <div className="card-content">
        <h1 className="title">
          {/* <span className="icon">
              <i style={{ fontSize: 24 }} className="fas fa-snowflake title" />
            </span> */}
          <span className="title">{jobDetails.title} Request</span>
        </h1>
        <div className="content">
          <div style={{ marginTop: 8 }}>
            <NewJobForm
              jobTitle={jobDetails.title}
              onCancel={onCancel}
              onSubmit={vals => onSubmit(vals)}
            />
            {/* <div style={{ marginTop: 8 }} >
                <figure className="image">
                  <img  src={this.props.imageUrl} alt={jobDetails.title} />
                </figure>
              </div> */}
          </div>
        </div>
      </div>
    );
  }
}
