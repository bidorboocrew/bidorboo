import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  normalizePhone,
  requiredField,
  alphanumericField,
  moreThan3LessThan15,
  renderFormTextField
} from './formHelpers';
import { connect } from 'react-redux';

import * as C from '../../constants/constants';

const ProfileForm = props => {
  const { onCancel, handleSubmit, submitting, pristine } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="userNameField"
        type="text"
        label="user name"
        placeholderText="enter your preferred name"
        component={renderFormTextField}
        validate={[requiredField, alphanumericField, moreThan3LessThan15]}
      />
      <Field
        name="phoneNumberField"
        type="text"
        label="phonenumber"
        placeholderText="enter your phone number"
        helpText="example : 456-123-1234"
        component={renderFormTextField}
        validate={[requiredField, alphanumericField]}
        normalize={normalizePhone}
      />
       <Field
        name="addressField"
        type="text"
        label="phonenumber"
        placeholderText="enter your phone number"
        helpText="example : 456-123-1234"
        component={renderFormTextField}
        validate={[requiredField, alphanumericField]}
        normalize={normalizePhone}
      />

      <div>
        <button disabled={pristine || submitting} className="button is-primary">
          Save Changes
        </button>

        <button
          style={{ marginLeft: 6 }}
          onClick={() => {
            onCancel();
          }}
          className="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const mapStateToProps = ({ authReducer }) => {
  const {
    profileImgUrl,
    displayName,
    email,
    address,
    personalParagraph,
    creditCards,
    membershipStatus,
    phoneNumber
  } = authReducer.userDetails;

  const creditCardsString =
    creditCards && creditCards.length > 0
      ? `${creditCards}`
      : 'edit your profile to add';
  const membershipStatusDisplay =
    C.USER_MEMBERSHIP_TO_DISPLAY[membershipStatus];

  return {
    initialValues: {
      userNameField: displayName,
      phoneNumberField: phoneNumber
    }
  };
};
const MyReduxForm = reduxForm({
  // a unique name for the form\
  form: 'ProfileForm'
})(ProfileForm);

export default connect(mapStateToProps)(MyReduxForm);
