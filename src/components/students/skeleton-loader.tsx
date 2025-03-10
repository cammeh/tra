"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton"; // Assuming you have a Skeleton component
import { Avatar, AvatarFallback } from "../ui/avatar";

export function CardSkeleton() {
  return (
    <div className="px-4 mb-4 mt-4 pb-4">
      <div className="grid grid-cols-8 gap-2">
        {Array.from({ length: 20 }).map((_, index) => (
          <Card
            key={index}
            className="bg-background dark:border-muted shadow-md rounded-lg overflow-hidden h-auto"
          >
            <CardContent className="flex flex-row items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  <Skeleton className="w-8 h-8 rounded-full" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-[100px]" />
                <div className="flex gap-2">
                  <Skeleton className="h-4 w-[60px]" />
                  <Skeleton className="h-4 w-[40px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
