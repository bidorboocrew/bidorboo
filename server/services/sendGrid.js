// emailing services
const sgMail = require('@sendgrid/mail');

const keys = require('../config/keys');
const populateHtmlTemplate = require('./sendGrid-Htmltemplate').populateHtmlTemplate;
const populateNewBidHtmlTemplate = populateHtmlTemplate; //require('./sendGrid-Htmltemplate-newBid').populateHtmlTemplate;
const populateRequestUpdates = populateHtmlTemplate; //require('./sendGrid-Htmltemplate-requestUpdates').populateHtmlTemplate;

sgMail.setApiKey(keys.sendGridKey);

exports.EmailService = {
  sendEmailVerificationCode: ({ emailVerificationCode, to, toDisplayName }) => {
    console.log('SENDGRID MSG: sendEmailVerificationCode ');
    console.log({ emailVerificationCode, to, toDisplayName });

    const msg = {
      to,
      toDisplayName,
      from: 'bidorboo@bidorboo.ca',
      subject: `Email Verification Code is: ${emailVerificationCode}`,
      text: `BidOrBoo Email Verification Code is ${emailVerificationCode}`,
      html: populateHtmlTemplate({
        toDisplayName,
        contentHtml: `
        <p>Your BidOrBoo Email verification code is:</p>
        <p><strong>${emailVerificationCode}</strong></p>
        `,
        clickLink: 'https://www.bidoroboo.ca/my-profile/basic-settings',
        clickDisplayName: 'Go To BidOrBoo',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: sendEmailVerificationCode success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE sendEmailVerificationCode' + JSON.stringify(e)
        );
      });
  },

  sendNewBidRecievedEmail: ({ to, toDisplayName, taskName, clickLink }) => {
    console.log('SENDGRID MSG: sendNewBidRecievedEmail ');
    console.log({ to, toDisplayName, taskName, clickLink });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `${taskName} received a new bid`,
      text: `${taskName} received a new bid`,
      html: populateNewBidHtmlTemplate({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Exciting news! ${taskName} received a new bid.</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Check out the Bids</li>
          <li style="">Select a Tasker</li>
          <li style="">Proceed to Booking</li>
        </ul>
        `,
        clickLink,
        clickDisplayName: 'View Bid',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: sendNewBidRecievedEmail success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE sendNewBidRecievedEmail' + JSON.stringify(e)
        );
      });
  },

  sendRequestIsHappeningSoonToTaskerEmail: ({
    to,
    requestTitle,
    toDisplayName,
    ownerEmailAddress,
    ownerPhoneNumber,
    linkForTasker,
  }) => {
    console.log('SENDGRID MSG: sendRequestIsHappeningSoonToTaskerEmail ');
    console.log({
      to,
      requestTitle,
      toDisplayName,
      ownerEmailAddress,
      ownerPhoneNumber,
      linkForTasker,
    });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Reminder: ${requestTitle} is happening tomorrow!`,
      text: `
        This is an automated reminder for your upcoming assigned ${requestTitle} task.
        Get in touch with the requester to get the exact task location and time details.
     `,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>This is an automated reminder for your assigned ${requestTitle} task.</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Review the task details thoroughly to do a great job</li>
          <li style="">Be on time and keep the Requester posted if anything changes</li>
          <li style="">Pack any tools or items if required to fulfil the task</li>
          <li style="">Get in touch with the Requester to get the exact task location and time</li>
          <li style="">You MUST bring and wear a mask while performing the task</li>
        </ul>
        <br>
        <div>
        Email address:
        </div>
        <div>
        <strong><a href="mailto:${ownerEmailAddress}?subject=BidOrBoo - Iam the tasker for ${requestTitle}">${ownerEmailAddress}</a></strong>
        </div>
        <br>
        <div>
        Phone number:
        </div>
        <div><strong><a href="tel:${ownerPhoneNumber}">${ownerPhoneNumber}</a></strong></div>
        `,

        clickLink: `${linkForTasker}`,
        clickDisplayName: 'View Request',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: sendRequestIsHappeningSoonToTaskerEmail success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE sendRequestIsHappeningSoonToTaskerEmail' +
            JSON.stringify(e)
        );
      });
  },
  // ============Hanan to continue here

  sendNewRequestInYourAreaNotification: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
    console.log('SENDGRID MSG: sendNewRequestInYourAreaNotification ');
    console.log({ to, requestTitle, toDisplayName, linkForTasker });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `new ${requestTitle} was posted in your area`,
      text: `Act fast, be the first to bid on it`,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>${requestTitle} request was posted in your area.</p>
        <br>
        <p>Act fast, be the first to bid</p>
        `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Bid Now',
      }),
    };
    // function(error, response) {
    //   console.log(response.statusCode);
    //   console.log(response.body);
    //   console.log(response.headers);
    // }

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: sendNewRequestInYourAreaNotification success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE sendNewRequestInYourAreaNotification' +
            JSON.stringify(e)
        );
      });
  },

  sendRequestIsHappeningSoonToRequesterEmail: ({
    to,
    requestTitle,
    toDisplayName,
    taskerEmailAddress,
    taskerPhoneNumber,
    linkForOwner,
  }) => {
    console.log('SENDGRID MSG: sendRequestIsHappeningSoonToRequesterEmail ');
    console.log({
      to,
      requestTitle,
      toDisplayName,
      taskerEmailAddress,
      taskerPhoneNumber,
      linkForOwner,
    });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Reminder: ${requestTitle} is Scheduled Tomorrow`,
      text: `This is an automated reminder for your upcoming scheduled ${requestTitle}.
      Get in touch with the requester to agree on exact location and time details.`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>This is an automated reminder for your upcoming scheduled ${requestTitle} task.</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Review the task details to remind your self of the details</li>
          <li style="">Make sure to keep an eye on your email or phone in case the Tasker needs any instructions</li>
          <li style="">Get in touch with the Tasker to specify the exact task location and time to meet</li>
          <li style="">Please wear a mask while Tasker is present</li>
          <li style="">Tasker must be wearing a mask while performing the task, please reach out to us via chat if you need any assistance</li>
        </ul>
        <br>
        <div>
        Email address:
        </div>
        <div><strong><a href="mailto:${taskerEmailAddress}?subject=BidOrBoo - Iam expecting you for ${requestTitle}">${taskerEmailAddress}</a></strong></div>
        <br>
        <div>
        Phone number:
        </div>
        <div><strong><a href="tel:${taskerPhoneNumber}">${taskerPhoneNumber}</a></strong></div>
        `,

        clickLink: `${linkForOwner}`,
        clickDisplayName: 'View Request',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: sendRequestIsHappeningSoonToRequesterEmail success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE sendRequestIsHappeningSoonToRequesterEmail' +
            JSON.stringify(e)
        );
      });
  },
  tellTaskerThatRequesterCancelledRequest: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
    console.log('SENDGRID MSG: tellTaskerThatRequesterCancelledRequest ');
    console.log({ to, requestTitle, toDisplayName, linkForTasker });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `${requestTitle} has been cancelled by the Requester!`,
      text: `We are sorry to inform you that this Request has been cancelled by the requester.`,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>We are sorry to inform you that ${requestTitle} has been cancelled by the Requester.</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">You are no longer assigned to this task, remove it from your calendar if you had it set already</li>
          <li style="">Do NOT show up to the task address and Seize all communication with the Requester</li>
          <li style="">You will recieve a payout of approx. 10% of the bid amount for the inconvenience</li>
          <li style="">If you have any further questions, Get in touch with our support crew by clicking the Chat button at www.bidorboo.ca</li>
        </ul>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Cancelled Request Details',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellTaskerThatRequesterCancelledRequest success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellTaskerThatRequesterCancelledRequest' +
            JSON.stringify(e)
        );
      });
  },

  tellRequeterThatTheyHaveCancelledAnAwardedRequest: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
    console.log('SENDGRID MSG: tellRequeterThatTheyHaveCancelledAnAwardedRequest ');
    console.log({ to, requestTitle, toDisplayName, linkForOwner });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `You have cancelled ${requestTitle}!`,
      text: `We are sorry to hear that things did not work out.
      We will inform the tasker about this to ensure that they will NOT show up.
     `,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>We are sorry to hear that things did not work out.</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">We will notify the tasker and they will NOT show up</li>
          <li style="">You will recieve a refund of 90% of your booking payment</li>
          <li style="">If you have any further questions, Get in touch with our support crew by clicking the Chat button at www.bidorboo.ca</li>
        </ul>
      `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Cancelled Request Details',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequeterThatTheyHaveCancelledAnAwardedRequest success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequeterThatTheyHaveCancelledAnAwardedRequest' +
            JSON.stringify(e)
        );
      });
  },

  tellRequesterThatWeAutoDeletedTheirJob: ({ to, requestTitle, toDisplayName }) => {
    console.log('SENDGRID MSG: tellRequesterThatWeAutoDeletedTheirJob ');
    console.log({ to, requestTitle, toDisplayName });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `${requestTitle} - was auto deleted`,
      text: `Auto deleted one of your requests ${requestTitle}
     `,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>Your equest ${requestTitle} did not recieve any bids and is past the chosen due date.</p>
        <br>
        <p>We automatically deleted this Request</p>
        `,
        clickLink: `https://www.bidorboo.ca/bdb-request/root`,
        clickDisplayName: 'Post Another Request',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequesterThatWeAutoDeletedTheirJob success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequesterThatWeAutoDeletedTheirJob' +
            JSON.stringify(e)
        );
      });
  },
  tellRequesterToHurryUpAndAwardAbidder: ({ to, requestTitle, toDisplayName, clickLink }) => {
    console.log('SENDGRID MSG: tellRequesterToHurryUpAndAwardAbidder ');
    console.log({ to, requestTitle, toDisplayName, clickLink });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `${requestTitle} - has bids, Hurry up award it to a Tasker`,
      text: `Hurry up and award a tasker`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>This request ${requestTitle} is happening soon and has Bids</p>
        <br>
        <strong>Hurry up</strong> award it to a Tasker before the due date</p>
        `,
        clickLink,
        clickDisplayName: 'View Bids',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequesterToHurryUpAndAwardAbidder success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequesterToHurryUpAndAwardAbidder' +
            JSON.stringify(e)
        );
      });
  },

  tellRequeterThatTheTaskerHaveCancelledAnAwardedRequest: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
    console.log('SENDGRID MSG: tellRequeterThatTheTaskerHaveCancelledAnAwardedRequest ');
    console.log({ to, requestTitle, toDisplayName, linkForOwner });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Tasker have cancelled ${requestTitle}!`,
      text: `We are sorry to inform you that things did not work out!
      The tasker cancelled their booking and thus will NOT show up to do this task.
     `,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Tasker have cancelled ${requestTitle}!</p>
        <br>
        <p>We are sorry to inform you that things did not work out!</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Tasker will NOT show up to perform this task</li>
          <li style="">Full refund was issued back to your payment method</li>
          <li style="">If you have any further questions, Get in touch with our support crew by clicking the Chat button at www.bidorboo.ca</li>
        </ul>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Cancelled Request Details',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequeterThatTheTaskerHaveCancelledAnAwardedRequest success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequeterThatTheTaskerHaveCancelledAnAwardedRequest' +
            JSON.stringify(e)
        );
      });
  },
  tellTaskerThatTheyCancelledRequest: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
    console.log('SENDGRID MSG: tellTaskerThatTheyCancelledRequest ');
    console.log({ to, requestTitle, toDisplayName, linkForTasker });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `You have cancelled assigned ${requestTitle} booking.`,
      text: `
      You have cancelled your assigned Task booking and thus you should NOT show up or do the task.
      It Happens! We understand that life is sometimes unpredictable
      and we are sorry to hear that things did not work out!
     `,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>You have cancelled assigned ${requestTitle} booking.</p>
        <br>
        <p>It Happens! We understand that life is sometimes unpredictable</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">You should Sieze all contact with the requester</li>
          <li style="">Do NOT show up or complete this task as you will not get paid for it</li>
          <li style="">If you have any further questions, Get in touch with our support crew by clicking the Chat button at www.bidorboo.ca</li>
        </ul>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Cancelled Request Details',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellTaskerThatTheyCancelledRequest success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellTaskerThatTheyCancelledRequest' +
            JSON.stringify(e)
        );
      });
  },

  tellRequesterToConfirmCompletion: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    console.log('SENDGRID MSG: tellRequesterToConfirmCompletion ');
    console.log({ to, requestTitle, toDisplayName, linkForOwner });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Confirm Tasker has completed ${requestTitle}!`,
      text: `Confirm that the Tasker had completed their work.`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <div>The Tasker has confirmed that ${requestTitle} was completed</div>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Confirm that it is completed</li>
          <li style="">Then Review your Tasker</li>
        </ul>
         `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'View Request',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequesterToConfirmCompletion success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequesterToConfirmCompletion' +
            JSON.stringify(e)
        );
      });
  },

  tellTaskerWeWaitingOnRequesterToConfirmCompletion: ({
    to,
    requestTitle,
    toDisplayName,
    linkForTasker,
  }) => {
    console.log('SENDGRID MSG: tellTaskerWeWaitingOnRequesterToConfirmCompletion ');
    console.log({ to, requestTitle, toDisplayName, linkForTasker });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `waiting on requester's confirmation for the completion of ${requestTitle}!`,
      text: `
      Thank you for completing this Request!
      We are reaching out to the Requester to get the final confirmation that you completed your work.
     `,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Thank you for completing this Request!</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Review your Requester</li>
          <li style="">We notified the Requester to confirm this task's completion</li>
          <li style="">Payment for this task will be released once we recieve the confirmation</li>
        </ul>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Request Details',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellTaskerWeWaitingOnRequesterToConfirmCompletion success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellTaskerWeWaitingOnRequesterToConfirmCompletion' +
            JSON.stringify(e)
        );
      });
  },

  tellRequesterRequestIsCompleteBeginRating: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
    console.log('SENDGRID MSG: tellRequesterRequestIsCompleteBeginRating ');
    console.log({ to, requestTitle, toDisplayName, linkForOwner });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `${requestTitle} is Completed!`,
      text: `BidOrBoo is happy to hear that the request was fulfilled.
      Now it is your turn to rate the Tasker
     `,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBoo is happy to hear that the request was fulfilled.</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Review The Tasker',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequesterRequestIsCompleteBeginRating success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequesterRequestIsCompleteBeginRating' +
            JSON.stringify(e)
        );
      });
  },

  tellTaskerRequestIsCompleteBeginRating: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
    console.log('SENDGRID MSG: tellTaskerRequestIsCompleteBeginRating ');
    console.log({ to, requestTitle, toDisplayName, linkForTasker });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `${requestTitle} is Completed!`,
      text: `BidOrBoo is happy to hear that you've completed this request
      Your payout is on the way and you should recieve it within 1-10 business days`,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBoo is happy to hear that you've completed this request</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Review the Requester</li>
          <li style="">We notified the Requester to confirm this task's completion</li>
          <li style="">Payment for this task will be released once we recieve the confirmation</li>
        </ul>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Review The Requester',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellTaskerRequestIsCompleteBeginRating success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellTaskerRequestIsCompleteBeginRating' +
            JSON.stringify(e)
        );
      });
  },

  tellRequesterThanksforPaymentAndTaskerIsRevealed: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
    console.log('SENDGRID MSG: tellRequesterThanksforPaymentAndTaskerIsRevealed ');
    console.log({ to, requestTitle, toDisplayName, linkForOwner });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `${requestTitle} Payment successful!`,
      text: `
      Thank you for your payment! We've notified the Tasker
      The assigned Tasker will be ready to do a great request and fulfil your service.`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Thank you for your payment! We've notified the Tasker</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Tasker was notified and assigned to complete this request</li>
          <li style="">Taskers contact details are revealed</li>
          <li style="">Get in touch with the Tasker to specify the exact task location and meeting time details</li>
        </ul>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'View Assigned Tasker',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequesterThanksforPaymentAndTaskerIsRevealed success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequesterThanksforPaymentAndTaskerIsRevealed ' +
            JSON.stringify(e)
        );
      });
  },

  tellTaskerThatTheyWereAwarded: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
    console.log('SENDGRID MSG: tellTaskerThatTheyWereAwarded ');
    console.log({ to, requestTitle, toDisplayName, linkForTasker });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Your Bid Won !`,
      text: `
      Your ${requestTitle} Bid Won and the request is Assigned to you!
      Please show up prepaired with all the tools required to fulfil this request`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Congratulations. Your ${requestTitle} Bid Won and the request is Assigned to you</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Requester's contact info is revealed</li>
          <li style="">Get in touch with the Requester to finalize exact task location and time details</li>
          <li style="">Add this task to your calendar to avoid missing it</li>
        </ul>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Finalize Request Details',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellTaskerThatTheyWereAwarded success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellTaskerThatTheyWereAwarded ' +
            JSON.stringify(e)
        );
      });
  },
  tellDisputeOwnerThatWeWillInvestigate: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
    console.log('SENDGRID MSG: tellDisputeOwnerThatWeWillInvestigate ');
    console.log({ to, requestTitle, toDisplayName, linkForTasker });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `We recieved your dispute regarding ${requestTitle}!`,
      text: `
      We are sorry for your inconvienience and want you to know that we will investigatee and resolve this asap!
      we will keep you posted with any updates soon`,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>We are sorry for your inconvienience</p>
        <br>
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Our support crew will look into this Dispute ASAP and resolve it</li>
          <li style="">We will reach out to you and inform you about any updates</li>
          <li style="">If you have any further questions, Get in touch with our support crew by clicking the Chat button at www.bidorboo.ca</li>
        </ul>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'View Disputed Task',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellDisputeOwnerThatWeWillInvestigate success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellDisputeOwnerThatWeWillInvestigate' +
            JSON.stringify(e)
        );
      });
  },
  tellRequesterThatWeMarkedRequestDone: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    console.log('SENDGRID MSG: tellRequesterThatWeMarkedRequestDone ');
    console.log({ to, requestTitle, toDisplayName, linkForOwner });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `BidOrBoo Marked ${requestTitle} as Complete`,
      text: `BidOrBoo is happy to hear that your ${requestTitle} request was fulfilled.
      Since you did not confirm the completion in the past 3 days we went ahead and marked this request as completed.`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBoo is happy to hear that your ${requestTitle} request was completed</p>
        <br>
        <p>You did not confirm nor dispute the completion of this task in the past 3 days</p>
        <br>
        <p>The tasker confirmed that they've completed this task</p>
        <br>
        <p>Thus We marked this request as complete automatically</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Completed Request Details',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequesterThatWeMarkedRequestDonesuccess');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequesterThatWeMarkedRequestDone ' +
            JSON.stringify(e)
        );
      });
  },
  tellRequesterToConfirmRequest: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    console.log('SENDGRID MSG: tellRequesterToConfirmRequest ');
    console.log({ to, requestTitle, toDisplayName, linkForOwner });

    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Confirm ${requestTitle} completion!`,
      text: `BidOrBoo is happy to hear that your ${requestTitle} request was fulfilled.
      Please confirm the completion of this`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBoo is happy to hear that your ${requestTitle} request was fulfilled.</p>
        <br>
        <p>Please confirm the completion of this request asap</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Confirm Request Completion',
      }),
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: tellRequesterToConfirmRequest success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE tellRequesterToConfirmRequest ' +
            JSON.stringify(e)
        );
      });
  },
  informBobCrewAboutDispute: ({
    whoSubmitted,
    requesterDisplayName,
    taskerDisplayName,
    requestDisplayName,
    requestLinkForRequester,
    requestLinkForTasker,
    requesterEmailAddress,
    requesterPhoneNumber,
    taskerEmailAddress,
    processedPayment,
    requestId,
    reason,
    details,
    userIdWhoFiledDispute,
  }) => {
    console.log('EMAIL- informBobCrewAboutDispute');
    console.log({
      whoSubmitted,
      requesterDisplayName,
      taskerDisplayName,
      requestDisplayName,
      requestLinkForRequester,
      requestLinkForTasker,
      requesterEmailAddress,
      requesterPhoneNumber,
      taskerEmailAddress,
      processedPayment,
      requestId,
      reason,
      details,
      userIdWhoFiledDispute,
    });

    const msg = {
      to: 'bidorboo@bidorboo.ca',
      from: 'bidorboo@bidorboo.ca',
      subject: `DISPUTE CASE: ${reason} submitted by ${whoSubmitted}`,
      html: `
      <p>Investigate this dispute filed by user ${userIdWhoFiledDispute} about request ${requestId}.</p>
      <br>
      <p>the claim details are :</p>
      <br>
      <p>${details}</p>
      <br>
      <p>Additional info</p>
      <br>
    <p>whoSubmitted = ${whoSubmitted},</p>
    <br>
    <p>requesterDisplayName = ${requesterDisplayName},</p>
    <br>
    <p>taskerDisplayName = ${taskerDisplayName},</p>
    <br>
    <p>requestDisplayName = ${requestDisplayName},</p>
    <br>
    <p>requestLinkForRequester = ${requestLinkForRequester},</p>
    <br>
    <p>requestLinkForTasker = ${requestLinkForTasker},</p>
    <br>
    <div>
    <a href="mailto:${requesterEmailAddress}?subject=BidOrBoo DISPUTE">requesterEmailAddress: ${requesterEmailAddress}</a>
    </div>
    <br>
    <div>
    <a href="tel:${requesterPhoneNumber}">requesterPhoneNumber</srtong>: ${requesterPhoneNumber},</a>
    </div>
    <br>
    <div>
    <a href="mailto:${taskerEmailAddress}?subject=BidOrBoo DISPUTE">taskerEmailAddress: ${taskerEmailAddress}</a>
    </div>
    <br>
    <p>requestId = ${requestId},</p>
    <br>
    <p>reason = ${reason},</p>
    <br>
    <p>details = ${details},</p>
    <br>
    <p>processedPayment = ${JSON.stringify(processedPayment)},</p>
      `,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: informBobCrewAboutDispute success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE informBobCrewAboutDispute' + JSON.stringify(e)
        );
      });
  },

  informBobCrewAboutSuccessPayment: ({ requestId, paymentDetails }) => {
    console.log('EMAIL- informBobCrewAboutSuccessPayment');
    console.log({ requestId, paymentDetails });
    const msg = {
      to: 'bidorboo@bidorboo.ca',
      from: 'bidorboo@bidorboo.ca',
      subject: `SUCCESS PAYOUT CASE: ${requestId}`,
      html: `
      <p>Payment to bank was successful
        ${JSON.stringify(paymentDetails)}.</p>
      `,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: success');
      })
      .catch((e) => {
        console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
      });
  },

  informBobCrewAboutFailedImportantStuff: (methodName, details) => {
    console.log('EMAIL- informBobCrewAboutFailedImportantStuff');
    const msg = {
      to: 'bidorboocrew@gmail.com',
      from: 'bidorboo@bidorboo.ca',
      subject: `FAILED IMPORTANT: ${methodName}`,

      html: `
      <p>Something important failed
        ${JSON.stringify(details)}.</p>
      `,
    };

    sgMail
      .send(msg)
      .then(() => {
        console.log('SENDGRID MSG: informBobCrewAboutSuccessPayment success');
      })
      .catch((e) => {
        console.log(
          'BIDORBOO_ERROR: SENDGRID MAILING ISSUE informBobCrewAboutSuccessPayment ' +
            JSON.stringify(e)
        );
      });
  },
};
