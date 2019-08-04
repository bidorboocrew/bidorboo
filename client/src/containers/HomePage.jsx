import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import howItWorks from '../assets/images/howItWorks.png';
import MainBanner from '../assets/images/MainBanner.png';
import RequesterImg from '../assets/images/RequesterImg.png';
import TaskerImg from '../assets/images/TaskerImg.png';

export default class HomePage extends React.Component {
  render() {
    return (
      <div>
        <section
          style={{
            background: '#ee2a36',
            marginBottom: '3.5rem',
          }}
          className="hero has-text-centered"
        >
          <div
            style={{ position: 'relative', backgroundImage: `url(${MainBanner})` }}
            className="hero-body"
          >
            <div
              style={{
                position: 'absolute',
                margin: 'auto',
                left: 0,
                bottom: '-1.5rem',
                width: '100%',
              }}
            >
              <button
                style={{
                  width: 150,
                  marginRight: 30,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                }}
                onClick={(e) => {
                  switchRoute(ROUTES.CLIENT.PROPOSER.root);
                }}
                className="button is-success is-medium"
              >
                <span className="icon">
                  <i className="far fa-plus-square" />
                </span>
                <span>Request</span>
              </button>
              <button
                style={{
                  width: 150,
                  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                }}
                onClick={(e) => {
                  switchRoute(ROUTES.CLIENT.BIDDER.root);
                }}
                className="button is-medium is-dark"
              >
                <span className="icon">
                  <i className="fas fa-hand-rock" />
                </span>
                <span>Bid</span>
              </button>
            </div>
            <div className="container">
              <h1
                style={{
                  color: 'white',
                  marginBottom: 2,
                  transform: 'scaleY(1.1)',
                  fontWeight: 400,
                }}
                className="title is-1"
              >
                <span id="BidOrBoo-welcome-step">BidOrBoo</span>
              </h1>
              <h2 style={{ fontSize: 12 }} className="has-text-white">
                Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy.
              </h2>
            </div>
          </div>
        </section>

        <div className="columns is-mobile is-multiline is-centered">
          <div style={{ maxWidth: '21rem', marginBottom: '1.5rem' }} className="column">
            <RequestAService
              onClickHandler={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            />
          </div>
          <div style={{ maxWidth: '21rem', marginBottom: '1.5rem' }} className="column">
            <ProvideAService
              onClickHandler={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            />
          </div>
        </div>

        <div
          style={{
            width: '50%',
            margin: '3rem auto',
            display: 'block',
            borderBottom: '1px solid #ee2a36',
          }}
        />
        <div className="columns is-mobile is-multiline is-centered">
          <div style={{ maxWidth: '21rem', marginBottom: '1.5rem' }} className="column">
            <VideoExplanation />
          </div>
        </div>
      </div>
    );
  }
}

const RequestAService = (props) => {
  return (
    <div style={{ height: '30rem' }} className="card cardWithButton">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={RequesterImg} alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <HowItWorksRequestService />
        </div>
      </div>

      <button
        style={{
          width: 150,
        }}
        onClick={(e) => {
          switchRoute(ROUTES.CLIENT.PROPOSER.root);
        }}
        className="button centerFirstButtonInCard is-success"
      >
        <span className="icon">
          <i className="far fa-plus-square" />
        </span>
        <span>Request</span>
      </button>
    </div>
  );
};

const ProvideAService = () => {
  return (
    <div style={{ height: '30rem' }} className="card cardWithButton">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={TaskerImg} alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <HowItWorksProvideService />
        </div>
      </div>
      <button
        style={{
          width: 150,
        }}
        onClick={(e) => {
          switchRoute(ROUTES.CLIENT.BIDDER.root);
        }}
        className="button centerFirstButtonInCard is-dark"
      >
        <span className="icon">
          <i className="fas fa-hand-rock" />
        </span>
        <span>Bid</span>
      </button>
    </div>
  );
};

const HowItWorksRequestService = () => {
  return (
    <div>
      <h1 className="title has-text-centered">How It Works?</h1>
      <ul>
        <li>
          <p className="is-size-5">Fill A Request</p>
        </li>
        <li>
          <p className="is-size-5">Taskers Will Bid</p>
        </li>
        <li>
          <p className="is-size-5">Chose a Tasker</p>
        </li>
      </ul>
    </div>
  );
};

const HowItWorksProvideService = () => {
  return (
    <div>
      <h1 className="title has-text-centered">How It Works?</h1>
      <ul>
        <li>
          <p className="is-size-5">Browse Tasks</p>
        </li>
        <li>
          <p className="is-size-5">Place Your Bids</p>
        </li>
        <li>
          <p className="is-size-5">{`Do it & Get Paid.`}</p>
        </li>
      </ul>
    </div>
  );
};

const VideoExplanation = () => {
  return (
    <div style={{ height: 'unset' }} className="card">
      <div className="card-image">
        <figure className="image is-4by3">
          <img src={howItWorks} alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content has-text-centered">
          <div style={{ marginBottom: 0, color: '#ee2a36' }} className="title is-size-4">
            See How It Works
          </div>
        </div>
      </div>
    </div>
  );
};
