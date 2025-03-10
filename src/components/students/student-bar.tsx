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

const StudentBar = ({ id }: { id: string }) => {
  const { data: student } = useQuery({
    queryKey: ["student"],
    queryFn: async () =>
      await fetch(
        `https://api.wonde.com/v1.0/schools/A1930499544/students/${id}?include=photo,education_details`,
        {
          headers: {
            Authorization: `Bearer 3e482f451d2c91d2d42320b36c691ce2a3c1ac4a`,
          },
        }
      )
        .then((res) => res.json())
        .then((req) => req.data),
    select: (data) => data || [],
  });
  return (
    <>
      <div className="border-b p-4 border-muted">
        <div className="flex items-center justify-between p-0.5">
          <div>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/students">
                    <h1 className="px-2 py-1 rounded bg-muted text-sm font-semibold">
                      Students
                    </h1>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <h1 className="px-2 py-1 rounded bg-muted text-sm font-semibold">
                    Overview for {student?.forename} {student?.surname}
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

export default StudentBar;
