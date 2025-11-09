import type { Metadata } from "next";
import DashboardComponent from "@/components/dashboard/DashboardComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <DashboardComponent />
    </section>
  );
}
