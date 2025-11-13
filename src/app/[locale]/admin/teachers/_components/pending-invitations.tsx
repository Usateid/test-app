"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeacherInvitationType } from "@/db/schema/teacher-invitation";
import { deleteTeacherInvitation } from "@/db/query/teacher-invitation";
import { Copy, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface PendingInvitationsProps {
  invitations: TeacherInvitationType[];
}

export default function PendingInvitations({
  invitations,
}: PendingInvitationsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (invitation: TeacherInvitationType) => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const magicLink = `${baseUrl}/register/teacher?token=${invitation.token}`;
    navigator.clipboard.writeText(magicLink);
    setCopiedId(invitation.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invitation?")) {
      await deleteTeacherInvitation(id);
    }
  };

  if (invitations.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Teachers who have been invited but haven&apos;t registered yet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium">
                  {invitation.firstName} {invitation.lastName}
                </p>
                <p className="text-sm text-gray-500">{invitation.email}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyLink(invitation)}
                >
                  {copiedId === invitation.id ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(invitation.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
