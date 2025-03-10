import prisma from "@/components/util/prisma";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Fetch both students and staff data
    const [studentsResponse, staffResponse] = await Promise.all([
      axios.get(
        `https://api.wonde.com/v1.0/schools/${process.env.WONDE_SCHOOL_ID}/students?include=photo,education_details,contact_details`,
        {
          headers: { Authorization: `Bearer ${process.env.WONDE_API_KEY}` },
        }
      ),
      axios.get(
        `https://api.wonde.com/v1.0/schools/${process.env.WONDE_SCHOOL_ID}/employees?include=photo,contact_details`,
        {
          headers: { Authorization: `Bearer ${process.env.WONDE_API_KEY}` },
        }
      ),
    ]);

    const students = studentsResponse.data.data;
    const staff = staffResponse.data.data;

    // Process Students
    for (const student of students) {
      await prisma.$transaction(async (tx) => {
        const {
          id: studentId,
          upi,
          mis_id,
          initials,
          title,
          surname,
          forename,
          middle_names,
          legal_surname,
          legal_forename,
          gender,
          gender_identity,
          date_of_birth,
          photo,
          contact_details,
          education_details,
          person_id,
        } = student;

        // Student Data
        const studentData = {
          upi: upi || "",
          misId: mis_id?.toString() || "",
          initials: initials || "",
          title: title || "",
          surname: surname || "Unknown",
          forename: forename || "Unknown",
          middleNames: middle_names || null,
          gender: gender || "unknown",
          genderIdentity: gender_identity || "unknown",
          dateOfBirth: date_of_birth ? new Date(date_of_birth) : null,
        };

        const studentRecord = await tx.student.upsert({
          where: { id: studentId },
          update: studentData,
          create: { id: studentId, ...studentData },
        });

        // Student Photo
        if (photo?.data) {
          await tx.photo.upsert({
            where: { studentId: studentRecord.id },
            update: {
              content: photo.data.content || "no-photo",
              staffId: null,
            },
            create: {
              id: photo.data.id,
              content: photo.data.content || "no-photo",
              studentId: studentRecord.id,
              staffId: null,
            },
          });
        }

        // Student Contact Details
        if (contact_details?.data) {
          const phones = [
            contact_details.data.phones?.phone,
            contact_details.data.phones?.primary,
            contact_details.data.phones?.home,
            contact_details.data.phones?.work,
            contact_details.data.phones?.mobile,
          ].filter((p): p is string => !!p);

          const emails = [
            contact_details.data.emails?.email,
            contact_details.data.emails?.primary,
            contact_details.data.emails?.home,
            contact_details.data.emails?.work,
          ].filter((e): e is string => !!e);

          const addressFields = [
            "house_number",
            "house_name",
            "street",
            "town",
            "county",
            "postcode",
          ];
          const addresses = [
            contact_details.data.addresses?.home,
            contact_details.data.addresses?.work,
            contact_details.data.addresses?.postal,
          ]
            .flatMap((address) =>
              address
                ? [
                    addressFields
                      .map((f) => address[f])
                      .filter(Boolean)
                      .join(", "),
                  ]
                : []
            )
            .filter(Boolean);

          await tx.contactDetails.upsert({
            where: { studentId: studentRecord.id },
            update: {
              phones: phones.length ? phones : ["no-phone"],
              emails: emails.length ? emails : ["no-email"],
              addresses: addresses.length ? addresses : ["no-address"],
              salutation: contact_details.data.salutation || "N/A",
              staffId: null,
            },
            create: {
              phones: phones.length ? phones : ["no-phone"],
              emails: emails.length ? emails : ["no-email"],
              addresses: addresses.length ? addresses : ["no-address"],
              salutation: contact_details.data.salutation || "N/A",
              studentId: studentRecord.id,
              staffId: null,
            },
          });
        }

        // Student Education Details
        if (education_details?.data) {
          const eduData = education_details.data;
          await tx.educationDetails.upsert({
            where: { studentId: studentRecord.id },
            update: {
              admissionNumber: eduData.admission_number || "N/A",
              upn: eduData.upn || "N/A",
              localUpn: eduData.local_upn || "N/A",
              formerUpn: eduData.former_upn || "N/A",
              learnerNumber: eduData.learner_number || "N/A",
              currentNcYear: eduData.current_nc_year || "N/A",
              partTime: eduData.part_time ?? false,
              partTimeRate: eduData.part_time_rate ?? null,
              admissionDate: eduData.admission_date
                ? new Date(eduData.admission_date)
                : null,
              leavingDate: eduData.leaving_date
                ? new Date(eduData.leaving_date)
                : null,
            },
            create: {
              admissionNumber: eduData.admission_number || "N/A",
              upn: eduData.upn || "N/A",
              localUpn: eduData.local_upn || "N/A",
              formerUpn: eduData.former_upn || "N/A",
              learnerNumber: eduData.learner_number || "N/A",
              currentNcYear: eduData.current_nc_year || "N/A",
              partTime: eduData.part_time ?? false,
              partTimeRate: eduData.part_time_rate ?? null,
              admissionDate: eduData.admission_date
                ? new Date(eduData.admission_date)
                : null,
              leavingDate: eduData.leaving_date
                ? new Date(eduData.leaving_date)
                : null,
              studentId: studentRecord.id,
            },
          });
        }

        // Student Person Record
        if (person_id) {
          await tx.person.upsert({
            where: { id: person_id },
            update: {
              surname: legal_surname || surname || "Unknown",
              forename: legal_forename || forename || "Unknown",
              legalSurname: legal_surname || surname || "Unknown",
              legalForename: legal_forename || forename || "Unknown",
              gender: gender || "unknown",
              genderIdentity: gender_identity || "unknown",
              dateOfBirth: date_of_birth ? new Date(date_of_birth) : null,
            },
            create: {
              id: person_id,
              surname: legal_surname || surname || "Unknown",
              forename: legal_forename || forename || "Unknown",
              legalSurname: legal_surname || surname || "Unknown",
              legalForename: legal_forename || forename || "Unknown",
              gender: gender || "unknown",
              genderIdentity: gender_identity || "unknown",
              dateOfBirth: date_of_birth ? new Date(date_of_birth) : null,
              student: { connect: { id: studentRecord.id } },
            },
          });
        }
      });
    }

    // Process Staff
    for (const staffMember of staff) {
      await prisma.$transaction(async (tx) => {
        const {
          id: staffId,
          upi,
          mis_id,
          initials,
          title,
          surname,
          forename,
          middle_names,
          legal_surname,
          legal_forename,
          gender,
          date_of_birth,
          photo,
          contact_details,
        } = staffMember;

        // Staff Data
        const staffData = {
          upi: upi || "",
          misId: mis_id?.toString() || "",
          initials: initials || "",
          title: title || "",
          surname: surname || "Unknown",
          forename: forename || "Unknown",
          middleNames: middle_names || null,
          legalSurname: legal_surname || surname || "Unknown",
          legalForename: legal_forename || forename || "Unknown",
          gender: gender || "unknown",
          dateOfBirth: date_of_birth ? new Date(date_of_birth) : null,
        };

        const staffRecord = await tx.staff.upsert({
          where: { id: staffId },
          update: staffData,
          create: { id: staffId, ...staffData },
        });

        // Staff Photo
        if (photo?.data) {
          await tx.photo.upsert({
            where: { staffId: staffRecord.id },
            update: {
              content: photo.data.content || "no-photo",
              studentId: null,
            },
            create: {
              id: photo.data.id,
              content: photo.data.content || "no-photo",
              staffId: staffRecord.id,
              studentId: null,
            },
          });
        }

        // Staff Contact Details
        if (contact_details?.data) {
          const phones = [
            contact_details.data.phones?.phone,
            contact_details.data.phones?.primary,
            contact_details.data.phones?.home,
            contact_details.data.phones?.work,
            contact_details.data.phones?.mobile,
          ].filter((p): p is string => !!p);

          const emails = [
            contact_details.data.emails?.email,
            contact_details.data.emails?.primary,
            contact_details.data.emails?.home,
            contact_details.data.emails?.work,
          ].filter((e): e is string => !!e);

          const addressFields = [
            "house_number",
            "house_name",
            "street",
            "town",
            "county",
            "postcode",
          ];
          const addresses = [
            contact_details.data.addresses?.home,
            contact_details.data.addresses?.work,
            contact_details.data.addresses?.postal,
          ]
            .flatMap((address) =>
              address
                ? [
                    addressFields
                      .map((f) => address[f])
                      .filter(Boolean)
                      .join(", "),
                  ]
                : []
            )
            .filter(Boolean);

          await tx.contactDetails.upsert({
            where: { staffId: staffRecord.id },
            update: {
              phones: phones.length ? phones : ["no-phone"],
              emails: emails.length ? emails : ["no-email"],
              addresses: addresses.length ? addresses : ["no-address"],
              salutation: contact_details.data.salutation || "N/A",
              studentId: null,
            },
            create: {
              phones: phones.length ? phones : ["no-phone"],
              emails: emails.length ? emails : ["no-email"],
              addresses: addresses.length ? addresses : ["no-address"],
              salutation: contact_details.data.salutation || "N/A",
              staffId: staffRecord.id,
              studentId: null,
            },
          });
        }
      });
    }

    return NextResponse.json({
      message: "Database seeded successfully",
      counts: {
        students: students.length,
        staff: staff.length,
      },
    });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
      },
      { status: 500 }
    );
  }
}
