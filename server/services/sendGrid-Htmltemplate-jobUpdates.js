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

    /* -------------------------------------
        RESPONSIVE AND MOBILE FRIENDLY STYLES
    ------------------------------------- */
    @media only screen and (max-width: 620px) {
      table[class=body] h1 {
        font-size: 28px !important;
        margin-bottom: 10px !important;
      }
      table[class=body] p,
      table[class=body] ul,
      table[class=body] ol,
      table[class=body] td,
      table[class=body] span,
      table[class=body] a {
        font-size: 16px !important;
      }
      table[class=body] .wrapper,
      table[class=body] .article {
        padding: 10px !important;
      }
      table[class=body] .content {
        padding: 0 !important;
      }
      table[class=body] .container {
        padding: 0 !important;
        width: 100% !important;
      }
      table[class=body] .main {
        border-left-width: 0 !important;
        border-radius: 0 !important;
        border-right-width: 0 !important;
      }
      table[class=body] .btn table {
        width: 100% !important;
      }
      table[class=body] .btn a {
        width: 100% !important;
      }
      table[class=body] .img-responsive {
        height: auto !important;
        max-width: 100% !important;
        width: auto !important;
      }
    }

    /* -------------------------------------
        PRESERVE THESE STYLES IN THE HEAD
    ------------------------------------- */

  </style>
  </head>

  <body>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <span class="preheader">BidOrBoo updates!</span>

            <table dir="ltr" width="100%" style="border:0;border-collapse:collapse;margin:0;padding:0;background-color:#ffffff">
              <tbody>
              <tr style="border-bottom:4px solid #ee2a36">
                <td class="wrapper">
                <img alt="" height="64" width="64" src="https://res.cloudinary.com/hr6bwgs1p/image/upload/v1562257900/android-chrome-512x512.png" style="display:block;border:0;height:64px;width:64px;margin:auto" >
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
                        <p> BidOrBoo Wishes you the best of luck!</p>
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
                    <span class="apple-link">BidOrBoo Inc, Ottawa ON Canada</span>
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
