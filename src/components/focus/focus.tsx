import React from "react";
import TopBar from "./top-bar";
import StudentList from "./student-list";
import WeeklyCalendar from "./weekly-calendar";

const Focus = () => {
  return (
    <div className=" bg-background rounded-lg pb-4 shadow h-[calc(100vh-32px)]">
      <TopBar />
      <WeeklyCalendar />
    </div>
  );
};

export default Focus;
