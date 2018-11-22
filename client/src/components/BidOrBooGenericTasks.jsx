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
        <div key={id} className="column is-one-third">
          <div
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
            <header>
              <p
                style={{
                  backgroundColor: bgcolor,
                  border: 'none',
                }}
                className="button is-size-4 is-fullwidth has-text-white has-text-centered is-capitalized"
              >
                {title}
              </p>
            </header>
            <div className="card-image">
              <div
                style={{
                  background: `url('${imageUrl}')`,
                }}
                className="bdbImageAsBackground"
              />
            </div>
            <div className="card-content">
              <h1>
                <div className="HorizontalAligner-center">
                  <a
                    style={{
                      marginTop: '-51px',
                      color: 'white',
                      borderRadius: '50%',
                      borderColor: 'transparent',
                      backgroundColor: bgcolor,
                    }}
                    className="button is-size-4 is-large bdb-AddJobButton"
                  >
                    <span>+</span>
                  </a>
                </div>
              </h1>
              <div className="content">
                <div className="has-text-grey is-size-6">{description}</div>
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
