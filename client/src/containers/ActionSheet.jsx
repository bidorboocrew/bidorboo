import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ActionSheet extends React.Component {


  render() {
    return (
      <div className="notification bdb-ActionSheet slide-in-bottom" id="bdb-action-sheet">
        hello
      </div>
    );
  }
}


export default connect(
  null,
  null
)(ActionSheet);
