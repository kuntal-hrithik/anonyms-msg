import resend from "../lib/resend";
import VerificationEmail from "../../emails/verificationEmail";

import { ApiResponse } from "../types/ApiResponse";
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log(response);
    return {
      success: true,
      message: "Verification email sent",
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: "Error sending verification email",
    };
  }
}
