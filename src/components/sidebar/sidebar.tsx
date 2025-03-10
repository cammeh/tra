import React from "react";
import AccountToggle from "./account-toggle";
import Search from "./search";
import RouteSelect from "./route-select";
import Logo from "./logo";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Sidebar = async () => {
  return (
    <div className="">
      <div className="sticky top-4 ">
        <Logo />
        <Search />
        <RouteSelect />
      </div>
      <AccountToggle />
    </div>
  );
};

export default Sidebar;
