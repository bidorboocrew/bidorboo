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

  constructor(props) {
    super(props);

    this.columnCount = BULMA_RESPONSIVE_SCREEN_SIZES.isMobile(this.props)
      ? 'column is-half'
      : 'column is-one-quarter';
  }

  shouldComponentUpdate(nextProps, nextState) {
    // cases when we re render
    if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
      return true;
    }

    if (nextProps.windowWidth !== this.props.windowWidth) {
      let newColumnCount = BULMA_RESPONSIVE_SCREEN_SIZES.isMobile(this.props)
        ? 'column is-half'
        : 'column is-one-quarter';
      if (this.columnCount !== newColumnCount) {
        this.columnCount = newColumnCount;
        return true;
      }
      return false;
    }
    return false;
  }

  render() {
    const { isLoggedIn, showLoginDialog } = this.props;

    this.columnCount = BULMA_RESPONSIVE_SCREEN_SIZES.isMobile(this.props)
      ? 'column is-half'
      : 'column is-one-quarter';

    const genericTasks = Object.keys(templatesRepo).map((key) => {
      const defaultTask = templatesRepo[key];
      const { title, subtitle, description, imageUrl, id } = defaultTask;
      const bgcolor = `${randomColor({
        luminosity: 'dark',
        format: 'rgba',
        alpha: 0.9,
      })}`;

      return (
        <div key={id} className={this.columnCount}>
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
            {/* <div style={{ paddingBottom: '0.25rem' }} className="card-content">
             <div className="content">
                <div className="has-text-grey is-size-7">{description}</div>
              </div>
            </div> */}
          </div>
        </div>
      );
    });

    return <React.Fragment>{genericTasks}</React.Fragment>;
  }
}

export default windowSize(BidOrBooGenericTasks);
