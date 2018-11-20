import React from 'react';

export default class ProposerStepper extends React.Component {
  render() {
    const { currentStepNumber } = this.props;
    return (
      <div style={{ marginTop: '0.5rem', background: '#eeeeee' }}>
        {/* mobile view*/}
        <div className="is-hidden-tablet ">
          <ul className="steps is-horizontal">
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
                  <i className="fas fa-camera" />
                </span>
              </span>
            </li>
            <li className={`steps-segment ${currentStepNumber === 4 ? 'is-active' : ''}`}>
              <span className="steps-marker">
                <span className="icon">
                  <i className="fa fa-check" />
                </span>
              </span>
            </li>
          </ul>
        </div>
        {/* desktop view*/}
        <div className="is-hidden-mobile">
          <ul className="steps is-horizontal has-content-centered">
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
                  <i className="fas fa-camera" />
                </span>
              </span>
              <div className="steps-content">
                <p className="is-size-5">Add Pics</p>
              </div>
            </li>
            <li
              className={`steps-segment ${
                currentStepNumber === 4 ? 'is-active has-text-weight-semibold' : ''
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
