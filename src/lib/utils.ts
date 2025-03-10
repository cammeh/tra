import { StudentWithPhoto } from "@/types/calendar";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function DateToUTCDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  );
}

export function toCalendarDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  );
}

export function getCurrentWeek(): Date[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate the start of the week (Monday)
  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - currentDay + (currentDay === 0 ? -6 : 1)
  );

  // Generate dates for Monday to Friday
  return Array.from({ length: 5 }).map((_, i) => {
    const date = new Date(startOfWeek); // Create a new Date object for each day
    date.setDate(startOfWeek.getDate() + i);
    return toCalendarDate(date);
  });
}

export interface Day {
  date: Date;
  periods: Period[];
}

interface Period {
  id: number;
  students: StudentWithPhoto[];
}
