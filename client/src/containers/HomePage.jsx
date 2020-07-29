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
import YoutubeCover from '../assets/images/YoutubeCover.png';

export default class HomePage extends React.Component {
  componentDidMount() {
    window.document.querySelector('body').setAttribute('style', 'background: white');
  }
  componentWillUnmount() {
    window.document.querySelector('body').setAttribute('style', 'background: #eee');
  }

  render() {
    return (
      <>
        <section
          style={{ position: 'absolute', top: -80000, overflow: 'hidden', height: 0, width: 0 }}
        >
          <h1>BidOrBoo - Chores Made Easy</h1>
          <h2>
            BidOrBoo is a services platform where you can get rid of your daily chores like house
            cleaning deep cleaning, airbnb cleaning, detailed home cleaning, condo or appartment
            cleaning, car detailing car, shining, car cleaning, pet sitting, dog sitting, cat
            sitting, house sitting, home sitting, dog walking, pet walking, moving heavy items,
            lifting and moving furniture, moving boxes moving, by requesting the help of housemaids,
            handyman, in your area. Alternatively you can sign up as a Tasker to earn money
            completing simple chores in your area.
          </h2>
          <h3>Need help with chores, this is how it works</h3>
          <div>
            let us help
            <p>
              Browse one of our services like house cleaning deep cleaning, airbnb cleaning,
              detailed home cleaning, condo or appartment cleaning, car detailing car, shining, car
              cleaning, pet sitting, dog sitting, cat sitting, house sitting, home sitting, dog
              walking, pet walking, moving heavy items, lifting and moving furniture, moving boxes
              moving, by requesting the help of housemaids, handyman, in your area.
            </p>
            <p>Tell us what you need done, specify the time and location</p>
            <p>Pick a Tasker and your chore will get done</p>
          </div>
          <h3>Earn money by becoming a Tasker, this is how it works</h3>
          <div>
            Explore tasks and chores in your area
            <p>
              Browse for our services like house cleaning deep cleaning, airbnb cleaning, detailed
              home cleaning, condo or appartment cleaning, car detailing car, shining, car cleaning,
              pet sitting, dog sitting, cat sitting, house sitting, home sitting, dog walking, pet
              walking, moving heavy items, lifting and moving furniture, moving boxes moving, by
              requesting the help of housemaids, handyman, in your area.
            </p>
            <p>Bid the price you want to make for doing the task</p>
            <p>Complete the chore and get paid</p>
          </div>
        </section>
        <div className="fade-in">
          <section className="hero has-text-centered is-danger is-small">
            <div style={{ backgroundImage: `url(${MainBanner})` }} className="hero-body">
              <div className="container">
                <div style={{ paddingTop: 20 }} className="container has-text-centered">
                  <img
                    style={{ width: 300 }}
                    src={BidOrBooMain}
                    alt="BidOrBoo - Chores Made Easy"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="hero is-small has-text-centered is-white">
            <div style={{ paddingTop: 0 }} className="hero-body">
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
          <section
            style={{ marginBottom: '1rem' }}
            className="hero is-small has-text-centered is-white fade-in"
          >
            <div className="hero-body">
              <div className="container has-text-centered">
                <img style={{ width: 210 }} src={HowItWorks} alt="See How BidOrBoo Works" />
              </div>
            </div>
          </section>
          <section className="hero has-text-centered is-white fade-in">
            <div style={{ position: 'relative' }}>
              <div style={{ margin: 'auto', padding: '0.5rem', maxWidth: 450 }}>
                <div className="player-wrapper">
                  <ReactPlayer
                    playIcon={
                      <section className="hero is-small has-text-centered is-white fade-in">
                        <div style={{ paddingBottom: '1rem' }} className="hero-body">
                          <div className="container has-text-centered">
                            <img
                              style={{ width: 300 }}
                              src={YoutubeCover}
                              alt="BidOrBoo YouTube Promo Video"
                            />
                          </div>
                        </div>
                      </section>
                    }
                    light
                    playing
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
          <br></br>
        </div>
      </>
    );
  }
}

const RequestAService = () => {
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
          <img src={RequesterSteps} alt="How to request a service step by step" />
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
          <img src={TaskerSteps} alt="How to become a tasker step by step" />
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
          <img src={Earn_Money} alt="Earn Money As a Tasker" />
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
