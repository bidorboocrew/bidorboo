import React from 'react';

import * as ROUTES from '../constants/frontend-route-consts';
import { switchRoute } from '../utils';
import BidOrBooCard from '../components/BidOrBooCard';
import ReviewPage from '../containers//ReviewPage';

export default class HomePage extends React.Component {
  render() {
    // start dummy data
    const bid = {
      _id: '5be4408d3b59ce7784c2616a',
      _postedBidsRef: [
        {
          _id: '5be659011a5fcb00675da498',
          bidAmount: { currency: 'CAD', value: 55 },
          isNewBid: false,
          _bidderRef: '5be4408d3b59ce7784c2616a',
          _jobRef: {
            _id: '5be64fd1c701f93840dda6eb',
            _bidsListRef: ['5be659011a5fcb00675da498'],
            state: 'OPEN',
            hideForUserIds: [],
            location: { type: 'Point', coordinates: [-75.61419, 45.37178] },
            startingDateAndTime: {
              date: '2018-11-10T03:26:09.306Z',
              hours: 1,
              minutes: 0,
              period: 'PM',
            },
            addressText: '238 Briston Private, Ottawa, ON K1G 5P9, Canada',
            title: 'Lawn Mowing',
            fromTemplateId: 'lawnMowing',
            _ownerRef: {
              _id: '5be3c423284542006779b12f',
              profileImage: {
                url:
                  'https://lh6.googleusercontent.com/-iSeZ1UGp9dE/AAAAAAAAAAI/AAAAAAAATl0/IND4jh2gpwM/photo.jpg?sz=50',
              },
              displayName: 'Said Madi',
            },
            createdAt: '2018-11-10T03:26:09.689Z',
            updatedAt: '2018-11-10T04:05:21.816Z',
            __v: 0,
          },
          state: 'OPEN',
          createdAt: '2018-11-10T04:05:21.812Z',
          updatedAt: '2018-11-13T05:12:16.842Z',
          __v: 0,
        },
        {
          _id: '5be702208d162000677aaf14',
          bidAmount: { currency: 'CAD', value: 1 },
          isNewBid: false,
          _bidderRef: '5be4408d3b59ce7784c2616a',
          _jobRef: {
            _id: '5be467b0284542006779b131',
            _bidsListRef: ['5be702208d162000677aaf14'],
            state: 'OPEN',
            hideForUserIds: [],
            location: { type: 'Point', coordinates: [-75.69915, 45.42256] },
            startingDateAndTime: {
              date: '2018-11-08T16:43:28.427Z',
              hours: 1,
              minutes: 0,
              period: 'PM',
            },
            addressText: '240 Sparks St, Ottawa, ON K1P 6C9, Canada',
            title: 'Tutoring',
            fromTemplateId: 'Tutoring',
            _ownerRef: {
              _id: '5be3c423284542006779b12f',
              profileImage: {
                url:
                  'https://lh6.googleusercontent.com/-iSeZ1UGp9dE/AAAAAAAAAAI/AAAAAAAATl0/IND4jh2gpwM/photo.jpg?sz=50',
              },
              displayName: 'Said Madi',
            },
            createdAt: '2018-11-08T16:43:28.966Z',
            updatedAt: '2018-11-10T16:06:56.497Z',
            __v: 0,
          },
          state: 'OPEN',
          createdAt: '2018-11-10T16:06:56.483Z',
          updatedAt: '2018-11-10T17:01:19.238Z',
          __v: 0,
        },
      ],
    };

    const job = {
      _postedJobsRef: [
        {
          _id: '5be658dd1a5fcb00675da497',
          _bidsListRef: [
            '5be6a0778d162000677aaf13',
            '5be75778a551212adcbd0348',
            '5be75778a551212adcbd0349',
            '5be75779a551212adcbd034a',
            '5be7581ea551212adcbd034d',
            '5be761a3cd7fd50067755b25',
          ],
          state: 'AWARDED',
          hideForUserIds: [],
          detailedDescription: 'Hehshs',
          location: {
            type: 'Point',
            coordinates: [-75.6972, 45.4215],
          },
          startingDateAndTime: {
            date: '2018-11-10T04:04:45.229Z',
            hours: 1,
            minutes: 0,
            period: 'PM',
          },
          title: 'Snow Removal',
          fromTemplateId: 'snowRemoval',
          _ownerRef: '5be4408d3b59ce7784c2616a',
          createdAt: '2018-11-10T04:04:45.610Z',
          updatedAt: '2018-11-12T02:56:00.409Z',
          _awardedBidRef: '5be7581ea551212adcbd034d',
        },
      ],
    };

    const proposer = {
      _id: '5be4408d3b59ce7784c2616a',
      profileImage: {
        url:
          'https://lh5.googleusercontent.com/-Yq14_Lizr6s/AAAAAAAAAAI/AAAAAAAAB08/FVGKX5iAFIo/photo.jpg?sz=50',
        public_id: null,
      },
      _postedJobsRef: [
        '5be440e90258c0798d3266fe',
        '5be443fc0258c0798d326702',
        '5be658dd1a5fcb00675da497',
      ],
      _postedBidsRef: ['5be659011a5fcb00675da498', '5be702208d162000677aaf14'],
      globalRating: null,
      userRole: 'REGULAR',
      hasAgreedToServiceTerms: false,
      extras: null,
      settings: null,
      verified: false,
      verificationIdImage: null,
      bidCancellations: 0,
      canBid: true,
      canPost: true,
      displayName: 'Yacoub Abdulla',
      userId: '100941490865538492879',
      email: 'yacoub.abdulla89@gmail.com',
      membershipStatus: 'NEW_MEMBER',
      _reviewsRef: [],
      creditCards: [],
      createdAt: '2018-11-08T13:56:29.120Z',
      updatedAt: '2018-11-10T16:06:56.496Z',
      __v: 0,
    };

    const bidder = {
      _id: '5be4408d3b59ce7784c2616a',
      profileImage: {
        url:
          'https://lh5.googleusercontent.com/-Yq14_Lizr6s/AAAAAAAAAAI/AAAAAAAAB08/FVGKX5iAFIo/photo.jpg?sz=50',
        public_id: null,
      },
      _postedJobsRef: [
        '5be440e90258c0798d3266fe',
        '5be443fc0258c0798d326702',
        '5be658dd1a5fcb00675da497',
      ],
      _postedBidsRef: ['5be659011a5fcb00675da498', '5be702208d162000677aaf14'],
      globalRating: null,
      userRole: 'REGULAR',
      hasAgreedToServiceTerms: false,
      extras: null,
      settings: null,
      verified: false,
      verificationIdImage: null,
      bidCancellations: 0,
      canBid: true,
      canPost: true,
      displayName: 'Yacoub Abdulla',
      userId: '100941490865538492879',
      email: 'yacoub.abdulla89@gmail.com',
      membershipStatus: 'NEW_MEMBER',
      _reviewsRef: [],
      creditCards: [],
      createdAt: '2018-11-08T13:56:29.120Z',
      updatedAt: '2018-11-10T16:06:56.496Z',
      __v: 0,
    };

    //  END of dummy data

    return (
      <div id="bdb-home-content">
        <section className="hero has-text-centered is-dark fade-in">
          <div className="hero-body">
            <div className="container">
              {/* <Rotate delay={300} top left cascade> */}
              <h1 style={{ color: 'white' }} className="title">
                BidOrBoo
              </h1>
              {/* </Rotate> */}
              <h2 style={{ color: 'white' }} className="subtitle fade-in">
                Get tasks done for the price you want. Earn money doing what you love.
              </h2>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="columns">
            <div className="column">
              <BidOrBooCard
                backgroundImage="https://images.theconversation.com/files/191713/original/file-20171024-30561-ph2byj.jpg?ixlib=rb-1.1.0&rect=665%2C0%2C2622%2C1744&q=45&auto=format&w=1012&h=668&fit=crop"
                contentTextColor={'white'}
                onClickHandler={() => {
                  switchRoute(ROUTES.CLIENT.PROPOSER.root);
                }}
                cardContent={
                  <a
                    onClick={() => {
                      switchRoute(ROUTES.CLIENT.PROPOSER.root);
                    }}
                  >
                    <div className="title has-text-white">
                      <div
                        style={{
                          borderRadius: 0,
                          backgroundColor: '#9C89B8',
                        }}
                        className="button is-primary is-large is-fullwidth"
                      >
                        <span className="icon">
                          <i className="fa fa-plus fa-w-14" />
                        </span>
                        <span className="has-text-white" style={{ marginLeft: 4 }}>
                          Request a Service
                        </span>
                      </div>
                    </div>
                    <div className="subtitle has-text-white	">
                      Start with one of our templates and post your jobs. Get your chores done for a
                      price that will please you.
                    </div>
                  </a>
                }
              />
            </div>
            <div className="column">
              <BidOrBooCard
                backgroundImage="https://martechtoday.com/wp-content/uploads/2018/04/header-bidding-auction-ss-1920-800x450.gif"
                contentTextColor={'white'}
                onClickHandler={() => {
                  switchRoute(ROUTES.CLIENT.BIDDER.root);
                }}
                cardContent={
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      switchRoute(ROUTES.CLIENT.BIDDER.root);
                    }}
                  >
                    <div className="title has-text-white">
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          switchRoute(ROUTES.CLIENT.BIDDER.root);
                        }}
                        style={{
                          borderRadius: 0,
                          backgroundColor: '#F0A6CA',
                        }}
                        className="button is-primary is-large is-fullwidth"
                      >
                        <span className="icon">
                          <i className="fas fa-dollar-sign" />
                        </span>
                        <span className="has-text-white	" style={{ marginLeft: 4 }}>
                          Offer a Service
                        </span>
                      </div>
                    </div>
                    <div className="subtitle has-text-white	">
                      Start Bidding on the jobs. Do the work you like for the price you like. Be
                      your own boss and manage your own schedule.
                    </div>
                  </a>
                }
              />
            </div>
          </div>
        </section>
        <ReviewPage
          job={job}
          bid={bid}
          bidder={bidder}
          proposer={proposer}
          isForProposer={false}
          touched
          errors
          handleChange
          handleBlur
        />
      </div>
    );
  }
}
