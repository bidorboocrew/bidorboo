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
  }
  toggleShareModal = () => {
    this.setState({ showShareModal: !this.state.showShareModal });
  };
  copyToClipboard = () => {
    const el = document.createElement('textarea');
    el.value = this.getSharingLink();
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('link copied to clipboard');
    this.toggleShareModal();
  };

  getSharingLink = () => {
    const { shareUrl } = this.props;

    const pathname = shareUrl ? shareUrl : window.location.pathname;

    return `https://www.bidorboo.ca${pathname}`;
  };
  render() {
    const { showShareModal } = this.state;

    const urlForSharing = this.getSharingLink();

    return (
      <>
        {showShareModal &&
          ReactDOM.createPortal(
            <div className="modal is-active has-text-centered">
              <div onClick={this.toggleShareModal} className="modal-background"></div>
              <div className="modal-content">
                <div className="">
                  <div className="modal-card-body">
                    <p className="control has-text-centered has-text-weight-semibold">
                      Share this page Via
                    </p>

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
                      <EmailShareButton
                        className="socialShare"
                        url={urlForSharing}
                        subject={'BidOrBoo'}
                      >
                        <EmailIcon size={48} round />
                      </EmailShareButton>
                    </div>
                    <div style={{ display: 'inline-block', margin: 8 }}>
                      <FacebookShareButton
                        className="socialShare"
                        url={urlForSharing}
                        quote={'BidOrBoo'}
                      >
                        <FacebookIcon size={48} round />
                      </FacebookShareButton>
                    </div>
                    <div style={{ display: 'inline-block', margin: 8 }}>
                      <WhatsappShareButton
                        className="socialShare"
                        url={urlForSharing}
                        title={'BidOrBoo'}
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
            document.querySelector('body'),
          )}
        <button
          // style={{
          //   position: 'fixed',
          //   bottom: '2rem',
          //   zIndex: 999,
          //   left: 10,
          //   cursor: 'pointer',
          // }}
          onClick={this.toggleShareModal}
          className="button is-danger"
        >
          <span className="icon">
            <i className="fas fa-share-alt"></i>
          </span>
          <span>Share</span>
        </button>
      </>
    );
  }
}
