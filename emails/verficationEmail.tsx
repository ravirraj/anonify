import * as React from "react";

interface VerificationEmailTemplateProps {
  username: string;
  verificationCode: string;
}

export function VerificationEmailTemplate({
  username,
  verificationCode,
}: VerificationEmailTemplateProps) {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "24px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <h1 style={{ marginBottom: "16px" }}>Verify your email</h1>

        <p style={{ marginBottom: "24px", fontSize: "16px" }}>
          Hi {username},<br />
          Use the verification code below to complete your sign-in:
        </p>

        <div
          style={{
            fontSize: "32px",
            fontWeight: "bold",
            letterSpacing: "6px",
            padding: "16px",
            backgroundColor: "#f0f0f0",
            borderRadius: "6px",
            marginBottom: "24px",
          }}
        >
          {verificationCode}
        </div>

        <p style={{ fontSize: "14px", color: "#666" }}>
          This code will expire in a few minutes.
          <br />
          If you didn’t request this, you can safely ignore this email.
        </p>
      </div>
    </div>
  );
}
