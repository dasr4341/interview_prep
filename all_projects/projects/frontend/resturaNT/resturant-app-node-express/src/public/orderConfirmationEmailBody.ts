/* eslint-disable max-len */
const orderConfirmationEmailBody = (orderId: number, noOfItems: number, grandTotal: number, link: string): string => `<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
        body,
        table,
        td,
        a {
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }

        table,
        td {
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }

        img {
            -ms-interpolation-mode: bicubic;
        }

        img {
            border: 0;
            height: auto;
            line-height: 100%;
            outline: none;
            text-decoration: none;
        }

        table {
            border-collapse: collapse !important;
        }

        body {
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
        }


        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }

        .responsive-width {
            width: 50%;
        }

        .header {
            font-size: 36px;
            letter-spacing: 0.1rem;
        }
.responsive-img{
    width: 100px;
    height: 100px;
}
        @media screen and (max-width: 480px) {
            .responsive-width {
                width: 70%;
            }

            .header {
                font-size: 20px;
            }
            .responsive-img{
                 width: 60px;
    height: 60px;
            }

        }
    </style>

<body style="margin: 0 !important; padding: 0 !important; 
     background-image: 
     url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80');
     background-size:cover; 
     background-repeat: no-repeat; background-origin: border-box; background-attachment: fixed; ">

    <table border="0" cellpadding="0" cellspacing="0" width="70%" style="margin:auto; " class="responsive-width">
        <tr>
            <td align="center">

                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px;">
                    <tr>
                        <td align="center" valign="top" style="font-size:0; padding: 35px;" bgcolor="#000000">
                            <h1 style="
                                font-weight: 800; margin: 0;
                                 color: #ffffff; font-family: Open Sans, Helvetica, Arial, sans-serif;" class="header">
                                Gangotri</h1>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding: 35px 35px 20px 35px; background-color: #ffffff; "
                            bgcolor="#ffffff">
                            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="max-width:600px;" bgcolor="#ffffff">
                                <tr>
                                    <td align="center" style="font-family: Open Sans, Helvetica, Arial, sans-serif; 
                                        font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 25px;">
                                        <img src="https://img.icons8.com/external-those-icons-flat-those-icons/344/external-Check-interface-those-icons-flat-those-icons-2.png"
                                            style="display: block; border: 0px;" class="responsive-img" /><br>
                                        <h2 style="font-size: 25px;
                                             font-weight: 500; line-height: 36px; color: #333333; margin: 0;">
                                            Thank You For Your Order!
                                        </h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif;
                                         font-size: 16px; font-weight: 400; line-height: 24px; padding-top: 10px;">
                                        <p style="font-size: 16px;
                                             font-weight: 400; line-height: 24px; color: #777777;">
                                            The order has been successfully placed. We will be very happy to serve you
                                            again
                                            <a href="${link}">Track Order</a>
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding-top: 20px;">
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td width="75%" align="left" bgcolor="#eeeeee" style="font-family: Open Sans, Helvetica, Arial, sans-serif;
                                                     font-size: 16px; font-weight: 800;
                                                      line-height: 24px; padding: 10px;">
                                                    Order Confirmation #
                                                </td>
                                                <td width="25%" align="left" bgcolor="#eeeeee" style="font-family: Open Sans, Helvetica, Arial, sans-serif;
                                                     font-size: 16px; font-weight: 800; 
                                                     line-height: 24px; padding: 10px;">
                                                    <!-- TODO -->
                                                    ${orderId}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="75%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif;
                                                     font-size: 16px;
                                                      font-weight: 400; 
                                                      line-height: 24px; padding: 15px 10px 5px 10px;">
                                                    <!-- TODO -->
                                                    Purchased
                                                </td>
                                                <td width="25%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; 
                                                    font-size: 16px; font-weight: 400;
                                                     line-height: 24px; padding: 15px 10px 5px 10px;">
                                                    ${noOfItems} Items
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="75%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; 
                                                    font-size: 16px; font-weight: 400;
                                                     line-height: 24px; padding: 5px 10px;">
                                                    Delivery Charges
                                                </td>
                                                <td width="25%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif;
                                                     font-size: 16px; font-weight: 400; 
                                                     line-height: 24px; padding: 5px 10px;">
                                                    &#8377; 0.00
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="75%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; 
                                                    font-size: 16px; font-weight: 400;
                                                     line-height: 24px; padding: 5px 10px;">
                                                    Packaging Charges
                                                </td>
                                                <td width="25%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif; 
                                                    font-size: 16px; font-weight: 400; 
                                                    line-height: 24px; padding: 5px 10px;">
                                                    &#8377; 0.00
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="left" style="padding-top: 20px;">
                                        <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr style=" border-top: 3px solid #eeeeee; 
                                                border-bottom: 3px solid #eeeeee;">
                                                <td width="75%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif;
                                                     font-size: 16px; font-weight: 800;
                                                      line-height: 24px; padding: 10px;">
                                                    TOTAL
                                                </td>
                                                <td width="25%" align="left" style="font-family: Open Sans, Helvetica, Arial, sans-serif;
                                                     font-size: 16px; font-weight: 800;
                                                      line-height: 24px; padding: 10px; ">
                                                    &#8377; ${grandTotal}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    <tr>
                        <td align="center" valign="top" style="font-size:0; padding: 35px;" bgcolor="#000000">
                            <Button style="background-color: rgb(230, 132, 90);
                                 border:0; border-radius: 5px; padding: 5px 10px; ">
                                <a href="${link}" style="text-decoration: none;">
                                    <h1 style="  
                                         margin: 0;
                                         color: #ffffff; font-family: Open Sans, Helvetica, Arial, sans-serif;" class="header">
                                        Track Order</h1>
                                </a>
                            </Button>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>

</html>`;

export default orderConfirmationEmailBody;
