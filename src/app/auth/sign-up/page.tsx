import SignUpForm from "@/components/auth/SignUpForm";
import Image from "next/image";
import Link from "next/link";

export default function SignUpPage() {
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
            Create your account
          </h2>
          <p className="text-[var(--muted)] text-lg leading-relaxed">
            Join the studio, access your dashboard, and submit project briefs
            directly to the ARK team.
          </p>
        </div>
      </div>

      {/* Right sign-up form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}