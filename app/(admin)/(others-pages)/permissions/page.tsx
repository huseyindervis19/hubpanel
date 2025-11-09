import type { Metadata } from "next";
import PermissionsComponent from "@/components/permissions/PermissionsComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function PermissionsPage() {
  return (
    <section className="space-y-6">
      <PermissionsComponent />
    </section>
  );
}
