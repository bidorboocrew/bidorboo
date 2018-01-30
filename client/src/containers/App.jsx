import React from 'react';
import PropTypes from 'prop-types';
import {
  Header,
  ContentContainer,
  Footer,
  Home,
  ProposerContainer,
  BidderContainer
} from './index';
import { Route, Switch } from 'react-router-dom';

class App extends React.Component {
  componentDidCatch(error, info) {
    debugger;
    // Display fallback UI
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);

  }
  render() {
    return (
      <div id="bob-root-view">
        <Header id="bidorboo-header" />
        <div id="bidorboo-notification" />
        <div id="bidorboo-route-view">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/proposer" component={ProposerContainer} />
            <Route exact path="/bidder" component={BidderContainer} />
          </Switch>
        </div>
        <div id="bidorboo-progress" />
        <Footer />
      </div>
    );
  }
}

export default App;
