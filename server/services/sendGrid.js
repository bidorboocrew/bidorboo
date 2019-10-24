// emailing services
const sgMail = require('@sendgrid/mail');

const keys = require('../config/keys');
const populateHtmlTemplate = require('./sendGrid-Htmltemplate').populateHtmlTemplate;
const populateNewBidHtmlTemplate = require('./sendGrid-Htmltemplate-newBid').populateHtmlTemplate;
const populateJobUpdates = require('./sendGrid-Htmltemplate-jobUpdates').populateHtmlTemplate;

sgMail.setApiKey(keys.sendGridKey);

exports.EmailService = {
  sendEmailVerificationCode: ({ emailVerificationCode, to, toDisplayName }) => {
    const msg = {
      to,
      toDisplayName,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: Verification Code ${emailVerificationCode}`,
      text: `Your BIDORBOO Email Verification Code is ${emailVerificationCode}`,
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
      from: 'bidorboocrew@bidorboo.com',
      subject: `Your ${taskName} request has recieved a new bid`,
      text: `Exciting news! Your ${taskName} request has recieved a new bid. Check the bids and award a Tasker when the price is right`,
      html: populateNewBidHtmlTemplate({
        toDisplayName: toDisplayName || to,
        contentHtml: `${taskName}`,
        clickLink,
        clickDisplayName: 'View The Bid',
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

  sendJobIsHappeningSoonToTaskerEmail: ({
    to,
    requestTitle,
    toDisplayName,
    ownerEmailAddress,
    ownerPhoneNumber,
    linkForBidder,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: ${requestTitle} is Happening Soon !`,
      text: `
        This is an automated reminder for your upcoming scheduled ${requestTitle}.
        To get in touch with your task owner feel free to contact them on:
        email address : ${ownerEmailAddress}
        phone number : ${ownerPhoneNumber}
        for reference here is the link to your task ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>This is an automated reminder for your upcoming scheduled ${requestTitle} task.</p>
        <p>To get in touch with your task owner feel free to contact them on:</p>
        <div>
        <strong>email address:</strong> <a href="mailto:${ownerEmailAddress}?subject=BIDORBOO - Iam your tasker for ${requestTitle}">${ownerEmailAddress}</a>
        </div>
        <div>
        <strong>phone number:</srtong> <a href="tel:${ownerPhoneNumber}">${ownerPhoneNumber}</a>
        </div>`,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'View Request Details',
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

  sendNewJobInYourAreaNotification: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `new ${requestTitle} request was posted in your area`,
      text: `
      ${requestTitle} request was posted in your area.
      Act fast, be the first to bid on it
      ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>${requestTitle} request was posted in your area.</p>
        <p>Act fast, be the first to bid on it</p>
        `,
        clickLink: `${linkForBidder}`,
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

  sendJobIsHappeningSoonToRequesterEmail: ({
    to,
    requestTitle,
    toDisplayName,
    bidderEmailAddress,
    bidderPhoneNumber,
    linkForOwner,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: ${requestTitle} is Happening Soon !`,
      text: `This is an automated reminder for your upcoming scheduled ${requestTitle}.
    To get in touch with your assigned Tasker feel free to contact them on:
    email address : ${bidderEmailAddress}
    phone number : ${bidderPhoneNumber}
    for reference here is the link to your task ${linkForOwner}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>This is an automated reminder for your upcoming scheduled ${requestTitle} task.</p>
        <p>To get in touch with your assigned Tasker owner feel free to contact them on:</p>
        <div>
        <strong>email address:</strong> <a href="mailto:${bidderEmailAddress}?subject=BIDORBOO - Iam expecting you soon for ${requestTitle}">${bidderEmailAddress}</a>
        </div>
        <div>
        <strong>phone number:</srtong> <a href="tel:${bidderPhoneNumber}">${bidderPhoneNumber}</a>
        </div>`,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'View Request Details',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellTaskerThatRequesterCancelledJob: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: ${requestTitle} has been cancelled by the Requester !`,
      text: `We are sorry to inform you that this Request has been cancelled by the requester.
      click to View details and understand the full impact  ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>We are sorry to inform you that this Request has been cancelled by the requester.</p>
        <p>click to View details and understand the full impact</p>
       `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'Cancelled Request Details',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellRequeterThatTheyHaveCancelledAnAwardedJob: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: You have cancelled ${requestTitle}!`,
      text: `We are sorry to hear that things did not work out.
      We will inform the tasker about this to ensure that they will NOT show up.

      click to View details and understand the full impact
       ${linkForOwner}
     `,
      html: populateJobUpdates({
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

  tellRequeterThatTheTaskerHaveCancelledAnAwardedJob: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: Tasker have cancelled ${requestTitle}!`,
      text: `It Happens! We are sorry to inform you that things did not work out!

      The tasker cancelled their agreement and thus will NOT show up to do this task.

      click to View details and understand the full impact ${linkForOwner}
     `,
      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>It Happens! We are sorry to inform you that things did not work out!</p>

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
  tellTaskerThatTheyCancelledJob: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: you have cancelled your ${requestTitle} agreement !`,
      text: `
      You have cancelled your agreement and thus will NOT show up to do this task.

      It Happens! We understand that life is sometimes unpredictable
      and we are sorry to hear that things did not work out!
      click to View details and understand the full impact ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>You have cancelled your agreement and thus will NOT show up to do this task.</p>

        <p>It Happens! We understand that life is sometimes unpredictable</p>
        <p>and we are sorry to hear that things did not work out!</p>
        <p>click to View details and understand the full impact</p>
       `,
        clickLink: `${linkForBidder}`,
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
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: Confirm Tasker has completed ${requestTitle}!`,
      text: `BidOrBooCrew is happy to hear that the tasker has finished their work, and we hope that they done so to your satisfaction.

      We are waiting on you to confirm that our Tasker have completed your request ${linkForOwner}`,
      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `<p>BidOrBooCrew is happy to hear that the tasker has finished their work</p>
        <p>We hope that they done so to your satisfaction.</p>
        <p>We are waiting on you to confirm that our Tasker have completed your request</p>
        <p>click to View details and confirm the completion</p>
         `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Confirm Task Is Done',
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
    linkForBidder,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: waiting on requester's confirmation for the completion of ${requestTitle}!`,
      text: `
      Thank you for completing your Task!
      We are reaching out to the Requester to get the final confirmation that you completed your work.
      This will happen shortly and your payment will be released upon this confirmation.
      We will keep you posted of any updates. click to View details ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Thank you for completing your Task!</p>
        <p>We are reaching out to the Requester to get the final confirmation that you completed your work.</p>
        <p>This will happen shortly and your payment will be released upon this confirmation.</p>
        <p>We will keep you posted of any updates. click to View details</p>
       `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'View Request Details',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellRequesterJobIsCompleteBeginRating: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: ${requestTitle} is Completed!`,
      text: `BidOrBooCrew is SUPER HAPPY to hear that the request was fulfilled.

      Now it is your turn to RATE your Tasker and tell them how well they did
     click to view the details
       ${linkForOwner}
     `,
      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBooCrew is SUPER HAPPY to hear that the request was fulfilled.</p>

        <p>Now it is your turn to RATE your Tasker and tell them how well they did</p>
         <p>click to view the details</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Completed Request Details',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellTaskerJobIsCompleteBeginRating: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: ${requestTitle} is Completed!`,
      text: `BidOrBooCrew is SUPER HAPPY to hear that you've completed your task
      Your payout is on the way and you should recieve it within 5-10 business days

      Now it is your turn to RATE your Requester and tell them how accurate was the description of the task
      click to view the details
       ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBooCrew is SUPER HAPPY to hear that you've completed your task</p>
        <p>Your payout is on the way and you should recieve it within 5-10 business days</p>
        <p>Now it is your turn to RATE your Requester and tell them how accurate was the description of the task</p>
        <p>click to view the details</p>
       `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'Completed Request Details',
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
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: ${requestTitle} Payment successful!`,
      text: `
      Thank you for your paymen! We've notified the Tasker
      The assigned Tasker will be ready to do a great job and fulfil your service.
       ${linkForOwner}
     `,
      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Thank you for your payment! We've notified the Tasker</p>
        <p>The Tasker will be ready to do a great job and fulfil your service.</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Assigned Tasker Details',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },

  tellTaskerThatTheyWereAwarded: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: Your Bid Won !`,
      text: `
      Your ${requestTitle} Bid Won and the request is Assigned to you!
      Please show up prepaired with all the tools required to fulfil this request to the best of your ability

      Remember, showing up on time , clear communication, good manners and thourough work will lead to higher ratings

      For any changes or to get in touch with the requeter visit the link below
       ${linkForBidder}
     `,
      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>Your ${requestTitle} Bid Won and the request is Assigned to you!</p>
        <p>Please show up prepaired with all the tools required to fulfil this request to the best of your ability</p>

        <p>Remember, showing up on time , clear communication, good manners and thourough work will lead to higher ratings</p>

      <p>For any changes or to get in touch with the requeter visit the link below</p>
       `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'Assigned Request Details',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellDisputeOwnerThatWeWillInvestigate: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: We recieved your dispute regarding ${requestTitle}!`,
      text: `
      We are sorry for your inconvienience and want you to know that we will investigat and resolve this asap!
      we will keep you posted with any updates soon. here is the task link for reference
      ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>We are sorry for your inconvienience and want you to know that we will investigat and resolve this asap!</p>
        <p>we will keep you posted with any updates soon. here is the task link for reference </p>
       `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'View Disputed Task',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  informBobCrewAboutFailedPayment: ({ jobId, paymentDetails }) => {
    const msg = {
      to: 'bidorboocrew@bidorboo.com',
      from: 'bidorboocrew@bidorboo.com',
      subject: `FAILED PAYOUT CASE: ${jobId}`,
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

  tellRequesterThatWeMarkedJobDone: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO Marked ${requestTitle} as Complete`,
      text: `BidOrBooCrew is SUPER HAPPY to hear that your ${requestTitle} request was fulfilled.
      Since you did not confirm the completion in the past 3 days we went ahead and marked this job as completed.
      Please rate your Tasker
       ${linkForOwner}
     `,
      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBooCrew is SUPER HAPPY to hear that your ${requestTitle} request was fulfilled</p>
        <p> Since you did not confirm the completion in the past 3 days we went ahead and marked this job as completed.</p>
        <p>Please rate your Tasker</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Completed Request Details',
      }),
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
  tellRequesterToConfirmJob: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    const msg = {
      to,
      from: 'bidorboocrew@bidorboo.com',
      subject: `BIDORBOO: Confirm ${requestTitle} completion!`,
      text: `BidOrBooCrew is SUPER HAPPY to hear that your ${requestTitle} request was fulfilled.

      Please confirm the completion of this request and rate your Tasker
       ${linkForOwner}
     `,
      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBooCrew is SUPER HAPPY to hear that your ${requestTitle} request was fulfilled.</p>

        <p>Please confirm the completion of this request and rate your Tasker</p>
         <p>click to view the details</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Completed Request Details',
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
    jobDisplayName,
    requestLinkForRequester,
    requestLinkForTasker,
    requesterEmailAddress,
    requesterPhoneNumber,
    taskerEmailAddress,
    processedPayment,
    jobId,
    reason,
    details,
    userIdWhoFiledDispute,
  }) => {
    const msg = {
      to: 'bidorboocrew@bidorboo.com',
      from: 'bidorboocrew@bidorboo.com',
      subject: `DISPUTE CASE: ${reason} submitted by ${whoSubmitted}`,
      text: `
     Investigate this dispute filed by user ${userIdWhoFiledDispute} about job ${jobId}.
     the claim details are :
    ${details}
    Additional info
    whoSubmitted = ${whoSubmitted},
    requesterDisplayName = ${requesterDisplayName},
    taskerDisplayName = ${taskerDisplayName},
    jobDisplayName = ${jobDisplayName},
    requestLinkForRequester = ${requestLinkForRequester},
    requestLinkForTasker = ${requestLinkForTasker},
    requesterEmailAddress = ${requesterEmailAddress},
    requesterPhoneNumber = ${requesterPhoneNumber},
    taskerEmailAddress = ${taskerEmailAddress},
    jobId = ${jobId},
    reason = ${reason},
    details = ${details},
    processedPayment= ${JSON.stringify(processedPayment)},
     `,

      html: `
      <p>Investigate this dispute filed by user ${userIdWhoFiledDispute} about job ${jobId}.</p>
      <p>the claim details are :</p>
      <p><strong>${details}</strong></p>
      <br>
      Additional info
    <p>whoSubmitted = ${whoSubmitted},</p>
    <p>requesterDisplayName = ${requesterDisplayName},</p>
    <p>taskerDisplayName = ${taskerDisplayName},</p>
    <p>jobDisplayName = ${jobDisplayName},</p>
    <p>requestLinkForRequester = ${requestLinkForRequester},</p>
    <p>requestLinkForTasker = ${requestLinkForTasker},</p>
    <div>
    <a href="mailto:${requesterEmailAddress}?subject=BIDORBOO DISPUTE"><strong>requesterEmailAddress:</strong> ${requesterEmailAddress}</a>
    </div>
    <div>
    <a href="tel:${requesterPhoneNumber}"><strong>requesterPhoneNumber</srtong>: ${requesterPhoneNumber},</a>
    </div>
    <div>
    <a href="mailto:${taskerEmailAddress}?subject=BIDORBOO DISPUTE"><strong>taskerEmailAddress:</strong> ${taskerEmailAddress}</a>
    </div>
    <p>jobId = ${jobId},</p>
    <p>reason = ${reason},</p>
    <p>details = ${details},</p>
    <p>processedPayment = ${JSON.stringify(processedPayment)},</p>
      `,
    };

    sgMail.send(msg).catch((e) => {
      console.log('BIDORBOO_ERROR: SENDGRID MAILING ISSUE ' + JSON.stringify(e));
    });
  },
};
