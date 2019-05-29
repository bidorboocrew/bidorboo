import React from 'react';
import Tour from 'reactour';
import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';

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
    selector: '.ProvideAServiceForTour',
    content: 'Are you looking to make money doing tasks you enjoy? Click Here',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
  {
    selector: '.RequestAServiceForTour',
    content: 'If you have chores and want help getting them done, Click Here',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
  {
    selector: '#BidOrBoo-logo-step',
    content: 'Click Here to go to the home page at anytime',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
];

const desktopTour = [
  ...commonTourSteps,
  {
    selector: '#viewDependentNavBarItems',
    content:
      'This area will show relevant actions where you can access your Task or Requests based on your current view (Tasker or Requester).',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
  {
    selector: '#myprofile-step',
    content:
      'Through this menu you can access your My Profile, Payments, or switch between Tasker and Reuqester roles at anytime',
    style: { maxWidth: 'none', backgroundColor: '#eee', fontWeight: '600' },
  },
];

const mobileTour = [
  ...commonTourSteps,
  {
    selector: '#mobile-nav-burger',
    content:
      'Through this menu you can access your your Tasks, Requests, My Profile, Payments, or switch between Tasker and Reuqester roles at anytime',
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
      <div style={{ margin: '-0.5rem' }}>
        {isDesktopView && (
          <Tour
            scrollDuration={500}
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
            scrollDuration={500}
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

        {/* new start page */}

        <section className="hero has-text-centered is-white is-small">
          <div className="hero-body">
            <div className="container">
              <h1
                style={{ marginBottom: 2, transform: 'scaleY(1.1)' }}
                className="title is-1 has-text-weight-bold"
              >
                <span id="BidOrBoo-welcome-step">
                  <Zoom top cascade>
                    BidOrBoo
                  </Zoom>
                </span>
              </h1>
              <Fade delay={200}>
                <h2 className="is-5 has-text-grey">
                  Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy.
                </h2>
              </Fade>
            </div>
          </div>
        </section>
        <section
          style={{ paddingBottom: '0.5rem', paddingTop: 0 }}
          className="hero has-text-centered is-white is-small"
        >
          <div className="hero-body">
            <div className="container">
              <div>
                <Zoom delay={400}>
                  <div style={{ color: '#4a4a4a', fontSize: 24, fontWeight: 600 }}>
                    What Do You Want To Do
                  </div>
                </Zoom>
                <div>
                  <a
                    style={{
                      borderRadius: 0,
                      border: 'none',
                    }}
                    onClick={this.toggleTour}
                    className="button is-outlined is-dark is-small"
                  >
                    <span className="help icon">
                      <i className="fas fa-chalkboard-teacher" />
                    </span>
                    <span>View Our Product Tour</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Fade delay={100}>
          <div className="columns is-mobile is-multiline is-centered">
            <div style={{ maxWidth: '21rem' }} className="column">
              <Fade bottom delay={200}>
                <RequestAService
                  logoImg={requestImg}
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.PROPOSER.root);
                  }}
                />
              </Fade>
            </div>
            <div style={{ maxWidth: '21rem' }} className="column">
              <Fade bottom delay={200}>
                <ProvideAService
                  logoImg={bidsImg}
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.BIDDER.root);
                  }}
                />
              </Fade>
            </div>
          </div>
        </Fade>

        <Fade delay={100}>
          <section className="section hero has-text-centered is-info">
            <div className="hero-body">
              <div className="container">
                <div className="columns is-mobile is-multiline is-centered">
                  <div style={{ maxWidth: '21rem' }} className="column">
                    <Fade bottom delay={200}>
                      <RequestAService
                        logoImg={requestImg}
                        onClickHandler={() => {
                          switchRoute(ROUTES.CLIENT.PROPOSER.root);
                        }}
                      />
                    </Fade>
                  </div>
                  <div style={{ maxWidth: '21rem' }} className="column">
                    <Fade bottom delay={200}>
                      <HowItWorksRequestService />
                    </Fade>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Fade>
        <br />
        <Fade delay={100}>
          <section className="section hero has-text-centered is-dark">
            <div className="hero-body">
              <div className="container">
                <div className="columns is-mobile is-multiline is-centered">
                  <div style={{ maxWidth: '21rem' }} className="column">
                    <Fade bottom delay={200}>
                      <ProvideAService
                        logoImg={bidsImg}
                        onClickHandler={() => {
                          switchRoute(ROUTES.CLIENT.BIDDER.root);
                        }}
                      />
                    </Fade>
                  </div>
                  <div style={{ maxWidth: '21rem' }} className="column">
                    <Fade bottom delay={200}>
                      <HowItWorksProvideService />
                    </Fade>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Fade>
      </div>
    );
  }
}

const RequestAService = (props) => {
  const { onClickHandler } = props;
  return (
    <div
      id="bidOrBooMainPage-Request"
      className="card has-text-centered is-outlined RequestAServiceForTour"
    >
      <div onClick={onClickHandler} className="card-content">
        <div id="Proposer-step" className="buttonlike has-text-weight-semibold is-size-4">
          <span className="icon">
            <i className="far fa-plus-square" />
          </span>
          <div>Request A Service</div>
          <br />
          <p className="is-size-6">I want to get my chores done for a good clear price</p>
        </div>
      </div>
    </div>
  );
};

const ProvideAService = (props) => {
  const { onClickHandler } = props;
  return (
    <div id="bidOrBooMainPage-Provide" className="card has-text-centered ProvideAServiceForTour">
      <div onClick={onClickHandler} className="card-content">
        <div id="Bidder-step" className="buttonlike has-text-weight-semibold is-size-4">
          <span className="icon">
            <i className="fas fa-hand-rock" />
          </span>
          <div>Provide A Service</div>
          <br />
          <p className="is-size-6">I want to earn money by completing Tasks that I enjoy doing</p>
        </div>
      </div>
    </div>
  );
};

const HowItWorksRequestService = () => {
  return (
    <div style={{ paddingTop: '2rem' }}>
      <h1 className="title">How It Works?</h1>
      <ul className="steps has-content-centered is-horizontal">
        <li className="steps-segment is-active">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Select a Template</p>
          </div>
        </li>
        <li className="steps-segment">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Taskers Will Bids</p>
          </div>
        </li>
        <li className="steps-segment ">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Choose a Tasker</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

const HowItWorksProvideService = () => {
  return (
    <div style={{ paddingTop: '2rem' }}>
      <h1 className="title">How It Works?</h1>
      <ul className="steps has-content-centered is-horizontal">
        <li className="steps-segment is-active">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Browse For Tasks</p>
          </div>
        </li>
        <li className="steps-segment">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Bid On Tasks</p>
          </div>
        </li>
        <li className="steps-segment ">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">{`Win & Get Paid.`}</p>
          </div>
        </li>
      </ul>
    </div>
  );
};
