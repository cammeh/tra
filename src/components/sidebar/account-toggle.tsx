import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut } from "lucide-react";
import { Button } from "../ui/button";

const AccountToggle = async () => {
  const { getUser, isAuthenticated, getRoles } = getKindeServerSession();
  const user = await getUser();
  const authenticated = await isAuthenticated();
  const roles = await getRoles();

  const isAdmin = roles?.some((role) => role.key === "administrator");

  return (
    <div className="flex sticky top-[calc(100vh_-_48px_-_16px)] flex-col h-12 px-2 border-stone-300 justify-end text-xs">
      <div className="flex items-center justify-between">
        {authenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex p-0.5 hover:bg-primary-foreground rounded transition-colors relative gap-2 w-full items-center focus:outline-none cursor-pointer">
                <img
                  src={user.picture!}
                  alt="avatar"
                  className="size-8 rounded shrink-0 bg-violet-500 shadow"
                />
                <div className="text-start">
                  <span className="text-sm font-bold block">
                    {user.given_name} {user.family_name}
                  </span>
                  <span className="text-xs block text-stone-500">
                    {isAdmin ? "Administrator" : "Staff"}
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <LogOut />
                <LogoutLink>Log out</LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className="flex p-0.5 rounded transition-colors relative gap-2 w-full items-center cursor-pointer">
            <LogIn />
            <LoginLink>Log in</LoginLink>
          </Button>
        )}
      </div>
    </div>
  );
};

export default AccountToggle;
