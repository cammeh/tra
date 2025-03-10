import Focus from "@/components/focus/focus";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function FocusPage() {
  const { getPermission } = getKindeServerSession();

  const permission = await getPermission("view:staff");

  if (!permission?.isGranted) {
    redirect("/");
  }

  return (
    <div>
      <Focus />
    </div>
  );
}
