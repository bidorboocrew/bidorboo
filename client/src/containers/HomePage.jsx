import React from 'react';
import './styles/home.css';

class HomePage extends React.Component {
  render() {
    return (
      <section style={{background:'black',padding:"3.25rem 1.5rem"}} >
      <div id="bdb-home-content" >
        <img
              src="https://my.alliant.edu/ICS/icsfs/under_construction.jpg?target=9664e852-79ba-4537-bae4-319d2f6edce7"
              alt="BidOrBoo"
              width="400"
              height="200"
            />
      </div>
      </section>
    );
  }
}

export default HomePage;
