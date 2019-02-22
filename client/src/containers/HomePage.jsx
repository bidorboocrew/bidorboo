import React from 'react';
import Tour from 'reactour';

import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

const elementInViewport = (el) => {
  if (el) {
    var top = el.offsetTop;
    var left = el.offsetLeft;
    var width = el.offsetWidth;
    var height = el.offsetHeight;

    while (el.offsetParent) {
      el = el.offsetParent;
      top += el.offsetTop;
      left += el.offsetLeft;
    }

    return (
      top < window.pageYOffset + window.innerHeight &&
      left < window.pageXOffset + window.innerWidth &&
      top + height > window.pageYOffset &&
      left + width > window.pageXOffset
    );
  } else {
    return false;
  }
};

const commonTourSteps = [
  {
    content: <h1 className="title">Welcome to BidOrBoo</h1>,
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
  {
    selector: '#BidOrBoo-logo-step',
    content: 'Click Here to go to the home page at anytime',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
  {
    selector: '#Proposer-step',
    content: 'If you have chores and want help getting them done, Click Here',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
  {
    selector: '#Bidder-step',
    content: 'Are you looking to make money doing tasks you enjoy? Click Here',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
];

const desktopTour = [
  ...commonTourSteps,
  {
    selector: '#switch-role-step',
    content: 'You can switch your view to Request or to be a Tasker at anytime',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
  {
    selector: '#myprofile-step',
    content: 'Click on your profile to edit your details at any time',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
];

const mobileTour = [
  ...commonTourSteps,
  {
    selector: '#switch-role-mobile-step',
    content: 'You can switch your view to Request or to be a Tasker at anytime',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
  {
    selector: '#mobile-nav-burger',
    content: 'To access your profile settings and more menu options click Here',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
];
export default class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTourOpen: false,
    };
  }

  toggleTour = () => {
    this.setState({ isTourOpen: !this.state.isTourOpen });
  };
  render() {
    const isDesktopView = !elementInViewport(document.querySelector('#mobile-nav-burger'));

    return (
      <React.Fragment>
        {isDesktopView && (
          <Tour
            scrollDuration={800}
            showNumber={false}
            startAt={0}
            maskSpace={0}
            accentColor={'#31c110'}
            closeWithMask
            isOpen={this.state.isTourOpen}
            onRequestClose={this.toggleTour}
            lastStepNextButton={
              <a className="button is-text" onClick={this.toggleTour}>
                Get Started
              </a>
            }
            steps={desktopTour}
          />
        )}
        {!isDesktopView && (
          <Tour
            scrollDuration={800}
            showNumber={false}
            startAt={0}
            maskSpace={0}
            accentColor={'#31c110'}
            closeWithMask
            isOpen={this.state.isTourOpen}
            onRequestClose={this.toggleTour}
            lastStepNextButton={
              <a className="button is-text" onClick={this.toggleTour}>
                Get Started
              </a>
            }
            steps={mobileTour}
          />
        )}

        <section className="hero is-white has-text-centered">
          <div className="hero-body">
            <div className="container">
              <h1 style={{ transform: 'scaleY(1.1)' }} className="title has-text-weight-bold">
                <span id="BidOrBoo-welcome-step">BidOrBoo</span>
              </h1>
              <h2 className="subtitle">
                Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy.
                <a onClick={this.toggleTour} className="help button is-text">
                  <span className="help icon">
                    <i className="fas fa-chalkboard-teacher" />
                  </span>
                  <span>View BidOrBoo Product Tour</span>
                </a>
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
      </React.Fragment>
    );
  }
}

const RequestAService = (props) => {
  const { onClickHandler } = props;
  return (
    <div id="bidOrBooMainPage-Request" className="card has-text-centered is-outlined">
      <div onClick={onClickHandler} className="card-content">
        <div id="Proposer-step" className="buttonlike has-text-weight-semibold is-size-4">
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
      <div onClick={onClickHandler} className="card-content">
        <div id="Bidder-step" className="buttonlike has-text-weight-semibold is-size-4">
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
