import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Cartivo <onboarding@resend.dev>",
      to,
      subject,
      text,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error(error.message || "Failed to send email");
    }

    console.log("Email sent successfully:", data?.id);
    return data;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};

export default sendEmail;