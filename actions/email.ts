"use server";
import sgMail from "@sendgrid/mail";
// Function to send verification email using SendGrid

export async function sendVerificationEmail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error("SENDGRID_API_KEY is not set");
  }
  if (!process.env.SENDGRID_FROM_EMAIL) {
    throw new Error("SENDGRID_FROM_EMAIL is not set");
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const message = {
    to: to.toLowerCase().trim(),
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: subject.trim(),
    text: text.trim(),
  };
  try {
    const [response] = await sgMail.send(message);
    if (response.statusCode !== 202) {
      throw new Error(`SendGrid API error: ${response.statusCode}`);
    }
    return {
      success: true,
      messageId: response.headers["x-message-id"],
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Failed to send email. Please try again later.",
    };
  }
}
