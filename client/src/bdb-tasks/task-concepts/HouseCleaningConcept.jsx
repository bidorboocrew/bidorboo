import React from 'react';

import PropTypes from 'prop-types';
import * as ROUTES from '../../constants/frontend-route-consts';
import { switchRoute } from '../../utils';

export default class HouseCleaningConcept extends React.Component {

}

HouseCleaningConcept.propTypes = {
  isLoggedIn: PropTypes.bool,
  showLoginDialog: PropTypes.func,
};
