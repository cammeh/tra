"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function CommandMenu({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [value, setValue] = useState("");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Fetch students only when the dialog is open
  const { data: students, isLoading: isStudentsLoading } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const res = await fetch("/api/students");
      if (!res.ok) throw new Error("Failed to fetch students");
      return res.json();
    },
    enabled: open, // Only fetch when the dialog is open
  });

  // Fetch staff only when the dialog is open
  const { data: staff, isLoading: isStaffLoading } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const res = await fetch("/api/staff");
      if (!res.ok) throw new Error("Failed to fetch staff");
      return res.json();
    },
    enabled: open, // Only fetch when the dialog is open
  });

  return (
    <CommandDialog open={open} onOpenChange={setOpen} title="Search">
      <CommandInput
        placeholder="Find a student or staff member"
        value={value}
        onValueChange={setValue}
      />
      <CommandList className="p-3 overflow-y-auto max-h-60">
        <CommandEmpty>
          {isStudentsLoading || isStaffLoading ? null : (
            <div>
              No results found for{" "}
              <span className="text-violet-500">"{value}"</span>
            </div>
          )}
        </CommandEmpty>

        {isStudentsLoading || isStaffLoading ? (
          <div className="flex justify-center items-center">Loading...</div>
        ) : (
          <>
            <CommandGroup
              heading="Students"
              className="text-sm mb-3 text-stone-400"
            >
              {students?.map((student: any) => (
                <Link href={`/students/${student.id}`} key={student.id}>
                  <CommandItem className="flex cursor-pointer transition-colors text-sm text-primary hover:bg-primary-foreground rounded items-center gap-2">
                    {student.photo?.content ? (
                      <Base64Image
                        base64String={`data:image/png;base64,${student.photo.content}`}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    )}
                    {student.forename} {student.surname}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>

            <CommandGroup
              heading="Staff"
              className="text-sm mb-3 text-stone-400"
            >
              {staff?.map((staffMember: any) => (
                <Link href={`/staff/${staffMember.id}`} key={staffMember.id}>
                  <CommandItem className="flex cursor-pointer transition-colors text-sm text-stone-950 hover:bg-stone-200 rounded items-center gap-2">
                    {staffMember.photo?.content ? (
                      <Base64Image
                        base64String={`data:image/png;base64,${staffMember.photo.content}`}
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    )}
                    {staffMember.forename} {staffMember.surname}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

const Base64Image = ({ base64String }: { base64String: string }) => (
  <img
    className="rounded-full w-8 h-8 object-cover"
    src={base64String}
    alt="Profile"
  />
);
