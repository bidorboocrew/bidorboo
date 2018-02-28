import React from 'react';
import ProfileForm from '../components/forms/ProfileForm';

const onSubmit = () => {};
class UserProfileContainer extends React.Component {
  render() {
    return (
      <div id="bdb-profile-content" className="container-wrapper">
        <div className="inner row center-xs">
          <div className="col-xs-10">
            <div className="row">
              <div className="col-xs-12
                col-sm-12
                col-md-4
                col-lg-4">
                  <div className="col-xs-12">
                    <img
                      alt="profile pic"
                      src="https://scontent.xx.fbcdn.net/v/t1.0-1/p200x200/25551858_10102066392355761_3888110341800170274_n.jpg?oh=ab5e2fcce393b52aad48a8df5dd4ec27&amp;oe=5B46736C"
                      className="profileImg"
                    />
                  </div>
                  <div className="col-xs-12">
                    <img
                      alt="star rating"
                      src="https://www.citizensadvice.org.uk/Global/energy-comparison/rating-35.svg"
                      className="starRating col-xs-12"
                    />
                  </div>
                  <div className="col-xs-12">Said Madi</div>
                  <div className="col-xs-12">saidymadi@gmail.com</div>
                  <div className="col-xs-12">
                    <div className="specialDivider" />
                  </div>
                </div>
              <div className="col-xs-12
                col-sm-12
                col-md-8
                col-lg-8">
                <ProfileForm onSubmit={onSubmit} />
              </div>
              </div>
              </div>
            </div>
          </div>
    );
  }
}

export default UserProfileContainer;
