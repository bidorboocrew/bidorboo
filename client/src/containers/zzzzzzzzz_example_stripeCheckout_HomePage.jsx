import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import BidOrBooCard from '../components/BidOrBooCard';
import bidsImg from '../assets/images/bids.png';
import requestImg from '../assets/images/jobs.png';
import PaymentHandling from './PaymentHandling';
export default class HomePage extends React.Component {
  render() {
    return (
      <div id="bdb-home-content" className="bdbPage">
        <section className="section">
          <PaymentHandling />
        </section>
      </div>
    );
  }
}
