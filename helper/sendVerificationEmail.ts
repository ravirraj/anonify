import { resend } from "@/lib/resend";
import { VerificationEmailTemplate } from "@/emails/verficationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmails(
  email: string,
  username: string,
  verificationCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      react: VerificationEmailTemplate({username,verificationCode}),
    });

    
    return { success: true, message: " verification email sent successfully" };
  } catch (emailError) {
    console.log("Error sending verification email ", emailError);
    return { success: false, message: "Failed to send verification email" };
  }
}
