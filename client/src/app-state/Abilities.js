// Can.js
import { createCanBoundTo } from '@casl/react';
import { Ability, AbilityBuilder } from '@casl/ability';

const ACTIONS = {
  view: 'view',
};
const SUBJECTS = {
  loginButton: 'loginButton',
  profilePage: 'profilePage',
};

const abilityBuilder = () => {
  const { rules, can, cannot } = AbilityBuilder.extract();

  return new Ability(rules);
};

const CURRENT_USER_ABILITIES = abilityBuilder();

const applyLoggedOutUserAbilities = [{ actions: ACTIONS.view, subject: SUBJECTS.loginButton }];

export const ABILITIES_ENUM = {
  loggedOut: 'loggedOut',
  bidder: 'bidder',
  proposer: 'proposer',
};
const UPDATE_ABILITIES = {
  // clear rules then apply logged out user rules
  loggedOut: () => {
    CURRENT_USER_ABILITIES.update([]).update(applyLoggedOutUserAbilities);
  },
};

export const updateUserAbilities = (desiredPermissionEnum) =>
  UPDATE_ABILITIES[`${desiredPermissionEnum}`]();

export default createCanBoundTo(CURRENT_USER_ABILITIES);
