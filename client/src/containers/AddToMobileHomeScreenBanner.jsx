import React from 'react';

export default class AddToMobileHomeScreenBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shouldShowBanner: false,
    };

    this.installPrompt = null;

    this.beforeInstallPromptFunc = (e) => {
      // For older browsers
      e.preventDefault();
      console.log('Install Prompt fired');
      this.installPrompt = e;
      // See if the app is already installed, in that case, do nothing
      if (
        (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
        window.navigator.standalone === true
      ) {
        return false;
      }
      // Set the state variable to make button visible
      this.showBanner();
    };
  }

  installApp = async () => {
    if (!this.installPrompt) {
      return false;
    }
    this.installPrompt.prompt();
    let outcome = await this.installPrompt.userChoice;
    if (outcome.outcome == 'accepted') {
      console.log('App Installed');
    } else {
      console.log('App not installed');
    }
    // Remove the event reference
    this.installPrompt = null;
    // Hide the button
    this.hideBanner();
  };

  showBanner = () => {
    this.setState({ shouldShowBanner: true });
  };

  hideBanner = () => {
    this.setState({ shouldShowBanner: false });
  };
  componentDidMount() {
    console.log('Listening for Install prompt');
    window.addEventListener('beforeinstallprompt', this.beforeInstallPromptFunc);
  }
  componentWillUnmount() {
    window.removeEventListener('beforeinstallprompt', this.beforeInstallPromptFunc);
  }
  render() {
    return this.state.shouldShowBanner ? (
      <a onClick={this.installApp} className="button is-outlined is-small">
        <span className="icon">
          <i className="fas fa-mobile-alt" />
        </span>
        <span>Insall B.o.B App</span>
      </a>
    ) : null;
  }
}
