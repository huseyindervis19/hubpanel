import type { Metadata } from "next";
import UsersComponent from "@/components/users/UsersComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function UsersPage() {
  return (
    <section className="space-y-6">
      <UsersComponent />
    </section>
  );
}
