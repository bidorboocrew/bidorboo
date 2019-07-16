import React from 'react';
import Tour from 'reactour';

// import Fade from 'react-reveal/Fade';
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
    content: (
      <h1 className="title">
        Welcome to <span style={{ color: '#353535' }}>BidOrBoo</span>
      </h1>
    ),
    style: { maxWidth: 'none', fontWeight: '600' },
  },
  {
    selector: '.ProvideAServiceForTour',
    content: 'Are you looking to make money doing tasks you enjoy? Click Here',
    style: { maxWidth: 'none', fontWeight: '600' },
  },
  {
    selector: '.RequestAServiceForTour',
    content: 'If you have chores and want help getting them done, Click Here',
    style: { maxWidth: 'none', fontWeight: '600' },
  },
  {
    selector: '#BidOrBoo-logo-step',
    content: 'Click Here to go to the home page at anytime',
    style: { maxWidth: 'none', fontWeight: '600' },
  },
];

const desktopTour = [
  ...commonTourSteps,
  {
    selector: '#viewDependentNavBarItems',
    content:
      'This area will show relevant actions where you can access your Task or Requests based on your current view (Tasker or Requester).',
    style: { maxWidth: 'none', fontWeight: '600' },
  },
  {
    selector: '#myprofile-step',
    content:
      'Through this menu you can access your My Profile, Payments, or switch between Tasker and Reuqester roles at anytime',
    style: { maxWidth: 'none', fontWeight: '600' },
  },
];

const mobileTour = [
  ...commonTourSteps,
  {
    selector: '#mobile-nav-burger',
    content:
      'Through this menu you can access your your Tasks, Requests, My Profile, Payments, or switch between Tasker and Reuqester roles at anytime',
    style: { maxWidth: 'none', fontWeight: '600' },
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
      <div>
        {isDesktopView && (
          <Tour
            scrollDuration={500}
            showNumber={false}
            startAt={0}
            maskSpace={0}
            accentColor={'#ef2834'}
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
            accentColor={'#ef2834'}
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

        <section className="hero has-text-centered is-small is-transparent">
          <div className="hero-body">
            <div className="container">
              <h1
                style={{
                  color: '#353535',
                  marginBottom: 2,
                  transform: 'scaleY(1.1)',
                  fontWeight: 400,
                }}
                className="title is-1"
              >
                <span id="BidOrBoo-welcome-step">
                  BidOrBoo
                  {/* <span style={{ color: 'black' }}> Bid</span>
                  <span style={{ color: 'rgba(0,0,0,0.4)' }}>Or</span>
                  <span style={{ color: 'black' }}>Boo</span> */}
                </span>
              </h1>
              {/* <Fade> */}
              <h2 className="is-5">
                Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy.
              </h2>
              {/* </Fade> */}
              <br />
              <div>
                <Zoom>
                  <h2 className="is-5">What Do You Want To Do</h2>
                </Zoom>
                <div>
                  <a
                    style={{
                      borderRadius: 0,
                      border: 'none',
                    }}
                    onClick={this.toggleTour}
                    className="button is-text"
                  >
                    <span className="help icon">
                      <i className="fas fa-chalkboard-teacher" />
                    </span>
                    <span>View Product Tour</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="columns is-mobile is-multiline is-centered">
          <div style={{ maxWidth: '21rem' }} className="column">
            {/* <Fade bottom delay={250}> */}
            <RequestAService
              onClickHandler={() => {
                switchRoute(ROUTES.CLIENT.PROPOSER.root);
              }}
            />
            {/* </Fade> */}
            <div style={{ maxWidth: '21rem', padding: 0 }} className="column">
              {/* <Fade bottom delay={250}> */}
              <HowItWorksRequestService />
              {/* </Fade> */}
            </div>
          </div>
          <div style={{ maxWidth: '21rem' }} className="column">
            {/* <Fade bottom delay={250}> */}
            <ProvideAService
              onClickHandler={() => {
                switchRoute(ROUTES.CLIENT.BIDDER.root);
              }}
            />
            {/* </Fade> */}
            <div style={{ maxWidth: '21rem', padding: 0 }} className="column">
              {/* <Fade bottom delay={250}> */}
              <HowItWorksProvideService />
              {/* </Fade> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const RequestAService = (props) => {
  const { onClickHandler, id = 'Proposer-step' } = props;
  return (
    <div className="card bidOrBooMainPage-Request has-text-centered is-outlined RequestAServiceForTour">
      <div onClick={onClickHandler} className="card-content" style={{ minHeight: 'unset' }}>
        <div id={id} style={{ fontWeight: 400 }} className="buttonlike is-size-4">
          <span className="icon">
            <i className="far fa-plus-square" />
          </span>
          <div>Request A Service</div>
          <br />
          <p className="is-size-6 has-text-grey">
            I want to get my chores done for a good clear price
          </p>
        </div>
      </div>
    </div>
  );
};

const ProvideAService = (props) => {
  const { onClickHandler, id = 'Bidder-step' } = props;
  return (
    <div className="card bidOrBooMainPage-Provide has-text-centered ProvideAServiceForTour">
      <div onClick={onClickHandler} className="card-content" style={{ minHeight: 'unset' }}>
        <div id={id} style={{ fontWeight: 400 }} className="buttonlike is-size-4">
          <span className="icon">
            <i className="fas fa-hand-rock" />
          </span>
          <div>Provide A Service</div>
          <br />
          <p className="is-size-6 has-text-grey">
            I want to earn money by completing Tasks I enjoy{' '}
          </p>
        </div>
      </div>
    </div>
  );
};

const HowItWorksRequestService = () => {
  return (
    <div>
      <h1 style={{ fontWeight: 300 }} className="title has-text-centered is-size-4">
        How It Works?
      </h1>
      <ul className="steps has-content-centered is-horizontal">
        <li className="steps-segment is-active">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Fill A Request</p>
          </div>
        </li>
        <li className="steps-segment">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Taskers Will Bid</p>
          </div>
        </li>
        <li className="steps-segment ">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Chose a Tasker</p>
          </div>
        </li>
      </ul>
    </div>
  );
};

const HowItWorksProvideService = () => {
  return (
    <div>
      <h1 style={{ fontWeight: 300 }} className="title has-text-centered is-size-4">
        How It Works?
      </h1>
      <ul className="steps has-content-centered is-horizontal">
        <li className="steps-segment is-active">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Browse Tasks</p>
          </div>
        </li>
        <li className="steps-segment">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">Place Your Bids</p>
          </div>
        </li>
        <li className="steps-segment ">
          <span className="steps-marker" />
          <div className="steps-content">
            <p className="is-size-6">{`Do it & Get Paid.`}</p>
          </div>
        </li>
      </ul>
    </div>
  );
};
