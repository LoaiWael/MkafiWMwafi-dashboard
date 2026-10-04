import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { DEMO_CREDENTIALS } from "@/features/auth/auth-store";
import ForgotPasswordDialog from "@/features/auth/components/forgot-password-dialog";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { ROUTES, SITE } from "@/lib/constants";
import { useState } from "react";

export default function LoginForm() {
  const navigate = useNavigate();
  const { loginWithPassword, isLoading } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const isPhoneIdentifier = /^(\+966|05|\d)/.test(identifier.trim());

  function fillDemoPassword() {
    setIdentifier(DEMO_CREDENTIALS.identifier);
    setPassword(DEMO_CREDENTIALS.password);
    setErrorMessage(null);
    toast.info("تم ملء بيانات الدخول التجريبية للمسؤول.");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    try {
      const user = await loginWithPassword({
        identifier,
        password,
        rememberMe,
      });
      toast.success(`مرحباً بك مجدداً، ${user.name}`);
      navigate(ROUTES.home, { viewTransition: true });
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "تعذر تسجيل الدخول. يرجى التحقق من البيانات.";
      setErrorMessage(message);
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Logo & Header */}
      <div className="flex flex-col items-center text-center space-y-3">
        <div className="flex h-16 w-auto max-w-44 items-center justify-center">
          <img
            src={SITE.logo}
            alt={SITE.name}
            className="h-full w-auto object-contain"
          />
        </div>
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            تسجيل الدخول إلى لوحة التحكم
          </h1>
          <p className="text-xs text-muted-foreground sm:text-sm">
            أدخل البريد الإلكتروني أو رقم الجوال وكلمة المرور للمتابعة
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {errorMessage && (
        <Alert
          variant="destructive"
          className="border-destructive/30 bg-destructive/10 text-start"
        >
          <AlertCircle className="size-4" />
          <AlertDescription className="text-xs font-medium">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Password Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2 text-start">
          <Label
            htmlFor="identifier"
            className="text-xs font-semibold text-foreground"
          >
            البريد الإلكتروني أو رقم الجوال
          </Label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-muted-foreground">
              {isPhoneIdentifier ? (
                <Phone className="size-4" />
              ) : (
                <Mail className="size-4" />
              )}
            </div>
            <Input
              id="identifier"
              type="text"
              placeholder="awad@makfiwamufi.sa أو 0504111307"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              disabled={isLoading}
              autoComplete="username"
              className="h-11 ps-10 pe-4 text-start"
              required
            />
          </div>
        </div>

        <div className="space-y-2 text-start">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-xs font-semibold text-foreground"
            >
              كلمة المرور
            </Label>
            <button
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
              className="cursor-pointer text-xs font-medium text-primary hover:text-primary-700 hover:underline"
            >
              نسيت كلمة المرور؟
            </button>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5 text-muted-foreground">
              <Lock className="size-4" />
            </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoComplete="current-password"
              className="h-11 ps-10 pe-10 text-start"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 end-0 flex cursor-pointer items-center pe-3.5 text-muted-foreground hover:text-foreground"
              aria-label={
                showPassword ? "إخفاء كلمة المرور" : "عرض كلمة المرور"
              }
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-foreground select-none">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
              disabled={isLoading}
            />
            <span>تذكر بيانات الدخول</span>
          </label>

          <button
            type="button"
            onClick={fillDemoPassword}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50/80 px-2.5 py-1 text-[11px] font-semibold text-primary-900 transition-colors hover:bg-primary-100/80"
          >
            <Sparkles className="size-3 text-secondary-500" />
            <span>بيانات تجريبية</span>
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="h-11 w-full text-sm font-bold shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spinner className="size-4" />
              <span>جاري تسجيل الدخول...</span>
            </div>
          ) : (
            <span>تسجيل الدخول</span>
          )}
        </Button>
      </form>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onOpenChange={setForgotPasswordOpen}
      />
    </div>
  );
}
