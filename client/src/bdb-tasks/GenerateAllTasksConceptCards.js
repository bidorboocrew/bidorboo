import React from 'react';

import { HouseCleaningConcept } from './index';

import { JobTitleText } from '../containers/commonComponents';
export const GenerateAllTasksConceptCards = (props) => {
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
    <div className="card disabled is-clipped limitWidthOfCard">
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
        <div className="card-image is-clipped">
          <figure className="bdb-cover-img">
            <img src={'https://www.spring-green.com/wp-content/uploads/2016/05/lawn-mower1.jpg'} />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            <JobTitleText title={'Lawn Mowing'} />
            Tired of mowing? Why don't you let one of our handy BidorBooers do the lawn mowing. with
            a simple click. Get rid of that grass and live life to the max
          </div>
          <a className="button is-outlined is-fullwidth">Coming Soon</a>
        </div>
      </div>
      <footer className="card-footer">
        <div className="card-footer-item has-text-centered">Want it sooner?</div>
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
    <div className="card disabled is-clipped limitWidthOfCard">
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
        <div className="card-image is-clipped">
          <figure className="bdb-cover-img">
            <img
              src={
                'https://www.apartmentguide.com/blog/wp-content/uploads/2015/06/cost-of-hiring-movers-1-748x350.jpg'
              }
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            <JobTitleText title={'Movers'} />
            Need some Muscles to help you lift heavy items or move ? Movers can do the heavy lifting
            while you enjoy settling into your new space.
          </div>
          <a className="button is-outlined is-fullwidth">Coming Soon</a>
        </div>
      </div>

      <footer className="card-footer">
        <div className="card-footer-item has-text-centered">Want it sooner?</div>
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
