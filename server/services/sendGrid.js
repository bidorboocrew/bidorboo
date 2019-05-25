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
        toDisplayName: to || toDisplayName,
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
        toDisplayName: to || toDisplayName,
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
      text: `This is an automated reminder for your upcoming scheduled ${requestTitle}.
    To get in touch with your task owner feel free to contact them on:
    email address : ${ownerEmailAddress}
    phone number : ${ownerPhoneNumber}
    for reference here is the link to your task ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: to || toDisplayName,
        contentHtml: `This is an automated reminder for your upcoming scheduled ${requestTitle} task.
      To get in touch with your task owner feel free to contact them on:
      email address : ${ownerEmailAddress}
      phone number : ${ownerPhoneNumber}

      Note : After You finish your work. please make sure to confirm completion and review the requester.
      `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'View Reqeust Details',
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
        toDisplayName: to || toDisplayName,
        contentHtml: `This is an automated reminder for your upcoming scheduled ${requestTitle} task.
      To get in touch with your assigned Tasker owner feel free to contact them on:
      email address : ${bidderEmailAddress}
      phone number : ${bidderPhoneNumber}.

      Note : After the Tasker finishes thier work please make sure to confirm completion and review the quality of thier work`,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'View Reqeust Details',
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
      As part of our policy, you will still get 15% of the total bid price for your inconvenience.
      Furthermore in order to ensure serious requests on our platform this cancellation will impact the overall rating of the Requester or may ban them if it happens often
      We wish you best of luck! keep bidding keep winning !
    for reference here is the link to your task ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: to || toDisplayName,
        contentHtml: `We are sorry to inform you that this Request has been cancelled by the requester.
        You are no longer assigned to this request and will not required to show up.

        As part of our policy, you will still get 10% of the total bid price for your inconvenience.
        Furthermore in order to ensure serious requests on our platform this cancellation will impact the overall rating of the Requester or may ban them if it happens often
        We wish you best of luck! keep bidding keep winning !
      for reference here is the link to your task ${linkForBidder}
       `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'Cancelled Reqeust Details',
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

      However, As part of our policy, you will be refunded 80% of your payment in order to compensate the Tasker for the last minute cancellation inconvenience.
      Furthermore This action may impact your global rating and ban you if you cancel often.
    for reference here is the link to your task ${linkForOwner}
    We hope you understand that though these actions may sound severe it is our only way of avoiding misuse of our platform.
     `,
      html: populateJobUpdates({
        toDisplayName: to || toDisplayName,
        contentHtml: `We are sorry to hear that things did not work out.
        We will inform the tasker about this to ensure that they will NOT show up.
        However, As part of our policy, you will be refunded 80% of your payment in order to compensate the Tasker for the last minute cancellation inconvenience.
        Furthermore This action may impact your global rating and ban you if you cancel often.
      for reference here is the link to your task ${linkForOwner}
      We hope you understand that though these actions may sound severe it is our only way of avoiding misuse of our platform.
       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Cancelled Reqeust Details',
      }),
    };
    sgMail.send(msg);
  },

  tellRequeterThatTheTaskerHaveCancelledAnAwardedJob: ({
    to,
    requestTitle,
    toDisplayName,
    linkForOwner,
    isPastDue,
  }) => {
    const msg = {
      to,
      from: 'bidorboocrew@gmail.com',
      subject: `BidOrBoo: Tasker have cancelled ${requestTitle}!`,
      text: `It Happens! We are sorry to inform you that things did not work out!

      The tasker cancelled their agreement and thus will NOT show up to do this task.

      ${
        !isPastDue
          ? 'We reopened the task, go ahead and select another tasker if one is available'
          : 'The scheduled date for this task is unfortounately past due. Please go and create another task'
      }
      As part of our policy, you will be refunded 100% of your payment in order to compensate the Tasker for the last minute cancellation inconvenience.
      Furthermore This action may impact your global rating and ban the tasker if they cancel often.

    For reference here is the link to your task ${linkForOwner}

     `,
      html: populateJobUpdates({
        toDisplayName: to || toDisplayName,
        contentHtml: `It Happens! We are sorry to inform you that things did not work out!

        The tasker cancelled their agreement and thus will NOT show up to do this task.


        As part of our policy, you will be refunded 100% of your payment in order to compensate the Tasker for the last minute cancellation inconvenience.
        Furthermore This action may impact your global rating and ban the tasker if they cancel often.

      For reference here is the link to your task ${linkForOwner}

       `,
        clickLink: `${linkForOwner}`,
        clickDisplayName: 'Cancelled Reqeust Details',
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

      As part of our policy, you will not get paid as you have cancelled

      Furthermore This action may impact your global rating and cause a ban if you cancel often.

    For reference here is the link to your task ${linkForBidder}
     `,

      html: populateJobUpdates({
        toDisplayName: to || toDisplayName,
        contentHtml: `
        You have cancelled your agreement and thus will NOT show up to do this task.

        It Happens! We understand that life is sometimes unpredictable
        and we are sorry to hear that things did not work out!

        As part of our policy, you will not get paid as you have cancelled

        Furthermore This action may impact your global rating and cause a ban if you cancel often.

      For reference here is the link to your task ${linkForBidder}
       `,
        clickLink: `${linkForBidder}`,
        clickDisplayName: 'Cancelled Reqeust Details',
      }),
    };
    sgMail.send(msg);
  },
};
