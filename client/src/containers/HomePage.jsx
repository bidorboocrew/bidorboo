import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

class HomePage extends React.Component {
  render() {
    return (
      <div id="bdb-home-content" className="bdbPage">
        <section className="hero has-text-centered is-dark">
          <div className="hero-body">
            <div className="container">
              {/* <Rotate delay={300} top left cascade> */}
              <h1 className="title is-size-1">BidOrBoo</h1>
              {/* </Rotate> */}
              <h2 className="is-size-6">
                Get the services you need for the price you want. Earn money doing what you love.
              </h2>
            </div>
          </div>
        </section>

        <section className="hero">
          <div className="hero-body">
            <div className="container">
              <div className="container is-fluid">
                <div className="columns is-centered is-multiline">
                  <div className="column is-half">
                    <BidOrBooCard
                      logoImg={requestImg}
                      onClickHandler={() => {
                        switchRoute(ROUTES.CLIENT.PROPOSER.root);
                      }}
                      cardContent={
                        <a
                          onClick={() => {
                            switchRoute(ROUTES.CLIENT.PROPOSER.root);
                          }}
                        >
                          <div className="title has-text-white">Request a Service</div>
                        </a>
                      }
                    />
                  </div>
                  <div className="column is-half">
                    <BidOrBooCard
                      logoImg={bidsImg}
                      onClickHandler={() => {
                        switchRoute(ROUTES.CLIENT.BIDDER.root);
                      }}
                      cardContent={
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            switchRoute(ROUTES.CLIENT.BIDDER.root);
                          }}
                        >
                          <div className="title has-text-white">Offer a Service</div>
                        </a>
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default HomePage;

const BidOrBooCard = (props) => {
  const { cardContent, onClickHandler, logoImg } = props;
  return (
    <div
      style={{ cursor: 'pointer', height: '18rem', position: 'relative' }}
      onClick={onClickHandler}
      className="card is-clipped"
    >
      <div className="card-image">
        <img src={`${logoImg}`} className="bdb-home-page" />
        <div
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: ' 100%',
            background: 'rgba(54,54,54,0.8)',
            padding: '1.25rem',
          }}
        >
          <div className="title has-text-centered has-text-white">{cardContent}</div>
        </div>
      </div>
    </div>
  );
};
