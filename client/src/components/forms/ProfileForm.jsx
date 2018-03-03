import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  normalizePhone,
  requiredField,
  alphanumericField,
  moreThan3LessThan15,
  renderFormTextField
} from './formHelpers';

const ProfileForm = props => {
  const { onCancel, handleSubmit, submitting, pristine } = props;

  return (
    <form onSubmit={handleSubmit}>
      <Field
        name="username"
        type="text"
        label="user name"
        placeholderText="enter your preferred name"
        component={renderFormTextField}
        validate={[requiredField, alphanumericField, moreThan3LessThan15]}
      />
      <Field
        name="phonenumber"
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

export default reduxForm({
  // a unique name for the form\
  form: 'ProfileForm'
})(ProfileForm);
