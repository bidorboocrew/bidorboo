import React from 'react';

import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

export default class HomePage extends React.Component {
  render() {
    return (
      <React.Fragment>
        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ transform: 'scaleY(1.1)' }} className="title has-text-weight-bold">
                BidOrBoo
              </h1>
              <h2 className="subtitle">
                Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy.
              </h2>
            </div>
          </div>
        </section>
        <div className="columns is-multiline is-centered">
          <div className="column is-4">
            <RequestAService
              logoImg={requestImg}
              onClickHandler={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            />
          </div>
          <div className="column is-4">
            <ProvideAService
              logoImg={bidsImg}
              onClickHandler={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            />
          </div>
        </div>
        <footer className="footer">
          <nav className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Availablility</p>
                <div>
                  <img
                    width={25}
                    height={25}
                    src="https://static.gikacoustics.com/wp-content/uploads/2017/09/Canada-flag-round.png"
                  />
                </div>
              </div>
            </div>

            <div className="level-item has-text-centered">
              <div>
                <p className="heading">Terms Of Service</p>
                <a target="_blank" rel="noopener noreferrer" href="bidorbooserviceAgreement">
                  {`BidOrBoo Terms`}
                </a>
                {` & `}
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://stripe.com/connect-account/legal"
                >
                  {` Stripe Terms`}
                </a>
              </div>
            </div>
          </nav>
        </footer>
      </React.Fragment>
    );
  }
}

const RequestAService = (props) => {
  const { onClickHandler } = props;
  return (
    <div id="bidOrBooMainPage-Request" className="card has-text-centered is-outlined">
      <div className="card-content">
        <div onClick={onClickHandler} className="buttonlike has-text-weight-semibold is-size-4">
          <i className="far fa-plus-square" />
          <div>Request Services</div>
        </div>
        <br />
        <h1 className="subtitle">How it works?</h1>
        <div>
          <ul className="steps has-content-centered">
            <li className="steps-segment is-active">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-6">Step 1</p>
                <p>Select a Template.</p>
              </div>
            </li>
            <li className="steps-segment">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-6">Step 2</p>
                <p>Wait for Bids.</p>
              </div>
            </li>
            <li className="steps-segment ">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-6">Step 3</p>
                <p>Choose a Tasker.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProvideAService = (props) => {
  const { onClickHandler } = props;
  return (
    <div id="bidOrBooMainPage-Provide" className="card has-text-centered">
      <div className="card-content">
        <div onClick={onClickHandler} className="buttonlike has-text-weight-semibold is-size-4">
          <i className="fas fa-hand-rock" />
          <div>Provide Services</div>
        </div>
        <br />
        <h1 className="subtitle">How it works?</h1>
        <div>
          <ul className="steps has-content-centered">
            <li className="steps-segment is-active">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-6">Step 1</p>
                <p>Browse Tasks.</p>
              </div>
            </li>
            <li className="steps-segment">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-6">Step 2</p>
                <p>Bid On Tasks.</p>
              </div>
            </li>
            <li className="steps-segment ">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-6">Step 3</p>
                <p>{`Win & Get Paid.`}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
