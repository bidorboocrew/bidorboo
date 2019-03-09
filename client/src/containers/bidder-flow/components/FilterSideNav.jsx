import React from 'react';
// https://github.com/gauravchl/react-simple-sidenav
import SideNav from 'react-simple-sidenav';
import JobsLocationFilterForm from '../../../components/forms/JobsLocationFilterForm';

export default class FilterSideNav extends React.Component {
  render() {
    const { isSideNavOpen } = this.props;
    return (
      <SideNav
        navStyle={{ background: '#eee', overflowY: 'auto', overflowX: 'hidden' }}
        openFromRight
        showNav={isSideNavOpen}
        titleStyle={{
          marginTop: `4rem`,
          lineHeight: 'none',
          background: '#14719f',
          padding: '1.5rem 1rem',
        }}
        itemStyle={{ padding: 0 }}
        title={<SideNavTitle {...this.props} />}
        items={[<SearchControls {...this.props} />]}
      />
    );
  }
}

const SideNavTitle = ({ toggleSideNav }) => {
  return (
    <nav className="level is-mobile">
      <div className="level-left">
        <div className="level-item">
          <p className="subtitle has-text-light is-5">
            <strong className="subtitle has-text-light">Filter Jobs</strong>
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

const SearchControls = ({ updateMapCenter, onCancel, handleGeoSearch }) => {
  return (
    <JobsLocationFilterForm
      updateMapCenter={updateMapCenter}
      onCancel={onCancel}
      onSubmit={handleGeoSearch}
    />
  );
};
