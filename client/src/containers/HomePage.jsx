import React from 'react';
import './styles/home.css';
import { bidorbooDefaultTasks } from '../constants/bidorbooDefaultTasks';

class HomePage extends React.Component {
  render() {
    const defaultTasks = bidorbooDefaultTasks.map(defaultTask => (
      <BidOrBooDefaultTask key={defaultTask.id} {...defaultTask} />
    ));
    return (
      <div id="bdb-home-content">
        <section className="hero">
          <div style={{ background: '#00d1b2' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                BidOrBoo
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Get tasks done for the price you want. Earn money doing what you
                love.
              </h2>
            </div>
          </div>
        </section>
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

export default HomePage;

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
                <a className="button is-primary">
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
