import React from 'react';
// const logo = require('../../target-mobile-coupon-starbucks.png')

export default class ProposerRoot extends React.Component {
  state = { iframe_loading: false };

  componentDidMount() {
    document.getElementById('testSurvey').onload = () => {
      this.setState({ iframe_loading: true });
    };
  }


  render() {
    const testDom = this.state.iframe_loading ? (
      <section className="section">
        <div className="container has-text-centered">
        <nav
          style={{ background: '#00BF6F !important', color: 'white !important' }}
          className={`navbar is-fixed-top`}
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand">
            <a className="navbar-item">
              <img
                src="https://cdn.smassets.net/wp-content/themes/survey-monkey-theme/images/surveymonkey_logo_dark.svg?ver=1.108.0"
                width="112"
                height="64"
              />
            </a>
          </div>
          <div className="navbar-end navbar-item">
            <a className="navbar-item button is-danger" href={'/api/auth/google'}>
              Login
            </a>
          </div>
        </nav>
        <div class="confetti-container">
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <div class="confetti"></div>
          <img class="confetti-image" src={require('../../assets/images/coupon-starbucks.png')} />
        </div>
        </div>
      </section>
    ) : null;

    return (
      <div>
        {testDom}
        <iframe
          id="testSurvey"
          height="100vh !important"
          style={{
            height: '100vh !important',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          src="https://www.surveymonkey.com/r/?sm=Xx1ka9lbHw5UgYKthpVWHdk8GqEch1IOKd82PtEb7SBTM7ZH9_2BllWFXnFfGLqciyPrgncGPZvy6VqNGLrNePjfb56OjavX36T4JBufvJnbskQphSFTaIHV3BBeW4lMyCSKFb_2Fakm_2BzrUVG79_2Bg7ZC8aXwiNybt5h_2FCZ2avHqWpxAlu88oXprr4dnrKOBi3ztbqZnVdqzzwGXQsPw2nrctsfwth5X78dUXhtBpPbG4XA_3D"
        />
      </div>
    );
  }
}
