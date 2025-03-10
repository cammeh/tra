import prisma from "@/components/util/prisma"; // Adjust the path to your prisma instance
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        person: true, // Changed from Person to person (camelCase)
        contactDetails: true, // Changed from ContactDetails to contactDetails (camelCase)
        photo: true, // Changed from Photo to photo (camelCase)
      },
    });

    return NextResponse.json(staff);
  } catch (error) {
    console.error("Error fetching staff:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
