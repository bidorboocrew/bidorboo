import React from 'react';
// https://transform.tools/html-to-jsx
// https://html-cleaner.com/

export default class TermsOfService extends React.Component {
  render() {
    return (
      <>
        <section className="hero is-white">
          <div className="hero-body">
            <div style={{ background: 'white' }} className="container">
              <section className="hero is-white is-small">
                <div className="hero-body has-text-centered">
                  <div className="container">
                    <h1 className="title">BIDORBOO Inc</h1>
                    <h2 className="subtitle">
                      <a className="has-text-link has-text-weight-semibold" href="#TermsOfService">
                        Terms Of Service
                      </a>{' '}
                      And{' '}
                      <a className="has-text-link has-text-weight-semibold" href="#PrivacyPolicy">
                        Privacy Policy
                      </a>{' '}
                      Agreements
                    </h2>
                  </div>
                </div>
              </section>

              <section className="hero is-info is-small">
                <div className="hero-body has-text-centered">
                  <div className="container">
                    <a className="title" name="TermsOfService">
                      Terms Of Service
                    </a>
                  </div>
                </div>
              </section>

              <TOS></TOS>

              <section className="hero is-info is-small">
                <div className="hero-body has-text-centered">
                  <div className="container">
                    <a className="title" name="PrivacyPolicy">
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </section>

              <POS></POS>
            </div>
          </div>
        </section>
      </>
    );
  }
}
const POS = () => {
  return (
    <div>
      <p>Terms Of Servic Agreement</p>
      <p>&nbsp;</p>
      <p>
        BIDORBOO INC., and its affiliates or corporate partners, ("
        <strong>BidOrBoo</strong>" or "<strong>we</strong>"), collect, use, and disclose in
        compliance with Canadian and applicable laws when providing services to our BidOrBoo users
        and individuals who reach out to us, including both Taskers, Requesters, and other people
        getting in touch with us (together, “<strong>you</strong>” or “<strong>your</strong>”).
        &nbsp;Along with our Terms of Service, this Policy serves to let you know how we collect,
        use, and disclose your personal information.
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>WHAT IS PERSONAL INFORMATION</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        The Canadian government defines <em>personal information</em> as any factual or subjective
        information, recorded or not, about an identifiable individual.&nbsp; For instance, personal
        information includes age, name, ID numbers, income, ethnic origin, blood type, opinions,
        evaluations, comments, social status, disciplinary actions, employee files, credit records,
        loan records, and medical records.
      </p>
      <p>&nbsp;</p>
      <p>
        We are responsible for the personal information that we possess or control. We maintain
        internal practices to protect personal information and have appointed a Privacy Officer to
        oversee privacy matters.
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>WHAT PERSONAL INFORMATION DO WE COLLECT</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>The types of personal information we collect about you or have access to include:</p>
      <ul>
        <li>Name;</li>
        <li>Username;</li>
        <li>Profile picture (if you provide one);</li>
        <li>Address;</li>
        <li>Email;</li>
        <li>Phone number;</li>
        <li>IP address;</li>
        <li>Payment information; and</li>
        <li>Other information that we need to provide services to you.</li>
      </ul>
      <p>&nbsp;</p>
      <p>If you are a Tasker, in some cases, we may also collect or require your:</p>
      <ul>
        <li>
          Stripe account ID – Stripe may require your bank information, including account, transit,
          and institution numbers (we do not keep bank or financial information rather it is
          collected and kept by Stripe);
        </li>
        <li>Copy of government issued ID;</li>
        <li>Social insurance number;</li>
        <li>Proof of police record check or other certifications; and</li>
        <li>Reviews about you posted on our Websites.</li>
      </ul>
      <p>&nbsp;</p>
      <p>
        If you have reached out to us for employment opportunities, we collect personal information
        including your name, address, telephone number, date of birth, social insurance number,
        banking information, benefit information, emergency contact information, resume, reference
        letters, and/or police record or RCMP record checks.
      </p>
      <p>&nbsp;</p>
      <p>
        We also collect information through e-mail communications and your use of our websites
        located at https://www.bidorboo.com and https://www.bidorboo.ca (“<strong>Websites</strong>
        ”). We collect this information to adjust our content, verify your credentials or
        authenticate you, and understand your preferences and online activities using BidOrBoo.
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>WHY WE COLLECT, USE AND DISCLOSE PERSONAL INFORMATION</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        We collect, use, and disclose personal information for the primary purpose of providing our
        services, namely connecting Taskers and Requesters online.&nbsp; To provide this service, we
        use personal information:
      </p>
      <ul>
        <li>to maintain our relationship with you, our suppliers and other third parties</li>
        <li>to answer your inquiries or questions;</li>
        <li>to collect and process payments;</li>
        <li>to update you on changes to our practices and procedures;</li>
        <li>to send updates to our mailing list subscribers;</li>
        <li>to develop and manage our operations;</li>
        <li>to detect and protect against error, fraud, theft and other illegal activity;</li>
        <li>to authenticate you when you contact us;</li>
        <li>to verify your bank account and identity; and</li>
        <li>as permitted by, and to comply with, applicable laws.</li>
      </ul>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        For people who contact us regarding a job at BidOrBoo, we would also use your personal
        information to communicate with you about the job.
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>Our Websites</strong>
      </p>
      <p>
        <em>&nbsp;</em>
      </p>
      <p>
        <em>Cookies</em>
      </p>
      <p>
        We collect personal information using cookies on our Websites. <em>Cookies</em> are small
        files placed on your devices to track how you use our website. This helps us improve your
        user experience and save your preferences.&nbsp;
      </p>
      <p>&nbsp;</p>
      <p>
        We use functional cookies that are required for to use the Platform including, but not
        limited to:
      </p>
      <ul>
        <li>third-party cookies to ensure safety and security;</li>
        <li>
          <a target="_blank" rel="noopener noreferrer" href="https://policies.google.com/terms">
            Google RECAPTCHA
          </a>
          ;
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://stripe.com/en-ca/connect-account/legal"
          >
            Stripe
          </a>
          ; and
        </li>
        <li>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://support.freshchat.com/support/solutions/articles/233584-updates-to-terms-of-service-and-privacy-policy"
          >
            Freshchat
          </a>
          .
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        We also use optional cookies activated upon consent like Google Analytics (see our
        Third-Party Service Providers).
      </p>
      <p>&nbsp;</p>
      <p>
        Some browsers can block cookies through your browser settings. Blocking cookies may affect
        the way our Websites works on your device.&nbsp;
      </p>
      <p>&nbsp;</p>
      <p>
        <em>Online Communications</em>
      </p>
      <p>
        Our Websites allows you to submit information to us through a form and through our chat
        system. We use the personal information you provide only to address your question or
        inquiry.
      </p>
      <p>&nbsp;</p>
      <p>
        We also send e-mails to the people in our contact database regarding updates to our services
        or practices.&nbsp; Our e-mails contain opt-out features and instructions on how to
        unsubscribe.&nbsp; You can also send us an email to [bidorboo@bidorboo.ca] to be removed
        from our contact list.&nbsp; You acknowledge that in some cases, we will need to
        authenticate you before processing the request.
      </p>
      <p>
        <em>&nbsp;</em>
      </p>
      <p>
        <em>Third Party Links</em>
      </p>
      <p>
        Our Websites contains links to other websites. Those other websites may also collect your
        personal information. We are not responsible for how those other websites collect, use or
        disclose your personal information. We strongly encourage you to review their privacy
        policies before providing them with your personal information.
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>Our Third-Party Service Providers</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        To the extent we engage third-party service providers, we try to ensure that those providers
        maintain comparable privacy protections and practices if they process your personal
        information.&nbsp; Some of our third-party service providers include:
      </p>
      <ul>
        <li>
          Cloudinary (
          <a target="_blank" rel="noopener noreferrer" href="https://cloudinary.com/privacy">
            https://cloudinary.com/privacy
          </a>
          );
        </li>
        <li>
          Amazon S3 (
          <a target="_blank" rel="noopener noreferrer" href="https://aws.amazon.com/privacy/">
            https://aws.amazon.com/privacy/
          </a>
          );
        </li>
        <li>
          Stripe (
          <a target="_blank" rel="noopener noreferrer" href="https://stripe.com/en-ca/privacy">
            https://stripe.com/en-ca/privacy
          </a>
          );
        </li>
        <li>
          Twilio (
          <a target="_blank" rel="noopener noreferrer" href="https://www.twilio.com/legal/privacy">
            https://www.twilio.com/legal/privacy
          </a>
          );
        </li>
        <li>
          Heroku (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://devcenter.heroku.com/articles/security-privacy-compliance"
          >
            https://devcenter.heroku.com/articles/security-privacy-compliance
          </a>
          );
        </li>
        <li>
          mongoLab (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.mongodb.com/legal/privacy-policy"
          >
            https://www.mongodb.com/legal/privacy-policy
          </a>
          );
        </li>
        <li>
          Bugsnag (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://docs.bugsnag.com/legal/privacy-policy/"
          >
            https://docs.bugsnag.com/legal/privacy-policy/
          </a>
          );
        </li>
        <li>
          LogDna (
          <a target="_blank" rel="noopener noreferrer" href="https://logdna.com/privacy/">
            https://logdna.com/privacy/
          </a>
          ); and
        </li>
        <li>
          Google (Analytics) (
          <a target="_blank" rel="noopener noreferrer" href="https://policies.google.com/privacy">
            https://policies.google.com/privacy
          </a>
          ).
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        We encourage you to read and review their privacy policies available through the links
        above.&nbsp; For more information on the service providers we engage, please contact our
        Privacy Officer at [bidorboo@bidorboo.ca].
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>YOUR CONSENT</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        We will obtain your express consent to collect, use and disclose your personal information
        wherever possible and where required by law. If you provide personal information directly to
        us, we assume you consented the processing of your information for the reason you provided
        your information. This applies where you have signed up as a Tasker or Requester, agreed to
        our Terms, or a representative has done so on your behalf.&nbsp;
      </p>
      <p>&nbsp;</p>
      <p>
        We do not collect, use or disclose personal information without consent unless authorized or
        required by law to do so, such as in the following circumstances:
      </p>
      <ul>
        <li>
          when the information is <em>publicly available</em>, such as in public directories,
          registries or published information;
        </li>
        <li>if we are required to disclose personal information to a lawful authority;</li>
        <li>in an emergency that threatens someone’s life, health or personal security;</li>
        <li>for security reasons; or</li>
        <li>as otherwise authorized by law.</li>
      </ul>
      <p>&nbsp;</p>
      <p>
        We obtain electronic or oral consent from those who subscribe to our Websites or who express
        an interest in receiving communications from us.
      </p>
      <p>&nbsp;</p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>HOW LONG WE KEEP PERSONAL INFORMATION</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        We retain personal information only for as long as we need to for the purposes outlined in
        this Policy, unless otherwise required by law.&nbsp; For instance, under Canadian law, we
        must retain financial information for at least 6 years.&nbsp; We do not sell or otherwise
        distribute your personal information.
      </p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>
        <strong>SECURITY AND ACCURACY</strong>
      </p>
      <p>&nbsp;</p>
      <p>
        We protect personal information in our files from loss, misuse, unauthorized access, and
        alteration using technical, physical and administrative methods.&nbsp; We frequently monitor
        our systems to ensure we have implemented up-to-date and effective security measures.&nbsp;
      </p>
      <p>&nbsp;</p>
      <p>Some security measures we implement include:</p>
      <ul>
        <li>SSL encrypted secure communications using https;</li>
        <li>Encryption for payment information via third-party service;</li>
        <li>Recaptcha for verifying human users;</li>
        <li>Secured cookie encryption for sessions handling;</li>
        <li>sha265 password encryption;</li>
        <li>High complexity passwords and regular password changes;</li>
        <li>Server-side best practices for protecting against common hacks and attacks;</li>
        <li>Server-side secured end points preventing unauthorized user access; and</li>
        <li>Audit logs and monitoring setup for detecting suspicious behaviour.</li>
      </ul>
      <p>&nbsp;</p>
      <p>
        However, you acknowledge that no one security system is impenetrable.&nbsp; By sharing your
        personal information with us, your personal information may be at risk if someone breaches
        our systems.&nbsp; In such cases, we will notify you as soon as is feasible if it is
        reasonable to believe that the breach created a real risk of significant harm to you.
      </p>
      <p>&nbsp;</p>
      <p>
        We try to ensure that personal information we have on file is accurate.&nbsp; We encourage
        you to contact us to update your personal information where you are aware our records are
        incorrect.
      </p>
      <p>&nbsp;</p>
      <p>
        For more information on our security measures or records, please contact us at
        [bidorboo@bidorboo.ca].
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>CONTACT US</strong>
      </p>
      <p>&nbsp;</p>
      <p>
        If you would like to review or correct your personal information we have on file, or have
        any other concerns regarding your privacy rights, please send a written request to:
      </p>
      <p>&nbsp;</p>
      <p>
        Privacy Officer
        <br /> Said Madi
      </p>
      <p>bidorboo@bidorboo.ca</p>
      <p>&nbsp;</p>
      <p>
        Once you submit a written request, we will provide you with access to your personal
        information, unless otherwise required by law.
      </p>
      <p>&nbsp;</p>
      <p>
        You acknowledge that when you request to exercise your privacy rights, you are consenting to
        our collection of your basic contact information so that we can authenticate you and
        communicate with you regarding your request.
      </p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>
        <strong>CHALLENGING COMPLIANCE</strong>
      </p>
      <p>&nbsp;</p>
      <p>
        BidOrBoo will respond to questions we receive about this Policy and our legal compliance. We
        will investigate all challenges and attempt to resolve all complaints. If you feel we have
        not met our legal obligations under this Policy or applicable laws, please contact our
        Privacy Officer at [bidorboo@bidorboo.ca]. Following our investigation, we will decide
        whether to update our policies and practices as necessary.
      </p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>
        <strong>UPDATES</strong>
      </p>
      <p>&nbsp;</p>
      <p>
        We review and revise this Policy regularly.&nbsp; We reserve the right to change our Policy
        at any time by posting a new Policy on our Websites.
      </p>
      <p>&nbsp;</p>
      {/* <p>This Policy was last updated on [01-23-2020].</p> */}
    </div>
  );
};

