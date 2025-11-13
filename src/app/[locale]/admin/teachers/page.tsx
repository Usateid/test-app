import { db } from "@/index";
import { user, userInformation } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTeacherInvitations } from "@/db/query/teacher-invitation";
import NewTeacher from "./_components/new-teacher";
import PendingInvitations from "./_components/pending-invitations";
import TeachersList from "./_components/teachers-list";
import PageLayout from "@/components/common/page-layout";

async function getTeachers() {
  const teachers = await db
    .select({
      id: user.id,
      firstName: userInformation.firstName,
      lastName: userInformation.lastName,
      email: user.email,
    })
    .from(userInformation)
    .innerJoin(user, eq(userInformation.userId, user.id))
    .where(eq(userInformation.role, "teacher"));

  return teachers;
}

export default async function TeachersPage() {
  const teachers = await getTeachers();
  const pendingInvitations = await getTeacherInvitations();

  return (
    <PageLayout
      title="Teachers"
      description="Manage teachers and invitations"
      cta={<NewTeacher />}
    >
      <PendingInvitations invitations={pendingInvitations} />
      <TeachersList teachers={teachers} />
    </PageLayout>
  );
}
