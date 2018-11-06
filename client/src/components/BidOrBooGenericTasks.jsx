import React from 'react';
import classNames from 'classnames';

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
      return (
        <div key={id} className="column fade-in is-one-third">
          <div
            style={{ height: '100%' }}
            onClick={(e) => {
              e.preventDefault();
              if (!isLoggedIn) {
                showLoginDialog(true);
              } else {
                switchRoute(`${ROUTES.CLIENT.PROPOSER.createjob}/${id}`);
              }
            }}
            className="card"
          >
            <div className="card-image is-clipped">
              <figure className="image is-3by1">
                <img src={imageUrl} alt={subtitle} />
              </figure>
            </div>
            <div className="card-content">
              <h1 className="title">
                <a style={{ borderRadius: 0 }} className="button is-primary is-large is-fullwidth">
                  <span>{title}</span>
                </a>
              </h1>
              <div className="content">
                <div className="descriptoin-section">{description}</div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return <React.Fragment>{genericTasks}</React.Fragment>;
  }
}

export default BidOrBooGenericTasks;
