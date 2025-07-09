import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardTable from "./table";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("admin-user");
  if (!userCookie) {
    redirect("/login");
  }
  
  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <DashboardTable />
    </main>
  );
} 