import React from 'react';
import NewJobForm from './forms/NewJobForm';

export class CreateJobDetailsCard extends React.Component {
  render() {
    return (
      <div className="swing-in-top-fwd">
        <div className="card-content">
          <h1 className="bdb-section-title title">
            <span className="icon">
              <i style={{fontSize: 24}} className="fas fa-snowflake title" />
            </span>
            <span className="title">{this.props.title} Request</span>
          </h1>
          <div className="content">
            <div style={{ marginTop: 8 }}>
              <NewJobForm
                title={this.props.title}
                imageUrl={this.props.imageUrl}
                onCancel={this.props.onCancel}
                onSubmit={vals => this.props.onSubmit(vals)}
              />
              {/* <div style={{ marginTop: 8 }} >
                <figure className="image">
                  <img  src={this.props.imageUrl} alt={this.props.title} />
                </figure>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
