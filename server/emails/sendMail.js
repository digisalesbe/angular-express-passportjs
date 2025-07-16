const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,          // e.g. 'smtp.hostinger.com'
  port: 465,                             // or 587 for TLS
  secure: true,                          // true for port 465, false for port 587
  auth: {
    user: process.env.MAIL_USER,         // e.g. 'your@email.com'
    pass: process.env.MAIL_PASS,
  },
});

function sendHtmlEmail(to, subject, templateName, placeholders) {
  const filePath = path.join(__dirname, 'templates', `${templateName}.html`);
  let html = fs.readFileSync(filePath, 'utf8');

  // Replace {{placeholders}} in the HTML file
  for (const key in placeholders) {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, placeholders[key]);
  }

  return transporter.sendMail({
    from: `"Your App" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}

module.exports = sendHtmlEmail;