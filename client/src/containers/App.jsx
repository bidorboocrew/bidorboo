import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route, Switch } from 'react-router-dom';

import {
  Header,
  ContentContainer,
  Home,
  ProposerContainer,
  BidderContainer
} from './index';
import { SideBar, Overlay } from '../components';

import './styles/app.css';

class App extends React.Component {
  componentDidCatch(error, info) {
    // Display fallback UI
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
    console.log("bdb error details " + error)
    console.log('bdbfailure info ' + info)
  }
  render() {
    const { isSideNavOpen } = this.props;


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
          {isSideNavOpen && <SideBar ></SideBar>}
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
const mapStateToProps = ({ uiReducer }) => {
  return {
    isSideNavOpen: uiReducer.isSideNavOpen
  };
};
// const mapDispatchToProps = dispatch => {
//   return {
//     onToggleSideNav: bindActionCreators(a_toggleSideNav, dispatch)
//   };
// };
export default connect(mapStateToProps, null)(App);
