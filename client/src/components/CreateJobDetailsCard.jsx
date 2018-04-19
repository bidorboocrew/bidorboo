import React from 'react';
import NewJobForm from './forms/NewJobForm';

export class CreateJobDetailsCard extends React.Component {
  render() {
    return (
      <div className="column">
        <div className="swing-in-top-fwd">
          <div className="card space">
            <div className="card-content">
              <h1 className="bdb-section-title">{this.props.title} Request</h1>
              <div className="content">
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }} className="card-image">
                    <figure className="image is-3by1">
                      <img src={this.props.imageUrl} alt={this.props.title} />
                    </figure>
                  </div>
                  <NewJobForm
                    title={this.props.title}
                    imageUrl={this.props.imageUrl}
                    onCancel={this.props.onCancel}
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
