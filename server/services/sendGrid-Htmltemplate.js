exports.populateHtmlTemplate = ({ toDisplayName, contentHtml, clickLink, clickDisplayName }) => {
  return `
  <!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <title>BidOrBoo Update</title>
    <style>
      /* -------------------------------------
          GLOBAL RESETS
      ------------------------------------- */

      /*All the styling goes here*/

      img {
        border: none;
        -ms-interpolation-mode: bicubic;
        max-width: 100%;
      }

      body {
        background-color: #f6f6f6;
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
        background-color: #f6f6f6;
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

      /* -------------------------------------
          TYPOGRAPHY
      ------------------------------------- */
      h1,
      h2,
      h3,
      h4 {
        color: #000000;
        font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        font-weight: 400;
        line-height: 1.2;
        margin: 0;
        margin-bottom: 30px;
      }

      h1 {
        font-size: 35px;
        font-weight: 300;
        text-align: center;
        text-transform: capitalize;
      }

      p,
      ul,
      ol {
        font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        font-size: 16px;
        font-weight: normal;
        margin: 0;
        margin-bottom: 15px;
      }
        p li,
        ul li,
        ol li {
          list-style-position: inside;
          margin-left: 5px;
      }

      a {
        color: #3498db;
        text-decoration: underline;
      }

      p {
        font-family: Roboto,RobotoDraft,Helvetica,Arial,sans-serif;
        font-size: 16px;
        line-height: 1.2;
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

      /* -------------------------------------
          OTHER STYLES THAT MIGHT BE USEFUL
      ------------------------------------- */
      .last {
        margin-bottom: 0;
      }

      .first {
        margin-top: 0;
      }

      .align-center {
        text-align: center;
      }

      .align-right {
        text-align: right;
      }

      .align-left {
        text-align: left;
      }

      .clear {
        clear: both;
      }

      .mt0 {
        margin-top: 0;
      }

      .mb0 {
        margin-bottom: 0;
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
        border-bottom: 1px solid #f6f6f6;
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
      @media all {
        .ExternalClass {
          width: 100%;
        }
        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }
        .apple-link a {
          color: inherit !important;
          font-family: inherit !important;
          font-size: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
          text-decoration: none !important;
        }
        .btn-primary table td:hover {
          background-color: #34495e !important;
        }
        .btn-primary a:hover {
          background-color: #34495e !important;
          border-color: #34495e !important;
        }
      }

    </style>
  </head>
  <body class="">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
      <tr>
        <td>&nbsp;</td>
        <td class="container">
          <div class="content">

            <!-- START CENTERED WHITE CONTAINER -->
            <table dir="ltr" width="100%" style="border:0;border-collapse:collapse;margin:0;padding:0;background-color:#ffffff">
              <tbody>
              <tr>
                <td style="background-color:#ef2834;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%;border-top-left-radius:5px" align="right" height="156" valign="bottom" width="252">
                  <a>
                    <img alt="" height="156" width="252" src="https://ci4.googleusercontent.com/proxy/9-vzO6oIjzdWLz5vxJipUa48-_jdteSGmZPi_jXjI1P9gfsxKXGx5ZC6HCp7gEsdL6c6qVHcVmPrfRVxxz7Yw1GWRX10g1zsI66f3vStuGoBVesH24A0bVJsUdvql3xAbjPcKaA_8g=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/notifications/hosted/20180110/Header/Left.png" style="display:block;border:0;line-height:100%;width:100%" class="CToWUd">
                  </a>
                </td>
                <td class="m_-5264624343063366418Header-icon m_-5264624343063366418Target" style="background-color:#ef2834;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%" align="center" height="156" valign="bottom" width="96">
                  <a href="https://www.bidorboo.com/" style="outline:0;text-decoration:none" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.bidorboo.com/&amp;source=gmail&amp;ust=1562304463864000&amp;usg=AFQjCNFKfA4UjYJAJAXofB_kEQt0lTmgow">
                    <img alt="" height="156" width="96" src="https://ci6.googleusercontent.com/proxy/-VaqDn6myfpJbQOv-RyMbWX-3HaT6PQUSZ2un3_LdTM9gliqOua3EJN4VuiAA68aZtzI2PrM4n3B-8-Pd0wEhnIJQylApp-HA3CgqtxdiEdHx9vGQ-m9q-W2wYlhMwmhm2jrfxNCf56uy0A4GWtT519v=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/emails/acct_1EkxmxHRQ5neEvOS/1/twelve_degree_icon@2x.png" style="display:block;border:0;line-height:100%;width:100%" class="CToWUd">
                  </a>
                </td>
                <td style="background-color:#ef2834;border:0;border-collapse:collapse;margin:0;padding:0;font-size:0;line-height:0px;background-size:100% 100%;border-top-right-radius:5px" align="left" height="156" valign="bottom" width="252">
                  <a>
                    <img alt="" height="156" width="252" src="https://ci5.googleusercontent.com/proxy/agqjJXCE9UqmeYtipoZMl4NQ5plhy-TKT_WsqxR18QMhNXU7t-dJPtqpaqwtjzrOslBvOe18-HlXRVknnUuUTIhtrECzchPqX06DXBwznI7p5hMwQb0pIl-d9gWCXjLTWHpQSf0rxKo=s0-d-e1-ft#https://stripe-images.s3.amazonaws.com/notifications/hosted/20180110/Header/Right.png" style="display:block;border:0;line-height:100%;width:100%" class="CToWUd">
                  </a>
                </td>
              </tr>
              </tbody>
            </table>
            <h1 style="color: #363636;font-weight:700">BidOrBoo</h1>
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
                                      <td> <a style="background-color:#31c110;color:white;" href="${clickLink ||
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
                <tr>
                  <td class="content-block powered-by">
                    Powered by <a rel="noopener noreferrer" target="_blank" href="https://sendgrid.com">SendGrid</a>.
                  </td>
                </tr>
              </table>
            </div>
            <!-- END FOOTER -->

          <!-- END CENTERED WHITE CONTAINER -->
          </div>
        </td>
        <td>&nbsp;</td>
      </tr>
    </table>
  </body>
</html>`;
};
