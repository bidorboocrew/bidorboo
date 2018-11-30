import React from 'react';
import { randomColor } from 'randomcolor';
import windowSize from 'react-window-size';

import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import PropTypes from 'prop-types';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute, BULMA_RESPONSIVE_SCREEN_SIZES } from '../utils';

class BidOrBooGenericTasks extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    showLoginDialog: PropTypes.func,
  };

  render() {
    const { isLoggedIn, showLoginDialog } = this.props;

    const columnCount = BULMA_RESPONSIVE_SCREEN_SIZES.isMobile(this.props)
      ? 'column is-half'
      : 'column is-one-fifth';

    const genericTasks = Object.keys(templatesRepo).map((key) => {
      const defaultTask = templatesRepo[key];
      const { title, subtitle, description, imageUrl, id } = defaultTask;
      const bgcolor = `${randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 0.9,
      })}`;
      return (
        <div key={id} className={columnCount}>
          <div
            onClick={(e) => {
              e.preventDefault();
              if (!isLoggedIn) {
                showLoginDialog(true);
              } else {
                switchRoute(`${ROUTES.CLIENT.PROPOSER.createjob}/${id}`);
              }
            }}
            className="card is-clipped"
          >
            <header>
              <p
                style={{
                  backgroundColor: bgcolor,
                  border: 'none',
                }}
                className="button is-primary is-size-6 is-fullwidth has-text-white has-text-centered is-capitalized"
              >
                {title}
              </p>
            </header>
            <div className="card-image">
              <img src={`${imageUrl}`} className="bdb-cover-img" />
            </div>
            <div style={{ paddingBottom: '0.25rem' }} className="card-content">
              <h1>
                <div className="HorizontalAligner-center">
                  <a
                    style={{
                      marginTop: '-70px',
                      color: 'white',
                      borderRadius: '50%',
                      borderColor: 'transparent',
                      backgroundColor: bgcolor,
                    }}
                    className="button is-primary is-size-4  bdb-AddJobButton"
                  >
                    <span>+</span>
                  </a>
                </div>
              </h1>
              <div className="content">
                <div className="has-text-grey is-size-7">{description}</div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return <React.Fragment>{genericTasks}</React.Fragment>;
  }
}

export default windowSize(BidOrBooGenericTasks);
