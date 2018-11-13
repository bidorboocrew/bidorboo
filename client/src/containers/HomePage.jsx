import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import BidOrBooCard from '../components/BidOrBooCard';

export default class HomePage extends React.Component {
  render() {
    return (
      <div id="bdb-home-content">
        <section className="hero has-text-centered is-dark fade-in">
          <div className="hero-body">
            <div className="container">
              {/* <Rotate delay={300} top left cascade> */}
              <h1 style={{ color: 'white' }} className="title">
                BidOrBoo
              </h1>
              {/* </Rotate> */}
              <h2 style={{ color: 'white' }} className="subtitle fade-in">
                Get tasks done for the price you want. Earn money doing what you love.
              </h2>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="columns">
            <div className="column">
              <BidOrBooCard
                // backgroundImage="https://images.theconversation.com/files/191713/original/file-20171024-30561-ph2byj.jpg?ixlib=rb-1.1.0&rect=665%2C0%2C2622%2C1744&q=45&auto=format&w=1012&h=668&fit=crop"
                contentTextColor={'white'}
                onClickHandler={() => {
                  switchRoute(ROUTES.CLIENT.PROPOSER.root);
                }}
                cardContent={
                  <a
                    onClick={() => {
                      switchRoute(ROUTES.CLIENT.PROPOSER.root);
                    }}
                  >
                    <div className="title has-text-white">
                      <div
                        style={{
                          borderRadius: 0,
                          backgroundColor: '#9C89B8',
                        }}
                        className="button is-primary is-large is-fullwidth"
                      >
                        <span className="icon">
                          <i className="fa fa-plus fa-w-14" />
                        </span>
                        <span className="has-text-white">Request a Service</span>
                      </div>
                    </div>
                    <div className="subtitle has-text-white	">
                      Start with one of our templates and post your jobs. Get your chores done for a
                      price that will please you.
                    </div>
                  </a>
                }
              />
            </div>
            <div className="column">
              <BidOrBooCard
                // backgroundImage="https://martechtoday.com/wp-content/uploads/2018/04/header-bidding-auction-ss-1920-800x450.gif"
                contentTextColor={'white'}
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
                    <div className="title has-text-white">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          switchRoute(ROUTES.CLIENT.BIDDER.root);
                        }}
                        style={{
                          borderRadius: 0,
                          backgroundColor: '#F0A6CA',
                        }}
                        className="button is-primary is-large is-fullwidth"
                      >
                        <span className="icon">
                          <i className="fas fa-dollar-sign" />
                        </span>
                        <span className="has-text-white	">Offer a Service</span>
                      </div>
                    </div>
                    <div className="subtitle has-text-white">
                      Start Bidding on the jobs. Do the work you like for the price you like. Be
                      your own boss and manage your own schedule.
                    </div>
                  </a>
                }
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
}
