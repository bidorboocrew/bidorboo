// emailing services
const sgMail = require('@sendgrid/mail');

const keys = require('../config/keys');
const populateHtmlTemplate = require('./sendGrid-Htmltemplate').populateHtmlTemplate;
const populateNewBidHtmlTemplate = require('./sendGrid-Htmltemplate-newBid').populateHtmlTemplate;
const populateJobUpdates = require('./sendGrid-Htmltemplate-jobUpdates').populateHtmlTemplate;

sgMail.setApiKey(keys.sendGridKey);

exports.EmailService = {
  sendEmail: ({
    from = 'bidorboocrew@gmail.com',
    to,
    subject,
    contentText,
    toDisplayName,
    contentHtml,
    clickLink,
    clickDisplayName,
    callback,
  }) => {
    const msg = {
      to,
      from,
      subject,
      text: contentText,
      html: populateHtmlTemplate({
        toDisplayName: toDisplayName || to,
        contentHtml,
        clickLink,
        clickDisplayName,
      }),
    };
    // function(error, response) {
    //   console.log(response.statusCode);
    //   console.log(response.body);
    //   console.log(response.headers);
    // }
    sgMail.send(msg);
  },
  sendNewBidRecievedEmail: ({ to, toDisplayName, taskName, clickLink }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
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
    sgMail.send(msg);
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
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: ${requestTitle} is Happening Soon !`,
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
        <p><strong>email address : ${ownerEmailAddress}</strong></p>
        <p><strong>phone number : ${ownerPhoneNumber}</strong></p>`,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'View Request Details',
      }),
    };
    // function(error, response) {
    //   console.log(response.statusCode);
    //   console.log(response.body);
    //   console.log(response.headers);
    // }
    sgMail.send(msg);
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
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: ${requestTitle} is Happening Soon !`,
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
      <p><strong>email address : ${bidderEmailAddress}</strong></p>
      <p><strong>phone number : ${bidderPhoneNumber}</strong></p>`,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'View Request Details',
      }),
    };

    sgMail.send(msg);
  },
  tellTaskerThatRequesterCancelledJob: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: ${requestTitle} has been cancelled by the Requester !`,
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
    sgMail.send(msg);
  },

  tellRequeterThatTheyHaveCancelledAnAwardedJob: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: You have cancelled ${requestTitle}!`,
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
    sgMail.send(msg);
  },

  tellRequeterThatTheTaskerHaveCancelledAnAwardedJob: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: Tasker have cancelled ${requestTitle}!`,
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
    sgMail.send(msg);
  },
  tellTaskerThatTheyCancelledJob: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: you have cancelled your ${requestTitle} agreement !`,
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
    sgMail.send(msg);
  },

  tellRequesterToConfirmCompletion: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: Confirm Tasker has completed ${requestTitle}!`,
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
    sgMail.send(msg);
  },

  tellTaskerWeWaitingOnRequesterToConfirmCompletion: ({
    to,
    requestTitle,
    toDisplayName,
    linkForBidder,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: waiting on requester's confirmation for the completion of ${requestTitle}!`,
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
    sgMail.send(msg);
  },

  tellRequesterJobIsCompleteBeginRating: ({ to, requestTitle, toDisplayName, linkForOwner }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: ${requestTitle} is Completed!`,
      text: `BidOrBooCrew is SUPPER HAPPY to hear that the request was fulfilled.

      Now it is your turn to RATE your Tasker and tell them how well they did
     click to view the details
       ${linkForOwner}
     `,
      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBooCrew is SUPPER HAPPY to hear that the request was fulfilled.</p>

        <p>Now it is your turn to RATE your Tasker and tell them how well they did</p>
         <p>click to view the details</p>
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Completed Request Details',
      }),
    };
    sgMail.send(msg);
  },

  tellTaskerJobIsCompleteBeginRating: ({ to, requestTitle, toDisplayName, linkForBidder }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: ${requestTitle} is Completed!`,
      text: `BidOrBooCrew is SUPPER HAPPY to hear that you've completed your task
      Your payout is on the way and you should recieve it within 5-10 business days

      Now it is your turn to RATE your Requester and tell them how accurate was the description of the task
      click to view the details
       ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: toDisplayName || to,
        contentHtml: `
        <p>BidOrBooCrew is SUPPER HAPPY to hear that you've completed your task</p>
        <p>Your payout is on the way and you should recieve it within 5-10 business days</p>
        <p>Now it is your turn to RATE your Requester and tell them how accurate was the description of the task</p>
        <p>click to view the details</p>
       `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'Cancelled Request Details',
      }),
    };
    sgMail.send(msg);
  },
};
