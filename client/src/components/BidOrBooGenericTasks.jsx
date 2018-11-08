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
            className="card bdb-genericJobCard"
          >
            <header style={{ borderBottom: '1px solid #eee' }}>
              <p
                style={{
                  border: 'none',
                  padding: 28,
                  backgroundColor: bgcolor,
                  borderRadius: 0,
                  color: 'white',
                }}
                className="button is-fullwidth has-text-centered is-capitalized has-text-weight-bold is-size-4"
              >
                {title}
              </p>
            </header>
            <div className="card-image is-clipped">
              <figure className="image is-3by1">
                <img src={imageUrl} alt={subtitle} />
              </figure>
            </div>
            <div className="card-content">
              <h1>
                <div className="HorizontalAligner-center">
                  <a
                    style={{
                      fontSize: '1.8rem',
                      border: 'none',
                      marginTop: '-55px',
                      color: 'white',
                      borderRadius: '100%',
                      backgroundColor: bgcolor,
                    }}
                    className="button is-large bdb-AddJobButton"
                  >
                    <span>+</span>
                  </a>
                </div>
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
