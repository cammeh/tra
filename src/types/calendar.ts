import { Student } from "@prisma/client";

export interface StudentWithPhoto extends Student {
  photo?: {
    content: string;
  };
}

export interface CalendarEntry {
  id: string;
  date: string; // ISO string
  periodId: number;
  students: StudentWithPhoto[];
  createdAt: string;
  updatedAt: string;
}

export interface ClientCalendarEntry
  extends Omit<CalendarEntry, "date" | "createdAt" | "updatedAt"> {
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
