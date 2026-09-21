import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="card p-8 w-full max-w-sm">
        <div className="flex justify-center mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/nexalya-logo.png" alt="Nexalya" className="h-8 w-auto" />
        </div>
        <h1 className="text-lg font-semibold text-center mb-1">Acceder</h1>
        <p className="text-sm text-slate-500 text-center mb-6">
          Panel interno de Innovapro.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
