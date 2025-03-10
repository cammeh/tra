import React from "react";
import StaffBar from "./staff-bar";
import StaffData from "./staff-data";

const StaffInfo = ({ id }: { id: string }) => {
  return (
    <div className=" bg-background rounded-lg pb-4 shadow h-[calc(100vh-32px)]">
      <StaffBar id={id} />
      <StaffData id={id} />
    </div>
  );
};

export default StaffInfo;
