import React from 'react';

import { HouseCleaningConcept } from './index';

import { JobTitleText } from '../containers/commonComponents';
export const getAllRequestsTemplateCards = (props) => {
  const { showLoginDialog, isLoggedIn } = props;
  const bidorbooTaskConcepts = [
    <HouseCleaningConcept showLoginDialog={showLoginDialog} isLoggedIn={isLoggedIn} />,
    <ComingSoon1 />,
    <ComingSoon2 />,
  ];
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
            zIndex: 99,
            display: 'block',
            background: 'rgba(255,255,255,0.4)',
          }}
        />

        <div className="card-content">
          <div className="content">
            <JobTitleText title={'Lawn Mowing'} iconClass="fas fa-tree" />
            <hr className="divider" />
            Tired of mowing? Why don't you let one of our handy BidorBooers do the lawn mowing. with
            a simple click. Get rid of that grass and live life to the max
          </div>
          <a className="button is-outlined is-fullwidth">Coming Soon</a>
        </div>
      </div>
      <footer className="card-footer">
        <div className="card-footer-item has-text-centered">Support us to make it happen</div>
        <a href="#" className="card-footer-item">
          <span className="icon">
            <i className="far fa-thumbs-up" />
          </span>
          <span className="icon">Like</span>
        </a>
        <a href="#" className="card-footer-item">
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
            zIndex: 99,
            display: 'block',
            background: 'rgba(255,255,255,0.4)',
          }}
        />
        <div className="card-content">
          <div className="content">
            <JobTitleText title={'Movers'} iconClass="fas fa-people-carry" />
            <hr className="divider" />
            Need some Muscles to help you lift heavy items or move ? Movers can do the heavy lifting
            while you enjoy settling into your new space.
          </div>
          <a className="button is-outlined is-fullwidth">Coming Soon</a>
        </div>
      </div>

      <footer className="card-footer">
        <div className="card-footer-item has-text-centered">Support us to make it happen</div>
        <a href="#" className="card-footer-item">
          <span className="icon">
            <i className="far fa-thumbs-up" />
          </span>
          <span className="icon">Like</span>
        </a>
        <a href="#" className="card-footer-item">
          <span className="icon">
            <i className="fas fa-dollar-sign" />
          </span>
          <span>Donate</span>
        </a>
      </footer>
    </div>
  );
};
