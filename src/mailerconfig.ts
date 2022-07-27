export const mailConfig = {
  transport: {
    host: 'smtp.sendgrid.net',
    auth: {
      user: process.env.SENDGRID_USER_NAME,
      pass: process.env.SENDGRID_PASS,
    },
  },
};
