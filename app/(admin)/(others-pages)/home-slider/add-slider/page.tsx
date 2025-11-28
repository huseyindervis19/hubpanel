import AddSliderComponent from "@/components/home-slider/add-slider/AddSliderComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function AddSliderPage() {
  return (
    <section className="space-y-6">
      <AddSliderComponent />
    </section>
  );
}
