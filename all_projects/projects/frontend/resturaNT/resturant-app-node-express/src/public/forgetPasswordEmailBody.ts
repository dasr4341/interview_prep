const forgetPasswordEmailBody = (FORGET_PASSWORD_FRONTEND_URL: string, forgetPasswordAuthToken: string): string => `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Webite</title>
    <style>
        *{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: system-ui;
            background-color: rgb(190, 255, 255);
        }
        table {
            table-layout: fixed;
            border-collapse: collapse;
            margin: 0 auto;
        }

        th,
        td {
            text-align: center;
            word-wrap: break-word;
        }
        .title-heading{
          margin-top: 10px;
          font-size: 3rem;
        }
        .heading{
          font-size: 2rem;
          padding: 15px;
          color: rgb(40, 40, 40);
        }
        .anchor{
          padding: 15px;
        }
        .auth-anchor{
          font-size: 1.5rem;
          padding: 10px;
          background-color: black;
          color: white;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 10px;
        }
    </style>
</head>

<body>
  <table>
    <caption>
        <h1 class="title-heading">Gangotri</h1>
    </caption>
    <thead>
        <tr>
            <th class="heading" scope="row" colspan="1">Use the link below to reset your password</th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="anchor">
                <a  class="auth-anchor" 
                    style="color: white" 
                    href=${FORGET_PASSWORD_FRONTEND_URL}/${forgetPasswordAuthToken}>
                    Click Here
                </a>
            </td>
        </tr>
    </tbody>
  </table>

</body>

</html>
    `;

export default forgetPasswordEmailBody;
