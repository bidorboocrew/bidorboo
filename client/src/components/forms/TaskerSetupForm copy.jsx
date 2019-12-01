// import React from 'react';
// import axios from 'axios';
// import ReactDOM from 'react-dom';

// import Dropzone from 'react-dropzone';
// import moment from 'moment';
// import { withFormik } from 'formik';
// import * as Yup from 'yup';

// import { TextInput } from './FormsHelpers';

// import * as ROUTES from '../../constants/frontend-route-consts';
// import { switchRoute, throwErrorNotification } from '../../utils';

// import { Spinner } from '../Spinner';
// const MAX_FILE_SIZE_IN_MB = 1000000 * 10; //10MB
// const NO_SELECTION = 'NO_SELECTION';
// const EnhancedForms = withFormik({
//   validationSchema: Yup.object().shape({
//     dob_day: Yup.number(),
//     dob_month: Yup.number(),
//     dob_year: Yup.number(),
//     first_name: Yup.string()
//       .ensure()
//       .trim(),
//     last_name: Yup.string()
//       .ensure()
//       .trim(),
//     address_street: Yup.string()
//       .ensure()
//       .trim(),
//     address_city: Yup.string()
//       .ensure()
//       .trim(),
//     address_province: Yup.string()
//       .ensure()
//       .trim(),
//     address_postalcode: Yup.string()
//       .ensure()
//       .trim(),
//   }),
//   mapPropsToValues: ({ userDetails }) => {
//     const { email } = userDetails;

//     return {
//       // phone_number: phone.phoneNumber,
//       email: email.emailAddress,
//     };
//   },
//   handleSubmit: async (values, { setSubmitting, props }) => {
//     try {
//       const { data } = await axios.get(ROUTES.API.PAYMENT.GET.accountLinkForSetupAndVerification);
//       if (data.success && data.accountLinkUrl) {
//         setTimeout(() => {
//           window.location = data.accountLinkUrl;
//         }, 0);
//       }
//       debugger;
//     } catch (e) {
//       let msg = 'failed To Create Account please email us at bidorboo@bidorboo.ca';
//       if (
//         e &&
//         e.response &&
//         e.response.data &&
//         e.response.data.errorMsg &&
//         e.response.data.errorMsg.message
//       ) {
//         msg = e.response.data.errorMsg.message;
//       }
//       alert(msg);
//       setSubmitting(false);
//       console.error(e);
//     }
//     setSubmitting(false);
//   },
//   displayName: 'PaymentSetupForm',
// });

// const PaymentSetupForm = (props) => {
//   const {
//     values,
//     touched,
//     errors,
//     handleChange,
//     handleBlur,
//     handleSubmit,
//     isValid,
//     setFieldValue,
//     isSubmitting,
//   } = props;

//   let errorsList = null;
//   if (errors && Object.keys(errors).length > 0) {
//     errorsList = Object.keys(errors).map((errorKey, index) => {
//       return (
//         touched[`${errorKey}`] && (
//           <p key={index} className="help has-text-danger is-danger">
//             {errors[`${errorKey}`]}
//           </p>
//         )
//       );
//     });
//   }
//   let provinceSelect = '';
//   let isTouched = touched && touched.address_province;
//   if (isTouched) {
//     provinceSelect = values.address_province === NO_SELECTION ? 'is-danger' : 'hasSelectedValue';
//   }

//   return (
//     <React.Fragment>
//       {isSubmitting &&
//         ReactDOM.createPortal(
//           <div
//             style={{
//               background: '#363636',
//               zIndex: 99,
//               padding: 50,
//               position: 'fixed',
//               height: '100vh',
//               top: '4rem',
//               right: 0,
//               width: '100%',
//             }}
//           >
//             <div className="container is-widescreen">
//               <Spinner
//                 renderLabel={'Setting up your Payout banking Account'}
//                 isLoading={true}
//                 size={'large'}
//                 isDark={false}
//               />
//             </div>
//           </div>,
//           document.querySelector('#bidorboo-root-view'),
//         )}
//       <form onSubmit={handleSubmit}>
//         <div
//           style={{ minHeight: 'unset', height: 'unset' }}
//           className="card cardWithButton nofixedwidth"
//         >
//           <div style={{ minHeight: 'unset', height: 'unset' }} className="card-content">
//             <HeaderTitle title="Tell us about yourself" />

//             <div>To become a BidOrBoo Tasker you must fill out this form accurately</div>
//             <div className="help">
//               * This is required by law for the safety and integrity reasons
//             </div>
//             <div className="help">
//               * Your data is kept private, encrypted and secured via
//               <a href="https://stripe.com/ca" target="_blank">
//                 {` Stripe `}
//               </a>
//             </div>
//             <br></br>
//             {errorsList}
//             <div>
//               <div style={{ borderBottom: '1px solid #353535' }} className="subtitle">
//                 BASIC INFO
//               </div>

