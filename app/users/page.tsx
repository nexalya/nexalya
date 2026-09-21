import { listUsers } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import UsersManager from "@/components/UsersManager";
import ChangePasswordForm from "@/components/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const currentUser = await requireUser();
  const users = listUsers();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Usuarios</h1>
        <p className="text-slate-500 text-sm mt-1">
          Cuentas del equipo con acceso a Nexalya.
        </p>
      </div>

      <UsersManager initialUsers={users} currentUserId={currentUser.id} />

      <div>
        <h2 className="text-lg font-medium mb-3">Mi contraseña</h2>
        <div className="card p-6 max-w-sm">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
