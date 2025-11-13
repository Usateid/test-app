import { getTeacherInvitationByToken } from "@/db/query/teacher-invitation";
import { redirect } from "next/navigation";
import TeacherRegistrationForm from "./_components/registration-form";

export default async function TeacherRegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect("/login");
  }

  const invitation = await getTeacherInvitationByToken(token);

  if (!invitation) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-500">
            Invalid or Expired Invitation
          </h1>
          <p className="text-gray-500">
            This invitation link is no longer valid. Please contact your
            administrator.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to the Platform!</h1>
          <p className="text-gray-500">
            Complete your registration to get started as a teacher.
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">You&apos;re registering as:</p>
            <p className="font-medium text-lg">
              {invitation.firstName} {invitation.lastName}
            </p>
            <p className="text-sm text-gray-500">{invitation.email}</p>
          </div>
        </div>

        <TeacherRegistrationForm token={token} />
      </div>
    </div>
  );
}
