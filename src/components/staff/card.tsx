"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CardSkeleton } from "../students/skeleton-loader";

export function StaffCard() {
  const {
    data: staff,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await fetch("/api/staff");
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        throw new Error(errorData.error || "Failed to fetch students");
      }
      return response.json();
    },
    select: (data) => data || [], // Default to an empty array if no data
  });

  if (isLoading) return <CardSkeleton />;

  if (error instanceof Error) {
    console.error("Fetch error:", error); // Log the error for debugging
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="px-4 mb-4 mt-4 pb-4 ">
      <div className="grid grid-cols-8 gap-2">
        {staff?.map((staff: any) => (
          <Link href={`/staff/${staff.id}`} key={staff.id}>
            <Card className="bg-background dark:border-muted shadow-md rounded-lg overflow-hidden transition-all ease-in-out duration-300 hover:shadow-xl h-auto">
              <CardContent className="flex flex-row items-center gap-4">
                <Avatar>
                  {staff.photo?.content ? (
                    <AvatarImage
                      src={`data:image/png;base64,${staff.photo.content}`}
                      alt="Channel Logo"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback>{staff.initials}</AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold">
                    {staff.forename} {staff.surname}
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    MIS: {staff.misId}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
