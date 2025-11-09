import type { Metadata } from "next";
import DashboardComponent  from "@/components/dashboard/DashboardComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function landing() {
  return (
    <DashboardComponent/>
  );
}
