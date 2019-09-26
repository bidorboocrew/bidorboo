exports.populateHtmlTemplate = ({ toDisplayName, contentHtml, clickLink, clickDisplayName }) => {
  return `
  <!doctype html>
<html>

  <head>
  <meta charset="utf-8" />
  <meta
    name="BidOrBoo"
    content="BidorBoo, Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy."
  />
  <meta
    name="Description"
    content="A Crowd Sourcing Platform where you can Get Your Chores Done For The Right Price. Earn Money Doing What You Enjoy."
  />
  <meta
    name="viewport"
    content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
  />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="application-name" content="BidOrBoo" />
  <meta name="msapplication-TileColor" content="#603cba" />
  <meta name="theme-color" content="#ffffff" />

  <title>BidOrBoo Update</title>
  <style>
    img {
      border: none;
      -ms-interpolation-mode: bicubic;
      max-width: 100%;
    }

    body {
      background-color: #eeeeee;
      font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
      -webkit-font-smoothing: antialiased;
      font-size: 16px;
      line-height: 1.2;
      margin: 0;
      padding: 0;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    table {
      border-collapse: separate;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
      width: 100%; }
      table td {
        font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        font-size: 16px;
        vertical-align: top;
    }

    /* -------------------------------------
        BODY & CONTAINER
    ------------------------------------- */

    .body {
      background-color: #eeeeee;
      width: 100%;
    }

    /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
    .container {
      display: block;
      margin: 0 auto !important;
      /* makes it centered */
      max-width: 580px;
      padding: 10px;
      width: 580px;
    }

    /* This should also be a block element, so that it will fill 100% of the .container */
    .content {
      box-sizing: border-box;
      display: block;
      margin: 0 auto;
      max-width: 580px;
      padding: 10px;
    }

    /* -------------------------------------
        HEADER, FOOTER, MAIN
    ------------------------------------- */
    .main {
      background: #ffffff;
      border-radius: 3px;
      width: 100%;
    }

    .wrapper {
      box-sizing: border-box;
      padding: 20px;
    }

    .content-block {
      padding-bottom: 10px;
      padding-top: 10px;
    }

    .footer {
      clear: both;
      margin-top: 10px;
      text-align: center;
      width: 100%;
    }
      .footer td,
      .footer p,
      .footer span,
      .footer a {
        color: #999999;
        font-size: 12px;
        text-align: center;
    }



    a {
      color: #3498db;

    }

    p {
      font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
      font-size: 18px;
      font-weight: 400;
      line-height: 1.5;
    }

    /* -------------------------------------
        BUTTONS
    ------------------------------------- */
    .btn {
      box-sizing: border-box;
      width: 100%; }
      .btn > tbody > tr > td {
        padding-bottom: 15px; }
      .btn table {
        width: auto;
    }
      .btn table td {
        background-color: #ffffff;
        border-radius: 5px;
        text-align: center;
    }
      .btn a {
        background-color: #ffffff;
        border: solid 1px #3498db;
        border-radius: 5px;
        box-sizing: border-box;
        color: #3498db;
        cursor: pointer;
        display: inline-block;
        font-size: 16px;
        font-weight: bold;
        margin: 0;
        padding: 12px 25px;
        text-decoration: none;
        text-transform: capitalize;
    }

    .btn-primary table td {
      background-color: #3498db;
    }

    .btn-primary a {
      background-color: #3498db;
      border-color: #3498db;
      color: #ffffff;
    }



    .actionButton {
      background-color: #ef2834 !important;
      color: white;
      width: 100%;
      border: solid 1px #ef2834 !important;
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
    .preheader {
      color: transparent;
      display: none;
      height: 0;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
      mso-hide: all;
      visibility: hidden;
      width: 0;
    }

    .powered-by a {
      text-decoration: none;
    }

    hr {
      border: 0;
      border-bottom: 1px solid #eeeeee;
      margin: 20px 0;
    }
  </style>
  </head>

  <body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader">BidOrBoo updates!</span>

            <table dir="ltr" class="m_-7318686519169392378Section m_-7318686519169392378Header" width="100%" style="border:0;border-collapse:collapse;margin:0;padding:0;background-color:#ffffff">
              <tbody>
              <tr>
                <td class="m_-7318686519169392378Header-left m_-7318686519169392378Target" style="background-color:#ee2a36;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%;border-top-left-radius:5px" align="right" height="156" valign="bottom" width="252">
                  <a href="#m_-7318686519169392378_">
                    <img alt="" height="156" width="252" src="https://ci4.googleusercontent.com/proxy/9-vzO6oIjzdWLz5vxJipUa48-_jdteSGmZPi_jXjI1P9gfsxKXGx5ZC6HCp7gEsdL6c6qVHcVmPrfRVxxz7Yw1GWRX10g1zsI66f3vStuGoBVesH24A0bVJsUdvql3xAbjPcKaA_8g=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/notifications/hosted/20180110/Header/Left.png" style="display:block;border:0;line-height:100%;width:100%" class="CToWUd">
                  </a>
                </td>
                <td class="m_-7318686519169392378Header-icon m_-7318686519169392378Target" style="background-color:#ee2a36;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%" align="center" height="156" valign="bottom" width="96">
                  <a href="https://www.bidorboo.com/" style="outline:0;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.bidorboo.com/&amp;source=gmail&amp;ust=1569546059074000&amp;usg=AFQjCNGRPXG-YlxD4iHtz5pzS15YrDsjCw">
                    <img alt="" height="156" width="96" src="https://ci5.googleusercontent.com/proxy/CWAZxB20BZL5WyY3c9lYMGFHyUgJ0fpEofRTtY5rT2iH0hiEEgbe5yY83CJNRUlxEEit1yFtYcvgcT9h3CgTjR2EqvvwSV9hqMtqcFf-guCd0sitz8dfk8rZ5ZaqtpSOrurDGtyzf4OQPFDmTdPZSkQ5=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/emails/acct_1EkxmxHRQ5neEvOS/2/twelve_degree_icon@2x.png" style="display:block;border:0;line-height:100%;width:100%" class="CToWUd">
                  </a>
                </td>
                <td class="m_-7318686519169392378Header-right m_-7318686519169392378Target" style="background-color:#ee2a36;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%;border-top-right-radius:5px" align="left" height="156" valign="bottom" width="252">
                  <a href="#m_-7318686519169392378_">
                    <img alt="" height="156" width="252" src="https://ci5.googleusercontent.com/proxy/agqjJXCE9UqmeYtipoZMl4NQ5plhy-TKT_WsqxR18QMhNXU7t-dJPtqpaqwtjzrOslBvOe18-HlXRVknnUuUTIhtrECzchPqX06DXBwznI7p5hMwQb0pIl-d9gWCXjLTWHpQSf0rxKo=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/notifications/hosted/20180110/Header/Right.png" style="display:block;border:0;line-height:100%;width:100%" class="CToWUd">
                  </a>
                </td>
              </tr>
              </tbody>
            </table>

            <table role="presentation" class="main">
              <!-- START MAIN CONTENT AREA -->
              <tr>
                <td class="wrapper">
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <p>Hi ${toDisplayName || ''},</p>
                        <p>${contentHtml || ''}</p>
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                          <tbody>
                            <tr>
                              <td align="left">
                                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                  <tbody>
                                    <tr>
                                      <td> <a class="actionButton" href="${clickLink ||
                                        'https://www.bidorboo.com'}" rel="noopener noreferrer" target="_blank">${clickDisplayName ||
    'Open BidOrBoo'}</a> </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p> BIDORBOO Wishes you the best of luck!</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            <!-- END MAIN CONTENT AREA -->
            </table>

            <!-- START FOOTER -->
            <div class="footer">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td class="content-block">
                    <span class="apple-link">BIDORBOO Inc, Ottawa ON Canada</span>
                    <br>You can unsubscribe anytime by changing your notification settings <a href="https://bidorboo.com/my-profile/basic-settings">Unsubscribe</a>.
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};
