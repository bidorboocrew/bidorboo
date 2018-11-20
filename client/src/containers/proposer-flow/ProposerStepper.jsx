import React from 'react';

export default class ProposerStepper extends React.Component {
  render() {
    const { currentStepNumber } = this.props;
    return (
      <div style={{ background: '#EEEEEE' }}>
        {/* mobile view*/}
        <div
          style={{
            height: '2.5rem',
            position: 'fixed',
            left: 0,
            right: 0,
            width: '100%',
            top: '3.25rem',
            zIndex: 12,
            background: '#EEEEEE',
            paddingTop: 6,
            paddingBottom: 4,
          }}
          className="is-hidden-tablet"
        >
          <ul style={{ background: '#EEEEEE' }} className="steps is-horizontal">
            <li className={`steps-segment ${currentStepNumber === 1 ? 'is-active ' : ''}`}>
              <span className="steps-marker">
                <span className="icon">
                  <i className="fas fa-search" />
                </span>
              </span>
            </li>
            <li className={`steps-segment ${currentStepNumber === 2 ? 'is-active' : ''}`}>
              <span className="steps-marker">
                <span className="icon">
                  <i className="fas fa-pencil-alt" />
                </span>
              </span>
            </li>
            <li className={`steps-segment ${currentStepNumber === 3 ? 'is-active' : ''}`}>
              <span className="steps-marker">
                <span className="icon">
                  <i className="fa fa-check" />
                </span>
              </span>
            </li>
          </ul>
        </div>
        {/* desktop view*/}
        <div
          style={{
            height: '3.5rem',
            position: 'fixed',
            left: 0,
            right: 0,
            width: '100%',
            top: '3.25rem',
            zIndex: 12,
            background: '#EEEEEE',
            paddingTop: 6,
            paddingBottom: 4,
          }}
          className="is-hidden-mobile"
        >
          <ul
            style={{ background: '#EEEEEE' }}
            className="steps is-horizontal has-content-centered"
          >
            <li
              className={`steps-segment ${
                currentStepNumber === 1 ? 'is-active has-text-weight-semibold' : ''
              }`}
            >
              <span className="steps-marker">
                <span className="icon">
                  <i className="fas fa-search" />
                </span>
              </span>
              <div className="steps-content">
                <p className="is-size-5">Select task</p>
              </div>
            </li>
            <li
              className={`steps-segment ${
                currentStepNumber === 2 ? 'is-active has-text-weight-semibold' : ''
              }`}
            >
              <span className="steps-marker">
                <span className="icon">
                  <i className="fas fa-pencil-alt" />
                </span>
              </span>
              <div className="steps-content">
                <p className="is-size-5">Fill Details</p>
              </div>
            </li>
            <li
              className={`steps-segment ${
                currentStepNumber === 3 ? 'is-active has-text-weight-semibold' : ''
              }`}
            >
              <span className="steps-marker">
                <span className="icon">
                  <i className="fa fa-check" />
                </span>
              </span>
              <div className="steps-content">
                <p className="is-size-5">Post</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
