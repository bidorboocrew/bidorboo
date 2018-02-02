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
import './styles/app.css';
class App extends React.Component {
  componentDidCatch(error, info) {
    debugger;
    // Display fallback UI
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }
  render() {
    return (
      <div id="bidorboo-root-view">
        {/* we will make our notifications absolute positioned  */}
        <div id="bidorboo-notification" />
        {/* we will make progress absolutely positioned */}
        <div id="bidorboo-progress" />
        {/* for blocking Entire UI */}
        <div id="block-ui-overlay" />
        {/* for modal dialogs  */}
        <div id="modal-dialog" />

        <div id="app-flex-wrapper">

            <div id="side-nav" >

            <ul>
            <li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li>
            <li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li>
            <li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li>

            <li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li>
            <li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li><li>Coffee</li>
            <li>Tea</li>
            <li>Milk</li>
          </ul>
            </div>
            <div id="header-and-content">
              <Header id="bidorboo-header" />
              <div id="main-view">
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/proposer" component={ProposerContainer} />
                  <Route exact path="/bidder" component={BidderContainer} />
                </Switch>
              </div>
            </div>
          </div>
        </div>

    );
  }
}

export default App;
