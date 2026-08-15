import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return <>{children}</>; // /admin/login renders standalone
  }

  return (
    <div className="flex min-h-[calc(100vh-88px)]">
      <AdminSidebar />
      <div className="flex-1 px-6 py-8">{children}</div>
    </div>
  );
}
