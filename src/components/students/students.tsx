import React from "react";
import TopBar from "./top-bar";
import { StudentCard } from "./card";

const Students = () => {
  return (
    <div className=" bg-background rounded-lg shadow h-[calc(100vh-32px)]">
      <TopBar />
      <StudentCard />
    </div>
  );
};

export default Students;
