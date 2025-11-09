import { Metadata } from "next";
import ProfileComponent from "@/components/user-profile/ProfileComponent";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};
export default function ProfilePage() {
  return (
    <section className="space-y-6">
      <ProfileComponent />
    </section>
  );
}
