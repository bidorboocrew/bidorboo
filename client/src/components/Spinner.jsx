import React from 'react';
import Delay from 'react-delay';
import classNames from 'classnames';

export const Spinner = (props) => {
  const spinnerSize = classNames(
    'bdb-spinner',
    { small: props.size === 'small' },
    { meduim: props.size === 'meduim' },
    { large: props.size === 'large' }
  );
  return <Delay wait={800}>{props.isLoading ? <div className={spinnerSize} /> : null}</Delay>;
};
