import React from 'react';
// import GeoSearch from '../components/GeoSearch';
import GeoMap from '../components/GeoMap';
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   // geocodeByPlaceId,
//   getLatLng
// } from 'react-places-autocomplete';

class BidderRoot extends React.Component {
  constructor(props) {
    super(props);
    //render map only after we show everything
    this.state = { address: '', renderMap: false };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({ renderMap: true });
  }

  render() {
    return (
      <div className="fade-in" id="bdb-bidder-root">
        <section className="hero is-small is-dark">
          <div style={{ backgroundColor: '#c786f8' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Bid on Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Start Earning money by doing things you are good at.
              </h2>
            </div>
          </div>
        </section>
        <section className="section mainSectionContainer">
          <div className="container">
            {/* <GeoSearch
              fieldId={'addressSearch'}
              onError={(e)=> {console.log('google api error '+e)}}
              handleSelect={address => {
                geocodeByAddress(address)
                  .then(results => getLatLng(results[0]))
                  .then(latLng => console.log('Success', latLng))
                  .catch(error => console.error('Error', error));
              }}
            /> */}
            <div id="available-jobs">
              <p className="title">The Map View</p>
            </div>
            <div  id="existing-jobs">
              <div className="columns">
                <div className="column">
                  {this.state.renderMap && <GeoMap />}
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

export default BidderRoot;
