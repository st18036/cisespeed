/* import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { email, name, message } = req.body;

      // Create a transporter object using the default SMTP transport
      const transport = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.MY_EMAIL, // Your email address
          pass: process.env.MY_PASSWORD, // Your email password or app password
        },
      });

      // Mail options
      const mailOptions: Mail.Options = {
        from: process.env.MY_EMAIL, // Sender address
        to: process.env.MY_EMAIL, // List of receivers
        subject: `Message from ${name} (${email})`, // Subject of the email
        text: message, // Plain text body
      };

      // Send mail and return a promise
      await transport.sendMail(mailOptions);

      // Return a success response
      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      console.error('Error sending email:', err);
      // Return an error response
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    // Return method not allowed for other request methods
    res.status(405).json({ error: 'Method not allowed' });
  }
}
*/