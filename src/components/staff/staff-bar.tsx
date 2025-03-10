"use client";

import React from "react";
import { ModeToggle } from "../dashboard/dark-mode";
import { useQuery } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const StaffBar = ({ id }: { id: string }) => {
  const {
    data: staff,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staff", id],
    queryFn: async () => {
      const response = await fetch(`/api/staff/${id}`);
      if (!response.ok) throw new Error("Failed to fetch staff data");
      return response.json();
    },
  });

  return (
    <>
      <div className="border-b p-4 border-muted">
        <div className="flex items-center justify-between p-0.5">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/staff">
                    <h1 className="px-2 py-1 rounded bg-muted text-sm font-semibold">
                      Staff
                    </h1>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <h1 className="px-2 py-1 rounded bg-muted text-sm font-semibold">
                    Overview for {staff?.forename} {staff?.surname}
                  </h1>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </div>
      </div>
    </>
  );
};

export default StaffBar;
