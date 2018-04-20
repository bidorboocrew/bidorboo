import React from 'react';
// import GeoSearch from '../components/GeoSearch';
import GeoMap from '../components/GeoMap';
// import PlacesAutocomplete, {
//   geocodeByAddress,
//   // geocodeByPlaceId,
//   getLatLng
// } from 'react-places-autocomplete';

class BidderContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '', renderMap: false };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.setState({ renderMap: true });
  }

  render() {
    return (
      <div id="bdb-bidder-content">
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

export default BidderContainer;
