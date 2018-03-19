import React from 'react';
import Delay from 'react-delay';

export const Spinner = props => {
  return (
    <Delay wait={800}>
      {props.isLoading ? <div className="bdb-spinner" /> : null}
    </Delay>
  );
};
