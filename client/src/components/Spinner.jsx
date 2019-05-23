import React from 'react';
import Delay from 'react-delay';
import classNames from 'classnames';

export const Spinner = ({
  isDark = true,
  size = 'meduim',
  isLoading = false,
  renderLabel = null,
}) => {
  const spinnerSize = classNames(
    'bdb-spinner',
    { small: size === 'small' },
    { meduim: size === 'meduim' },
    { large: size === 'large' },
  );
  return (
    <Delay wait={800}>
      <div style={{ marginTop: '1rem' }} className="VerticalAligner">
        {isLoading ? <div className={spinnerSize} /> : null}
      </div>
      <div style={{ marginTop: '1rem' }} className="HorizontalAligner-center">
        {typeof renderLabel === 'function' && renderLabel()}
        {typeof renderLabel === 'string' && (
          <label className={`label ${isDark ? 'has-text-dark' : 'has-text-white'}`}>
            {renderLabel}
          </label>
        )}
      </div>
    </Delay>
  );
};
