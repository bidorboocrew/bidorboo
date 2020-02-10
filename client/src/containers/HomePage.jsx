import React from 'react';
import ReactPlayer from 'react-player';
import Delay from 'react-delay';

import * as ROUTES from '../constants/frontend-route-consts';
// import RequesterRoot from './requester-flow/RequesterRootPage';
import { switchRoute } from '../utils';
import MainBanner from '../assets/images/MainBanner.png';

import Need_Help from '../assets/images/Need-Help.jpg';
import RequesterSteps from '../assets/images/RequesterSteps.jpg';
import Earn_Money from '../assets/images/Earn-Money.jpg';
import TaskerSteps from '../assets/images/TaskerSteps.jpg';
import HowItWorks from '../assets/images/HowItWorks.jpg';
import BidOrBooMain from '../assets/images/BidOrBooMain.png';

export default class HomePage extends React.Component {
  componentDidMount() {
    window.document.querySelector('body').setAttribute('style', 'background: white');
  }
  componentWillUnmount() {
    window.document.querySelector('body').setAttribute('style', 'background: #eee');
  }

  render() {
    return (
      <div className="fade-in">
        <section className="hero has-text-centered is-danger is-small">
          <div style={{ backgroundImage: `url(${MainBanner})` }} className="hero-body">
            <div className="container">
              {/* <h1
                style={{
                  color: 'white',
                  marginBottom: 2,
                  transform: 'scaleY(1.1)',
                  fontWeight: 400,
                }}
                className="title is-1"
              >
                <span id="BidOrBoo-welcome-step">BidOrBoo</span>
              </h1> */}
              <div className="container has-text-centered">
                <img style={{ width: 280 }} src={BidOrBooMain} alt="Placeholder" />
              </div>
              {/* <h2
                style={{ fontSize: 16, marginBottom: 0, paddingBottom: 0 }}
                className="has-text-white"
              >
                the place to get all your chores done,
              </h2>
              <h2 style={{ fontSize: 16 }} className="has-text-white">
                and earn money doing what you love.
              </h2> */}
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
        <section className="hero is-small has-text-centered is-white fade-in">
          <div style={{ paddingBottom: 0.5 }} className="hero-body">
            <div className="container has-text-centered">
              <img style={{ width: 280 }} src={HowItWorks} alt="Placeholder" />
            </div>
          </div>
        </section>
        <section className="hero has-text-centered is-white fade-in">
          <div style={{ position: 'relative' }}>
            <div style={{ margin: 'auto', padding: '0.5rem', maxWidth: 650 }}>
              <div className="player-wrapper">
                <ReactPlayer
                  playIcon={<div style={{ display: 'none', width: 0, height: 0 }}></div>}
                  light
                  playing
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

        <br></br>
        <section className="hero is-small has-text-centered is-white">
          <div className="hero-body">
            <div className="columns is-centered is-narrow is-mobile is-multiline is-centered">
              <div style={{ minWidth: '18rem', margin: '0 2rem' }} className="column is-narrow">
                <RequestAServiceHowTo
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.TASKER.root);
                  }}
                />
              </div>

              <div style={{ minWidth: '18rem', margin: '0 2rem' }} className="column is-narrow">
                <ProvideAServiceHowTo
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.TASKER.root);
                  }}
                />
              </div>
            </div>
          </div>
        </section>
        <br></br>
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
      className="card cardWithButton fade-in"
    >
      {/* <div className="card-image">
        <figure className="image">
          <img style={{ height: 150 }} src={Need_Help} alt="Placeholder" />
        </figure>
      </div> */}
      <div className="card-image">
        <figure className="image">
          <img src={Need_Help} alt="Placeholder" />
        </figure>
      </div>
      <div>
        <Delay wait={500}>
          <button
            style={{ width: 210 }}
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.REQUESTER.root);
            }}
            className="button is-medium is-success centeredButtonInCard fade-in"
          >
            <span>Browse Services</span>
          </button>
        </Delay>
      </div>
    </div>
  );
};

const RequestAServiceHowTo = (props) => {
  return (
    <div
      style={{
        border: 'none',
        boxShadow: 'none',
        padding: '2rem',
      }}
      className="card cardWithButton fade-in"
    >
      <div className="card-image">
        <figure className="image">
          <img src={RequesterSteps} alt="Placeholder" />
        </figure>
      </div>
      <div>
        <Delay wait={500}>
          <button
            style={{ width: 210, marginTop: 0 }}
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.REQUESTER.root);
            }}
            className="button is-medium is-success centeredButtonInCard fade-in"
          >
            <span>Browse Services</span>
          </button>
        </Delay>
      </div>
    </div>
  );
};

const ProvideAServiceHowTo = (props) => {
  return (
    <div
      style={{
        border: 'none',
        boxShadow: 'none',
        padding: '2rem',
      }}
      className="card cardWithButton fade-in"
    >
      <div className="card-image">
        <figure className="image">
          <img src={TaskerSteps} alt="Placeholder" />
        </figure>
      </div>
      <div>
        <Delay wait={500}>
          <button
            style={{ width: 210, marginTop: 0 }}
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.TASKER.root);
            }}
            className="button is-medium is-dark centeredButtonInCard fade-in"
          >
            <span>Become A Tasker</span>
          </button>
        </Delay>
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
      className="card cardWithButton fade-in"
    >
      <div className="card-image">
        <figure className="image">
          <img src={Earn_Money} alt="Placeholder" />
        </figure>
      </div>
      <div>
        <Delay wait={500}>
          <button
            style={{ width: 210 }}
            onClick={(e) => {
              switchRoute(ROUTES.CLIENT.TASKER.root);
            }}
            className="button is-medium is-dark centeredButtonInCard fade-in"
          >
            <span>Become A Tasker</span>
          </button>
        </Delay>
      </div>
    </div>
  );
};