//               <div style={{ maxWidth: 250 }}>
//                 <TextInput
//                   id="first_name"
//                   type="text"
//                   label="First Name"
//                   error={touched.first_name && errors.first_name}
//                   value={values.first_name || ''}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//               </div>

//               <div style={{ maxWidth: 250 }}>
//                 <TextInput
//                   id="initial_name"
//                   type="text"
//                   label="Middle Initial (optional)"
//                   error={touched.initial_name && errors.initial_name}
//                   value={values.initial_name || ''}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//               </div>
//               <div style={{ maxWidth: 250 }}>
//                 <TextInput
//                   id="last_name"
//                   type="text"
//                   label="Last Name"
//                   error={touched.last_name && errors.last_name}
//                   value={values.last_name || ''}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//               </div>
//               <label className={`label`}>Date of birth</label>
//               <div className="field is-grouped">
//                 <div style={{ marginRight: 10 }} className="group">
//                   <div className="control">
//                     <div
//                       className={`select ${touched.dob_day && errors.dob_day ? 'is-danger' : ''}`}
//                     >
//                       <select
//                         error={touched.dob_day && errors.dob_day}
//                         value={values.dob_day || ''}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         id="dob_day"
//                       >
//                         <option>Day</option>
//                         {(() => {
//                           const dayOptions = [];
//                           for (let i = 1; i <= 31; i++) {
//                             dayOptions.push(
//                               <option key={`day-${i}`} value={i}>
//                                 {i}
//                               </option>,
//                             );
//                           }
//                           return dayOptions;
//                         })()}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//                 <div style={{ marginRight: 10 }} className="group">
//                   <div className="control">
//                     <div
//                       className={`select ${
//                         touched.dob_month && errors.dob_month ? 'is-danger' : ''
//                       }`}
//                     >
//                       <select
//                         error={touched.dob_month && errors.dob_month}
//                         value={values.dob_month || ''}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         id="dob_month"
//                       >
//                         <option>Month</option>
//                         {(() => {
//                           return (
//                             <React.Fragment>
//                               <option value={1}>Jan</option>
//                               <option value={2}>Feb</option>
//                               <option value={3}>Mar</option>
//                               <option value={4}>Apr</option>
//                               <option value={5}>May</option>
//                               <option value={6}>Jun</option>
//                               <option value={7}>Jul</option>
//                               <option value={8}>Aug</option>
//                               <option value={9}>Sep</option>
//                               <option value={10}>Oct</option>
//                               <option value={11}>Nov</option>
//                               <option value={12}>Dec</option>
//                             </React.Fragment>
//                           );
//                         })()}
//                       </select>
//                     </div>
//                   </div>
//                 </div>

//                 <div style={{ marginRight: 10 }} className="group">
//                   <div className="control">
//                     <div
//                       className={`select ${touched.dob_year && errors.dob_year ? 'is-danger' : ''}`}
//                     >
//                       <select
//                         error={touched.dob_year && errors.dob_year}
//                         value={values.dob_year || ''}
//                         onChange={handleChange}
//                         onBlur={handleBlur}
//                         id="dob_year"
//                       >
//                         <option>Year</option>
//                         {(() => {
//                           const yearOptions = [];
//                           const maxIs15YearsAgo = moment().subtract(15, 'year');
//                           const minIs60YearsAgo = moment().subtract(70, 'year');

//                           for (let i = maxIs15YearsAgo.year(); i >= minIs60YearsAgo.year(); i--) {
//                             yearOptions.push(
//                               <option key={`year-${i}`} value={i}>
//                                 {i}
//                               </option>,
//                             );
//                           }
//                           return yearOptions;
//                         })()}
//                       </select>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="group" />
//               <div style={{ borderBottom: '1px solid #353535' }} className="subtitle">
//                 ADDRESS DETAILS
//               </div>

//               <div style={{ maxWidth: 250 }}>
//                 <TextInput
//                   labelClassName=" "
//                   id="address_street"
//                   type="text"
//                   label="Street Address"
//                   error={touched.address_street && errors.address_street}
//                   value={values.address_street || ''}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//               </div>
//               <div style={{ maxWidth: 250 }}>
//                 <TextInput
//                   labelClassName=" "
//                   id="address_city"
//                   type="text"
//                   label="City"
//                   error={touched.address_city && errors.address_city}
//                   value={values.address_city || ''}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//               </div>
//               <div style={{ maxWidth: 250 }}>
//                 <TextInput
//                   labelClassName=" "
//                   id="address_postalcode"
//                   type="text"
//                   label="Postal Code"
//                   error={touched.address_postalcode && errors.address_postalcode}
//                   value={values.address_postalcode || ''}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//               </div>

