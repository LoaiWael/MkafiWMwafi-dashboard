import { ScaleIn } from "@/components/animations";
import LoginForm from "@/features/auth/components/login-form";

export default function LoginSection() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4 sm:p-6 lg:p-8">
      {/* Background ambient decorative shapes */}
      <div className="pointer-events-none absolute -top-40 -start-40 size-96 rounded-full bg-primary-100/60 blur-3xl dark:bg-primary-950/30" />
      <div className="pointer-events-none absolute -bottom-40 -end-40 size-96 rounded-full bg-tertiary-100/50 blur-3xl dark:bg-tertiary-950/20" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <ScaleIn duration={0.4} className="w-full">
          <div className="w-full rounded-3xl border border-border/80 bg-card p-6 shadow-xl shadow-primary-950/5 ring-1 ring-border/50 sm:p-8 md:p-9">
            <LoginForm />
          </div>
        </ScaleIn>
      </div>
    </div>
  );
}
