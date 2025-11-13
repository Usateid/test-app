import { getUsers } from "@/db/query/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, UserCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { formatDateYearMonthDay } from "@/utils";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/common/page-layout";

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <PageLayout
      title="Users"
      description={`Manage and view all registered users (${users.length} total)`}
    >
      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground py-12"
                >
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.userId}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-7 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                          <UserCircle2 className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDateYearMonthDay(user.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/users/${user.userId!}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="size-4" />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
}
