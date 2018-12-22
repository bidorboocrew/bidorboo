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
      const bgcolor = 'white';

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
            className="card proposerRootCardSpecial"
          >
            <div
              style={{
                backgroundColor: bgcolor,
              }}
              className="card-image"
            >
              <img src={`${imageUrl}`} />
            </div>
            <p className="title is-size-6 is-fullwidth has-text-dark has-text-centered is-capitalized">
              {title}
            </p>
          </div>
        </div>
      );
    });

    return <React.Fragment>{genericTasks}</React.Fragment>;
  }
}

export default BidOrBooGenericTasks;
