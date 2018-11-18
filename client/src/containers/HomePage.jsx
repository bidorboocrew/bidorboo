import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import BidOrBooCard from '../components/BidOrBooCard';
import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

export default class HomePage extends React.Component {
  render() {
    return (
      <div id="bdb-home-content" className="bdbPage">
        <section className="hero has-text-centered fade-in">
          <div style={{ color: 'rgb(85,85,85' }} className="hero-body">
            <div className="container">
              {/* <Rotate delay={300} top left cascade> */}
              <h1 className="title is-size-1">BidOrBoo</h1>
              {/* </Rotate> */}
              <h2 className="subtitle">
                Get the services you need for the price you want. Earn money doing what you love.
              </h2>
            </div>
          </div>
        </section>
        <div className="container is-fluid">
          <div className="columns  is-centered">
            <div className="column is-5">
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
                    <div className="title">
                      <div className="button is-large is-fullwidth is-outlined">
                        <span className="icon">
                          <i className="fa fa-plus fa-w-14" />
                        </span>
                        <span className="is-capitalized">Request</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 6 }} className="subtitle has-text-grey">
                      Need help ? Start by requesting a service using our platform to get your
                      chores done for the price you desire
                    </div>
                  </a>
                }
              />
            </div>
            <div className="column is-5">
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
                    <div className="title">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          switchRoute(ROUTES.CLIENT.BIDDER.root);
                        }}
                        className="button is-large is-fullwidth is-outlined"
                      >
                        <span className="icon">
                          <i className="fas fa-dollar-sign" />
                        </span>
                        <span className="is-capitalized">Bid</span>
                      </div>
                    </div>
                    <div style={{ marginTop: 6 }} className="subtitle has-text-grey">
                      Are you handy and creative ? Start Bidding and earn money doing the things you
                      like for the price you want.
                    </div>
                  </a>
                }
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
