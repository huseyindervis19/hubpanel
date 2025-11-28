import SliderComponent from "@/components/home-slider/list-slider/SliderComponent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function ListSliderPage() {
  return (
    <section className="space-y-6">
      <SliderComponent />
    </section>
  );
}
