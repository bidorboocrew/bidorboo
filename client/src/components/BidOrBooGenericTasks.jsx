import React from 'react';
import { templatesRepo } from '../constants/bidOrBooTaskRepo';
import PropTypes from 'prop-types';
import * as ROUTES from '../constants/route-const';

class BidOrBooGenericTasks extends React.Component {
  static propTypes = {
    switchRoute: PropTypes.func.isRequired
  };
  render() {
    const { switchRoute } = this.props;
    const genericTasks = templatesRepo.map(defaultTask => {
      const { title, subtitle, description, imageUrl, id } = defaultTask;
      return (
        <div
          key={id}
          className={
            'column is-one-quarter bdbCardComponent fade-in'
          }
        >
          <div
            onClick={e => {
              e.preventDefault();
              switchRoute(`${ROUTES.FRONTENDROUTES.PROPOSER.createjob}/${id}`);
            }}
            className="card space"
          >
            <div className="card-image">
              <figure className="image">
                <img src={imageUrl} alt={subtitle} />
              </figure>
            </div>
            <div className="card-content">
              <h1 className="title">{title}</h1>
              <div className="content">
                <div className="descriptoin-section">{description}</div>
                <div className="has-text-centered" style={{ textAlign: 'center', marginTop: 8 }}>
                  <a className="button is-primary">
                    {/* <i className="far fa-edit" style={{ fontSize: 12 }} /> */}
                    <span style={{ marginLeft: 4 }}>
                      <i className="fa fa-plus fa-w-14" /> Request Now
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });

    return <React.Fragment>{genericTasks}</React.Fragment>;
  }
}

export default BidOrBooGenericTasks;
