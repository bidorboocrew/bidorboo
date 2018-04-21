// //https://reactdatepicker.com/
// import React from 'react';
// import PropTypes from 'prop-types';
// // import ImageUploader from 'react-image-upload';
// import autoBind from 'react-autobind';

// export default class ImageUploaderInput extends React.Component {
//   // static propTypes = {
//   //   onChangeEvent: PropTypes.func.isRequired,
//   //   onBlurEvent: PropTypes.func.isRequired,
//   //   id: PropTypes.string.isRequired,
//   //   placeholder: PropTypes.string,
//   // };
//   static defaultProps = {
//     placeholder: '',
//     value: ''
//   };
//   constructor(props) {
//     super(props);
//     this.state = { pictures: [] };
//     this.onDrop = this.onDrop.bind(this);
//     autoBind(this,'handleChange');
//   }

//   onDrop(picture) {
//     this.setState({
//       pictures: this.state.pictures.concat(picture)
//     });
//   }

//   handleChange(date) {
//     this.setState({
//       startDate: date
//     });
//     this.props.onChangeEvent(date);
//   }

//   render() {
//     return (
//       <div className="file">
//         <label className="file-label">
//           <input className="file-input" type="file" name="resume" />
//           <span className="file-cta">
//             <span className="file-icon">
//               <i className="fas fa-upload" />
//             </span>
//             <span className="file-label">Choose a file…</span>
//           </span>
//         </label>
//       </div>
//     );
//   }
// }
