import React from 'react';

import PropTypes from 'prop-types';

export default class BidOrBooCard extends React.Component {
  static propTypes = {
    cardContent: PropTypes.node.isRequired,
    onClickHandler: PropTypes.func,
    backgroundImage: PropTypes.string,
    themeColor: PropTypes.string,
    contentTextColor: PropTypes.string,
    contentBackgroundColor: PropTypes.string,
  };

  static defaultProps = {
    themeColor: 'black',
    backgroundImage: '',
    contentTextColor: 'white',
    contentBackgroundColor: 'rgba(0,0,0,0.7)',
    onClickHandler: () => null,
  };

  render() {
    const {
      cardContent,
      onClickHandler,
      contentBackgroundColor,
      contentTextColor,
      backgroundImage,
    } = this.props;
    return (
      <div
        style={{
          padding: '1rem',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          background: `url(${backgroundImage})`,
        }}
      >
        <div
          style={{ background: 'transparent', color: 'white' }}
          onClick={onClickHandler}
          className="card bdbGenericCard fade-in VerticalAligner"
        >
          <div
            style={{
              color: contentTextColor,
              background: `${contentBackgroundColor}`,
              borderRadius: 2,
            }}
            className="card-content VerticalAligner-item"
          >
            <div className="content" style={{ color: contentTextColor }}>
              {cardContent}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
