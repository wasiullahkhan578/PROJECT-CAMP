import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendEmail = async (options) => {
   const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Task manager",
            link: "https://taskmanagerlink.com"
        }
   })
    
    const emailTexual = mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml = mailGenerator.generate(options.mailgenContent);

   const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_SMTP_HOST,
      port: process.env.MAILTRAP_SMTP_PORT,
      auth: {
        user: process.env.MAILTRAP_SMTP_USER,
        pass: process.env.MAILTRAP_SMTP_PASS,
      },
   });
    
    const mail = {
        from: "mail.taskmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTexual,
        html: emailHtml
    }
    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service failed")
        console.error("Error", error)
    }
    
}



const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App, we'are excited to have you on board",
      action: {
        instructions:
          "to verify your email please click on the following button",
        button: {
          color: "#22BC66",
          text: "verfy your email",
          link: verificationUrl,
        },
      },
      outro:
        "need help, or have questions? just reply to this email, we would love to help!",
    },
  };
};
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account.",
      action: {
        instructions:
          "to reset your password please click on the following button or link ",
        button: {
          color: "#e617c0",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "need help, or have questions? just reply to this email, we would love to help!",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail};
