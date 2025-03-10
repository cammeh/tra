import Sidebar from "@/components/sidebar/sidebar";
import Staff from "@/components/staff/staff";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export default async function StaffPage() {
  const { getPermission } = getKindeServerSession();

  const permission = await getPermission("view:staff");

  if (!permission?.isGranted) {
    redirect("/");
  }

  return (
    <div>
      <Staff />
    </div>
  );
}
