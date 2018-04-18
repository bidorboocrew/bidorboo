// import React from 'react';
// // import { Field, reduxForm } from 'redux-form';
// import {

//   requiredField,
//   renderAddressFormField,
//   moreThan0lessThan250Chars,

//   renderFormParagraphField
// } from './formHelpers';
// import { connect } from 'react-redux';
import { createGeoInput, DefaultGeoInput } from 'react-geoinput';

const GeoInput = createGeoInput(DefaultGeoInput);

// const GeoField = fields => {
//   return (
//   <GeoInput
//     addressInput={fields.input}
//     geoDestinationInput={fields.input}
//   />
// )};
// class NewJobForm extends React.Component {

//   render() {
//     const {
//       invalid,
//       onCancel,
//       handleSubmit,
//       submitting,
//       pristine,
//       submitSucceeded,
//       imageUrl,
//       title
//     } = this.props;

//     if (submitSucceeded) {
//       // onCancel();
//     }

//     return (
//       <React.Fragment>
//         <div className="card-image">
//           <figure style={{ padding: 5 }} className="image is-3by4">
//             <img src={imageUrl} alt={title} />
//           </figure>
//         </div>
//         <h1 className="bdb-section-title title">{title}</h1>
//         <form onSubmit={handleSubmit}>

//           <Field
//           name="addressField"
//           type="text"
//           label="Address"
//           placeholderText="Enter Your Address..."
//           component={GeoField}
//           formName='NewJobForm'
//           validate={[requiredField]}
//         />
//           <Field
//             name="personalParagraph"
//             type="text"
//             label="Detailed Description"
//             placeholderText="Sample: Hey I am handy with tools and can do everything... "
//             component={renderFormParagraphField}
//             validate={[moreThan0lessThan250Chars]}
//             charsLimit={500}
//           />
//           <div>
//             <button
//               disabled={invalid || submitting || pristine}
//               className="button is-primary"
//             >
//               Save Changes
//             </button>

//             <button
//               disabled={submitting}
//               style={{ marginLeft: 6 }}
//               onClick={() => {
//                 onCancel();
//               }}
//               className="button"
//             >
//               Cancel
//             </button>
//           </div>
//           <div />
//         </form>
//       </React.Fragment>
//     );
//   }
// }

// let CreateNewJobReduxForm = reduxForm({
//   // a unique name for the form\
//   form: 'NewJobForm'
// })(NewJobForm);
// export default connect(null)(CreateNewJobReduxForm);
