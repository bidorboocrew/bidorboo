import React from 'react';

import { templatesRepo } from '../../../constants/bidOrBooTaskRepo';
import PropTypes from 'prop-types';
import * as ROUTES from '../../../constants/frontend-route-consts';
import { switchRoute } from '../../../utils';

class ServiceTemplates extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    showLoginDialog: PropTypes.func,
  };

  render() {
    const { isLoggedIn, showLoginDialog } = this.props;

    const genericTasks = Object.keys(templatesRepo).map((key) => {
      const defaultTask = templatesRepo[key];
      const { title, imageUrl, id } = defaultTask;

      return (
        <div key={id} className="column limitMaxdWidth">
          <div
            onClick={(e) => {
              e.preventDefault();
              if (!isLoggedIn) {
                showLoginDialog(true);
              } else {
                switchRoute(`${ROUTES.CLIENT.PROPOSER.createjob}/${id}`);
              }
            }}
            className="card is-clipped bidderRootSpecial "
          >
            <div className="card-image is-clipped">
              <figure className="bdb-cover-img">
                <img src={`${imageUrl}`} />
              </figure>
            </div>
            <div style={{ padding: 8 }} className="card-content">
              <a className="has-text-weight-bold button is-outlined is-fullwidth">{title}</a>
            </div>
          </div>
        </div>
      );
    });

    return (
      <div className="columns forJobSummary is-mobile is-multiline is-centered">{genericTasks}</div>
    );
  }
}

export default ServiceTemplates;
