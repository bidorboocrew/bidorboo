import React from 'react';
import { Field, reduxForm } from 'redux-form';
import {
  enforceNumericField,
  requiredField,
  alphanumericField,
  moreThan3LessThan25Chars,
  renderFormTextField,
  // renderAddressFormField,
  moreThan0lessThan250Chars,
  // AddressField,
  renderFormParagraphField
} from './formHelpers';
import { connect } from 'react-redux';
class NewJobForm extends React.Component {
  render() {
    const {
      invalid,
      onCancel,
      handleSubmit,
      submitting,
      pristine,
      submitSucceeded
    } = this.props;

    if (submitSucceeded) {
      // onCancel();
    }
    return (
      <form onSubmit={handleSubmit}>
        <Field
          name="displayName"
          type="text"
          label="User Name"
          placeholderText="Enter your name..."
          component={renderFormTextField}
          validate={[
            requiredField,
            alphanumericField,
            moreThan3LessThan25Chars
          ]}
          charsLimit={25}
        />
        <Field
          name="phoneNumber"
          type="text"
          label="Phone Number"
          placeholderText="Enter Your Phone Number"
          helpText="example : 0016503334444"
          component={renderFormTextField}
          normalize={enforceNumericField}
        />
        {/* <Field
          name="addressField"
          type="text"
          label="Address"
          change={change}
          placeholderText="Enter Your Address..."
          component={renderAddressFormField}
          validate={[requiredField, AddressField]}
        /> */}
        <Field
          name="personalParagraph"
          type="text"
          label="About Me"
          placeholderText="Sample: Hey I am handy with tools and can do everything... "
          component={renderFormParagraphField}
          validate={[moreThan0lessThan250Chars]}
          charsLimit={250}
        />
        <div>
          <button
            disabled={invalid || submitting || pristine}
            className="button is-primary"
          >
            Save Changes
          </button>

          <button
            disabled={submitting}
            style={{ marginLeft: 6 }}
            onClick={() => {
              onCancel();
            }}
            className="button"
          >
            Cancel
          </button>
        </div>
        <div />
      </form>
    );
  }
}

const mapStateToProps = ({ authReducer }) => {
  const {
    displayName,
    personalParagraph,
    phoneNumber
  } = authReducer.userDetails;

  return {
    initialValues: {
      displayName: displayName,
      phoneNumber: phoneNumber,
      personalParagraph: personalParagraph
    }
  };
};
let CreateNewJobReduxForm = reduxForm({
  // a unique name for the form\
  form: 'NewJobForm'
})(NewJobForm);
export default connect(mapStateToProps)(CreateNewJobReduxForm);
