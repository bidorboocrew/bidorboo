import React from 'react';
import PropTypes from 'prop-types';
import ShowMoreText from 'react-show-more-text';

import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';
import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

import HouseCleaningJobForm from './HouseCleaningJobForm';
export default class HouseCleaningCreateJob extends React.Component {
  goBack = (e) => {
    e.preventDefault();
    switchRoute(ROUTES.CLIENT.PROPOSER.root);
  };

  postJob = (values) => {
    const { addJob } = this.props;
    addJob({ initialDetails: { ...values } });
  };

  render() {
    const { isLoggedIn, showLoginDialog, currentUserDetails } = this.props;
    const { ID, TITLE, DESCRIPTION, SUGGESTION_TEXT } = HOUSE_CLEANING_DEF;

    return (
      <div style={{ maxWidth: 'unset' }} className="card">
        <section style={{ borderBottom: '1px solid #eee' }} className="hero is-small is-white">
          <div className="hero-body">
            <div className="title has-text-dark">{TITLE} Request</div>
            <ShowMoreText className="has-text-grey" lines={2} more="Show more" less="Show less">
              {DESCRIPTION}
            </ShowMoreText>
          </div>
        </section>

        <div className="card-content">
          <HouseCleaningJobForm
            isLoggedIn={isLoggedIn}
            showLoginDialog={showLoginDialog}
            currentUserDetails={currentUserDetails}
            fromTemplateIdField={ID}
            jobTitleField={TITLE}
            suggestedDetailsText={SUGGESTION_TEXT}
            onGoBack={this.goBack}
            onSubmit={this.postJob}
          />
        </div>
      </div>
    );
  }
}

HouseCleaningCreateJob.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  showLoginDialog: PropTypes.func.isRequired,
  currentUserDetails: PropTypes.object,
};
