import React from 'react';
// https://github.com/gauravchl/react-simple-sidenav
import SideNav from 'react-simple-sidenav';

export default class BidderRootSideNav extends React.Component {
  render() {
    const { showNav } = this.props;

    return (
      <div className="bdbPage">
        <section className="section">
          <div className="container">
            <SideNav
              showNav={showNav}
              titleStyle={{ marginTop: '3rem', lineHeight: 'none' }}
              title={<SideNavTitle {...this.props} />}
              items={['Item 1', 'Item 2']}
            />
          </div>
        </section>
      </div>
    );
  }
}

const SideNavTitle = ({ toggleSideNav }) => {
  return (
    <nav className="level">
      <div className="level-left">
        <div className="level-item">
          <p className="subtitle has-text-light is-5">
            <strong className="subtitle has-text-light">Search Jobs</strong>
          </p>
        </div>
      </div>

      <div className="level-right">
        <p className="level-item">
          <a onClick={toggleSideNav} className="is-dark subtitle has-text-light is-4">
            <i className="fas fa-times-circle" />
          </a>
        </p>
      </div>
    </nav>
  );
};