const TOS = () => {
  return (
    <div>
      <p>{/* <strong>BIDORBOO INC. </strong> */}</p>
      <p>{/* <strong>TERMS OF SERVICE</strong> */}</p>
      <p>&nbsp;</p>
      <p>Updated: January 30, 2020.</p>
      <p>&nbsp;</p>
      <p>
        These Terms of Service (“<strong>Terms</strong>”) constitute a legally binding agreement
        between you and BidOrBoo Inc. (hereinafter referred as "<strong>BidOrBoo</strong>" and "
        <strong>we</strong>" or "<strong>us</strong>" or "<strong>our</strong>”) and governs the
        access to and use of BidOrBoo’s website (https://www.bidorboo.ca, https://www.bidorboo.com,
        collectively referred to as “<strong>Websites</strong>”), by any and all individuals or
        entities, whether they are Taskers, Requesters, Users, or otherwise (“
        <strong>you</strong>”, “<strong>your</strong>”). The Websites, any other applications
        developed by BidOrBoo related to the Websites, and all communications and information used
        to deliver the services provided hereunder are collectively referred to as the “
        <strong>Platform</strong>”.
      </p>
      <p>&nbsp;</p>
      <p>
        Please read these Terms carefully and contact us if you have any questions at{' '}
        <strong>[bidorboo@bidorboo.ca]</strong>.
      </p>
      <p>&nbsp;</p>
      <p>
        By clicking “<strong>I AGREE</strong>” below, creating an account under these Terms, or by
        accessing or using the Platform, you acknowledge that you have reviewed and agree to be
        bound by these Terms and our{' '}
        <a href="#PrivacyPolicy">
          {' '}
          <strong>Privacy Policy</strong>{' '}
        </a>{' '}
        Our Privacy Policy governs our collection and use of any personal data and is incorporated
        by reference into these Terms, and together with the Terms form the “
        <strong>Agreement</strong>” between you and BidOrBoo.
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        <strong>
          IF YOU DO NOT AGREE TO BE BOUND BY THIS AGREEMENT, YOU MAY NOT USE OR ACCESS THE PLATFORM.
        </strong>
      </p>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <ol>
        <li>
          <strong>OUR SERVICE</strong>
        </li>
      </ol>
      <p>&nbsp;</p>
      <p>
        The Platform is a web-based communications platform that connects users (“
        <strong>Requesters</strong>”) who need help with short-term, everyday tasks, including, but
        not limited to, house-cleaning, car-detailing, pet-sitting/walking, furniture assembly,
        moving/lifting, grass-cutting without power tools, snow-removal without power tools, and
        other general tasks (“<strong>Service Requests</strong>”) with other users who have
        registered on the Platform and are willing to perform those Service Requests, and their
        respective assistants, helpers, contractors, subcontractors or other personnel engaged by
        the user to perform those Service Requests (“<strong>Taskers</strong>”). Taskers and
        Requesters are collectively referred to as “<strong>Users</strong>”.
      </p>
      <p>&nbsp;</p>
      <p>Users are connected through the Platform as follows:</p>
      <p>&nbsp;</p>
      <ul>
        <li>
          Requesters post a Service Request on the Platform by filling out a task request form that
          details the type of Service Request to be completed and any relevant details about the
          particular task to be completed. Taskers are informed of the approximate location where
          the Service Request is to be performed (“<strong>Location</strong>”).
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Once the Service Request is posted, Taskers in the Location and surrounding area are
          notified of the Requester’s request for Service Requests.
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Taskers “bid” on the Requester’s Service Request on the Platform. The Requester will have
          the opportunity to review the bids and select the Tasker of the Requester’s choosing.
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Once a Tasker has been selected for the Service Request (“
          <strong>Assigned</strong>”), the Requester shall pay the Service Request Payment (defined
          below) through the Platform. The Service Request Payment is held by the Payment Processor
          (defined below) and is not released to the Assigned Tasker until the Service Request has
          been marked as ‘complete’ on the Platform.&nbsp; BidOrBoo will release the Requester’s
          contact information (i.e. address and phone number) and allow the Users to communicate so
          that they may arrange the terms of the Service Requests Agreement (defined below).
        </li>
      </ul>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <ul>
        <li>
          Following completion of an Assigned Service Request and payment of the Service Request
          Payment, each User may provide a rating to the other for the Assigned Service Request,
          which affects the Users’ global rating.
        </li>
      </ul>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <ol start={2}>
        <li>
          <strong>INDEPENDENT RELATIONSHIP</strong>
        </li>
      </ol>
      <p>&nbsp;</p>
      <p>
        By using the Platform, you understand and acknowledge that BidOrBoo provides a booking and
        bidding service that connects Requesters with Taskers and that Taskers are fully independent
        and not employees or agents of BidOrBoo. The Platform only enables connections between Users
        for the fulfillment of Service Requests. When Users make or accept a Service Request, they
        are entering into a contract with each other. BidOrBoo is not and does not become a party to
        such contract, or any other contract, between the Users.&nbsp;
      </p>
      <p>&nbsp;</p>
      <p>
        BidOrBoo is not responsible for the performance or communications of Users, nor does it have
        control over the quality, timing, legality, failure to provide, or any other aspect
        whatsoever of Service Requests, Taskers, Requesters, nor of the integrity, responsibility,
        competence, qualifications, or any of the actions or omissions whatsoever of any Users, or
        of any ratings provided by Users with respect to each other.
      </p>
      <p>&nbsp;</p>
      <p>
        BidOrBoo is not responsible to pay the Tasker for any fees that are agreed upon between the
        Requester and the Tasker.
      </p>
      <p>&nbsp;</p>
      <ol start={3}>
        <li>
          <strong>USER VERIFICATION </strong>
        </li>
      </ol>
      <p>&nbsp;</p>
      <p>
        BidOrBoo does not require that Users maintain any licenses, certificates, or liability
        insurance (whether commercial, general or otherwise), however, in BidOrBoo’s sole
        discretion, Users may be subject to a vetting process before they can register for and
        during their use of the Platform, including but not limited to a verification of identity,
        and criminal record checks (for Taskers), using third party services as appropriate (“
        <strong>Background Checks</strong>”).&nbsp; For criminal record checks, BidOrBoo will obtain
        consent from Taskers where required by law.
      </p>
      <p>&nbsp;</p>
      <p>
        Although BidOrBoo may perform Background Checks, we are not required to do so and cannot
        confirm that each User is who they claim to be on or off the Platform. BidOrBoo cannot and
        does not assume any responsibility for the accuracy or reliability of Background Check or
        any information provided by Users.&nbsp; BidOrBoo will not be liable for any false or
        misleading statements made by Users. You should exercise caution to protect your personal
        safety, data, and property, just as you would when interacting with other strangers.
        BidOrBoo encourages Users not to pay cash for services and to use only the Platform to
        facilitate Service Requests.&nbsp; BidOrBoo shall not be liable for any services or
        transactions between Users facilitated outside the Platform, whether related to Service
        Requests or not.
      </p>
      <ol start={4}>
        <li>
          <strong>TASKER SERVICE AGREEMENTS</strong>
        </li>
      </ol>
      <p>
        Once a Requester has accepted a bid and a Tasker has been Assigned, the Users acknowledge
        that they have entered into a binding contract (the “
        <strong>Service Request Agreement</strong>”). The terms of the Service Request Agreement
        also include the terms in this Section 4 and any other terms accepted by both the Tasker and
        their Requester to the extent such terms do not conflict with the terms in this Agreement.
        Notwithstanding anything the Service Request Agreement, BidOrBoo shall not be liable for any
        damages resulting from the Service Request Agreement.&nbsp; BidOrBoo is not a party to any
        Service Request Agreement and the Service Request Agreement will not, under any
        circumstance, create an employment, agency, or other service relationship between BidOrBoo
        and the Tasker, nor will it create an employment relationship between the Requester and the
        Tasker. BidOrBoo’s role is restricted solely to acting as a limited payment intermediary to
        facilitate payment through the Platform using the Payment Processor (as defined below) in
        respect of Service Requests Taskers perform. In acting as the limited payment collection
        agent for particular Service Requests on the Platform, BidOrBoo disclaims any other agency
        or authority to act on behalf of the Tasker, and assumes no liability or responsibility for
        any acts or omissions of the Tasker, either within or outside of the Platform.&nbsp;
      </p>
      <p>
        Subject to the approval of the Requester, the Assigned Tasker is not obligated to personally
        perform the Service Request. The Assigned Tasker may engage assistants, helpers,
        contractors, subcontractors or other personnel to perform the Service Request. The Assigned
        Tasker assumes full and sole responsibility for the acts and omissions of such persons,
        including without limitation the payment of all compensation, benefits, and expenses and for
        all applicable income tax withholdings in the performance of the Service Requests.&nbsp;
      </p>
      <p>
        While using the Platform, Requesters, in their sole discretion, determine whether they will
        be present or not when a Service Request is performed and/or completed. Requesters who elect
        not to be present when a Service Request is performed and/or completed agree that if someone
        other than them (i.e. spouse, roommate, friend, etc.) is present when the Service Request is
        performed, they are appointing such person as their agent (“
        <strong>Requester’s Agent</strong>”) and the Assigned Tasker, or his/her assistants,
        helpers, contractors, subcontractors or other personnel, &nbsp;may take and follow direction
        from the Requester’s Agent as if such direction was given from the Requester him or herself.
      </p>
      <p>
        Each User agrees to comply with the Service Request Agreement and this Agreement during the
        engagement, performance and completion of a Service Request.
      </p>
      <p>
        <u>User Dispute Option</u>
      </p>
      <p>
        Users may at any time use BidOrBoo’s Platform dispute mechanism (“
        <strong>Dispute Option</strong>”) to open a dispute for an Assigned Service Request.&nbsp;
        Users agree to notify BidOrBoo of such disputes and open a dispute through the Dispute
        Option when any dispute arises between Requester and Assigned Tasker. BidOrBoo reserves the
        right to suspend or terminate any account or Service Request pending the resolution of any
        dispute.
      </p>
      <p>
        The Dispute Option provides Users with access to our dispute support team to resolve issues
        respecting the Assigned Service Request.&nbsp; Our support team will work with both Users to
        come to a resolution.&nbsp; If the Users cannot resolve the dispute, our support team will
        make a final decision.&nbsp; Once the dispute has been resolved or decided, BidOrBoo shall
        mark the Service Request as ‘complete’ on the Platform and the Payment Processor will be
        automatically authorized to process the Booking Fee (defined below).&nbsp; Users acknowledge
        and agree that all decisions and resolutions made through the Dispute Option are final and
        binding.&nbsp;
      </p>
      <ol start={5}>
        <li>
          <strong>USER REPRESENTATIONS AND WARRANTIES</strong>
        </li>
      </ol>
      <p>You represent and warrant that:</p>
      <p>&nbsp;</p>
      <ul>
        <li>
          you are 19 years of age or older and a resident of Canada, or you are a duly organized,
          validly existing business, organization or other legal entity in good standing under the
          laws of Canada;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          you have the right, authority and capacity to enter into this Agreement and to abide by
          the terms and conditions of this Agreement, and that you will so abide;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>you have a valid banking account registered with a Canadian bank.</li>
      </ul>
      <p>&nbsp;</p>
      <p>
        Where you enter into this Agreement on behalf of a company or other organization, you
        represent and warrant that you have authority to act on behalf of that entity and to bind
        that entity to this Agreement.
      </p>
      <p>&nbsp;</p>
      <p>
        You represent and warrant that you have read, understand and agree to be bound by these
        Terms and the Privacy Policy, both of which govern your right to access and use the
        Platform. You further represent and warrant that you shall conduct all activities on the
        Platform in accordance with all privacy laws and regulations, together and in addition to
        those set out in our Privacy Policy. You represent that you will act professionally,
        responsibly and deal in good faith with other Users, and comply with all applicable
        municipal, provincial, national or international law as it relates to the use of the
        Platform and the provision of and payment for the Service Requests.&nbsp;
      </p>
      <p>&nbsp;</p>
      <p>
        Taskers specifically represent and warrant, in addition to the forgoing, to take
        commercially reasonable efforts to provide timely, quality services to their Requesters.
        Taskers will not offer or provide services that they do not have the necessary skills,
        tools, and/or expertise to perform. All Service Requests shall be provided by the Taskers
        safely and in compliance with all applicable laws related to the performance of those
        Service Requests. You, as a Tasker, represent and warrant that you have the legal right to
        work and provide Service Requests in Canada.
      </p>
      <p>&nbsp;</p>
      <ol start={6}>
        <li>
          <strong>PAYMENT AND TAXES</strong>
        </li>
      </ol>
      <p>&nbsp;</p>
      <p>
        Payment for Service Requests facilitated in the Platform is made by the Requester to the
        Tasker via the Payment Processor. Payment is based on the bid and rates set out on the
        Platform in the bid agreed to by the parties in the Service Request Agreement. BidOrBoo is
        not obligated to pay Taskers in the event of any failure by a Requester to pay for Service
        Requests.
      </p>
      <p>&nbsp;</p>
      <p>
        Users of the Platform will be required to provide their payment method details through the
        Payment Processor. Users must maintain a valid Canadian bank account to make and receive
        Service Request Payments (defined below).
      </p>
      <p>&nbsp;</p>
      <p>
        Requesters will be responsible for paying the fee for each Service Request (“
        <strong>Booking Fee</strong>”), which will include
      </p>
      <p>&nbsp;</p>
      <ul>
        <li>the pricing terms of the Service Request agreed with and provided by a Tasker;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>any tip or gratuity, if applicable;</li>
      </ul>
      <p>&nbsp;</p>
      <p>
        (i), (ii) and (iii) are collectively referred to as the “
        <strong>Service Request Payment</strong>”
      </p>
      <p>&nbsp;</p>
      <ul>
        <li>BidOrBoo Fees (defined below) and Payment Processor Fees (defined below), and;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Taskers will be responsible for paying repayment of erroneous payments. Requesters will be
          responsible for paying cancellation fees, if applicable.
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          <u>BidOrBoo Fees</u>
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        BidOrBoo charges a platform fee for the use of the Platform in the amount of two percent
        (2%) of the bid pre-tax total.&nbsp; Users acknowledge and agree that BidOrBoo may, in its
        sole discretion, change the BidOrBoo Fee from time to time.&nbsp; In the event we decide to
        change the BidOrBoo Fee, we will provide you with twenty-four (24) hours notice prior to any
        change in the BidOrBoo Fee.&nbsp; Any changes in the BidOrBoo Fee will not affect Assigned
        Service Requests prior to notice of the change.
      </p>
      <p>&nbsp;</p>
      <ul>
        <li>
          <u>Payment Processor and Payment Processor Fees</u>
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        Payments are made through Stripe Inc., a third-party payment processor, and all such
        payments are processed by Stripe (“
        <strong>Payment Processor</strong>”) in accordance with Stripe’s{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://stripe.com/en-ca/connect-account/legal"
        >
          Terms of Service
        </a>{' '}
        (“
        <strong>Payment Processor ToS</strong>”). BidOrBoo is not a party to the Payment Processor
        ToS between the Users and the Payment Processor, and as such, BidOrBoo has no
        responsibilities, liabilities or obligations to any Tasker or third party in connection with
        the Payment Processor ToS. &nbsp;Service Request Payment and fees must be paid through the
        Payment Processor.
      </p>
      <p>&nbsp;</p>
      <p>
        <strong>Payment Processor Fee</strong>: The Payment Processor charges Users $0.25 for each
        transaction processed by the Payment Processor.&nbsp; BidOrBoo collects and remits the
        Payment Processor Fee to the Payment Processor.
      </p>
      <p>&nbsp;</p>
      <p>EXAMPLE</p>
      <p>&nbsp;</p>
      <p>
        If a Tasker has successfully won a bid at $100, the Tasker stands to gain $100 less the
        BidOrBoo Fee and the Payment Processor Fee.&nbsp;
      </p>
      <p>&nbsp;</p>
      <p>
        100 – ((100)(0.02<sup>(i)</sup>) + 0.25) = 97.50.&nbsp;
      </p>
      <p>&nbsp;</p>
      <p>
        <sup>(i)</sup>BidOrBoo Fee of 2% (please see Section 6(a) above.
      </p>
      <p>&nbsp;</p>
      <p>Therefore, the Tasker would receive $97.50 before taxes.</p>
      <p>&nbsp;</p>
      <p>
        To help prevent fraud and safeguard User information from the risk of unauthorized access,
        BidOrBoo and/or the Payment Processor may validate an account before activation.
      </p>
      <p>&nbsp;</p>
      <ul>
        <li>
          <u>Completed Service Request</u>
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        When a Tasker has completed a Service Request, the Requester may within 3 days following
        performance of the Service Request either: (1) confirm completion by marking the request as
        ‘complete’ on the Platform; or (2) open a dispute through the Dispute Option on the
        Platform.&nbsp; Once the 3-day period has expired, BidOrBoo shall mark the request as
        ‘complete’ on the Platform, which automatically authorizes the Payment Processor to process
        the Booking Fee and release Service Request Payment to the Tasker.&nbsp; The transfer of the
        Service Request Payment to the Tasker bank account may take between one (1) to ten (10)
        days.
      </p>
      <p>&nbsp;</p>
      <p>
        BidOrBoo reserves the right (but not the obligation), in its sole discretion, upon request
        from Requester or Tasker, or upon notice of any potential fraud, unauthorized charges or
        other misuse of the Platform, to (i) place on hold any Service Request Payment, or (ii)
        refund or provide credits, or arrange for the Payment Processor to do so. Users of the
        Platform will be liable for any taxes required to be paid for the Service Requests provided
        under the Agreement.
      </p>
      <p>&nbsp;</p>
      <ul>
        <li>
          <u>Cancellation Policy</u>
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        If a Requester cancels a Service Request prior to Assigning a Tasker, the Requester does not
        incur a cancellation fee.
      </p>
      <p>&nbsp;</p>
      <p>In the event a Requester cancels an Assigned Service Request,</p>
      <p>&nbsp;</p>
      <ul>
        <li>the Requester’s global rating will decrease;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          BidOrBoo will automatically issue a notice indicating the cancellation of the Requester’s
          Platform profile; and
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Cancellation Fee: BidOrBoo will only refund the Requester up to ninety percent (90%) of
          the Requester’s initial payment, and the remainder will be released to the Assigned Tasker
          (such refund and release being subject to change from time to time and in BidOrBoo’s sole
          discretion).
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        Requesters are prohibited from harassing, spamming, or otherwise contacting the Assigned
        Tasker following cancellation.
      </p>
      <p>&nbsp;</p>
      <p>
        BidOrBoo monitors all cancellations.&nbsp; If Requester cancels an Assigned Service Request
        more than <strong>3 times</strong> within <strong>30 days</strong>, BidOrBoo reserves the
        right, in its sole discretion, to suspend or terminate such Users’ Platform account and
        profile.&nbsp; BidOrBoo shall not be liable for any damages following the suspension or
        termination of a Users’ Platform account or profile.&nbsp; Any outstanding Assigned Service
        Requests scheduled for performance prior to termination or suspension will be forwarded to
        the Dispute Option.
      </p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>In the event a Tasker cancels an Assigned Service Request,</p>
      <p>&nbsp;</p>
      <ul>
        <li>the Tasker’s global rating will decrease;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          BidOrBoo will automatically issue a notice indicating the cancellation of the Tasker’s
          Platform profile; and
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>BidOrBoo will refund one hundred percent (100%) of the Requester’s initial payment.</li>
      </ul>
      <p>&nbsp;</p>
      <p>
        Taskers are prohibited from harassing, spamming, or otherwise contacting the Requester
        following cancellation.
      </p>
      <p>&nbsp;</p>
      <p>
        BidOrBoo monitors all cancellations.&nbsp; If Tasker cancels Assigned Service Requests more
        than <strong>3 times</strong> within <strong>30 days</strong>, BidOrBoo reserves the right,
        in its sole discretion, to suspend or terminate such Users’ Platform account and
        profile.&nbsp; BidOrBoo shall not be liable for any damages following the suspension or
        termination of a Users’ Platform account or profile.&nbsp; Any outstanding Assigned Service
        Requests scheduled for performance prior to termination or suspension will be forwarded to
        the Dispute Option.
      </p>
      <p>&nbsp;</p>
      <ul>
        <li>
          <u>Taxes</u>
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        Taskers are responsible for collecting and remitting any and all applicable taxes, including
        federal, provincial, or state taxes, pursuant to their jurisdiction.&nbsp; BidOrBoo may
        provide relevant Service Request Payment data and receipts respecting Tasker earnings if
        requested by Taskers.
      </p>
      <p>&nbsp;</p>
      <ol start={7}>
        <li>
          <strong>USER GENERATED CONTENT </strong>
        </li>
      </ol>
      <p>&nbsp;</p>
      <ul>
        <li>
          <u>Your responsibilities</u>
        </li>
      </ul>
      <p>
        You are solely responsible for the information and content (including, without limitation,
        personal information, text, links, data, databases, tools, images, graphics, photographs,
        pictures, videos, postings, multimedia clips) that you upload, publish or display
        (hereinafter, "<strong>post</strong>") on or through the Platform (collectively, “
        <strong>User Generated Content</strong>” or "<strong>UGC</strong>").
      </p>
      <p>
        You are responsible for ensuring that any material you provide to or through the Platform or
        post, including but not limited to, personal information, text, photographs, video, and
        audio, does not violate the copyright, trademark, trade secret, or any other personal,
        moral, or proprietary rights of any third party or is posted with the permission of the
        owner(s) of such rights and you agree to indemnify and defend BidOrBoo from third party
        claims as provided for in these terms of use. For greater certainty, BidOrBoo does not
        provide any representations, warranties or guarantees with respect to UGC, its quality or
        its accuracy.&nbsp;
      </p>
      <ul>
        <li>
          <u>Use of your UGC</u>
        </li>
      </ul>
      <p>
        You grant BidOrBoo and other Users a non-exclusive, royalty-free, transferable,
        sublicensable, worldwide licence to use, store, display, reproduce, save, modify, create
        derivative works, perform and distribute your UGC on the Platform solely for the purposes of
        operating, developing, providing and using the Platform. Nothing in these Terms restricts
        other legal rights BidOrBoo may have to UGC, for example, under other licences.&nbsp;For
        greater certainty, your UGC made public may be posted and shared by BidOrBoo and Users on
        social media platforms (i.e. Facebook, Twitter, Instagram, Pinterest, etc.).
      </p>
      <p>
        You understand and agree that BidOrBoo may, but is not obligated to, conduct a content
        review of the Platform and that it may, at its sole discretion and without notice, delete or
        remove any UGC,&nbsp; including but not limited to UGC that violates these Terms, that may
        be misleading, offensive or illegal, or that may violate the rights, harm, or threaten the
        safety of other users of the Platform.
      </p>
      <p>
        We will do regular backups of UGC however this service is not guaranteed. You are solely
        responsible to maintain, at your own cost and expense, a back-up copy of your UGC that you
        contribute to the Platform.&nbsp; We will not replace or provide a copy of any UGC you post
        or store on the Platform or provide to us.
      </p>
      <ul>
        <li>
          <u>Content Retention </u>
        </li>
      </ul>
      <p>
        Following termination or deactivation of your BidOrBoo account, or if you remove any UGC
        from the Platform, BidOrBoo will make reasonable efforts to remove all of your UGC that has
        been posted to the Platform. Notwithstanding the forgoing, BidOrBoo is not responsible for
        any UGC that has been publicly shared with third parties in accordance with these Terms
        (including UGC shared on social media platforms) and cannot guarantee that such shared UGC
        will be deleted and removed following the termination or deactivation of your BidOrBoo
        account, or if you remove any UGC from the Platform. BidOrBoo may continue to use your
        Personal Information (as defined in our Privacy Policy) in accordance with the terms of its
        Privacy Policy, as may be amended from time to time and incorporated herein by reference,
        following the termination or deactivation of your BidOrBoo account.
      </p>
      <ol start={8}>
        <li>
          <strong>ACCEPTABLE USE OF PLATFORM AND USER RESTRICTIONS</strong>
        </li>
      </ol>
      <p>
        The Platform may contain profiles, email systems, blogs, message boards, reviews, ratings,
        forums, communities and/or other methods that allow Users to communicate with other Users (“
        <strong>Messaging Options</strong>”). You may only use such Messaging Options to send and
        receive communications that are relevant and proper to the applicable forum. For the safety
        and integrity of the Platform, you should not share your personal contact information with
        other Users.
      </p>
      <p>&nbsp;</p>
      <p>Without limitation and in addition to Section 7, while using the Platform, you may not:</p>
      <p>&nbsp;</p>
      <ul>
        <li>
          Defame, abuse, harass, stalk, threaten, intimidate, misrepresent, mislead or otherwise
          violate the legal rights (such as, but not limited to, rights of privacy, confidentiality,
          reputation, and publicity) of others, including Users or BidOrBoo staff, or use
          information learned from the Platform or during the performance of Service Requests to
          otherwise defame, abuse, harass, stalk, threaten, intimidate, misrepresent, mislead, or
          otherwise violate the legal rights of any other User or BidOrBoo staff;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Publish, post, upload, distribute or disseminate any profane, defamatory, infringing,
          obscene or unlawful topic, name, material or information on the Platform;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Use the Platform for any unauthorized purpose, including, but not limited to posting or
          completing a Service Request in violation of local, state, provincial, national, or
          international law;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Upload files that contain viruses, Trojan horses, corrupted files, or any other similar
          software that may damage the operation of another’s computer;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Advertise or offer to sell any goods or services for any commercial purpose through the
          Platform which are not relevant to the Service Requests offered through the Platform;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Post or complete a Service Request requiring a User to (i) purchase or obtain gift cards
          or money orders (ii) purchase high value items without obtaining pre-authorization from
          BidOrBoo, (iii) provide ridesharing or other peer to peer transportation services, (iv)
          post ratings or reviews on any third party website in breach of such third party website’s
          terms of use, or (v) otherwise engage in activity that is illegal or deemed dangerous,
          harmful or otherwise inappropriate by BidOrBoo in its sole discretion;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>Conduct or forward surveys, contests, pyramid schemes, or chain letters;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Impersonate another person or a User or allow any other person or entity to use your
          identification to post or view comments;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Post the same Service Request repeatedly (i.e. more than <strong>3</strong> times within
          the same day);
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Download any file posted by another User that a User knows, or reasonably should know,
          cannot be legally distributed through the Platform;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>Restrict or inhibit any other User from using and enjoying the Messaging Options;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Imply or state that any statements you make are endorsed by BidOrBoo, without the prior
          written consent of BidOrBoo;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Use a robot, spider, manual, meta tag, “hidden text,” agent, robot, script, and/or
          automatic processes or devices to data-mine, data-crawl, scrape, collect, mine, republish,
          redistribute, transmit, sell, license, download, manage or index the Platform, or the
          electronic addresses or personal information of others, in any manner;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>Frame or utilize framing techniques to enclose the Platform or any portion thereof;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>Hack or interfere with the Platform, its servers or any connected networks;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Adapt, alter, license, sublicense or translate the Platform for your own personal or
          commercial use;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Remove or alter, visually or otherwise, any copyrights, trademarks or proprietary marks or
          rights owned by BidOrBoo and its affiliates or corporate partners;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Upload content to the Platform that is offensive and/or harmful, including, but not
          limited to, content that advocates, endorses, condones or promotes racism, bigotry, hatred
          or physical harm of any kind against any individual or group of individuals;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Upload content that provides materials or access to materials that exploit people in an
          abusive, violent or sexual manner;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Use the Platform to solicit for any other business, website or service, or otherwise
          contact Users for employment, contracting or any purpose not related to use of the
          Platform as set forth herein;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Use the Platform to collect usernames, email addresses, or other personal information of
          Users by electronic or other means;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>Use the Platform or the Service Request in violation of this Agreement;</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Use the Platform in a manner that is false or misleading (directly or by omission or
          failure to update information) or for the purpose of accessing or otherwise obtaining
          BidOrBoo’s trade secret information for public disclosure or other purposes;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Attempt to circumvent the payments system or service fees in any way including, but not
          limited to, processing payments outside of the Platform, providing inaccurate information
          on Booking Fees, or otherwise invoicing in a fraudulent manner;
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Register under different usernames or identities after your account has been suspended or
          terminated, or register under multiple usernames or false identities, or register using a
          false or disposable email or phone number; or
        </li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>Cause any third party to engage in the restricted activities above.</li>
      </ul>
      <p>&nbsp;</p>
      <ul>
        <li>
          Attempt to override or circumvent any of the usage rules or restrictions on the Platform.
        </li>
      </ul>
      <p>&nbsp;</p>
      <p>
        You understand that all submissions made to Messaging Options will be public and that you
        will be publicly identified by your name or login identification when communicating in
        Messaging Options. BidOrBoo will not be responsible for the action of any Users with respect
        to any information or materials posted in Messaging Options.
      </p>
      <p>&nbsp;</p>
      <ol start={9}>
        <li>
          <strong>TERMINATION AND SUSPENSION</strong>
        </li>
      </ol>
      <p>&nbsp;</p>
      <p>
        BidOrBoo may terminate, suspend or limit your right to use the Platform immediately if it
        suspects or discovers that you are in breach of the Agreement.
      </p>
      <p>&nbsp;</p>
      <p>
        If BidOrBoo terminates, suspends or limits your right to use BidOrBoo pursuant to this
        Section 9, you are prohibited from registering and creating a new account under your name, a
        fake or borrowed name, or the name of any third party, even if you may be acting on behalf
        of the third party. If BidOrBoo terminates, suspends or limits your right to use the
        Platform as a Requester due to a breach of this Agreement, you will not be entitled to any
        refund of unused balance in your account.
      </p>
      <p>&nbsp;</p>
      <p>
        Even after your right to use the Platform is terminated or limited, this Agreement will
        remain enforceable against you. BidOrBoo reserves the right to take appropriate legal
        action, including but not limited to pursuing arbitration in accordance with Section 18 of
        these Terms.
      </p>
      <p>&nbsp;</p>
      <p>
        BidOrBoo reserves the right to modify or discontinue, temporarily or permanently, all or any
        portion of the Platform at its sole discretion. BidOrBoo is not liable to you for any
        modification or discontinuance of all or any portion of the Platform. BidOrBoo has the right
        to restrict anyone from completing registration as a Tasker if BidOrBoo believes such person
        may threaten the safety and integrity of the Platform, or if, in BidOrBoo’s discretion, such
        restriction is necessary to address any other reasonable business concern.
      </p>
      <p>&nbsp;</p>
      <p>
        You may terminate this Agreement at any time by ceasing all use of the Platform. All parts
        of this Agreement which by their nature should survive the expiration or termination of this
        Agreement shall continue in full force and effect subsequent to and notwithstanding the
        expiration or termination of this Agreement.
      </p>
      <p>&nbsp;</p>
      <ol start={10}>
        <li>
          <strong>LINKS TO </strong>
          <strong>THIRD</strong>
          <strong>-PARTY WEBSITES</strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        We and our users may provide links to other websites or resources maintained by third
        parties. The content in any linked websites is not under our control so we are not
        responsible for the content, including any further links in associated third-party websites.
        &nbsp;You acknowledge and agree that we are not responsible for the availability or security
        of such external sites or resources, and we do not endorse and are not responsible or liable
        for any content, advertising, products, or other materials on or available from such sites
        or resources. You agree that we shall not be responsible or liable, directly or indirectly,
        for any damage or loss caused or alleged to be caused by or in connection with use of or
        reliance on any such content, goods or services available on such external sites or
        resources.
      </p>
      <p>
        We reserve the right to terminate a link to a third-party website at any time. The fact that
        we provide a link to a third-party website does not mean that we endorse, adopt, authorize
        or sponsor that website. It also does not mean that we are affiliated with the third-party
        website’s owners or sponsors.
      </p>
      <ol start={11}>
        <li>
          <strong>PROPRIETARY AND INTELLECTUAL PROPERTY RIGHTS </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        All content on or available through the Platform, including articles, discussion forums,
        graphics, pictures, video, information, applications, software, music, sound and other
        files, and their selection and arrangement, name references or other material contained in
        advertisements or search results, provided to or accessed by you via the Platform, and other
        materials related to the Platform including, without limitation, the "look and feel" of the
        Websites (collectively the “<strong>Content</strong>”) are our proprietary property, our
        users or our licensors with all rights reserved. Therefore, you are only permitted to use
        this Content as expressly authorized by these Terms or by the relevant advertiser, as
        appropriate. Except as expressly provided for in these Terms, no Content may be modified,
        copied, distributed, framed, reproduced, republished, downloaded, scraped, displayed,
        posted, transmitted, or sold in any form or by any means, in whole or in part, without our
        prior written permission, except that the foregoing does not apply to your User Generated
        Content that you legally post on the Site.
      </p>
      <p>
        You may not create derivative works of the Content without expressly being authorized to do
        so in writing by us or the relevant party. You do not acquire ownership rights to any
        content, document, or other materials viewed through the Platform that is not content that
        you have posted or uploaded on the Platform. Some of the Content on the Platform is the
        copyrighted work of third parties. Except for your User Generated Content, you may not
        upload or republish Content on any Internet, Intranet or Extranet website or incorporate the
        information in any other database or compilation. Any use of the Platform and its Content
        other than as specifically authorized herein and without our prior written permission is
        strictly prohibited, and any such use will terminate the license granted herein. Any and all
        unauthorized use may also violate applicable laws including copyright and trademark laws and
        communications regulations and statutes. Unless explicitly stated herein, nothing in these
        Terms shall be construed as conferring any license to our intellectual property rights,
        whether by estoppels, implication or otherwise. This license is revocable at any time
        without notice and with or without cause.
      </p>
      <ol start={12}>
        <li>
          <strong>USE OF TRADEMARKS </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        "BidOrBoo" and certain product or feature names mentioned on the Platform are our
        trademarks. Other product and company names mentioned on the Platform may be trademarks
        and/or service marks of their respective owners.
      </p>
      <p>
        We grant you the right to display the link to the Websites on your website(s) and the
        non-exclusive right to display publicly our trademark " BidOrBoo " in the form authorized by
        us. Any goodwill associated with our trademarks automatically vests in us. You grant us the
        right to display the link to your website on the Websites and the non-exclusive right to
        display publicly your trademark in the form presented by you to us. Any goodwill associated
        with your trademarks automatically vests in you.
      </p>
      <ol start={13}>
        <li>
          <strong>CONFIDENTIAL INFORMATION</strong>
        </li>
      </ol>
      <p>
        You acknowledge that Confidential Information (as defined below) is a valuable, special and
        unique asset of BidOrBoo and agree that you will not disclose, transfer, use (or seek to
        induce others to disclose, transfer or use) any Confidential Information for any purpose
        other than using the Platform in accordance with these Terms of Service. If relevant, you
        may disclose the Confidential Information to your authorized employees and agents provided
        that they are also bound to maintain the confidentiality of Confidential Information. You
        shall promptly notify BidOrBoo in writing of any circumstances that may constitute
        unauthorized disclosure, transfer, or use of Confidential Information. You shall use best
        efforts to protect Confidential Information from unauthorized disclosure, transfer or use.
        You shall return all originals and any copies of any and all materials containing
        Confidential Information to BidOrBoo upon termination of this Agreement for any reason
        whatsoever.
      </p>
      <p>
        The term “<strong>Confidential Information</strong>” shall mean any and all of BidOrBoo’s
        trade secrets, confidential and proprietary information, and all other information and data
        of BidOrBoo that is not generally known to the public or other third parties who could
        derive value, economic or otherwise, from its use or disclosure. Confidential Information
        shall be deemed to include technical data, know-how, research, product plans, products,
        services, customers, markets, software, developments, inventions, processes, formulas,
        technology, designs, drawings, engineering, hardware configuration information, marketing,
        finances, strategic and other proprietary and confidential information relating to BidOrBoo
        or BidOrBoo’s business, operations or properties, including information about BidOrBoo’s
        staff, Users or partners, or other business information disclosed directly or indirectly in
        writing, orally or by drawings or observation.
      </p>
      <ol start={14}>
        <li>
          <strong>DISCLAIMERS </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <ul>
        <li>Use Platform at Your Own Risk</li>
      </ul>
      <p>
        THE PLATFORM IS PROVIDED ON AN “AS IS” BASIS WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
        EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OR CONDITIONS OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. BIDORBOO MAKES NO
        WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE CONTENT PROVIDED
        THROUGH THE PLATFORM OR THE CONTENT OF ANY SITES LINKED TO THE PLATFORM AND ASSUMES NO
        LIABILITY OR RESPONSIBILITY IN CONTRACT, WARRANTY OR IN TORT FOR ANY (I) ERRORS, MISTAKES,
        OR INACCURACIES OF CONTENT, (II) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE
        WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE PLATFORM, (III) ANY ACCESS TO OR
        USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL
        INFORMATION STORED THEREIN; AND (IV) EVENTS BEYOND OUR REASONABLE CONTROL.
      </p>
      <p>
        BIDORBOO MAKES NO WARRANTIES OR REPRESENTATIONS ABOUT THE SUITABILITY, RELIABILITY,
        TIMELINESS, OR ACCURACY OF THE TASKER SERVICES REQUESTED OR SERVICES PROVIDED BY, OR THE
        COMMUNICATIONS OF OR BETWEEN, USERS IDENTIFIED THROUGH THE PLATFORM, WHETHER IN PUBLIC,
        PRIVATE, OR OFFLINE INTERACTIONS OR OTHERWISE HOWSOEVER.
      </p>
      <p>
        BidOrBoo does not warrant, endorse, guarantee or assume responsibility for any service
        advertised or offered by a third party through the Platform or any hyperlinked website or
        featured in any banner or other advertising, and BidOrBoo will not be a party to or in any
        way be responsible for monitoring any transaction between you and third-party providers of
        products or services. As with the purchase of a product or service through any medium or in
        any environment, you should use your best judgment and exercise caution where appropriate.
        Without limiting the foregoing, BidOrBoo do not warrant that access to the Platform will be
        uninterrupted or that the Platform will be error-free; nor do they make any warranty as to
        the results that may be obtained from the use of the Platform, or as to the timeliness,
        accuracy, reliability, completeness or content of any Task, service, information or
        materials provided through or in connection with the use of the Platform. BidOrBoo is not
        responsible for the conduct, whether online or offline, of any User. BidOrBoo does not
        warrant that the Platform is free from computer viruses, system failures, worms, trojan
        horses, or other harmful components or malfunctions, including during hyperlink to or from
        third-party websites. BidOrBoo cannot and does not guarantee that any personal information
        supplied by you will not be misappropriated, intercepted, deleted, destroyed or used by
        others.
      </p>
      <p>
        Notwithstanding any feature a Requester may use to expedite BidOrBoo selection, each
        Requester is responsible for determining the Service Request and selecting their Tasker and
        BidOrBoo does not warrant any goods or services purchased by a Requester and does not
        recommend any particular Tasker. BidOrBoo does not provide any warranties or guarantees
        regarding any Tasker’s professional accreditation, registration or license.
      </p>
      <p>
        In addition, no individual or entity shall be a third party beneficiary of these terms.
        These terms are solely for the benefit of the parties to this Agreement and are not intended
        to and shall not be construed to give any person or entity other than you any interest,
        remedy, claim, liability, reimbursement, claim of action or any other rights (including,
        without limitation, any third party beneficiary rights), with respect to or in connection
        with any agreement or provision contained herein or contemplated hereby.
      </p>
      <ul>
        <li>No Liability</li>
      </ul>
      <p>
        You acknowledge and agree that BidOrBoo is only willing to provide the Platform if you agree
        to certain limitations of our liability to you and third parties. Therefore, you agree not
        to hold BidOrBoo, affiliates or their corporate partners, liable for any claims, demands,
        damages, expenses, losses, governmental obligations, suits, and/or controversies of every
        kind and nature, known and unknown, suspected and unsuspected, disclosed and undisclosed,
        direct, indirect, incidental, actual, consequential, economic, special, or exemplary,
        including attorneys fees and costs (collectively, “<strong>Liabilities</strong>”) that have
        arisen or may arise, relating to your or any other party’s use of or inability to use the
        Platform, including without limitation any Liabilities arising in connection with the
        conduct, act or omission of any User (including without limitation stalking, harassment that
        is sexual or otherwise, acts of physical violence, and destruction of personal property),
        any dispute with any User, any instruction, advice, act, or service provided by BidOrBoo,
        and affiliates or corporate partners, and any destruction of your UGC.
      </p>
      <p>
        UNDER NO CIRCUMSTANCES WILL BIDORBOO, ITS OFFICERS, DIRECTORS, EMPLOYEES, AFFILIATES OR
        THEIR CORPORATE PARTNERS, BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, ACTUAL,
        CONSEQUENTIAL, ECONOMIC, SPECIAL OR EXEMPLARY DAMAGES (INCLUDING BUT NOT LIMITED TO LOST
        PROFITS, LOSS OF DATA, LOSS OF GOODWILL, SERVICE INTERRUPTION, COMPUTER DAMAGE, SYSTEM
        FAILURE, FAILURE TO STORE ANY INFORMATION OR OTHER CONTENT MAINTAINED OR TRANSMITTED BY
        BIDORBOO, OR THE COST OF SUBSTITUTE PRODUCTS OR SERVICES) ARISING IN CONNECTION WITH YOUR
        USE OF OR INABILITY TO USE THE PLATFORM OR THE TASK SERVICES, EVEN IF ADVISED OF THE
        POSSIBILITY OF THE SAME. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF
        INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATIONS MAY NOT APPLY TO YOU IN THEIR
        ENTIRETY.
      </p>
      <p>
        BIDORBOO, ITS AFFILIATES OR THEIR CORPORATE PARTNERS, EXPRESSLY DISCLAIM ANY LIABILITY THAT
        MAY ARISE BETWEEN USERS OF ITS PLATFORM. BIDORBOO, ITS OFFICERS, DIRECTORS, EMPLOYEES,
        AFFILIATES OR THEIR CORPORATE PARTNERS, ALSO DO NOT ACCEPT ANY LIABILITY WITH RESPECT TO THE
        QUALITY OR FITNESS OF ANY WORK PERFORMED VIA THE PLATFORM.
      </p>
      <p>
        IF, NOTWITHSTANDING THE FOREGOING EXCLUSIONS, IT IS DETERMINED THAT BIDORBOO, ITS OFFICERS,
        DIRECTORS, EMPLOYEES, AFFILIATES OR THEIR CORPORATE PARTNERS, ARE LIABLE FOR DAMAGES, IN NO
        EVENT WILL THE AGGREGATE LIABILITY, WHETHER ARISING IN CONTRACT, TORT, STRICT LIABILITY OR
        OTHERWISE, EXCEED THE TOTAL FEES PAID BY YOU TO COMPANY DURING THE SIX (6) MONTHS PRIOR TO
        THE TIME SUCH CLAIM AROSE, TO THE EXTENT PERMITTED BY APPLICABLE LAW.
      </p>
      <ul>
        <li>Release</li>
      </ul>
      <p>
        THE PLATFORM IS ONLY A VENUE FOR CONNECTING USERS. BECAUSE BIDORBOO IS NOT A PARTY TO OR
        OTHERWISE INVOLVED IN THE CONTRACT BETWEEN USERS OR IN THE COMPLETION OF THE TASK, IN THE
        EVENT THAT YOU HAVE A DISPUTE WITH ONE OR MORE USERS, YOU HEREBY RELEASE BIDORBOO, ITS
        OFFICERS, DIRECTORS, EMPLOYEES, AFFILIATES OR THEIR CORPORATE PARTNERS, FROM ANY AND ALL
        CLAIMS, DEMANDS, DAMAGES (INCLUDING DIRECT, INDIRECT, INCIDENTAL, ACTUAL, CONSEQUENTIAL,
        ECONOMIC, SPECIAL, OR EXEMPLARY), EXPENSES, LOSSES, GOVERNMENTAL OBLIGATIONS, SUITS AND/OR
        CONTROVERSIES OF EVERY KIND AND NATURE, KNOWN AND UNKNOWN, SUSPECTED AND UNSUSPECTED,
        DISCLOSED AND UNDISCLOSED, ARISING OUT OF OR IN ANY WAY CONNECTED WITH SUCH DISPUTE.
      </p>
      <ol start={15}>
        <li>
          <strong>INDEMNIFICATION</strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        You agree to indemnify and hold BidOrBoo, our directors, officers, employees, agents or
        sub-contractors, subsidiaries and affiliates or any related companies, licensors, suppliers,
        successors and assigns harmless from any claim or demand for damages, liabilities, injuries,
        costs, fees and expenses, including but not limited to reasonable attorneys' fees, made by
        any third party due to or arising out of your use of the Platform, the violation of these
        Terms of use by you, or the infringement by you, or other user of the Platform using your
        computer, of any intellectual property or other right of any person or entity arising out
        your content, your provision or failure to provide any products or services to any person
        including without limitation claims by third parties under warranties given by you or claims
        that the products or services provided by you are defective or not suitable for the
        end-users use or application.
      </p>
      <ol start={16}>
        <li>
          <strong>LIMITATION ON LIABILITY </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        Except in jurisdictions where such provisions are restricted, in no event shall BidOrBoo,
        our directors, officers, employees, agents or sub-contractors, subsidiaries and affiliates
        or any related companies, licensors, suppliers, successors and assigns be liable to you or
        any third person or entity for any injury, loss, claim, damage, act of god, accident, delay
        or any indirect, consequential, exemplary, incidental, special or punitive damages of any
        kind, including for any lost profits or lost data, whether based in contract, tort or
        otherwise, arising out of or are in any way connected with your purchase of a Subscription
        or use of the Platform, or for any information or services obtained through the Platform,
        even if BidOrBoo has been made aware or has been advised of the possibility of such damages.
        Notwithstanding anything to the contrary contained herein, our sole liability to you for any
        cause whatsoever, and regardless of the form of the action, will at all times be limited to
        the amount paid by you to us for the Platform, but in no case will our liability to you
        exceed one hundred dollars Canadian ($100 CAD).
      </p>
      <ol start={17}>
        <li>
          <strong>GOVERNING LAW </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        These Terms shall be interpreted, construed and governed in accordance with the laws of the
        Province of Ontario, Canada, including its conflicts of law rules, and the federal laws of
        Canada applicable therein. For the purpose of all legal proceedings, these Terms will be
        deemed to have been performed in the Province of Ontario and the courts of the Province of
        Ontario will have jurisdiction to entertain any action arising under these Terms, except for
        matters that can be tried only before a Federal Court in which case jurisdiction and venue
        shall be in Ontario. The Parties to these Terms each hereby attorn to the jurisdiction of
        the courts of the Province of Ontario and of the Federal Court in accordance with the
        foregoing and waive any objection to venue or any claim of inconvenient forum.
        Notwithstanding the foregoing, however, we shall have the right to commence and prosecute
        any legal or equitable action or proceeding before any non-Canadian court of competent
        jurisdiction to obtain injunctive or other relief in the event that, in our opinion, such
        action is necessary or desirable.
      </p>
      <ol start={18}>
        <li>
          <strong>DISPUTE AND ARBITRATION </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        In the event of any controversy, complaint, claim, differences or any type of disputes
        whatsoever (“<strong>Dispute</strong>”) between BidOrBoo and you arising out of or in
        connection with your use of the Platform, both parties shall first attempt, promptly and in
        good faith, to resolve any such Dispute. The good faith negotiation shall commence by each
        party communicating its position and a proposal on how the parties should resolve the
        Dispute. Neither party shall commence any arbitral proceedings unless and until the good
        faith negotiation fails.
      </p>
      <p>
        If we are unable to resolve any such dispute within a reasonable time (not to exceed thirty
        (30) days), then either party may submit such Dispute to binding arbitration.&nbsp; The
        Arbitration Tribunal shall consist of one (1) Arbitrator. The decision arrived at by the
        Arbitrator shall be final and binding pursuant to the National Arbitration Rules of the
        Alternative Dispute Resolution Institute of Canada, Inc. or pursuant to the{' '}
        <em>Arbitration Act (1991),</em> S.O. 1991. Ch. 17 in the event of a domestic arbitration,
        or in accordance with the <em>International Commercial Arbitration Act</em>, R.S.O. 1990,
        Ch. I.11 in the event of an international Dispute. &nbsp;Judgment upon the award rendered by
        the Arbitrator may be entered in any court having jurisdiction thereof. Nothing in this
        section will prevent either party from seeking injunctive relief from a court of competent
        jurisdiction.&nbsp; The place of the arbitration shall be in Ottawa, Ontario. The language
        of the arbitration shall be English. The arbitration award shall be given in writing and
        shall be final, binding on the parties, not subject to any appeal, and shall deal with the
        question of costs of arbitration and all matters related thereto.
      </p>
      <p>
        YOU AND WE AGREE THAT THE SOLE AND EXCLUSIVE FORUM AND REMEDY FOR ANY AND ALL DISPUTES AND
        CLAIMS RELATING IN ANY WAY TO OR ARISING OUT OF THESE TERMS OR THE SERVICE SHALL BE A FINAL
        AND BINDING ARBITRATION, with the exception where either party has infringed upon or
        violated or threatened to infringe upon or violate, in any manner whatsoever, the other
        party's patent(s), copyright, trademark(s) or trade secret rights, such that the
        non-infringing party may seek injunctive or other appropriate relief.
      </p>
      <p>
        Judgment upon the award rendered may be entered into any court having competent
        jurisdiction, or application may be made to such court for a judicial recognition of the
        award or an order of enforcement thereof, as the case may be.
      </p>
      <ol start={19}>
        <li>
          <strong>SEVERABILITY</strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        If any provision of these Terms is held by a court or other tribunal of competent
        jurisdiction to be invalid or unenforceable, such provision shall be limited or eliminated
        to the minimum extent necessary and the remainder of these Terms shall continue in full
        force and effect.
      </p>
      <ol start={20}>
        <li>
          <strong>NOTICES AND COMMUNICATIONS</strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        All notices to BidOrBoo shall be made via email to [bidorboo@bidorboo.ca]. We may broadcast
        notices, communications or messages through the Platform and on the Websites to inform you
        of any changes to these Terms, to the Platform, or regarding any other associated matters,
        including]. BidOrBoo shall not be liable for any delay or failure in delivery of any such
        notices or communications, or performance of the Platform, caused by circumstances beyond
        its reasonable control. By using the Platform, you agree to be bound by any such revisions
        to these Terms and should therefore periodically visit this page to determine the then
        current Terms to which you are bound.&nbsp; We encourage you to check our Terms on the
        Websites occasionally to review any recent changes.
      </p>
      <ol start={21}>
        <li>
          <strong>ASSIGNMENT </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        These Terms, and any rights and licences granted hereunder, may not be transferred or
        assigned by you, but may be assigned by BidOrBoo without restriction or notice. Any
        attempted transfer or assignment in violation hereof shall be null and void.
      </p>
      <ol start={22}>
        <li>
          <strong>AMENDMENTS</strong>
        </li>
      </ol>
      <p>
        BidOrBoo reserves the right, at its sole and absolute discretion, to change, modify, add to,
        supplement, suspend, discontinue, or delete any of the terms and conditions of this
        Agreement (including the Terms and Privacy Policy) and review, improve, modify or
        discontinue, temporarily or permanently, the Platform or any content or information through
        the Platform at any time, effective with or without prior notice and without any liability
        to BidOrBoo. BidOrBoo will endeavor to notify you of material changes by email but will not
        be liable for any failure to do so. If any future changes to this Agreement are unacceptable
        to you or cause you to no longer be in compliance with this Agreement, you must terminate,
        and immediately stop using, the Platform. Your continued use of the Platform following any
        revision to this Agreement constitutes your complete and irrevocable acceptance of any and
        all such changes. BidOrBoo may also impose limits on certain features or restrict your
        access to part or all of the Platform without notice or liability.
      </p>
      <ol start={23}>
        <li>
          <strong>NO </strong>
          <strong>WAIVER</strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        No waiver of any term of these Terms shall be deemed a further or continuing waiver of such
        term or any other term, and BidOrBoo’s failure to assert any right or provision under these
        Terms shall not constitute a waiver of such right or provision.
      </p>
      <ol start={24}>
        <li>
          <strong>MISCELLANEOUS </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        We agree that any cause of action arising out of or related to the Platform must commence
        within one (1) year after the cause of action arose; otherwise, such cause of action is
        permanently barred. In the event that a jurisdiction prohibits the shortening of the time
        period in which a cause of action must be brought forward, the applicable time period shall
        be the minimum allowed by law. The section titles in these Terms are solely used for the
        convenience of the parties and have no legal or contractual significance.
      </p>
      <ol start={25}>
        <li>
          <strong>ENTIRE AGREEMENT </strong>
        </li>
      </ol>
      <p>
        <strong>&nbsp;</strong>
      </p>
      <p>
        These Terms constitute the entire agreement between BidOrBoo and you and they supersede all
        prior or contemporaneous agreements, representations, warranties and understandings with
        respect to the Platform, the content, products, or services provided by or through the
        Platform.&nbsp; These Terms shall survive the termination of your account.
      </p>
      <p>
        BidOrBoo cares about your privacy. For further information, please see BidOrBoo’s Privacy
        Policy
      </p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
      <p>&nbsp;</p>
    </div>
  );
};
