import React from 'react';
import './styles/home.css';
import { BidOrBooDefaultTasks } from '../components/BidOrBooDefaultTasks';

class HomePage extends React.Component {
  render() {
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
        <section className="section mainSectionContainer">
          <div className="container">
            <div id="job-templates-types">
              <div className="bdb-section-title">Post a Job</div>
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">
                <BidOrBooDefaultTasks />
              </div>
            </div>
          </div>
          <div className="container">
            <div id="bid-on-job">
              <div className="bdb-section-title">Bid on a Job</div>
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">
                <BidOrBooDefaultTasks />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default HomePage;
