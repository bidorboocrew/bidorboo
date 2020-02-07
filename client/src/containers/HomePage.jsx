import React from 'react';
import ReactPlayer from 'react-player';
import Delay from 'react-delay';

import * as ROUTES from '../constants/frontend-route-consts';
// import RequesterRoot from './requester-flow/RequesterRootPage';
import { switchRoute } from '../utils';
import MainBanner from '../assets/images/MainBanner.png';
import REQUESTER_MAINPAGE from '../assets/images/REQUESTER_MAINPAGE.png';
import TASKER_MAINPAGE from '../assets/images/TASKER_MAINPAGE.png';

export default class HomePage extends React.Component {
  componentDidMount() {
    window.document.querySelector('body').setAttribute('style', 'background: white');
  }
  componentWillUnmount() {
    window.document.querySelector('body').setAttribute('style', 'background: #eee');
  }

  render() {
    return (
      <div>
        <section
          style={{
            marginBottom: '2rem',
          }}
          className="hero has-text-centered is-danger"
        >
          <div style={{ backgroundImage: `url(${MainBanner})` }} className="hero-body">
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
              <h2 style={{ fontSize: 16 }} className="has-text-white">
                Get your chores done for the right price. Earn money doing what you enjoy.
              </h2>
            </div>
          </div>
        </section>

        <section className="hero is-small has-text-centered is-white">
          <h1 style={{ margin: 0, background: 'white', padding: '2rem' }} className="title">
            What are you looking for?
          </h1>
          <div className="columns is-mobile is-multiline is-centered">
            <div
              style={{ minWidth: '18rem', maxWidth: '21rem', margin: '1rem' }}
              className="column"
            >
              <RequestAService
                onClickHandler={() => {
                  switchRoute(ROUTES.CLIENT.REQUESTER.root);
                }}
              />
            </div>

            <div
              style={{ minWidth: '18rem', maxWidth: '21rem', margin: '1rem' }}
              className="column"
            >
              <ProvideAService
                onClickHandler={() => {
                  switchRoute(ROUTES.CLIENT.TASKER.root);
                }}
              />
            </div>
          </div>
        </section>
        <br></br>
        <br></br>

        <Delay wait={2000}>
          <section className="hero has-text-centered is-white fade-in">
            <div style={{ position: 'relative' }}>
              <div style={{ margin: 'auto', maxWidth: 800, padding: '0.5rem' }}>
                <div className="player-wrapper">
                  <ReactPlayer
                    className="react-player"
                    url="https://youtu.be/YHh9JbJAyf0"
                    width="100%"
                    height="100%"
                    config={{
                      youtube: {
                        rel: 0,
                        modestbranding: 1,
                        iv_load_policy: 3,
                        origin: 'https://www.bidorboo.ca',
                        widget_referrer: 'https://www.bidorboo.ca',
                        preload: true,
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </Delay>
      </div>
    );
  }
}

const RequestAService = (props) => {
  return (
    <div
      onClick={() => {
        switchRoute(ROUTES.CLIENT.REQUESTER.root);
      }}
      style={{
        cursor: 'pointer',
      }}
      className="card cardWithButton"
    >
      <div className="card-image">
        <figure className="image">
          <img style={{ height: 150 }} src={REQUESTER_MAINPAGE} alt="Placeholder" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <HowItWorksRequestService />
        </div>
      </div>
      <div className="centeredButtonInCard">
        <button
          onClick={(e) => {
            switchRoute(ROUTES.CLIENT.REQUESTER.root);
          }}
          className="button is-medium is-success centeredButtonInCard"
        >
          <span>Request a service</span>
        </button>
      </div>
    </div>
  );
};

const ProvideAService = () => {
  return (
    <div
      onClick={(e) => {
        switchRoute(ROUTES.CLIENT.TASKER.root);
      }}
      style={{
        cursor: 'pointer',
      }}
      className="card cardWithButton"
    >
      <div className="card-image">
        <figure className="image">
          <img style={{ height: 150 }} src={TASKER_MAINPAGE} alt="Placeholder" />
        </figure>
      </div>
      <div className="card-content">
        <div className="content">
          <HowItWorksProvideService />
        </div>
      </div>
      <div className="centeredButtonInCard">
        <button
          onClick={(e) => {
            switchRoute(ROUTES.CLIENT.TASKER.root);
          }}
          className="button is-medium is-dark centeredButtonInCard"
        >
          <span>Provide a service</span>
        </button>
      </div>
    </div>
  );
};

const HowItWorksRequestService = () => {
  return (
    <div>
      <h1 className="title has-text-centered">Need help with your chores?</h1>
      <ul className="has-text-left">
        <li>
          <p className="is-size-5">Browse Our Services</p>
        </li>
        <li>
          <p className="is-size-5">Receive Bids</p>
        </li>
        <li>
          <p className="is-size-5">Choose a tasker to get it done</p>
        </li>
      </ul>
      <br></br>
    </div>
  );
};

const HowItWorksProvideService = () => {
  return (
    <div>
      <h1 className="title has-text-centered">Earn money doing what you enjoy?</h1>
      <ul className="has-text-left">
        <li>
          <p className="is-size-5">Browse for tasks</p>
        </li>
        <li>
          <p className="is-size-5">Bid on them</p>
        </li>
        <li>
          <p className="is-size-5">{`Complete it & get paid`}</p>
        </li>
      </ul>
      <br></br>
    </div>
  );
};
