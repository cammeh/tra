"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import SearchDialog from "./search-dialog";

interface Student {
  id: number;
  name: string;
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddStudent = (selectedStudents: Student[]) => {
    setStudents((prevStudents) => [...prevStudents, ...selectedStudents]);
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Student List</h2>
      <Button onClick={() => setIsDialogOpen(true)}>+ Add Student</Button>
      <ul className="mt-4 space-y-2">
        {students.map((student) => (
          <li key={student.id} className="p-2 border rounded">
            {student.name}
          </li>
        ))}
      </ul>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Search Students</DialogTitle>
          </DialogHeader>
          <SearchDialog onSelectStudents={handleAddStudent} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentList;
