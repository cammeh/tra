"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Badge } from "../ui/badge";
import StaffInfoCard from "./info-card";

const StaffData = ({ id }: { id: string }) => {
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

  if (isLoading) return;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="px-4 mb-4 mt-4 pb-4">
      <div className="w-full h-full bg-muted rounded-xl">
        <div className="flex">
          <div className="grid gap-4 p-4 grid-cols-[400px_1fr]">
            <div className="flex flex-col w-full h-full p-4 gap-4 border-r-2 border-stone-300">
              {staff?.photo?.content && (
                <Image
                  src={`data:image/png;base64,${staff.photo.content}`}
                  width={200}
                  height={200}
                  alt="Staff photo"
                  className="rounded-full w-50 h-50 object-cover ring-4 ring-accent shadow-2xl"
                />
              )}
              <h1 className="text-2xl font-bold">
                {[staff?.forename, staff?.surname].filter(Boolean).join(" ")}
              </h1>
              <h1>
                {staff?.contactDetails?.emails?.[0] || "No primary email"}
              </h1>
              <div className="flex gap-2">
                <Badge>Year 8</Badge>
                <Badge className="bg-destructive dark:text-white">
                  Pupil Premium
                </Badge>
                <Badge className="bg-blue-600 dark:text-white">
                  Toilet Pass
                </Badge>
              </div>
              {/* <div className="flex flex-col gap-2">
                <AddressDialog />
                <ParentalContactDialog />
              </div> */}
            </div>
            <div className="flex">
              <div className="grid grid-cols-4 gap-2">
                <StaffInfoCard
                  title="Sex"
                  data={staff?.gender || "Not provided"}
                />
                <StaffInfoCard
                  title="Date of Birth"
                  data={
                    staff?.dateOfBirth
                      ? new Date(staff.dateOfBirth).toLocaleDateString()
                      : "Not provided"
                  }
                />
                <StaffInfoCard
                  title="UPI"
                  data={staff?.upi || "Not provided"}
                />
                <StaffInfoCard
                  title="MIS ID"
                  data={staff?.misId || "Not provided"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffData;
