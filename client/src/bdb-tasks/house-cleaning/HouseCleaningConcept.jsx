import React from 'react';

import PropTypes from 'prop-types';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningConcept extends React.Component {
  render() {
    const { isLoggedIn, showLoginDialog } = this.props;
    const { ID, TITLE } = HOUSE_CLEANING_DEF;

    return (
      <div
        onClick={(e) => {
          switchRoute(`${ROUTES.CLIENT.PROPOSER.createjob}/${ID}`);
        }}
        className="card is-clipped bidderRootSpecial "
      >
        <header className="card-header">
          <p className="card-header-title">{TITLE}</p>
        </header>

        <div className="card-image is-clipped">
          <figure className="bdb-cover-img">
            <img
              src={`https://www.pinclipart.com/picdir/middle/13-139117_image-stock-collection-of-free-disinfecting-house-cleaning.png`}
            />
          </figure>
        </div>
        <div className="card-content">
          <div className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
            <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
          </div>
        </div>
        <footer className="card-footer">
          <a className="card-footer-item has-text-weight-bold is-text is-fullwidth">Request Now</a>
        </footer>
      </div>
    );
  }
}

HouseCleaningConcept.propTypes = {
  isLoggedIn: PropTypes.bool,
  showLoginDialog: PropTypes.func,
};
