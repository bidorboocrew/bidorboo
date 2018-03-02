import React from 'react';
import './styles/home.css';

class HomePage extends React.Component {
  render() {
    return (
      <section style={{background:'black',padding:"3.25rem 1.5rem"}} >
      <div id="bdb-home-content" >
        <div  style={{height: "80vh",backgroundImage:"url('https://pre00.deviantart.net/6749/th/pre/i/2011/314/0/2/site_under_contruction_by_gudkiller01-d4fp3la.jpg')"}} className="inner"></div>
      </div>
      </section>
    );
  }
}

export default HomePage;
