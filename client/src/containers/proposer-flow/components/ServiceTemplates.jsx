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
        <div key={id} className="column">
          <div
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
            <div className="card-image">
              <img src={`${imageUrl}`} />
            </div>
            <p className="title is-size-6 is-fullwidth has-text-dark has-text-centered is-capitalized">
              {title}
            </p>
          </div>
        </div>
      );
    });

    return <div className="columns is-mobile is-multiline">{genericTasks}</div>;
  }
}

export default ServiceTemplates;
