import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
export default async function AdminPage() {
  return (
    <div>
      <h1>Welcome to the Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="border p-4 rounded-md w-62">
          <h2 className="text-lg font-bold">See the users</h2>
          <Link href="/admin/users">View users</Link>
        </div>
        <div className="border p-4 rounded-md w-62">
          <h2 className="text-lg font-bold">Users</h2>
          <p className="text-sm text-gray-500">100 users</p>
        </div>
        <div className="border p-4 rounded-md w-62">
          <h2 className="text-lg font-bold">Users</h2>
          <p className="text-sm text-gray-500">100 users</p>
        </div>
      </div>
    </div>
  );
}
