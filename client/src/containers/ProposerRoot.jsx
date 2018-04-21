import React from 'react';
import BidOrBooGenericTasks from '../components/BidOrBooGenericTasks';

import { switchRoute } from '../app-state/actions/routerActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ProposerRoot extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    const { a_switchRoute } = this.props;
    return (
      <div className="fade-in" id="bdb-proposer-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: '#e98969' }} className="hero-body">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Post Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Get the work done for the best price possible.
              </h2>
            </div>
          </div>
        </section>
        <section className="section mainSectionContainer">
          <div className="container">
            <div className="columns is-multiline">
              <BidOrBooGenericTasks switchRoute={a_switchRoute} />
            </div>
          </div>
        </section>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    a_switchRoute: bindActionCreators(switchRoute, dispatch)
  };
};

export default connect(null, mapDispatchToProps)(ProposerRoot);
