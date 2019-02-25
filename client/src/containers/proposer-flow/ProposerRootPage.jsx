import React from 'react';

export default class ProposerRoot extends React.Component {
  render() {
    const { a_showLoginDialog, isLoggedIn, userDetails } = this.props;

    return (
      <div>
        <section className="section">
          <div className="container has-text-centered">
            INSERT COUPON HERE XXXXXXXXXXXXXXXXXXXXXXXXXXXX
          </div>
        </section>
        <iframe
          id="testSurvey"
          heigh="100vh !important"
          style={{
            height: '100vh !important',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          src="https://www.surveymonkey.com/r/B3FSLSM"
        />
      </div>
    );
  }
}
