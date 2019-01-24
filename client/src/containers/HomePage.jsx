import React from 'react';

import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

export default class HomePage extends React.Component {
  render() {
    return (
      <section className="hero has-text-centered">
        <div className="hero-body">
          <div className="container is-widescreen">
            <h1 style={{ transform: 'scaleY(1.4)' }} className="subtitle">
              <strong>
                Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy.
              </strong>
            </h1>
            <br />
            <div className="columns is-multiline is-centered">
              <div className="column is-half">
                <div>
                  <BidOrBooCard
                    logoImg={requestImg}
                    onClickHandler={() => {
                      switchRoute(ROUTES.CLIENT.PROPOSER.root);
                    }}
                    cardContent={
                      <React.Fragment>
                        <span class="icon">
                          <i class="far fa-plus-square" />
                        </span>
                        <span>Request a Service</span>
                      </React.Fragment>
                    }
                  />
                </div>
                <br />
                <br />
                <h1 className="subtitle">How it works?</h1>
                <div>
                  <ul className="steps has-content-centered">
                    <li className="steps-segment is-active">
                      <span className="steps-marker " />
                      <div className="steps-content">
                        <p className="is-size-5">Step 1</p>
                        <p>Select Task Template.</p>
                      </div>
                    </li>
                    <li className="steps-segment">
                      <span className="steps-marker" />
                      <div className="steps-content">
                        <p className="is-size-5">Step 2</p>
                        <p>Get Bids From Taskers.</p>
                      </div>
                    </li>
                    <li className="steps-segment ">
                      <span className="steps-marker" />
                      <div className="steps-content">
                        <p className="is-size-5">Step 3</p>
                        <p>Award A tasker.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="column is-half">
                <div>
                  <BidOrBooCard
                    logoImg={bidsImg}
                    onClickHandler={() => {
                      switchRoute(ROUTES.CLIENT.BIDDER.root);
                    }}
                    cardContent={
                      <React.Fragment>
                        <span class="icon">
                          <i class="fas fa-hand-rock" />
                        </span>
                        <span>Offer a Service</span>
                      </React.Fragment>
                    }
                  />
                </div>
                <br />
                <br />
                <h1 className="subtitle">How it works?</h1>
                <div>
                  <ul className="steps has-content-centered">
                    <li className="steps-segment is-active">
                      <span className="steps-marker" />
                      <div className="steps-content">
                        <p className="is-size-5">Step 1</p>
                        <p>Browse Requests.</p>
                      </div>
                    </li>
                    <li className="steps-segment">
                      <span className="steps-marker" />
                      <div className="steps-content">
                        <p className="is-size-5">Step 2</p>
                        <p>Bid On Requests.</p>
                      </div>
                    </li>
                    <li className="steps-segment ">
                      <span className="steps-marker" />
                      <div className="steps-content">
                        <p className="is-size-5">Step 3</p>
                        <p>Get Paid.</p>
                      </div>
                    </li>
                  </ul>
                </div>
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
          <a className="subtitle  is-fullwidth has-text-dark has-text-centered button is-success is-outlined">
            <strong>{cardContent}</strong>
          </a>
        </div>
      </div>
    </div>
  );
};
