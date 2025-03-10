import prisma from "@/components/util/prisma"; // Adjust the path to your prisma instance
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      include: {
        person: true, // Changed from Person to person (camelCase)
        contactDetails: true, // Changed from ContactDetails to contactDetails (camelCase)
        educationDetails: true, // Changed from EducationDetails to educationDetails (camelCase)
        photo: true, // Changed from Photo to photo (camelCase)
      },
    });

    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
