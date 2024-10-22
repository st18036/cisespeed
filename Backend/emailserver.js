import nodemailer from "nodemailer";

const email = process.env.EMAIL;
const pass = process.env.EMAIL_PASS;

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'cloudtechnology8@gmail.com',
    pass: 'sdnj nnmp kgrm qpba',
  },
});

export const mailOptions = {
  from: email,
  to: email,
};