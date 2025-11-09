import type { Metadata } from "next";
import RolesComponent from "@/components/roles/RolesComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RolesPage() {
  return (
    <section className="space-y-6">
      <RolesComponent />
    </section>
  );
}
