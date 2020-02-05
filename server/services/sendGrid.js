// emailing services
const sgMail = require('@sendgrid/mail');

const keys = require('../config/keys');
const populateHtmlTemplate = require('./sendGrid-Htmltemplate').populateHtmlTemplate;
const populateNewBidHtmlTemplate = populateHtmlTemplate; //require('./sendGrid-Htmltemplate-newBid').populateHtmlTemplate;
const populateRequestUpdates = populateHtmlTemplate; //require('./sendGrid-Htmltemplate-requestUpdates').populateHtmlTemplate;

sgMail.setApiKey(keys.sendGridKey);

exports.EmailService = {
  sendEmailVerificationCode: ({ emailVerificationCode, to, toDisplayName }) => {
    const msg = {
      to,
      toDisplayName,
      from: 'bidorboo@bidorboo.ca',
      subject: `Email Verification Code`,
      text: `Your BidOrBoo Email Verification Code is inside`,
      html: populateHtmlTemplate({
        toDisplayName,
        contentHtml: `
        <p>Your BidOrBoo Email verification code is:</p>
        <p><strong>${emailVerificationCode}</strong></p>
        `,
        clickDisplayName: 'Verify Email',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  sendNewBidRecievedEmail: ({ to, toDisplayName, taskName, clickLink }) => {
    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Your ${taskName} request has received a new bid`,
      text: `Your ${taskName} received a new bid`,
      html: populateNewBidHtmlTemplate({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Exciting news! Your ${taskName} request has received a new bid.</p>
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
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
    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Reminder: ${requestTitle} task is happening tomorrow!`,
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  // ============Hanan to continue here

  sendNewRequestInYourAreaNotification: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `new ${requestTitle} request was posted in your area`,
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellTaskerThatRequesterCancelledRequest: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellRequeterThatTheyHaveCancelledAnAwardedRequest: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellRequesterThatWeAutoDeletedTheirJob: ({ to, requestTitle, toDisplayName }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellRequesterToHurryUpAndAwardAbidder: ({ to, requestTitle, toDisplayName, clickLink }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellRequeterThatTheTaskerHaveCancelledAnAwardedRequest: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellTaskerThatTheyCancelledRequest: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellRequesterToConfirmCompletion: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    const msg = {
      to,
      from: 'bidorboo@bidorboo.ca',
      subject: `Confirm Tasker has completed ${requestTitle}!`,
      text: `Confirm that the Tasker had completed their work.`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <div style="font-family: inherit; text-align: inherit; font-weight: bold"><strong>Next Steps</strong></div>
        <ul>
          <li style="">Confirm that the Tasker had completed their work</li>
          <li style="">Then Rate your Tasker</li>
        </ul>
         `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'View Request',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellTaskerWeWaitingOnRequesterToConfirmCompletion: ({
    to,
    requestTitle,
    toDisplayName,
    linkForTasker,
  }) => {
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
          <li style="">Rate your Requester and experience</li>
          <li style="">We notified the Requester to confirm this task's completion</li>
          <li style="">Payment for this task will be released once we recieve the confirmation</li>
        </ul>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Request Details',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellRequesterRequestIsCompleteBeginRating: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
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
        clickDisplayName: 'Rate The Tasker',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellTaskerRequestIsCompleteBeginRating: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
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
          <li style="">Rate the Requester</li>
          <li style="">We notified the Requester to confirm this task's completion</li>
          <li style="">Payment for this task will be released once we recieve the confirmation</li>
        </ul>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Rate The Requester',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellRequesterThanksforPaymentAndTaskerIsRevealed: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
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
          <li style="">Get in touch with the Tasker to sprcify the exact task location and meeting time details</li>
        </ul>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'View Assigned Tasker',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellTaskerThatTheyWereAwarded: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellDisputeOwnerThatWeWillInvestigate: ({ to, requestTitle, toDisplayName, linkForTasker }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellRequesterThatWeMarkedRequestDone: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellRequesterToConfirmRequest: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
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

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  informBobCrewAboutFailedPayment: ({ requestId, paymentDetails }) => {
    const msg = {
      to: 'bidorboo@bidorboo.ca',
      from: 'bidorboo@bidorboo.ca',
      subject: `FAILED PAYOUT CASE: ${requestId}`,
      text: `Payment to bank was not successful follow up with user
    ${JSON.stringify(paymentDetails)}`,
      html: `
      <p>Payment to bank was not successful follow up with user
        ${JSON.stringify(paymentDetails)}.</p>
      `,
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  informBobCrewAboutSuccessPayment: ({ requestId, paymentDetails }) => {
    const msg = {
      to: 'bidorboo@bidorboo.ca',
      from: 'bidorboo@bidorboo.ca',
      subject: `SUCCESS PAYOUT CASE: ${requestId}`,
      html: `
      <p>Payment to bank was successful
        ${JSON.stringify(paymentDetails)}.</p>
      `,
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
};
