"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Teacher {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

interface TeachersListProps {
  teachers: Teacher[];
}

export default function TeachersList({ teachers }: TeachersListProps) {
  if (teachers.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            No teachers registered yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Teachers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {teacher.firstName} {teacher.lastName}
                </p>
                <p className="text-sm text-gray-500">{teacher.email}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
