/**
/**
 * TODO SAID
 * handle validation using YUP and otherways
 * handle blur on address change
 * make the address optional
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';

// for reverse geocoding , get address from lat lng
// https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
// https://stackoverflow.com/questions/6478914/reverse-geocoding-code

export default class JobsLocationFilterDate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
    };
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };
  render() {
    const { showModal } = this.state;

    return (
      <React.Fragment>
        {showModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleModal} className="modal-background" />
              <div className="modal-card">
                <header className="modal-card-head">
                  <div className="modal-card-title">Searcg By Address</div>
                  <button onClick={this.toggleModal} className="delete" aria-label="close" />
                </header>
                <section className="modal-card-body">
                  <div className="content">Body</div>
                </section>
                <footer className="modal-card-foot">
                  <button onClick={this.toggleModal} className="button is-success">
                    <span>Submit Search</span>
                  </button>
                  <button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();

                      this.toggleModal();
                    }}
                    className="button"
                  >

                    <span>Cancel</span>
                  </button>
                </footer>
              </div>
            </div>,
            document.querySelector('#bidorboo-root-modals'),
          )}
        <a onClick={this.toggleModal} className="button is-rounded is-link">
          Choose Date Range
        </a>
      </React.Fragment>
    );
  }
}
