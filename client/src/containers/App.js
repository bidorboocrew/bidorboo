import React, { Component } from "react";
import logo from "../assets/logo.svg";
import "./App.scss";
import AppBar from "react-toolbox/lib/app_bar/AppBar";
import Navigation from "react-toolbox/lib/navigation/Navigation";
import Link from "react-toolbox/lib/link/Link";

const GithubIcon = () => <img alt="logo" src={logo}/>;

class App extends Component {
  render() {
    return (
      <AppBar title="BidOrBoo" leftIcon="menu" rightIcon={<GithubIcon />}>
        <Navigation type="horizontal">
          <Link href="http://" label="Inbox" icon="inbox" />
          <Link href="http://" active label="Profile" icon="person" />
        </Navigation>
      </AppBar>
    );
  }
}

export default App;
