import nodemailer from "nodemailer"
import { Request, Response } from "express"

export const myfunction = async (req:Request,email:string,secretCode : string ,res:Response) => {
    try {
 
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.SMTP_EMAIL,
              pass: process.env.SMTP_PASS
            }
          });
            const mailOptions = {
                from: "Harsh<codinggeekss0@gmail.com>",
                to: email,
                subject: "Certificate of Participation",
                html: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Registration Mail</title>
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Roboto', sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            padding: 20px;
                            margin: auto;
                            max-width: 600px;
                            background-color: #ffffff;
                            border-radius: 5px;
                            box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
                        }
                        .email-header {
                            text-align: center;
                            padding-bottom: 20px;
                        }
                        .email-header h1 {
                            margin: 0;
                            font-size: 24px;
                            color: #333333;
                        }
                        .email-body {
                            padding-bottom: 20px;
                        }
                        .email-body p {
                            margin: 0;
                            margin-bottom: 10px;
                            color: #333333;
                        }
                        .email-footer {
                            text-align: center;
                            padding-top: 20px;
                            border-top: 1px solid #dddddd;
                        }
                        .email-footer p {
                            margin: 0;
                            color: #888888;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="email-header">
                            <h1>Registration Mail</h1>
                        </div>
                        <div class="email-body">
                            <p>Hi,</p>
                            <p>Your OTP for the verification is: <strong>${secretCode}</strong></p>
                            <p>This OTP is valid for 10 minutes only. Do not share this OTP with anyone.</p>
                        </div>
                        <div class="email-footer">
                            <p>Regards,</p>
                            <p>Your Team</p>
                        </div>
                    </div>
                </body>
                </html>`,
            }
            await transporter 
                .sendMail(mailOptions)
                .then(() => {
                    console.log(`Mail sent to ${email}`)
                })
                .catch((err) => {
                    console.log(err);
                })
        // return res.status(200).json({ msg: 'All mail sent' })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Error registering the user' })
    }
}
