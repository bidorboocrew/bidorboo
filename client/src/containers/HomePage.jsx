import React from 'react';
import './styles/home.css';
import BidOrBooGenericTasks from './BidOrBooGenericTasks';
import Stepper from 'react-stepper-horizontal';
import Rotate from 'react-reveal/Rotate';
// import Webcam from 'react-webcam';

class HomePage extends React.Component {
  setRef = webcam => {
    this.webcam = webcam;
  };

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    console.log(imageSrc);
  };
  render() {
    return (
      <div id="bdb-home-content">
        <section className="hero">
          <div style={{ background: '#00d1b2' }} className="hero-body">
            <div className="container">
              <Rotate top left cascade>
                <h1 style={{ color: 'white' }} className="title">
                  BidOrBoo
                </h1>
              </Rotate>

              <h2 style={{ color: 'white' }} className="subtitle">
                Get tasks done for the price you want. Earn money doing what you
                love.
              </h2>
            </div>
          </div>
        </section>
        <section className="section mainSectionContainer">
          <div className="container">
            {/* <div>
              <Webcam
                audio={false}
                height={350}
                ref={this.setRef}
                screenshotFormat="image/jpeg"
                width={350}
              />
              <button onClick={this.capture}>Capture photo</button>
            </div> */}
            <div
              style={{ marginBottom: 0 }}
              className="has-text-centered title"
            >
              Post a Job
            </div>

            <div>
              <Stepper
                size={27}
                activeColor={'rgb(0, 209, 178)'}
                steps={[
                  { title: 'Pick a Template' },
                  { title: 'Fill In Details' },
                  { title: 'Post it!' }
                ]}
                activeStep={0}
              />
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">
                <BidOrBooGenericTasks />
              </div>
            </div>
          </div>
          <div className="container">
            <div className="has-text-centered title">Bid On a Job</div>

            <div>
              <Stepper
                size={24}
                activeColor={'rgb(0, 209, 178)'}
                steps={[
                  { title: 'Select a Job' },
                  { title: 'Bid' },
                  { title: 'Post it!' }
                ]}
                activeStep={0}
              />
            </div>
            <div className="bdb-section-body" id="existing-jobs">
              <div className="columns">{/* <BidOrBooDefaultTasks /> */}</div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default HomePage;
