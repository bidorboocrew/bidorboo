import React from 'react';

import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

export default class HomePage extends React.Component {
  render() {
    const { setRole } = this.props;
    return (
      <section className="hero has-text-centered">
        <div className="hero-body">
          <div className="container">
            <h1 className="subtitle">
              Get the services you need for the price you want. Earn money doing what you love.
            </h1>
            <br />
            <div className="columns is-multiline is-centered">
              <div className="column is-half">
                <BidOrBooCard
                  logoImg={requestImg}
                  onClickHandler={() => {
                    setRole('proposer');
                  }}
                  cardContent={'Request a Service'}
                />
              </div>
              <div className="column is-half">
                <BidOrBooCard
                  logoImg={bidsImg}
                  onClickHandler={() => {
                    setRole('bidder');
                  }}
                  cardContent={'Provide a Service'}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const BidOrBooCard = (props) => {
  const { cardContent, onClickHandler, logoImg } = props;
  return (
    <div onClick={onClickHandler} className="card">
      <div className="card-image is-clipped">
        <img className="bdb-homepage-img" src={`${logoImg}`} />
      </div>
      <div className="card-content">
        <div className="content">
          <p className="title  is-fullwidth has-text-dark has-text-centered">{cardContent}</p>
        </div>
      </div>
    </div>
  );
};
