import React from 'react';
import Delay from 'react-delay';
import classNames from 'classnames';
import { css } from '@emotion/core';
// First way to import
import { RingLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

export const Spinner = (props) => {
  const spinnerSize = classNames(
    'bdb-spinner',
    { small: props.size === 'small' },
    { meduim: props.size === 'meduim' },
    { large: props.size === 'large' },
  );
  return (
    <Delay wait={800}>
      {props.isLoading && (
        <RingLoader css={override} sizeUnit={'px'} size={150} color={'#123abc'} loading />
      )}
    </Delay>
  );
};
