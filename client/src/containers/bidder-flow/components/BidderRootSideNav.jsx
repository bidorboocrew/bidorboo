import React from 'react';
// https://github.com/gauravchl/react-simple-sidenav
import SideNav from 'react-simple-sidenav';
import JobsLocationFilterForm from '../../../components/forms/JobsLocationFilterForm';

export default class BidderRootSideNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      titleHeight: window.innerWidth >= 1087 ? 5 : 3.25,
    };

    this.handleWindowSizeChange = () => {
      if (window.innerWidth >= 1087 && this.state.titleHeight !== 5) {
        this.setState({
          titleHeight: 5,
        });
      } else if (window.innerWidth < 1087 && this.state.titleHeight !== 3.25) {
        this.setState({
          titleHeight: 3.25,
        });
      }
    };
  }

  componentDidCatch() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }
  componentDidMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  render() {
    const { isSideNavOpen } = this.props;
    const { titleHeight } = this.state;
    return (
      <div className="bdbPage">
        <section className="section">
          <div className="container">
            <SideNav
              navStyle={{ background: '#eee', overflowY: 'auto', overflowX: 'hidden' }}
              openFromRight
              showNav={isSideNavOpen}
              titleStyle={{
                marginTop: `${titleHeight}rem`,
                lineHeight: 'none',
                background: '#3273dc',
                padding: '1.5rem 1rem',
              }}
              itemStyle={{ padding: 0 }}
              title={<SideNavTitle {...this.props} />}
              items={[<SearchControls {...this.props} />]}
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

const SearchControls = ({ updateMapCenter, clearFilter, handleGeoSearch }) => {
  return (
    <JobsLocationFilterForm
      updateMapCenter={updateMapCenter}
      onCancel={clearFilter}
      onSubmit={(vals) => {
        handleGeoSearch(vals);
      }}
    />
  );
};
