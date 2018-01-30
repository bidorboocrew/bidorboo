import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { SideBar, Overlay } from '../components';
import { action_toggleSideBar } from '../app-state/actions/sidebarAction';

class ProposerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      willUnmount: false
    };
  }

  componentWillUnmount() {
    this.setState({ willUnmount: true });
  }
  render() {
    const { isSideBarOpen, onSideBarToggle } = this.props;
    let rootClasses = classnames('animated contentWrapper', {
      bounceOutRight: this.state.willUnmount,
      bounceInLeft: !this.state.willUnmount
    });
    return (
      <div id="bob-proposer-content" className={rootClasses}>
        {/* <div >click me</div> */}
        <SideBar isSideBarOpen />
        {/* {isSideBarOpen && (
          <Overlay clickHandler={onSideBarToggle} />
        )} */}
      </div>
    );
  }
}

const mapStateToProps = ({ sideBarReducer }) => {
  return {
    isSideBarOpen: sideBarReducer.isSideBarOpen
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onSideBarToggle: bindActionCreators(action_toggleSideBar, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposerContainer);
