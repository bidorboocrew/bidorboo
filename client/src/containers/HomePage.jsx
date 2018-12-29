import React from 'react';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import ProposerRoot from './proposer-flow/ProposerRootPage';

import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <section className="hero has-text-centered is-small is-dark">
          <div className="hero-body">
            <div className="container">
              
              <h2 className="is-size-6">
                Get the services you need for the price you want. Earn money doing what you love.
              </h2>
              <div className="columns is-multiline is-centered">
              <div className="column is-half">
                <BidOrBooCard
                  logoImg={requestImg}
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.PROPOSER.root);
                  }}
                  cardContent={'Request a Service'}
                />
              </div>
              <div className="column is-half">
                <BidOrBooCard
                  logoImg={bidsImg}
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.BIDDER.root);
                  }}
                  cardContent={'Provide a Service'}
                />
              </div>
            </div>
          </div>
        </section>


        
      </div>
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
