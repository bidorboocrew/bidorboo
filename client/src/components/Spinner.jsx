import React, { useState, useEffect } from 'react';
import Delay from 'react-delay';
import classNames from 'classnames';

import { switchRoute } from './../utils';
import * as ROUTES from '../constants/frontend-route-consts';

const TIMEOUT_DURATION = 40000;
export const Spinner = ({
  isDark = true,
  size = 'medium',
  isLoading = false,
  renderLabel = null,
}) => {
  const [didRequestTimeout, setDidRequestTimeout] = useState(false);
  useEffect(() => {
    const timeoutFunc = setTimeout(() => {
      setDidRequestTimeout(true);
    }, TIMEOUT_DURATION);

    return () => clearTimeout(timeoutFunc);
  }, []);

  const spinnerSize = classNames(
    'bdb-spinner',
    { small: size === 'small' },
    { medium: size === 'medium' },
    { large: size === 'large' },
  );
  return (
    <Delay wait={1000}>
      {isLoading && !didRequestTimeout && (
        <React.Fragment>
          <div className="VerticalAligner">
            <div style={{ marginTop: '6rem' }} className={spinnerSize} />
          </div>
          <div style={{ marginTop: '1rem' }} className="HorizontalAligner-center">
            {typeof renderLabel === 'function' && renderLabel()}
            {typeof renderLabel === 'string' && (
              <label className={`label ${isDark ? 'has-text-dark' : 'has-text-white'}`}>
                {renderLabel}
              </label>
            )}
          </div>
        </React.Fragment>
      )}
      {isLoading && didRequestTimeout && (
        <section className="hero is-fullheight">
          <div className="hero-body">
            <div className="container">
              <label className="subtitle has-text-danger">
                Something went wrong! The request had timed out
              </label>
              <br />
              <label className="is-size-7">
                Apologies for the inconvenience, We will track the issue and fix it asap.
              </label>
              <br />
              <br />
              <a
                onClick={() => {
                  switchRoute(ROUTES.CLIENT.HOME);
                }}
                className="button is-success is-medium"
              >
                Go to Home Page
              </a>
            </div>
          </div>
        </section>
      )}
    </Delay>
  );
};
