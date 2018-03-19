import React from 'react';
import { bidorbooDefaultTasks } from '../constants/bidorbooDefaultTasks';

export const BidOrBooDefaultTasks = () =>
  bidorbooDefaultTasks.map(defaultTask => (
    <BidOrBooDefaultTaskTemplate key={defaultTask.id} {...defaultTask} />
  ));

class BidOrBooDefaultTaskTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isHover: false
    };
    this.alterHoverState = val => {
      this.setState({ isHover: val });
    };
  }

  render() {
    const { title, subtitle, description, imageUrl } = this.props;

    return (
      <div
        className="column is-one-third-tablet
        is-one-quarter-desktop bdbCardComponent"
      >
        <div className="card space">
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
