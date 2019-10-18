/**
 *
 * https://github.com/intljusticemission/react-big-calendar/blob/master/src/Calendar.js#L628
 */

import React from 'react';
import ReactDOM from 'react-dom';

import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  ViberShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon,
  ViberIcon,
} from 'react-share';
export default class ShareButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showShareModal: false };

    this.rootModal = null;
  }
  toggleShareModal = () => {
    this.rootModal = document.querySelector('#bidorboo-root-modals');
    this.setState({ showShareModal: !this.state.showShareModal });
  };
  copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('link copied to clipboard');
  };
  render() {
    const { showShareModal } = this.state;
    const shareUrl = window.location.href;

    return (
      <>
        {showShareModal &&
          this.rootModal &&
          ReactDOM.createPortal(
            <div className="modal is-active">
              <div onClick={this.toggleShareModal} className="modal-background"></div>
              <div className="modal-content">
                <div className="modal-card">
                  <div className="modal-card-body">
                    <p className="control">Share this page Via</p>

                    <button
                      onClick={this.copyToClipboard}
                      style={{ width: 48, height: 48, display: 'inline-block', margin: 8 }}
                      className="button"
                    >
                      <span className="icon">
                        <i className="far fa-copy"></i>
                      </span>
                    </button>

                    <div style={{ display: 'inline-block', margin: 8 }}>
                      <EmailShareButton className="socialShare" url={shareUrl} subject={'BIDORBOO'}>
                        <EmailIcon size={48} round />
                      </EmailShareButton>
                    </div>
                    <div style={{ display: 'inline-block', margin: 8 }}>
                      <FacebookShareButton
                        className="socialShare"
                        url={shareUrl}
                        quote={'BIDORBOO'}
                      >
                        <FacebookIcon size={48} round />
                      </FacebookShareButton>
                    </div>
                    <div style={{ display: 'inline-block', margin: 8 }}>
                      <TwitterShareButton className="socialShare" url={shareUrl} title={'BIDORBOO'}>
                        <TwitterIcon size={48} round />
                      </TwitterShareButton>
                    </div>
                    <div style={{ display: 'inline-block', margin: 8 }}>
                      <WhatsappShareButton
                        className="socialShare"
                        url={shareUrl}
                        title={'BIDORBOO'}
                        separator=":: "
                      >
                        <WhatsappIcon size={48} round />
                      </WhatsappShareButton>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={this.toggleShareModal}
                className="modal-close is-large"
                aria-label="close"
              ></button>
            </div>,
            this.rootModal,
          )}
        <button onClick={this.toggleShareModal} className="button is-round">
          <span className="icon">
            <i className="fas fa-share-alt"></i>
          </span>
        </button>
      </>
    );
  }
}
