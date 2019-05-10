import React from 'react';
import ReactDOM from 'react-dom';
import TextareaAutosize from 'react-autosize-textarea';

import {
  DisplayLabelValue,
  CountDownComponent,
  StartDateAndTime,
} from '../../containers/commonComponents';

import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

export default class HouseCleaningRequestSummary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleteDialog: false,
      showMoreOptionsContextMenu: false,
      showMore: false,
    };
  }

  toggleShowMore = () => {
    this.setState({ showMore: !this.state.showMore });
  };

  toggleDeleteConfirmationDialog = () => {
    this.setState({ showDeleteDialog: !this.state.showDeleteDialog });
  };

  toggleShowMoreOptionsContextMenu = () => {
    this.setState({ showMoreOptionsContextMenu: !this.state.showMoreOptionsContextMenu }, () => {
      if (this.state.showMoreOptionsContextMenu) {
        document.addEventListener('mousedown', this.handleClick, false);
      } else {
        document.removeEventListener('mousedown', this.handleClick, false);
      }
    });
  };

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }

  handleClick = (e) => {
    if (this.node && e.target && this.node.contains(e.target)) {
      return;
    } else {
      this.toggleShowMoreOptionsContextMenu();
    }
  };
  render() {
    const { job, deleteJob } = this.props;

    const { startingDateAndTime, addressText, extras, detailedDescription } = job;

    const { showDeleteDialog, showMoreOptionsContextMenu, showMore } = this.state;
    const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;

    const effortLevel =
      extras && extras.effort ? (
        <DisplayLabelValue labelText="Effort" labelValue={extras.effort} />
      ) : (
        <DisplayLabelValue labelText="Effort" labelValue={'not specified'} />
      );

    return (
      <React.Fragment>
        {showDeleteDialog &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleDeleteConfirmationDialog} className="modal-background" />
              <div className="modal-card">
                <section className="modal-card-body">
                  <p className="title">Cancel your {TITLE} Request</p>
                  <br />
                  <div className="content">
                    When you cancel a request we will delete it and all associated bids within 24
                    hours.
                    <br /> You can always post a new request at any time
                  </div>
                  <div className="help">*This action will NOT affect your ratings.</div>
                </section>
                <footer style={{ borderTop: 0, paddingTop: 0 }} className="modal-card-foot">
                  <button
                    style={{ width: 160 }}
                    onClick={this.toggleDeleteConfirmationDialog}
                    className="button is-outline"
                  >
                    <span>Go Back</span>
                  </button>
                  <button
                    style={{ width: 160 }}
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      deleteJob(job._id);
                    }}
                    className="button is-danger"
                  >
                    <span className="icon">
                      <i className="far fa-trash-alt" />
                    </span>
                    <span>Cancel Request</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <div style={{ height: 'unset' }} className="card">
          <div className="card-image">
            <img className="bdb-cover-img" src={IMG_URL} />
          </div>
          <div className="card-content">
            <div className="content">
              <div style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1 }} className="is-size-4 has-text-weight-bold">
                  {TITLE}
                </div>

                <div
                  className={`dropdown is-right ${showMoreOptionsContextMenu ? 'is-active' : ''}`}
                >
                  <div className="dropdown-trigger">
                    <button
                      onClick={this.toggleShowMoreOptionsContextMenu}
                      className="button"
                      aria-haspopup="true"
                      aria-controls="dropdown-menu"
                    >
                      <div style={{ padding: 6 }} className="icon">
                        <i className="fas fa-ellipsis-v" />
                      </div>
                    </button>
                  </div>
                  <div
                    ref={(node) => (this.node = node)}
                    className="dropdown-menu"
                    id="dropdown-menu"
                    role="menu"
                  >
                    <div className="dropdown-content">
                      <a
                        onClick={() => {
                          this.toggleDeleteConfirmationDialog();
                        }}
                        href="#"
                        className="dropdown-item"
                      >
                        <span style={{ color: 'grey' }} className="icon">
                          <i className="far fa-trash-alt" aria-hidden="true" />
                        </span>
                        <span>Cancel Request</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: ' whitesmoke',
                  border: 'none',
                  display: 'block',
                  height: 2,
                  margin: '0.5rem 0',
                }}
                className="navbar-divider"
              />
              <StartDateAndTime date={startingDateAndTime} />
              <CountDownComponent startingDate={startingDateAndTime} isJobStart={false} />

              <DisplayLabelValue labelText="Address" labelValue={addressText} />
              {showMore && (
                <div style={{ margin: '0.5rem 0' }}>
                  {effortLevel}

                  <label className="label">Detailed Description</label>
                  <span className="is-size-7">
                    <TextareaAutosize
                      value={detailedDescription}
                      className="textarea is-marginless is-paddingless is-size-6"
                      style={{
                        resize: 'none',
                        border: 'none',
                        color: '#4a4a4a',
                        fontSize: '1rem',
                      }}
                      readOnly
                    />
                  </span>
                </div>
              )}
            </div>
          </div>
          <div style={{ padding: '0.5rem' }}>
            {!showMore && (
              <a onClick={this.toggleShowMore} className="button is-small is-outlined">
                <span style={{ marginRight: 4 }}>show full details</span>
                <span className="icon">
                  <i className="fas fa-angle-double-down" />
                </span>
              </a>
            )}
            {showMore && (
              <a onClick={this.toggleShowMore} className="button is-small is-outlined">
                <span style={{ marginRight: 4 }}>show less details</span>
                <span className="icon">
                  <i className="fas fa-angle-double-up" />
                </span>
              </a>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

// import React from 'react';
// import TextareaAutosize from 'react-autosize-textarea';

// import {
//   DisplayLabelValue,
//   CountDownComponent,
//   UserImageAndRating,
//   StartDateAndTime,
//   JobTitleText,
// } from '../../containers/commonComponents';
// import { HOUSE_CLEANING_DEF } from './houseCleaningDefinition';

// export default class HouseCleaningRequestDetails extends React.Component {
//   render() {
//     const { job } = this.props;
//     const { startingDateAndTime, _ownerRef, detailedDescription, addressText, extras } = job;
//     const { TITLE, IMG_URL } = HOUSE_CLEANING_DEF;

//     const effortLevel =
//       extras && extras.effort ? (
//         <DisplayLabelValue labelText="Effort" labelValue={extras.effort} />
//       ) : (
//         <DisplayLabelValue labelText="Effort" labelValue={'not specified'} />
//       );
//     return (
//       <div style={{ height: 'auto' }} className="card is-clipped disabled">
//         <div className="card-image is-clipped">
//           <img className="bdb-cover-img" src={`${IMG_URL}`} />
//         </div>
//         <div className="card-content">
//           <div className="content">
//             <JobTitleText title={`${TITLE} Request`} />
//             <label className="label">Requester</label>
//             <UserImageAndRating userDetails={_ownerRef} />
//             <div className="content">
//               <StartDateAndTime date={startingDateAndTime} />
//               <DisplayLabelValue labelText="Address" labelValue={addressText} />
//               {effortLevel}
//               <label className="label">Detailed Description</label>
//               <span className="is-size-7">
//                 <TextareaAutosize
//                   value={detailedDescription}
//                   className="textarea is-marginless is-paddingless is-size-6"
//                   style={{
//                     resize: 'none',
//                     border: 'none',
//                     color: '#4a4a4a',
//                     fontSize: '1rem',
//                   }}
//                   readOnly
//                 />
//               </span>
//             </div>
//           </div>
//         </div>
//         <CountDownComponent startingDate={startingDateAndTime} />
//       </div>
//     );
//   }
// }
