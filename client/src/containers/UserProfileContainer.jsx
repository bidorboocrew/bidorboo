import React from 'react';
import ProfileForm from '../components/forms/ProfileForm';

const onSubmit = () => {};
class UserProfileContainer extends React.Component {
  render() {
    return (
      <div id="bdb-profile-content" className="container-wrapper">
        <div className="inner row center-xs">
          <div className="col-xs-12
                col-sm-12
                col-md-8
                col-lg-5">
            <div className="row center-xs">
              <div style={{padding: 20}}  className="col-xs-12
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
                <button>edit profile</button>
              </div>
              <div className="col-xs-12
                col-sm-12
                col-md-8
                col-lg-8">
                <div className="row center-xs">
                  <h2 className="col-xs-12" style={{border:"1px solid grey"}}>General Information</h2>
                  <div className="col-xs-12">user name</div>
                  <div className="col-xs-12">membership status</div>
                  <div className="col-xs-12">phonenumber</div>
                  <h2 className="col-xs-12">Address Section</h2>
                  <div className="col-xs-12">address details</div>
                  <h2 className="col-xs-12">Payment details</h2>
                  <h2 className="col-xs-12">self description</h2>
                  <div className="col-xs-12">personal paragraph</div>
                </div>
                {/* <ProfileForm onSubmit={onSubmit} /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfileContainer;
