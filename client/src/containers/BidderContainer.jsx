import React from 'react';
import GeoSearch from '../components/GeoSearch';
import GeoMap from '../components/GeoMap';

class BidderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }

  render() {
    return (
      <div id="bdb-bidder-content">
        <section className="section">
          <div className="container">
            <GeoSearch />
            <div id="available-jobs">
              <div className="bdb-section-title">The Map View</div>
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">
                <div className="column">
                  <GeoMap />
                  <div />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default BidderContainer;
