import LoginSection from "@/features/auth/components/login-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function LoginPage() {
  useDocumentTitle("تسجيل الدخول");

  return <LoginSection />;
}
