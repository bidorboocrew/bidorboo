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
            <h1 style={{ transform: 'scaleY(1.2)' }} className="subtitle">
              <strong>
                Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy.
              </strong>
            </h1>
            <br />
            <div className="columns is-multiline is-centered">
              <div className="column">
                <RequestAService
                  logoImg={requestImg}
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.PROPOSER.root);
                  }}
                />
              </div>
              <div className="column">
                <ProvideAService
                  logoImg={bidsImg}
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.BIDDER.root);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
      </section>
    );
  }
}

const RequestAService = (props) => {
  const { onClickHandler } = props;
  return (
    <div id="bidOrBooMainPage-Request" className="card has-text-centered is-outlined">
      <div className="card-content">
        <div onClick={onClickHandler} className="buttonlike title is-size-2">
          <i className="far fa-plus-square" />
          <div>Request Services</div>
        </div>
        <br />
        <h1 className="subtitle">How it works?</h1>
        <div>
          <ul className="steps has-content-centered">
            <li className="steps-segment is-active">
              <span className="steps-marker " />
              <div className="steps-content">
                <p className="is-size-5">Step 1</p>
                <p>Select a Template.</p>
              </div>
            </li>
            <li className="steps-segment">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-5">Step 2</p>
                <p>Wait for Bids.</p>
              </div>
            </li>
            <li className="steps-segment ">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-5">Step 3</p>
                <p>Chose a Tasker.</p>
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
        <div onClick={onClickHandler} className="buttonlike title is-size-2">
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
                <p className="is-size-5">Step 1</p>
                <p>Browse Tasks.</p>
              </div>
            </li>
            <li className="steps-segment">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-5">Step 2</p>
                <p>Bid On Tasks.</p>
              </div>
            </li>
            <li className="steps-segment ">
              <span className="steps-marker" />
              <div className="steps-content">
                <p className="is-size-5">Step 3</p>
                <p>{`Win & Get Paid.`}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
