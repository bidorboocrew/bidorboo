import React from 'react';
import PropTypes from 'prop-types';
import { Header,
  ContentContainer,
Footer } from './index';

class App extends React.Component {
  render() {
    return (
      <div id="bob-root-view">
        <Header id="bidorboo-header" />
        <div id="bidorboo-notification" />
        <ContentContainer />
        <div id="bidorboo-progress" />
        <Footer />
      </div>
    );
  }
}

export default App;
