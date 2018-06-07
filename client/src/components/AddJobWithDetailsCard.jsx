import React from 'react';
import NewJobForm from './forms/NewJobForm';
import PropTypes from 'prop-types';

export class AddJobWithDetailsCard extends React.Component {
  static propTypes = {
    jobDetails: PropTypes.shape({
      title: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired
    }).isRequired,
    onCancel: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired
  };
  render() {
    const { jobDetails, onCancel, onSubmit } = this.props;
    return (
      <React.Fragment>
        <div style={{ marginTop: '1rem' }} className="container">
          <nav className="breadcrumb" aria-label="breadcrumbs">
            <ul>
              <li>
                <a onClick={onCancel}>Post Jobs</a>
              </li>
              <li className="is-active">
                <a aria-current="page">
                  {jobDetails.title}
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div style={{ marginTop: '1rem' }} className="card slide-in-left">
          <div className="card-content">
            <h1 className="title">
              {jobDetails.title} Request
            </h1>
            <div style={{ marginTop: 8 }}>
              <NewJobForm
                fromTemplateIdField={jobDetails.id}
                jobTitleField={jobDetails.title}
                onCancel={onCancel}
                onSubmit={vals => onSubmit(vals)}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
