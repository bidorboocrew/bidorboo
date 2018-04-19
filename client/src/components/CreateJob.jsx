import React from 'react';
import NewJobForm from './forms/NewJobForm';

export class CreateJob extends React.Component {
  render() {
    return (
      <div className="column">
        <div className="swing-in-top-fwd">
          <div className="card space">
            <div className="card-content">
              <h1 className="bdb-section-title">Request a New Job</h1>
              <div className="content">
                <div className="descriptoin-section">
                  fill in the details for your job
                </div>
                <div style={{ marginTop: 8 }}>
                  <NewJobForm
                     title={this.props.title}
                     imageUrl={this.props.imageUrl}
                     onCancel={this.onCancel}
                     onSubmit={vals => this.props.onSubmit(vals)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
