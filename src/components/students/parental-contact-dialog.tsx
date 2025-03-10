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
import { FiBook } from "react-icons/fi";
import CopyToClipboard from "../util/copy-clipboard";

const ParentalContactDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-[300px] cursor-pointer gap-2">
          <FiBook className="w-4 h-4" /> View parental contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Parental Contact Information</DialogTitle>
          <DialogDescription>Basic contact details</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Primary Contact Card */}
          <div className="bg-muted p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 underline">
              Primary Contact
            </h3>
            <div className="space-y-1">
              <span className="text-sm font-medium">Mother</span>
              <div className="flex items-center gap-2">
                <span className="text-sm ">01332 880 462</span>
                <CopyToClipboard text="01332 880 462" />
              </div>
            </div>
          </div>

          {/* Secondary Contact Card */}
          <div className="bg-muted p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-2 underline">
              Secondary Contact
            </h3>
            <div className="space-y-1">
              <span className="text-sm font-medium">Father</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">01332 880 222</span>
                <CopyToClipboard text="01332 880 222" />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParentalContactDialog;
