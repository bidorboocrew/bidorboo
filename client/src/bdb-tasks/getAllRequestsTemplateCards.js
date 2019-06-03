import React from 'react';

import { HouseCleaningConcept } from './index';

import { JobTitleText } from '../containers/commonComponents';

export const getAllActiveRequestsTemplateCards = (props) => {
  const { showLoginDialog, isLoggedIn } = props;
  const bidorbooTaskConcepts = [
    <HouseCleaningConcept showLoginDialog={showLoginDialog} isLoggedIn={isLoggedIn} />,
  ];
  return bidorbooTaskConcepts;
};

export const getAllUpcomingTemplateCards = (props) => {
  const bidorbooTaskConcepts = [<ComingSoon1 />, <ComingSoon2 />, <ComingSoon3 />];
  return bidorbooTaskConcepts;
};

const ComingSoon1 = () => {
  return (
    <div className="card is-clipped limitWidthOfCard">
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 9,
            display: 'block',
            background: 'rgba(255,255,255,0.4)',
          }}
        />

        <div className="card-content template">
          <div style={{ height: '12rem' }} className="content">
            <JobTitleText title={'Lawn Mowing'} iconClass="fas fa-tree" />
            <hr className="divider isTight" />
            <div style={{ marginTop: '1.5rem' }}>
              Tired of mowing? Why don't you let one of our handy BidorBooers do the lawn mowing.
              Get rid of that grass and live life to the max
            </div>
          </div>
          <a className="button is-outlined is-fullwidth">Coming Soon</a>
        </div>
      </div>
      <footer className="card-footer">
        <div className="card-footer-item has-text-centered">Want it sooner?</div>
        <a className="card-footer-item">
          <span className="icon">
            <i className="far fa-thumbs-up" />
          </span>
          <span className="icon">Like</span>
        </a>
        <a className="card-footer-item">
          <span className="icon">
            <i className="fas fa-dollar-sign" />
          </span>
          <span>Donate</span>
        </a>
      </footer>
    </div>
  );
};

const ComingSoon3 = () => {
  return (
    <div className="card is-clipped limitWidthOfCard">
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 9,
            display: 'block',
            background: 'rgba(255,255,255,0.4)',
          }}
        />

        <div className="card-content template">
          <div style={{ height: '12rem' }} className="content">
            <JobTitleText title={'Pet Buddies'} iconClass="fas fa-paw" />
            <hr className="divider isTight" />
            <div style={{ marginTop: '1.5rem' }}>
              Need a night out while leaving your pets safe and entertained? get our pet loving
              bidorboocrew members to take care of your pets leaving you worry free
            </div>
          </div>
          <a className="button is-outlined is-fullwidth">Coming Soon</a>
        </div>
      </div>
      <footer className="card-footer">
        <div className="card-footer-item has-text-centered">Want it sooner?</div>
        <a className="card-footer-item">
          <span className="icon">
            <i className="far fa-thumbs-up" />
          </span>
          <span className="icon">Like</span>
        </a>
        <a className="card-footer-item">
          <span className="icon">
            <i className="fas fa-dollar-sign" />
          </span>
          <span>Donate</span>
        </a>
      </footer>
    </div>
  );
};

const ComingSoon2 = () => {
  return (
    <div className="card  is-clipped limitWidthOfCard">
      <div style={{ position: 'relative' }}>
        <div
          style={{
            position: 'absolute',
            height: '100%',
            width: '100%',
            top: 0,
            left: 0,
            zIndex: 9,
            display: 'block',
            background: 'rgba(255,255,255,0.4)',
          }}
        />
        <div className="card-content template">
          <div style={{ height: '12rem' }} className="content">
            <JobTitleText title={'Movers'} iconClass="fas fa-people-carry" />
            <hr className="divider isTight" />
            <div style={{ marginTop: '1.5rem' }}>
              Need some Muscles to help you lift heavy items or move ? let's face it, do you even
              lift braah? let our Movers do the heavy lifting
            </div>
          </div>
          <a className="button is-outlined is-fullwidth">Coming Soon</a>
        </div>
      </div>

      <footer className="card-footer">
        <div className="card-footer-item has-text-centered">Want it sooner?</div>
        <a className="card-footer-item">
          <span className="icon">
            <i className="far fa-thumbs-up" />
          </span>
          <span className="icon">Like</span>
        </a>
        <a className="card-footer-item">
          <span className="icon">
            <i className="fas fa-dollar-sign" />
          </span>
          <span>Donate</span>
        </a>
      </footer>
    </div>
  );
};
