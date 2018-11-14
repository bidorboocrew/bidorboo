import React from 'react';
import ReactStars from 'react-stars';

export default class ReviewPage extends React.Component {
  //   constructor(props) {
  //     super(props);

  render() {
    //   }
    const ratingChanged = (newRating) => {
      console.log(newRating);
    };

    const { job, bid, bidder, proposer, isForProposer, onSubmit } = this.props;
    return (
      <div className="slide-in-left" id="bdb-review-root">
        <section className="hero is-small">
          <div style={{ backgroundColor: 'purple' }} className="hero-body  has-text-centered">
            <div className="container">
              <h1 style={{ color: 'white' }} className="title">
                Review this Jobs
              </h1>
              <h2 style={{ color: 'white' }} className="subtitle">
                Give your feedback about this job.
              </h2>
            </div>
          </div>
        </section>
        <section className="mainSectionContainer">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-6">
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">Submit Review</p>
                  </header>
                  <div class="card-image">
                    <figure class="image is-4by3">
                      <img
                        src="https://bulma.io/images/placeholders/1280x960.png"
                        alt="Placeholder image"
                      />
                    </figure>
                  </div>
                  <div class="card-content">
                    <div class="media">
                      <div class="media-left">
                        <figure class="image is-48x48">
                          <img
                            src="https://bulma.io/images/placeholders/96x96.png"
                            alt="Placeholder image"
                          />
                        </figure>
                      </div>
                      <div class="media-content">
                        <p class="title is-4">{job._postedJobsRef[0].title}</p>
                      </div>
                    </div>
                    <div class="content">
                      <p class="heading">
                        <div>Date of completion: 09/ 12/ 2018</div>
                      </p>
                      <p class="heading">
                        <div>Date of completion: 09/ 12/ 2018</div>
                      </p>
                    </div>

                    <div class="content">
                      <p class="heading">
                        <div>
                          ACCURACY OF POST:{' '}
                          <ReactStars
                            half={false}
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            color2={'#ffd700'}
                          />
                        </div>
                      </p>
                      <p class="heading">
                        <div>
                          PROFICIENCY:{' '}
                          <ReactStars
                            half={false}
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            color2={'#ffd700'}
                          />
                        </div>
                      </p>
                      <p class="heading">
                        <div>
                          ON TIME:{' '}
                          <ReactStars
                            half={false}
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            color2={'#ffd700'}
                          />
                        </div>
                      </p>
                      <p class="heading">
                        <div>
                          MANNERS:{' '}
                          <ReactStars
                            half={false}
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            color2={'#ffd700'}
                          />
                        </div>
                      </p>
                      <p class="heading">
                        <div>
                          CLEANLINESS:{' '}
                          <ReactStars
                            half={false}
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            color2={'#ffd700'}
                          />
                        </div>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
