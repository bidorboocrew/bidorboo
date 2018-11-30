import React from 'react';
import windowSize from 'react-window-size';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute, BULMA_RESPONSIVE_SCREEN_SIZES } from '../utils';
import BidOrBooCard from '../components/BidOrBooCard';
import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

class HomePage extends React.Component {
  render() {
    const columnCount = BULMA_RESPONSIVE_SCREEN_SIZES.isMobile(this.props)
      ? 'column is-half'
      : 'column is-4';

    return (
      <div id="bdb-home-content" className="bdbPage">
        <section style={{ paddingBottom: '0.25rem' }} className="hero has-text-centered fade-in">
          <div style={{ paddingBottom: '0.25rem', color: 'rgb(85,85,85' }} className="hero-body">
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
        <section
          style={{ paddingTop: '0.25rem' }}
          className="hero has-text-centered fade-in section"
        >
          <div className="container is-fluid">
            <div className="columns is-centered is-multiline is-mobile">
              <div className={columnCount}>
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
                      {/* <div className="title">
                        <div className="button  is-fullwidth is-primary">
                          <span className="icon">
                            <i className="fa fa-plus fa-w-14" />
                          </span>
                          <span className="is-capitalized">Request</span>
                        </div>
                      </div> */}
                      <div style={{ color: 'rgb(85, 85, 85)' }} className="is-size-6">
                        Need help ? Start by requesting a service.
                      </div>
                    </a>
                  }
                />
              </div>
              <div className={columnCount}>
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
                      {/* <div className="title">
                        <div
                          onClick={(e) => {
                            e.preventDefault();
                            switchRoute(ROUTES.CLIENT.BIDDER.root);
                          }}
                          className="button is-fullwidth is-primary"
                        >
                          <span className="icon">
                            <i className="fas fa-dollar-sign" />
                          </span>
                          <span className="is-capitalized">Bid</span>
                        </div>
                      </div> */}
                      <div style={{ color: 'rgb(85, 85, 85)' }} className="is-size-6">
                        Are you handy? Start Bidding now.
                      </div>
                    </a>
                  }
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default windowSize(HomePage);
