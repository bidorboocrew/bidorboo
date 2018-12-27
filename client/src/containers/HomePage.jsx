import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';

import { showLoginDialog } from '../app-state/actions/uiActions';
import ServiceTemplates from './proposer-flow/components/ServiceTemplates';

import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';

class HomePage extends React.Component {
  render() {
    const { a_showLoginDialog, isLoggedIn } = this.props;

    return (
      <div>
        <section className="hero has-text-centered is-small is-dark">
          <div className="hero-body">
            <div className="container">
              <h1 className="title is-size-1">BidOrBoo</h1>
              <h2 className="is-size-6">
                Get the services you need for the price you want. Earn money doing what you love.
              </h2>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="columns is-multiline is-centered">
              <div className="column is-half">
                <BidOrBooCard
                  logoImg={requestImg}
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.PROPOSER.root);
                  }}
                  cardContent={'Request a Service'}
                />
              </div>
              <div className="column is-half">
                <BidOrBooCard
                  logoImg={bidsImg}
                  onClickHandler={() => {
                    switchRoute(ROUTES.CLIENT.BIDDER.root);
                  }}
                  cardContent={'Provide a Service'}
                />
              </div>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="container">
            <div class="tabs is-mobile is-centered">
              <ul>
                <li>
                  <a>Task Templates</a>
                </li>
              </ul>
            </div>

            <ServiceTemplates showLoginDialog={a_showLoginDialog} isLoggedIn={isLoggedIn} />
          </div>
        </section>
      </div>
    );
  }
}

const BidOrBooCard = (props) => {
  const { cardContent, onClickHandler, logoImg } = props;
  return (
    <div onClick={onClickHandler} className="card">
      <div className="card-image is-clipped">
        <img className="bdb-homepage-img" src={`${logoImg}`} />
      </div>
      <div className="card-content">
        <div className="content">
          <p className="title  is-fullwidth has-text-dark has-text-centered">{cardContent}</p>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = ({ userReducer }) => {
  return {
    isLoggedIn: userReducer.isLoggedIn,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    a_showLoginDialog: bindActionCreators(showLoginDialog, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
