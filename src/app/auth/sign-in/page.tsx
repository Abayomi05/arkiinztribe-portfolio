import SignInForm from "@/components/auth/SignInForm";
import Image from "next/image";
import Link from "next/link";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full bg-[var(--background)]">
      {/* Left brand panel */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center px-12 border-r border-[var(--line)]">
        <div className="flex items-center gap-4 mb-12">
          <Image
            src="/brand/Arkiinztribe.png"
            alt="ARKIINZTRIBE"
            width={160}
            height={54}
            className="brand-logo"
          />
          <span className="text-gradient font-bold text-2xl tracking-tight">
            ARKIINZTRIBE
          </span>
        </div>
        <div className="text-center max-w-xs">
          <h2 className="text-4xl font-bold text-gradient mb-6">
            Sign in to your account
          </h2>
          <p className="text-[var(--muted)] text-lg leading-relaxed">
            Access your dashboard, manage project briefs, and collaborate with
            the ARKIINZTRIBE team.
          </p>
        </div>
      </div>

      {/* Right sign-in form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}