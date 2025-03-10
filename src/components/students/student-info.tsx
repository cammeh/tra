import React from "react";
import StudentData from "./student-data";
import StudentBar from "./student-bar";

const StudentInfo = ({ id }: { id: string }) => {
  return (
    <div className=" bg-background rounded-lg pb-4 shadow h-[calc(100vh-32px)]">
      <StudentBar id={id} />
      <StudentData id={id} />
    </div>
  );
};

export default StudentInfo;
