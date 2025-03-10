import prisma from "@/components/util/prisma";
import { NextResponse } from "next/server";

// Common function to handle both student and staff deletions
async function handleDelete(
  request: Request,
  relationType: "students" | "staff"
) {
  try {
    const { date, periodId, id } = await request.json();

    const result = await prisma.$transaction(async (tx) => {
      const updatedEntry = await tx.calendarEntry.update({
        where: {
          date_periodId: { date: new Date(date), periodId: Number(periodId) },
        },
        data: { [relationType]: { disconnect: { id } } },
        include: { students: true, staff: true },
      });

      // Delete entry only if both students and staff are empty
      if (
        updatedEntry.students.length === 0 &&
        updatedEntry.staff.length === 0
      ) {
        await tx.calendarEntry.delete({
          where: {
            date_periodId: { date: new Date(date), periodId: Number(periodId) },
          },
        });
        return { action: "delete", data: null };
      }

      return { action: "update", data: updatedEntry };
    });

    if (result.action === "delete") {
      return NextResponse.json({
        deleted: true,
        date: new Date(date).toISOString(),
        periodId,
      });
    }

    return NextResponse.json({
      ...result.data,
      date: result.data!.date.toISOString(),
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Common function to handle both student and staff additions
async function handlePost(
  request: Request,
  relationType: "students" | "staff"
) {
  try {
    const { date, periodId, id } = await request.json();

    const entry = await prisma.calendarEntry.upsert({
      where: {
        date_periodId: { date: new Date(date), periodId: Number(periodId) },
      },
      include: { students: true, staff: true },
      update: { [relationType]: { connect: { id } } },
      create: {
        date: new Date(date),
        periodId: Number(periodId),
        [relationType]: { connect: { id } },
      },
    });

    return NextResponse.json({
      ...entry,
      date: entry.date.toISOString(),
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET handler
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Missing startDate or endDate" },
      { status: 400 }
    );
  }

  try {
    const entries = await prisma.calendarEntry.findMany({
      where: {
        date: { gte: new Date(startDate), lte: new Date(endDate) },
      },
      include: {
        students: { include: { photo: true } },
        staff: { include: { photo: true } },
      },
    });

    return NextResponse.json(
      entries.map((entry) => ({
        ...entry,
        date: entry.date.toISOString(),
        students: entry.students.map((student) => ({
          ...student,
          photo: student.photo ? { content: student.photo.content } : undefined,
        })),
        staff: entry.staff.map((staff) => ({
          ...staff,
          photo: staff.photo ? { content: staff.photo.content } : undefined,
        })),
      }))
    );
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST handler
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const relationType = searchParams.get("relationType") as "students" | "staff";

  if (!relationType || !["students", "staff"].includes(relationType)) {
    return NextResponse.json(
      { error: "Invalid relationType" },
      { status: 400 }
    );
  }

  return handlePost(request, relationType);
}

// DELETE handler
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const relationType = searchParams.get("relationType") as "students" | "staff";

  if (!relationType || !["students", "staff"].includes(relationType)) {
    return NextResponse.json(
      { error: "Invalid relationType" },
      { status: 400 }
    );
  }

  return handleDelete(request, relationType);
}
