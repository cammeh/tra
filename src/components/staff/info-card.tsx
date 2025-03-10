import React from "react";

const StaffInfoCard = ({ title, data }: { title: string; data: string }) => {
  return (
    <div className="flex flex-col p-4 gap-2">
      <h1 className="font-medium text-stone-400">{title}</h1>
      <h1 className="font-semibold">{data}</h1>
    </div>
  );
};

export default StaffInfoCard;
