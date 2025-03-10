import React from "react";
import TopBar from "./top-bar";

const Dashboard = () => {
  return (
    <div className="bg-background rounded-lg pb-4 shadow h-[calc(100vh-32px)]">
      <TopBar />
    </div>
  );
};

export default Dashboard;
