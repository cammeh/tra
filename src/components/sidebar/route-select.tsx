"use client";

import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { redirect, usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";
import { FiHome, FiLock, FiUsers } from "react-icons/fi";
import { PiStudent } from "react-icons/pi";
import { Skeleton } from "../ui/skeleton";
import { LuBrain } from "react-icons/lu";

const RouteSelect = () => {
  const { getPermission, isLoading } = useKindeBrowserClient();

  return (
    <>
      {isLoading ? (
        <div className="space-y-1">
          <Skeleton className="w-full h-[20px] px-2 py-1.5 rounded-lg" />
          <Skeleton className="w-full h-[20px] px-2 py-1.5 rounded-lg" />
          <Skeleton className="w-full h-[20px] px-2 py-1.5 rounded-lg" />
          <Skeleton className="w-full h-[20px] px-2 py-1.5 rounded-lg" />
        </div>
      ) : (
        <div className="space-y-1">
          <Route Icon={FiHome} title="Dashboard" href="/" />
          <Route Icon={LuBrain} title="Focus Room" href="/focus" />
          <Route Icon={PiStudent} title="Students" href="/students" />
          {!getPermission("view:staff").isGranted ? (
            <Route Icon={FiUsers} title="Staff" href="/staff" disabled />
          ) : (
            <Route Icon={FiUsers} title="Staff" href="/staff" />
          )}
        </div>
      )}
    </>
  );
};

const Route = ({
  Icon,
  title,
  href,
  disabled,
}: {
  Icon: IconType;
  title: string;
  href: string;
  disabled?: boolean;
}) => {
  const pathName = usePathname();
  return (
    <button
      className={`flex items-center justify-start gap-2 cursor-pointer w-full rounded px-2 py-1.5 text-sm transition-[box-shadow,_background-color,_color] ${
        pathName === href
          ? "bg-background shadow"
          : "hover:bg-primary-foreground bg-transparent text-stone-500 shadow-none"
      }`}
      onClick={() => redirect(href)}
      disabled={disabled}
    >
      <Icon className={pathName === href ? "bg-background" : ""} />
      <span>{title}</span>
      {disabled && (
        <span className="ml-auto">
          <FiLock />
        </span>
      )}
    </button>
  );
};

export default RouteSelect;
