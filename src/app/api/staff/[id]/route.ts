import prisma from "@/components/util/prisma"; // Adjust the path to your prisma instance
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  // Ensure params are awaited before use
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
  }

  try {
    // Fetch student data with related models
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        photo: true,
        contactDetails: true,
      },
    });

    if (!staff) {
      return NextResponse.json({ error: "Staff not found" }, { status: 404 });
    }

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
