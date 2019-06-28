'use strict';



async function sendEmail(mail) {

  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    host: mail.host,
    port: mail.port,
    secure: mail.secure, // true for 465, false for other ports
    auth: {
      user: mail.auth.user,
      pass: mail.auth.pass
    }
  });

  let info = await transporter.sendMail({
    from: mail.from, // sender address
    to: mail.to, // list of receivers
    subject: mail.subject, // Subject line
    text: mail.text, // plain text body
    html: mail.html // html body
  });
}

module.exports.handle = async (event) => {
  let statusCode = 400;
  let body = '';
  await sendEmail(event.body)
    .then(_ => {
      statusCode = 200;
      body = JSON.stringify({
        message: 'Message Sent',
        input: event,
      }, null, 2);
    })
    .catch(err => {
      statusCode = 400;
      body = JSON.stringify({
        error: err.message,
        input: event,
      }, null, 2);;
    });
  return {
    statusCode,
    body
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
