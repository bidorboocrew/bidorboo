import React from 'react';
import GeoInput from '../components/GeoInput';
import GeoMap from '../components/GeoMap';

class BidderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false, address: '' };
    this.toggleShow = () => {
      this.setState({ show: !this.state.show });
    };
  }

  render() {
    return (
      <div id="bdb-bidder-content">
        <section className="section">
          <div className="container">
            <GeoInput />
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
