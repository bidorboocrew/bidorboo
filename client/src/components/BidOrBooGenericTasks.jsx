import React from 'react';
import { randomColor } from 'randomcolor';

import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import PropTypes from 'prop-types';
import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

class BidOrBooGenericTasks extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    showLoginDialog: PropTypes.func,
  };

  render() {
    const { isLoggedIn, showLoginDialog } = this.props;

    const genericTasks = Object.keys(templatesRepo).map((key) => {
      const defaultTask = templatesRepo[key];
      const { title, subtitle, description, imageUrl, id } = defaultTask;
      const bgcolor = `${randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 0.9,
      })}`;

      return (
        <div key={id} className="column">
          <div
            style={{
              backgroundColor: bgcolor,
            }}
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
                className="title button is-primary is-size-6 is-fullwidth has-text-white has-text-centered is-capitalized"
              >
                {title}
              </p>
            </header>
            <div className="card-image bdb-cover-img">
              <img src={`${imageUrl}`} className="bdb-cover-img" />
            </div>
          </div>
        </div>
      );
    });

    return <React.Fragment>{genericTasks}</React.Fragment>;
  }
}

export default BidOrBooGenericTasks;
