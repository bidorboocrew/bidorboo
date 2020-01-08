// emailing services
const sgMail = require('@sendgrid/mail');

const keys = require('../config/keys');
const populateHtmlTemplate = require('./sendGrid-Htmltemplate').populateHtmlTemplate;
const populateNewBidHtmlTemplate = require('./sendGrid-Htmltemplate-newBid').populateHtmlTemplate;
const populateRequestUpdates = require('./sendGrid-Htmltemplate-requestUpdates')
  .populateHtmlTemplate;

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
        <p>Email Verification Code</p>
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
        <p>Check the bids and award a Tasker</p>`,
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
      subject: `Task reminder: you have an upcoming ${requestTitle} task!`,
      text: `
        This is an automated reminder for your upcoming ${requestTitle} task.
        Get in touch with the requester to agree on exact location and time details.
     `,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>This is an automated reminder for your upcoming ${requestTitle} task.</p>
        <p>Get in touch with the requester to agree on exact location and time details.</p>
        <div>
        <strong>Email address:</strong> <a href="mailto:${ownerEmailAddress}?subject=BidOrBoo - Iam the tasker for ${requestTitle}">${ownerEmailAddress}</a>
        </div>
        <div>
        <strong>Phone number:</srtong> <a href="tel:${ownerPhoneNumber}">${ownerPhoneNumber}</a>
        </div>`,
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
        <p>Act fast, be the first to bid on it</p>
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
      subject: `${requestTitle} is Happening Soon !`,
      text: `This is an automated reminder for your upcoming scheduled ${requestTitle}.
      Get in touch with the requester to agree on exact location and time details.`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>This is an automated reminder for your upcoming scheduled ${requestTitle} task.</p>
        <p>Get in touch with the requester to agree on exact location and time details.</p>
        <div>
        <strong>email address:</strong> <a href="mailto:${taskerEmailAddress}?subject=BidOrBoo - Iam expecting you soon for ${requestTitle}">${taskerEmailAddress}</a>
        </div>
        <div>
        <strong>phone number:</srtong> <a href="tel:${taskerPhoneNumber}">${taskerPhoneNumber}</a>
        </div>`,
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
        contentHtml: `<p>We are sorry to inform you that this Request has been cancelled by the requester.</p>
        <p>You are no longer assigned and should not show up to do this task</p>
        <p>click to View details and understand the full impact</p>
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
        <p>We will inform the tasker about this to ensure that they will NOT show up.</p>
        <p>click to View details and understand the full impact</p>`,
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
        contentHtml: `<p>This request ${requestTitle} did not recieve any bids and it is Past due so we automatically deleted it.</p>
        <p>Feel free to post a new Request</p>
        `,
        clickLink: `https://www.bidorboo.ca/bdb-request/root`,
        clickDisplayName: 'Post A Request',
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
        contentHtml: `<p>This request ${requestTitle} is happening soon and has Bids, Hurry up award it to a Tasker before the due date</p>
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
        contentHtml: `<p>We are sorry to inform you that things did not work out!</p>
        <p>The tasker cancelled their agreement and thus will NOT show up to do this task.</p>
        <p>click to View details and understand the full impact</p>
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
      subject: `you have cancelled your ${requestTitle} bookin!`,
      text: `
      You have cancelled your agreement and thus you should NOT show up or do the task.
      It Happens! We understand that life is sometimes unpredictable
      and we are sorry to hear that things did not work out!
     `,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>You have cancelled your agreement and thus you should NOT show up or do the task.</p>

        <p>It Happens! We understand that life is sometimes unpredictable</p>
        <p>and we are sorry to hear that things did not work out!</p>
        <p>click to View details and understand the full impact</p>
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
      text: `We are waiting on you to confirm that our Tasker have completed the request.`,
      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>We are waiting on you to confirm that our Tasker have completed the request</p>
        <p>We hope that they done so to your satisfaction.</p>
        <p>View the request to confirm that it is completed</p>
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
        <p>We are reaching out to the Requester to get the final confirmation that you completed your work.</p>
        <p>This will happen shortly and your payment will be released upon this confirmation.</p>
        <p>We will keep you posted of any updates. click to View details</p>
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

        <p>Now it is your turn to rate the Tasker</p>
         <p>click to view the details</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Request Details',
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
      Your payout is on the way and you should recieve it within 5-10 business days`,

      html: populateRequestUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBoo is happy to hear that you've completed this request</p>
        <p>Your payout is on the way and you should recieve it within 5-10 business days</p>
        <p>Now it is your turn to rate the Requester</p>
        <p>click to view the details</p>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Request Details',
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
        <p>The Tasker will be ready to fulfill this request request.</p>
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
        <p>Your ${requestTitle} Bid Won and the request is Assigned to you!</p>
        <p>Please show up prepaired with all the tools required to fulfil this request</p>

        <p>Remember that showing up on time, clear communication, good manners and thourough work will lead to higher ratings</p>
       `,
        clickLink: `${linkForTasker}`,
        clickDisplayName: 'Request Details',
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
        <p>We are sorry for your inconvienience and want you to know that we will investigat and resolve this asap!</p>
        <p>we will keep you posted with any updates soon.</p>
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
        <p>BidOrBoo is happy to hear that your ${requestTitle} request was fulfilled</p>
        <p> Since you did not confirm the completion in the past 3 days we went ahead and marked this request as completed.</p>
        <p>Please rate the Tasker</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Request Details',
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
        <p>Please confirm the completion of this request asap</p>
        <p>click to view the details</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Request Details',
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
      text: `
     Investigate this dispute filed by user ${userIdWhoFiledDispute} about request ${requestId}.
     the claim details are :
    ${details}
    Additional info
    whoSubmitted = ${whoSubmitted},
    requesterDisplayName = ${requesterDisplayName},
    taskerDisplayName = ${taskerDisplayName},
    requestDisplayName = ${requestDisplayName},
    requestLinkForRequester = ${requestLinkForRequester},
    requestLinkForTasker = ${requestLinkForTasker},
    requesterEmailAddress = ${requesterEmailAddress},
    requesterPhoneNumber = ${requesterPhoneNumber},
    taskerEmailAddress = ${taskerEmailAddress},
    requestId = ${requestId},
    reason = ${reason},
    details = ${details},
    processedPayment= ${JSON.stringify(processedPayment)},
     `,

      html: `
      <p>Investigate this dispute filed by user ${userIdWhoFiledDispute} about request ${requestId}.</p>
      <p>the claim details are :</p>
      <p><strong>${details}</strong></p>
      <br>
      Additional info
    <p>whoSubmitted = ${whoSubmitted},</p>
    <p>requesterDisplayName = ${requesterDisplayName},</p>
    <p>taskerDisplayName = ${taskerDisplayName},</p>
    <p>requestDisplayName = ${requestDisplayName},</p>
    <p>requestLinkForRequester = ${requestLinkForRequester},</p>
    <p>requestLinkForTasker = ${requestLinkForTasker},</p>
    <div>
    <a href="mailto:${requesterEmailAddress}?subject=BidOrBoo DISPUTE"><strong>requesterEmailAddress:</strong> ${requesterEmailAddress}</a>
    </div>
    <div>
    <a href="tel:${requesterPhoneNumber}"><strong>requesterPhoneNumber</srtong>: ${requesterPhoneNumber},</a>
    </div>
    <div>
    <a href="mailto:${taskerEmailAddress}?subject=BidOrBoo DISPUTE"><strong>taskerEmailAddress:</strong> ${taskerEmailAddress}</a>
    </div>
    <p>requestId = ${requestId},</p>
    <p>reason = ${reason},</p>
    <p>details = ${details},</p>
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
      text: ` Payment to bank was not successful follow up with user
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
};
