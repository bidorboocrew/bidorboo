import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';

import { SideBar, Overlay } from '../components';
import  {A_toggleSideBar}  from '../redux-state/actions/sidebarAction';

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
    const {sidebarState, onSideBarToggle } = this.props;
    debugger;

    let rootClasses = classnames('animated contentWrapper', {
      bounceOutRight: this.state.willUnmount,
      bounceInLeft: !this.state.willUnmount
    });
    return (
      <div id="bob-proposer-content" className={rootClasses}>
      <div  onClick={()=> onSideBarToggle(sidebarState) }>click me</div>
        <SideBar />
        <Overlay />
      </div>
    );
  }
}

const mapStateToProps = ({sideBarReducer}) => {
  return {
    sidebarState : sideBarReducer.isSideBarOpen
  }
};
const mapDispatchToProps = dispatch => {
  return {
    onSideBarToggle: bindActionCreators(A_toggleSideBar, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProposerContainer);