//               <div className="group">
//                 <label className={`label ${provinceSelect}`}>Select Province</label>
//                 <div className="control">
//                   <div className={`select ${provinceSelect}`}>
//                     <select
//                       error={touched.address_province && errors.address_province}
//                       value={values.address_province || ''}
//                       onChange={handleChange}
//                       onBlur={handleBlur}
//                       id="address_province"
//                     >
//                       <option>Province</option>
//                       {(() => {
//                         return [
//                           'AB',
//                           'BC',
//                           'MB',
//                           'NB',
//                           'NL',
//                           'NS',
//                           'NT',
//                           'NU',
//                           'ON',
//                           'PE',
//                           'QC',
//                           'SK',
//                           'YT',
//                         ].map((province) => (
//                           <option key={`province-${province}`} value={province}>
//                             {province}
//                           </option>
//                         ));
//                       })()}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//               <div className="group">
//                 <label className={`label hasSelectedValue`}>Country</label>
//                 <div className="control">Canada</div>
//                 <div className="help">*BidOrBoo is only available in Canada</div>
//               </div>

//               <div style={{ borderBottom: '1px solid #353535' }} className="subtitle">
//                 ID Verification
//               </div>
//               <label className="label">Provide a valid non expired government issued ID</label>
//               <div className="help">
//                 {`* Accepted IDs: Passport, government-issued ID, or driver's license. `}
//               </div>
//               <input id="idFrontImg" className="input is-invisible" type="hidden" />

//               <Dropzone
//                 className="file is-boxed idVerification"
//                 onDrop={(files) => {
//                   setFieldValue('idFrontImg', files[0], true);
//                 }}
//                 accept={'image/*'}
//                 onDropRejected={(e) => {
//                   alert('this file is not accepted must be an img file less than 10MB');
//                 }}
//                 maxSize={MAX_FILE_SIZE_IN_MB}
//               >
//                 <label className="file-label">
//                   <span className="file-cta">
//                     <span className="file-icon">
//                       <i className="fas fa-upload" />
//                     </span>
//                     <span className="file-label">ID Image (front side)</span>
//                   </span>
//                   <span style={{ maxWidth: 'none' }} className="file-name has-text-centered">
//                     {(values.idFrontImg && values.idFrontImg.name) || 'upload now'}
//                   </span>
//                 </label>
//               </Dropzone>
//               <br />
//               <input id="idBackImg" className="input is-invisible" type="hidden" />
//               <Dropzone
//                 maxSize={MAX_FILE_SIZE_IN_MB}
//                 className="file is-boxed idVerification"
//                 onDrop={(files) => {
//                   setFieldValue('idBackImg', files[0], true);
//                 }}
//                 accept={'image/*'}
//                 onDropRejected={(e) => {
//                   alert('this file is not accepted must be an img file less than 10MB');
//                 }}
//               >
//                 <label className="file-label">
//                   <span className="file-cta">
//                     <span className="file-icon">
//                       <i className="fas fa-upload" />
//                     </span>
//                     <span className="file-label">ID Image (back side)</span>
//                   </span>
//                   <span style={{ maxWidth: 'none' }} className="file-name has-text-centered">
//                     {(values.idBackImg && values.idBackImg.name) || 'upload now'}
//                   </span>
//                 </label>
//               </Dropzone>
//               <div className="help">{`* Must be .JPEG or .PNG les than 10MB`}</div>
//               <br />
//               <div className="group">
//                 <div className="control">
//                   <label className="checkbox">
//                     <input style={{ marginRight: 4 }} type="checkbox" />
//                     {`  I have read and agree to`}
//                     <a target="_blank" rel="noopener noreferrer" href={`${ROUTES.CLIENT.TOS}`}>
//                       {` BidOrBoo Service Agreement `}
//                     </a>
//                     and the
//                     <a
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       href="https://stripe.com/connect-account/legal"
//                     >
//                       {` Stripe Connected Account Agreement`}
//                     </a>
//                     .
//                   </label>
//                 </div>
//               </div>
//               <br />

//               <button
//                 style={{ marginRight: 6 }}
//                 className={`button is-success firstButtonInCard is-medium  ${
//                   isSubmitting ? 'is-loading' : ''
//                 }`}
//                 type="submit"
//               >
//                 Submit
//               </button>
//               {/* <div className="help">
//                 * Provide your info as it appears on your legal document such as your: Passport,
//                 government-issued ID, or driver's license
//               </div> */}
//               {errorsList}
//             </div>
//           </div>
//         </div>
//       </form>
//     </React.Fragment>
//   );
// };

// export default EnhancedForms(PaymentSetupForm);

// const HeaderTitle = (props) => {
//   const { title, specialMarginVal } = props;
//   return (
//     <h2
//       style={{
//         marginTop: specialMarginVal || 0,
//         marginBottom: 4,
//         fontSize: 20,
//         borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
//       }}
//     >
//       {title}
//       <br></br>
//       <span className="has-text-grey is-size-6">(Required)</span>
//     </h2>
//   );
// };
