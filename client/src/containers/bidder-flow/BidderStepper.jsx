import React from 'react';

export default class BidderStepper extends React.Component {
  render() {
    const { currentStepNumber } = this.props;

    return (
      <div
        style={{
          background: '#EEEEEE',
        }}
      >
        <div
          style={{
            height: '2.5rem',
            position: 'fixed',
            left: 0,
            right: 0,
            width: '100%',
            top: '3.25rem',
            zIndex: 25,
            background: '#EEEEEE',
          }}
        >
          <ul
            style={{
              paddingTop: 10,
              background: '#EEEEEE',
              boxShadow:
                '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)',
            }}
            className="steps is-small is-horizontal has-content-centered"
          >
            <li
              className={`steps-segment ${
                currentStepNumber === 1 ? 'is-active has-text-weight-semibold' : ''
              }`}
            >
              <span className="steps-marker">
                <span style={{ fontSize: 'unset' }} className="icon">
                  <i className="fas fa-search" />
                </span>
              </span>
              <div className="steps-content">
                <p className="is-size-7">Select task</p>
              </div>
            </li>
            <li
              className={`steps-segment ${
                currentStepNumber === 2 ? 'is-active has-text-weight-semibold' : ''
              }`}
            >
              <span className="steps-marker">
                <span style={{ fontSize: 'unset' }} className="icon">
                  <i className="fas fa-pencil-alt" />
                </span>
              </span>
              <div className="steps-content">
                <p className="is-size-7">Bid</p>
              </div>
            </li>
            <li
              className={`steps-segment ${
                currentStepNumber === 3 ? 'is-active has-text-weight-semibold' : ''
              }`}
            >
              <span className="steps-marker">
                <span style={{ fontSize: 'unset' }} className="icon">
                  <i className="fa fa-check" />
                </span>
              </span>
              <div className="steps-content">
                <p className="is-size-7">Posted</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
