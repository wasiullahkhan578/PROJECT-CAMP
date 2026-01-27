import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // 1. Mailgen Setup (Frontend ka link lagaya taaki email logo par click karke user wahan jaye)
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Project Camp",
      link: process.env.CORS_ORIGIN || "http://localhost:5173",
    },
  });

  // 2. Email Body Generate
  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  // 3. Transporter (REAL GMAIL SETUP)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_MAIL, // .env se aayega
      pass: process.env.SMTP_PASSWORD, // .env se aayega
    },
  });

  // 4. Send Mail Object
  const mail = {
    from: `"Project Camp Team" <${process.env.SMTP_MAIL}>`, // Sender Name
    to: options.email, // User ka Real Email
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
    console.log(`✅ Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error("❌ Email service failed:", error);
  }
};

// --- CONTENT GENERATORS ---

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Project Camp! We're excited to have you on board.",
      action: {
        instructions: "To verify your email please click on the button below:",
        button: {
          color: "#22BC66", // Green Button
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro: "Need help? Just reply to this email, we'd love to help!",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We received a request to reset the password for your account.",
      action: {
        instructions: "To reset your password click the button below:",
        button: {
          color: "#6366f1", // Indigo Button
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro: "If you did not request this, please ignore this email.",
    },
  };
};

export {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
};
