import prisma from "@/components/util/prisma"; // Adjust the path to your prisma instance
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } } // Correctly destructure `params` from the context
) {
  const { id } = params; // No need to `await` params

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
  }

  try {
    // Fetch student data with related models
    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        photo: true,
        contactDetails: true,
        educationDetails: true,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
