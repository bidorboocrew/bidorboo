import React from 'react';
import { bidorbooDefaultTasks } from '../constants/bidorbooDefaultTasks';

class ProposerContainer extends React.Component {

  render() {
    const defaultTasks = bidorbooDefaultTasks.map(defaultTask => (
      <BidOrBooDefaultTask key={defaultTask.id} {...defaultTask} />
    ));
    return (
      <div id="bdb-proposer-content">
        <section className="section">
          <div className="container">
            <div id="job-types">
              <div className="bdb-section-title">Post a Job</div>
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">{defaultTasks}</div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default ProposerContainer;

class BidOrBooDefaultTask extends React.Component {
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
      <div className="column bdbCardComponent">
        <div className="card">
          <div className="card-image">
            <figure className="image is-3by4">
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
                  <span style={{ marginLeft: 4 }}>{`Request ${title}`} </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
