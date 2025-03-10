import React from "react";
import TopBar from "./top-bar";
import { StaffCard } from "./card";

const Staff = () => {
  return (
    <div className=" bg-background rounded-lg pb-4 shadow h-[calc(100vh-32px)]">
      <TopBar />
      <StaffCard />
    </div>
  );
};

export default Staff;
