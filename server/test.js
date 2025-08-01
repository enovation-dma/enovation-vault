const nodemailer = require("nodemailer");

async function sendTestEmail() {
  let transporter = nodemailer.createTransport({
    host: "smtp.vault.enovation.co.za",
    port: 465,
    secure: true, // use implicit TLS
    auth: {
      user: "security@vault.enovation.co.za",
      pass: "Lf72c097246Q5O",
    },
    logger: true,
    debug: true,
  });

  try {
    let info = await transporter.sendMail({
      from: "security@vault.enovation.co.za",
      to: "joshua.davids@enovation.co.za",
      subject: "Test Email",
      text: "This is a test email from Nodemailer",
    });
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Email send failed:", error);
  }
}

sendTestEmail();
