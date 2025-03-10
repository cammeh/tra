"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";

interface Student {
  id: number;
  name: string;
}

interface SearchDialogProps {
  onSelectStudents: (students: Student[]) => void;
}

const SearchDialog: React.FC<SearchDialogProps> = ({ onSelectStudents }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

  // Mock data for students
  const allStudents: Student[] = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Alice Johnson" },
  ];

  const filteredStudents = allStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectStudent = (student: Student) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.some((s) => s.id === student.id)
        ? prevSelected.filter((s) => s.id !== student.id)
        : [...prevSelected, student]
    );
  };

  const handleSubmit = () => {
    onSelectStudents(selectedStudents);
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul className="space-y-2">
        {filteredStudents.map((student) => (
          <li key={student.id} className="flex items-center space-x-2">
            <Checkbox
              id={`student-${student.id}`}
              checked={selectedStudents.some((s) => s.id === student.id)}
              onCheckedChange={() => handleSelectStudent(student)}
            />
            <label htmlFor={`student-${student.id}`} className="text-sm">
              {student.name}
            </label>
          </li>
        ))}
      </ul>
      <Button onClick={handleSubmit} className="w-full">
        Add Selected Students
      </Button>
    </div>
  );
};

export default SearchDialog;
