import React from 'react';
import './styles/home.css';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <section className="hero">
          <div style={{ background: '#00d1b2' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                BidOrBoo
              </h1>
                <h2 style={{ color: 'white' }} className="subtitle">
                  Get tasks done for the price you want. Earn money doing what you love.
                </h2>
            </div>
          </div>
        </section>
        {/* <section className="section">
          <div
            className="container"
            id="bdb-home-content"
          >
          </div>
        </section> */}
      </div>
    );
  }
}

export default HomePage;
