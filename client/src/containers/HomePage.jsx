import React from 'react';
import ReactPlayer from 'react-player';

import * as ROUTES from '../constants/frontend-route-consts';
import ProposerRoot from './proposer-flow/ProposerRootPage';
import { switchRoute } from '../utils';
import HOW_IT_WORKS from '../assets/images/HOW_IT_WORKS.png';
import MainBanner from '../assets/images/MainBanner.png';
import REQUESTER_MAINPAGE from '../assets/images/REQUESTER_MAINPAGE.png';
import TASKER_MAINPAGE from '../assets/images/TASKER_MAINPAGE.png';

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
                className="button is-medium is-white"
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
                Get your chores done for the right price. Earn money doing what you enjoy.
              </h2>
            </div>
          </div>
        </section>

        <section className="hero has-text-centered ">
          <div style={{ position: 'relative' }}>
            <div style={{ margin: 'auto', maxWidth: 800, padding: '0.5rem' }}>
              <div className="player-wrapper fade-in ">
                <ReactPlayer
                  className="react-player"
                  url="https://youtu.be/YHh9JbJAyf0?mode=opaque"
                  width="100%"
                  height="100%"
                  youtubeConfig={{
                    playerVars: {
                      widget_referrer: 'https://www.bidorboo.ca',
                    },
                    preload: true,
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        <br></br> <br></br>
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
        {/* <div
          style={{
            width: '50%',
            margin: '3rem auto',
            display: 'block',
            borderBottom: '1px solid #ee2a36',
          }}
        /> */}
        {/* <div className="columns is-mobile is-multiline is-centered">
          <div style={{ maxWidth: '21rem', marginBottom: '1.5rem' }} className="column">
            <VideoExplanation />
          </div>
        </div> */}
        {/* <div
          style={{
            width: '50%',
            margin: '3rem auto',
            display: 'block',
            borderBottom: '1px solid #ee2a36',
          }}
        /> */}
        {/* <div className="container"> */}
        <ProposerRoot />
        {/* </div> */}
      </div>
    );
  }
}

const RequestAService = (props) => {
  return (
    <div
      onClick={() => {
        switchRoute(ROUTES.CLIENT.PROPOSER.root);
      }}
      style={{ cursor: 'pointer' }}
      className="card cardWithButton"
    >
      <div className="card-image">
        <figure className="image">
          <img src={REQUESTER_MAINPAGE} alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <HowItWorksRequestService />
        </div>
      </div>
      {/* <div className="centeredButtonInCard">
        <button
          onClick={() => {
            switchRoute(ROUTES.CLIENT.PROPOSER.root);
          }}
          className="button is-fullwidth is-white"
        >
          <span className="icon">
            <i className="far fa-plus-square" />
          </span>
          <span>Request</span>
        </button>
      </div> */}
    </div>
  );
};

const ProvideAService = () => {
  return (
    <div
      onClick={(e) => {
        switchRoute(ROUTES.CLIENT.BIDDER.root);
      }}
      style={{ cursor: 'pointer' }}
      className="card cardWithButton"
    >
      <div className="card-image">
        <figure className="image">
          <img src={TASKER_MAINPAGE} alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <HowItWorksProvideService />
        </div>
      </div>
      {/* <div className="centeredButtonInCard">
        <button
          onClick={(e) => {
            switchRoute(ROUTES.CLIENT.BIDDER.root);
          }}
          className="button is-fullwidth is-dark"
        >
          <span className="icon">
            <i className="fas fa-hand-rock" />
          </span>
          <span>Bid</span>
        </button>
      </div> */}
    </div>
  );
};

const HowItWorksRequestService = () => {
  return (
    <div>
      <h1 className="title">Request a service</h1>
      <ul>
        <li>
          <p className="is-size-5">Fill a request</p>
        </li>
        <li>
          <p className="is-size-5">Receive bids</p>
        </li>
        <li>
          <p className="is-size-5">Choose a tasker</p>
        </li>
      </ul>
    </div>
  );
};

const HowItWorksProvideService = () => {
  return (
    <div>
      <h1 className="title">Bid on requests</h1>
      <ul>
        <li>
          <p className="is-size-5">Browse tasks</p>
        </li>
        <li>
          <p className="is-size-5">Place your bid</p>
        </li>
        <li>
          <p className="is-size-5">{`Do it & get paid`}</p>
        </li>
      </ul>
    </div>
  );
};

const VideoExplanation = () => {
  return (
    <div style={{ height: 'unset' }} className="card">
      <div className="card-image">
        <figure className="image">
          <img src={HOW_IT_WORKS} alt="Placeholder image" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content has-text-centered">
          <div style={{ marginBottom: 0, color: '#ee2a36' }} className="title is-size-4">
            <a
              className="button is-text"
              href="https://youtu.be/YHh9JbJAyf0"
              rel="noopener noreferrer"
              target="_blank"
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
