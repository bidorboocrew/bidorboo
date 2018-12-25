import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getCurrentUser } from '../../app-state/actions/authActions';

import { getAllJobsToBidOn } from '../../app-state/actions/jobActions';

import { TAB_IDS } from './components/commonComponents';
import BidderRootSideNav from './components/BidderRootSideNav';
import ActiveSearchFilters from './components/ActiveSearchFilters';

import { Spinner } from '../../components/Spinner';

class BidderRoot extends React.Component {
  constructor(props) {
    super(props);

    let initialTabSelection = TAB_IDS.openRequests;
    if (props.match && props.match.params && props.match.params.tabId) {
      const { tabId } = props.match.params;
      if (tabId && TAB_IDS[`${tabId}`]) {
        initialTabSelection = TAB_IDS[`${tabId}`];
      }
    }

    this.state = {
      activeTab: initialTabSelection,
      showSideNav: false,
    };
  }

  componentDidMount() {
    const { isLoggedIn, a_getCurrentUser, a_getAllJobsToBidOn } = this.props;
    if (!isLoggedIn) {
      a_getCurrentUser();
    }
    a_getAllJobsToBidOn();
  }

  changeActiveTab = (tabId) => {
    this.setState({ activeTab: tabId });
  };

  toggleSideNav = () => {
    this.setState({ showSideNav: !this.state.showSideNav });
  };

  render() {
    const { isLoading } = this.props;
    const { activeTab, showSideNav } = this.state;
    if (isLoading) {
      return (
        <section className="section">
          <div className="container">
            <Spinner isLoading={isLoading} size={'large'} />
          </div>
        </section>
      );
    }

    return (
      <div className="bdbPage">
        <section className="hero is-small is-dark">
          <div className="hero-body">
            <div>
              <h1 style={{ color: 'white' }} className="title">
                Provide A Service
              </h1>
            </div>
          </div>
        </section>
        <Tabs activeTab={activeTab} changeActiveTab={this.changeActiveTab} />
        <section className="section">
          <div className="container">
            <ActiveSearchFilters toggleSideNav={this.toggleSideNav} />
            <BidderRootSideNav showNav={showSideNav} toggleSideNav={this.toggleSideNav} />
          </div>
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ jobsReducer, userReducer }) => {
  return {
    error: jobsReducer.error,
    isLoading: jobsReducer.isLoading,
    ListOfJobsToBidOn: jobsReducer.ListOfJobsToBidOn,
    mapCenterPoint: jobsReducer.mapCenterPoint,
    userDetails: userReducer.userDetails,
    isLoggedIn: userReducer.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    a_getAllJobsToBidOn: bindActionCreators(getAllJobsToBidOn, dispatch),
    a_getCurrentUser: bindActionCreators(getCurrentUser, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BidderRoot);

const Tabs = ({ activeTab, changeActiveTab }) => {
  return (
    <div className="tabs is-marginless">
      <ul>
        <li className={`${activeTab === TAB_IDS.openRequests ? 'is-active' : null}`}>
          <a
            onClick={(e) => {
              e.preventDefault();
              changeActiveTab(TAB_IDS.openRequests);
            }}
          >
            {TAB_IDS.openRequests}
          </a>
        </li>
        <li className={`${activeTab === TAB_IDS.myRequests ? 'is-active' : null}`}>
          <a
            onClick={(e) => {
              e.preventDefault();
              changeActiveTab(TAB_IDS.myRequests);
            }}
          >
            {TAB_IDS.myRequests}
          </a>
        </li>
      </ul>
    </div>
  );
};
