const orderConfirmation = (emailTo: string, senderName: string, emailFrom: string, subject: string, html: string) => ({
  to: emailTo,
  from: {
    name: senderName,
    email: emailFrom,
  },
  subject,
  html,
});

export default orderConfirmation;
