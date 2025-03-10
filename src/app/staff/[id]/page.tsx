import StaffInfo from "@/components/staff/staff-info";

export default async function StaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <StaffInfo id={id} />
    </div>
  );
}
