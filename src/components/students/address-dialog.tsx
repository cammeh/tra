"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FiHome } from "react-icons/fi";
import CopyToClipboard from "../util/copy-clipboard";

const AddressDialog = () => {
  const fullAddress =
    "7 Priory Way, Peasehill, Ripley, DE5 3TJ, Derbyshire, United Kingdom";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[300px] cursor-pointer gap-2">
          <FiHome className="w-4 h-4" /> View address information
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Address Information</DialogTitle>
          <DialogDescription>Basic address details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Address Card */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-sm dark:bg-muted">
            <h3 className="text-lg font-semibold mb-2">Full Address</h3>
            <div className="space-y-1">
              <p className="text-sm font-medium">7 Priory Way</p>
              <p className="text-sm ">Peasehill</p>
              <p className="text-sm ">Ripley</p>
              <p className="text-sm ">DE5 3TJ</p>
              <p className="text-sm ">Derbyshire</p>
              <p className="text-sm ">United Kingdom</p>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm ">Copy full address:</span>
              <CopyToClipboard text={fullAddress} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddressDialog;
