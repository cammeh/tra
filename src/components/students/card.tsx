"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { CardSkeleton } from "./skeleton-loader";

export function StudentCard() {
  const {
    data: students,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await fetch("/api/students");
      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        throw new Error(errorData.error || "Failed to fetch students");
      }
      return response.json();
    },
    select: (data) => data || [], // Default to an empty array if no data
  });

  if (isLoading) return <CardSkeleton />; // Use the skeleton loader

  if (error instanceof Error) {
    console.error("Fetch error:", error); // Log the error for debugging
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="px-4 mb-4 mt-4 pb-4 ">
      <div className="grid grid-cols-8 gap-2">
        {students?.map((student: any) => (
          <Link href={`/students/${student.id}`} key={student.id}>
            <Card className="bg-background dark:border-muted shadow-md rounded-lg overflow-hidden transition-all ease-in-out duration-300 hover:shadow-xl h-auto cursor-pointer">
              <CardContent className="flex flex-row items-center gap-4">
                <Avatar>
                  {student.photo.content ? (
                    <AvatarImage
                      src={`data:image/png;base64,${student.photo.content}`}
                      alt={`${student.forename} ${student.surname} photo`}
                      className="object-cover"
                    />
                  ) : (
                    <AvatarFallback>?</AvatarFallback>
                  )}
                </Avatar>
                <div className="space-y-1">
                  <h2 className="text-sm font-semibold">
                    {student.forename} {student.surname}
                  </h2>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      MIS: {student.misId}
                    </Badge>
                    {student.educationDetails?.current_nc_year ? (
                      <Badge variant="secondary" className="text-xs">
                        Year {student.educationDetails.current_nc_year}
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
