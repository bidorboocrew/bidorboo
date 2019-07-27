import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { showSpecialMoment } from '../app-state/actions/uiActions';

class ShowSpecialMomentModal extends React.Component {
  clearOutThisMoment = () => {
    this.props.showSpecialMoment(null);
  };
  render() {
    const { s_specialMomentContent } = this.props;
    let boundSpecialMoment = null;
    if (s_specialMomentContent) {
      boundSpecialMoment = s_specialMomentContent.bind(this);
    }
    return boundSpecialMoment
      ? ReactDOM.createPortal(
          <div className="modal is-active">
            <div onClick={this.clearOutThisMoment} className="modal-background" />
            <div className="modal-content has-text-centered">
              {boundSpecialMoment(this.clearOutThisMoment)}
            </div>
          </div>,
          document.querySelector('#bidorboo-root-modals'),
        )
      : null;
  }
}
const mapStateToProps = ({ uiReducer }) => {
  return {
    s_specialMomentContent: uiReducer.specialMomentContent,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    showSpecialMoment: bindActionCreators(showSpecialMoment, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShowSpecialMomentModal);
