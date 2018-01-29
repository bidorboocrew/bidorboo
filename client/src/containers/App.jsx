import React from 'react';
import PropTypes from 'prop-types';
import { Header, ContentContainer, Footer, Home,ProposerContainer, BidderContainer } from './index';
import { BrowserRouter, Route } from 'react-router-dom';

class App extends React.Component {
  render() {
    return (
      <div id="bob-root-view">
        <Header id="bidorboo-header" />
        <div id="bidorboo-notification" />
        <BrowserRouter>
        <div id="bidorboo-route-view">
          <Route exact path="/" component={Home} />
          <Route exact path="/proposer" component={ProposerContainer} />
          <Route exact path="/bidder" component={BidderContainer} />
        </div>
        </BrowserRouter>
        <div id="bidorboo-progress" />
        <Footer />
      </div>
    );
  }
}

export default App;
