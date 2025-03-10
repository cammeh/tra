"use client";

import React, { useCallback, useState, useMemo, useEffect } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Plus, X, UserPlus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Student, Staff } from "@prisma/client";

interface StudentWithPhoto extends Student {
  photo?: {
    content: string;
  };
}

interface StaffWithPhoto extends Staff {
  photo?: {
    content: string;
  };
}

interface CalendarEntry {
  id: string;
  date: string;
  periodId: number;
  students: StudentWithPhoto[];
  staff: StaffWithPhoto[];
}

interface Period {
  id: number;
  students: StudentWithPhoto[];
  staff: StaffWithPhoto[];
}

interface Day {
  date: Date;
  periods: Period[];
}

const DateToUTCDate = (date: Date): Date => {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
};

const getCurrentWeek = (): Day[] => {
  const today = new Date();
  const startOfWeek = new Date(today);

  // Adjust to the previous Monday
  startOfWeek.setDate(
    today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)
  );

  // Create an array for Monday to Friday
  return Array.from({ length: 5 }).map((_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);
    return {
      date,
      periods: Array.from({ length: 5 }).map((_, periodId) => ({
        id: periodId + 1,
        students: [],
        staff: [],
      })),
    };
  });
};

const WeeklyCalendar: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogType, setDialogType] = useState<"student" | "staff">("student");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Recalculate the current week whenever the component renders
  const currentWeek = useMemo(() => getCurrentWeek(), []);

  // Use the start and end dates of the current week for fetching data
  const startDate = useMemo(() => currentWeek[0].date, [currentWeek]);
  const endDate = useMemo(() => currentWeek[4].date, [currentWeek]);

  // Fetch calendar entries for the current week
  const { data: calendarEntries = [], refetch: refetchCalendarEntries } =
    useQuery<CalendarEntry[]>({
      queryKey: [
        "calendarEntries",
        startDate.toISOString(),
        endDate.toISOString(),
      ],
      queryFn: async () => {
        const params = new URLSearchParams({
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        });
        const response = await fetch(`/api/calendar/entries?${params}`);
        if (!response.ok) throw new Error("Failed to fetch calendar entries");
        return response.json();
      },
    });

  // Fetch students and staff
  const { data: students = [] } = useQuery<StudentWithPhoto[]>({
    queryKey: ["students"],
    queryFn: async () => {
      const response = await fetch("/api/students?include=photo");
      if (!response.ok) throw new Error("Failed to fetch students");
      return response.json();
    },
  });

  const { data: staffMembers = [] } = useQuery<StaffWithPhoto[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await fetch("/api/staff?include=photo");
      if (!response.ok) throw new Error("Failed to fetch staff");
      return response.json();
    },
  });

  // Invalidate queries when the week changes
  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [
        "calendarEntries",
        startDate.toISOString(),
        endDate.toISOString(),
      ],
    });
  }, [startDate, endDate, queryClient]);

  const addStudent = useMutation({
    mutationFn: async ({
      date,
      periodId,
      studentId,
    }: {
      date: Date;
      periodId: number;
      studentId: string;
    }) => {
      const response = await fetch(
        "/api/calendar/entries?relationType=students",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: DateToUTCDate(date).toISOString(),
            periodId,
            id: studentId,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to add student");
      return response.json();
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<CalendarEntry[]>(
        ["calendarEntries", startDate.toISOString(), endDate.toISOString()],
        (old = []) => {
          const existingEntry = old.find(
            (e) => e.date === newEntry.date && e.periodId === newEntry.periodId
          );

          const updatedEntry = {
            ...newEntry,
            students: newEntry.students.map((student: any) => ({
              ...student,
              photo: students.find((s) => s.id === student.id)?.photo,
            })),
            staff: existingEntry?.staff || [], // Preserve existing staff data
          };

          const filtered = old.filter(
            (e) =>
              !(
                e.date === updatedEntry.date &&
                e.periodId === updatedEntry.periodId
              )
          );
          return [...filtered, updatedEntry];
        }
      );
    },
  });

  const removeStudent = useMutation({
    mutationFn: async ({
      date,
      periodId,
      studentId,
    }: {
      date: Date;
      periodId: number;
      studentId: string;
    }) => {
      const response = await fetch(
        "/api/calendar/entries?relationType=students",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            date: DateToUTCDate(date).toISOString(),
            periodId,
            id: studentId,
          }),
        }
      );
      if (!response.ok) throw new Error("Failed to remove student");
      return response.json();
    },
    onSuccess: (response) => {
      queryClient.setQueryData(
        ["calendarEntries", startDate.toISOString(), endDate.toISOString()],
        (old: CalendarEntry[] = []) => {
          if (response.deleted) {
            return old.filter(
              (entry) =>
                !(
                  entry.date === response.date &&
                  entry.periodId === response.periodId
                )
            );
          }

          return old.map((entry) => {
            if (
              entry.date === response.date &&
              entry.periodId === response.periodId
            ) {
              return {
                ...response,
                students: response.students.map((student: any) => ({
                  ...student,
                  photo: students.find((s) => s.id === student.id)?.photo,
                })),
                staff: entry.staff, // Preserve existing staff data
              };
            }
            return entry;
          });
        }
      );
    },
  });

  const assignStaff = useMutation({
    mutationFn: async ({
      date,
      periodId,
      staffId,
    }: {
      date: Date;
      periodId: number;
      staffId: string;
    }) => {
      const response = await fetch("/api/calendar/entries?relationType=staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: DateToUTCDate(date).toISOString(),
          periodId,
          id: staffId,
        }),
      });
      if (!response.ok) throw new Error("Failed to assign staff");
      return response.json();
    },
    onSuccess: (newEntry) => {
      queryClient.setQueryData<CalendarEntry[]>(
        ["calendarEntries", startDate.toISOString(), endDate.toISOString()],
        (old = []) => {
          const existingEntry = old.find(
            (e) => e.date === newEntry.date && e.periodId === newEntry.periodId
          );

          const updatedEntry = {
            ...newEntry,
            staff: newEntry.staff.map((staff: any) => ({
              ...staff,
              photo: staffMembers.find((s) => s.id === staff.id)?.photo,
            })),
            students: existingEntry?.students || [], // Preserve existing student data
          };

          const filtered = old.filter(
            (e) =>
              !(
                e.date === updatedEntry.date &&
                e.periodId === updatedEntry.periodId
              )
          );
          return [...filtered, updatedEntry];
        }
      );
    },
  });

  const removeStaff = useMutation({
    mutationFn: async ({
      date,
      periodId,
      staffId,
    }: {
      date: Date;
      periodId: number;
      staffId: string;
    }) => {
      const response = await fetch("/api/calendar/entries?relationType=staff", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: DateToUTCDate(date).toISOString(),
          periodId,
          id: staffId,
        }),
      });
      if (!response.ok) throw new Error("Failed to remove staff");
      return response.json();
    },
    onSuccess: (response) => {
      queryClient.setQueryData(
        ["calendarEntries", startDate.toISOString(), endDate.toISOString()],
        (old: CalendarEntry[] = []) => {
          if (response.deleted) {
            return old.filter(
              (entry) =>
                !(
                  entry.date === response.date &&
                  entry.periodId === response.periodId
                )
            );
          }

          return old.map((entry) => {
            if (
              entry.date === response.date &&
              entry.periodId === response.periodId
            ) {
              return {
                ...response,
                staff: response.staff.map((staff: any) => ({
                  ...staff,
                  photo: staffMembers.find((s) => s.id === staff.id)?.photo,
                })),
                students: entry.students, // Preserve existing student data
              };
            }
            return entry;
          });
        }
      );
    },
  });

  const calendarData = useMemo(() => {
    return currentWeek.map((day) => ({
      date: day.date,
      periods: day.periods.map((period) => {
        const entry = calendarEntries.find((e) => {
          const entryDate = new Date(e.date);
          return (
            entryDate.toDateString() === day.date.toDateString() &&
            e.periodId === period.id
          );
        });
        return {
          id: period.id,
          students: entry?.students || [],
          staff: entry?.staff || [],
        };
      }),
    }));
  }, [calendarEntries, currentWeek]);

  const filteredStudents = useMemo(() => {
    if (!searchTerm) return students;
    return students.filter((student) =>
      `${student.forename} ${student.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, students]);

  const filteredStaff = useMemo(() => {
    if (!searchTerm) return staffMembers;
    return staffMembers.filter((staff) =>
      `${staff.forename} ${staff.surname}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, staffMembers]);

  const handleAddClick = (
    date: Date,
    periodId: number,
    type: "student" | "staff"
  ) => {
    setSelectedDay(date);
    setSelectedPeriod(periodId);
    setDialogType(type);
    setIsDialogOpen(true);
  };

  const handleSubmit = (person: StudentWithPhoto | StaffWithPhoto) => {
    if (!selectedDay || selectedPeriod === null) return;

    if (dialogType === "student") {
      addStudent.mutate({
        date: selectedDay,
        periodId: selectedPeriod,
        studentId: person.id,
      });
    } else {
      assignStaff.mutate({
        date: selectedDay,
        periodId: selectedPeriod,
        staffId: person.id,
      });
    }

    setIsDialogOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Weekly Calendar</h2>
      <div className="grid grid-cols-5 gap-4">
        {calendarData.map((day) => (
          <div
            key={day.date.toDateString()}
            className="rounded-lg overflow-hidden flex flex-col shadow-lg bg-background dark:border dark:border-muted"
            style={{ minHeight: "150px" }}
          >
            <div className="bg-muted p-3">
              {/* Display weekday (e.g., "Monday") */}
              <h3 className="font-semibold text-sm">
                {day.date.toLocaleDateString("en-GB", { weekday: "long" })}
              </h3>
              {/* Display day of the month (e.g., "10") */}
              <h3 className="text-sm">
                {day.date.toLocaleDateString("en-GB", { day: "numeric" })}
              </h3>
            </div>

            {/* Periods rendering */}
            <div className="p-3 flex-1 grid gap-2">
              {day.periods.map((period) => (
                <div
                  key={period.id}
                  className="flex flex-col gap-1 min-h-[100px]"
                >
                  <div className="bg-muted/10 px-2 py-1 rounded flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        Period {period.id}
                      </span>
                      {period.staff.map((staff) => (
                        <div
                          key={staff.id}
                          className="flex items-center gap-1 bg-muted/20 px-2 py-1 rounded"
                        >
                          {staff.photo?.content && (
                            <img
                              src={`data:image/jpeg;base64,${staff.photo.content}`}
                              className="h-5 w-5 rounded-full"
                              alt={`${staff.forename} ${staff.surname}`}
                            />
                          )}
                          <span className="text-xs">
                            {staff.forename} {staff.surname}
                          </span>
                          <button
                            onClick={() =>
                              removeStaff.mutate({
                                date: day.date,
                                periodId: period.id,
                                staffId: staff.id,
                              })
                            }
                            className="text-destructive hover:text-destructive/80 ml-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-primary"
                        onClick={() =>
                          handleAddClick(day.date, period.id, "student")
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-blue-500"
                        onClick={() =>
                          handleAddClick(day.date, period.id, "staff")
                        }
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[120px]">
                    <ul className="space-y-1">
                      {period.students.map((student) => (
                        <li
                          key={student.id}
                          className="flex items-center justify-between text-sm p-1 pr-2 hover:bg-muted/50 rounded"
                        >
                          <div className="flex items-center gap-2 truncate">
                            {student.photo?.content && (
                              <img
                                src={`data:image/jpeg;base64,${student.photo.content}`}
                                alt={`${student.forename} ${student.surname}`}
                                className="h-6 w-6 rounded-full"
                              />
                            )}
                            <span>
                              {student.forename} {student.surname}
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              removeStudent.mutate({
                                date: day.date,
                                periodId: period.id,
                                studentId: student.id,
                              })
                            }
                            className="text-destructive hover:text-destructive/80"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] sm:max-h-[500px] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "student" ? "Add Students" : "Assign Staff"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-1">
            <Input
              placeholder={`Search ${dialogType}s...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="overflow-y-auto max-h-[300px]">
              {(dialogType === "student"
                ? filteredStudents
                : filteredStaff
              ).map((person) => (
                <div
                  key={person.id}
                  className="flex items-center p-2 hover:bg-muted/50 rounded cursor-pointer"
                  onClick={() => handleSubmit(person)}
                >
                  {"photo" in person && person.photo?.content && (
                    <img
                      src={`data:image/jpeg;base64,${person.photo.content}`}
                      className="h-8 w-8 rounded-full mr-2"
                      alt={`${person.forename} ${person.surname}`}
                    />
                  )}
                  <span className="text-sm">
                    {person.forename} {person.surname}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyCalendar;
