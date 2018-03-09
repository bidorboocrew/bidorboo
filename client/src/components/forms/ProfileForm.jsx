import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  normalizePhone,
  requiredField,
  alphanumericField,
  moreThan3LessThan25Chars,
  renderFormTextField,
  renderAddressFormField,
  moreThan0lessThan250Chars,
  AddressField,
  renderFormParagraphField
} from './formHelpers';
import { connect } from 'react-redux';

class ProfileForm extends React.Component {
  render() {
    const { onCancel, handleSubmit, submitting, pristine, change } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="userNameField"
          type="text"
          label="user name"
          placeholderText="enter your preferred name"
          component={renderFormTextField}
          validate={[
            requiredField,
            alphanumericField,
            moreThan3LessThan25Chars
          ]}
          charsLimit={25}
        />
        <Field
          name="phoneNumberField"
          type="text"
          label="phone number"
          placeholderText="enter your phone number"
          helpText="example : 456-123-1234"
          component={renderFormTextField}
          validate={[requiredField, alphanumericField]}
          normalize={normalizePhone}
        />
        <Field
          name="addressField"
          type="text"
          label="address"
          change={change}
          placeholderText="Specify your address"
          component={renderAddressFormField}
          validate={[requiredField, AddressField]}
        />

        <Field
          name="selfDescriptionField"
          type="text"
          label="self description"
          placeholderText="sample: Hey I am handy with tools and can do everything... "
          component={renderFormParagraphField}
          validate={[alphanumericField, moreThan0lessThan250Chars]}
          charsLimit={250}
        />

        <div>
          <button
            disabled={pristine || submitting}
            className="button is-primary"
          >
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
  }
}

const mapStateToProps = ({ authReducer }) => {
  const {
    displayName,
    address,
    personalParagraph,
    creditCards,
    phoneNumber
  } = authReducer.userDetails;

  return {
    initialValues: {
      userNameField: displayName,
      phoneNumberField: phoneNumber,
      addressField: address,
      creditCardsString: creditCards,
      paragraphField: personalParagraph
    }
  };
};
let MyProfileReduxForm = reduxForm({
  // a unique name for the form\
  form: 'ProfileForm'
})(ProfileForm);
export default connect(mapStateToProps)(MyProfileReduxForm);
