const nodemailer = require('nodemailer');

// Set up transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'dineshduddella2004@gmail.com',
    pass: 'adpxmfviprisptmc' // Use app password if 2FA enabled
  }
});

// Send email when a user favorites a property
const sendFavoriteEmail = (userEmail, propertyTitle) => {
  const mailOptions = {
    from: 'dineshduddella2004@gmail.com',
    to: userEmail,
    subject: '🏡 Property Favorited!',
    text: `You have favorited the property: "${propertyTitle}". We’ll keep you posted on any updates!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Email error:', error);
    else console.log('Email sent:', info.response);
  });
};
const sendIntentEmail = (userEmail, commentText) => {
  const mailOptions = {
    from: 'dineshduddella2004@gmail.com',
    to: userEmail,
    subject: '🏠 We Noticed Your Interest!',
    text: `Thanks for your comment: "${commentText}".\nWe’d love to help you move forward with this property. Let us know if you'd like a visit or more info!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Intent email error:', error);
    else console.log('Intent email sent:', info.response);
  });
};

module.exports = { sendFavoriteEmail, sendIntentEmail };