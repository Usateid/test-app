"use client";

import { useState } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";
import { redirect } from "next/navigation";
// import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

enum ModeEnum {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  RESET = "RESET",
}

function LoginPageContent() {
  const [mode, setMode] = useState<ModeEnum>(ModeEnum.LOGIN);

  return (
    <div
      className="relative flex justify-center items-center min-h-[100vh] overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px_800px_at_10%_-10%, rgba(56,189,248,0.18), rgba(0,0,0,0) 60%),\
           radial-gradient(900px_700px_at_90%_0%, rgba(167,139,250,0.16), rgba(0,0,0,0) 55%),\
           radial-gradient(700px_500px_at_50%_110%, rgba(248,113,113,0.12), rgba(0,0,0,0) 50%),\
           linear-gradient(180deg, #0b0f1a 0%, #0a0a0a 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-[42rem] w-[42rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(56,189,248,0.35), rgba(56,189,248,0))",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[36rem] w-[36rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(167,139,250,0.32), rgba(167,139,250,0))",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(248,113,113,0.22), rgba(248,113,113,0))",
        }}
      />

      {mode === ModeEnum.LOGIN && (
        <LoginForm onSwitchToRegister={() => setMode(ModeEnum.REGISTER)} />
      )}

      {mode === ModeEnum.REGISTER && (
        <RegisterForm onSwitchToLogin={() => setMode(ModeEnum.LOGIN)} />
      )}
      {/*
      {mode === ModeEnum.RESET && (
        <ResetPasswordForm
          onBack={handleBackToForgot}
          onSuccess={handleResetSuccess}
        />
      )} */}
    </div>
  );
}

export default function LoginPage() {
  return <LoginPageContent />;
}
