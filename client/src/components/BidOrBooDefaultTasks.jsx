import React from 'react';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';


export const BidOrBooDefaultTasks = () =>
  templatesRepo.map(defaultTask => (
    <BidOrBooDefaultTaskTemplate key={defaultTask.id} {...defaultTask} />
  ));

class BidOrBooDefaultTaskTemplate extends React.Component {

  render() {
    const { title, subtitle, description, imageUrl } = this.props;

    return (
      <div
        className={
          'column is-one-third-tablet is-one-quarter-desktop bdbCardComponent'
        }
      >

        <div className="card space hvr-bob">
          <div className="card-image">
            <figure style={{ padding: 5 }} className="image is-3by4">
              <img src={imageUrl} alt={subtitle} />
            </figure>
          </div>
          <div className="card-content">
            <h1 className="bdb-section-title">{title}</h1>
            <div className="content">
              <div className="descriptoin-section">{description}</div>
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <a className="button is-primary" disabled>
                  {/* <i className="far fa-edit" style={{ fontSize: 12 }} /> */}
                  <span style={{ marginLeft: 4 }}>
                    <i className="fa fa-plus fa-w-14" /> Request Now
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
