import Student from "@/components/students/student-info";

export default async function StudentsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <Student id={id} />
    </div>
  );
}
