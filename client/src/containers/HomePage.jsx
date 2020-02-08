import React from 'react';
import ReactPlayer from 'react-player';
import Delay from 'react-delay';

import * as ROUTES from '../constants/frontend-route-consts';
// import RequesterRoot from './requester-flow/RequesterRootPage';
import { switchRoute } from '../utils';
import MainBanner from '../assets/images/MainBanner.png';
import Earn_Money from '../assets/images/Earn-Money.png';
import Need_Help from '../assets/images/Need-Help.png';

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
        <section className="hero has-text-centered is-danger is-small">
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
              <h2
                style={{ fontSize: 16, marginBottom: 0, paddingBottom: 0 }}
                className="has-text-white"
              >
                the place to get all your chores done,
              </h2>
              <h2 style={{ fontSize: 16 }} className="has-text-white">
                and earn money doing what you love.
              </h2>
            </div>
          </div>
        </section>

        <section className="hero is-small has-text-centered is-white">
          <div className="hero-body">
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
          </div>
        </section>
        <br></br>
        <br></br>

        <Delay wait={1500}>
          <section className="hero is-small has-text-centered is-white fade-in">
            <div style={{ paddingBottom: 0.5 }} className="hero-body">
              <div className="container">
                <h1 className="title is-marginless">How Does It Work?</h1>
              </div>
            </div>
          </section>

          <section className="hero has-text-centered is-white fade-in">
            <div style={{ position: 'relative' }}>
              <div style={{ margin: 'auto', padding: '0.5rem', maxWidth: 650 }}>
                <div className="player-wrapper">
                  <ReactPlayer
                    className="react-player fade-in"
                    url="https://youtu.be/YHh9JbJAyf0"
                    width="100%"
                    height="100%"
                    // light
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
        border: 'none',
        boxShadow: 'none',
      }}
      className="card cardWithButton"
    >
      {/* <div className="card-image">
        <figure className="image">
          <img style={{ height: 150 }} src={Need_Help} alt="Placeholder" />
        </figure>
      </div> */}
      <div className="card-image">
        <figure className="image">
          <img style={{ height: 250 }} src={Need_Help} alt="Placeholder" />
        </figure>
      </div>
      <br></br>
      <div>
        <button
          style={{ width: 210 }}
          onClick={(e) => {
            switchRoute(ROUTES.CLIENT.REQUESTER.root);
          }}
          className="button is-medium is-success centeredButtonInCard"
        >
          <span>Browse Services</span>
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
        border: 'none',
        boxShadow: 'none',
      }}
      className="card cardWithButton"
    >
      <div className="card-image">
        <figure className="image">
          <img style={{ height: 250 }} src={Earn_Money} alt="Placeholder" />
        </figure>
      </div>
      <br></br>
      <div>
        <button
          style={{ width: 210 }}
          onClick={(e) => {
            switchRoute(ROUTES.CLIENT.TASKER.root);
          }}
          className="button is-medium is-dark centeredButtonInCard"
        >
          <span>Become A Tasker</span>
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
