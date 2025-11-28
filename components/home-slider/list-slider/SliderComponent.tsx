"use client";

import React, { useState } from "react";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useHomeSlider } from "@/hooks/useHomeSlider";
import HomeSliderCard from "./HomeSliderCard";
import EditSliderModal from "./FormModals/EditSliderModal";
import DeleteSliderModal from "./FormModals/DeleteSliderModal";
import { HomeSlider } from "@/types/HomeSlider";
import Link from "next/link";
import Button from "@/components/ui/button/Button";

const SliderComponent: React.FC = () => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedSlider, setSelectedSlider] = useState<HomeSlider | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { messages, locale } = useLocale();
  const { homeSlider, loading, error, refetch } = useHomeSlider(locale);

  return (
    <>
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <TitleComponent title={messages["home_slider"] || "Home Slider"} />
        <Link href="/home-slider/add-slider">
                  <Button className="h-9 px-4 text-sm">{messages["create"] || "Create"}</Button>
                </Link>
      </div>


      {loading && <div className="p-6">{messages["loading"] || "Loading..."}</div>}
      {error && <div className="p-6 text-red-600">{messages["failed_to_load"] || "Failed to load sliders"}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {homeSlider.map((s) => (
          <HomeSliderCard
            key={s.id}
            slider={s}
            openDropdownId={openDropdownId}
            onDropdownToggle={() => setOpenDropdownId((prev) => (prev === s.id ? null : s.id))}
            onDropdownClose={() => setOpenDropdownId(null)}
            onEdit={() => { setSelectedSlider(s); setEditModalOpen(true); setOpenDropdownId(null); }}
            onDelete={() => { setSelectedSlider(s); setDeleteModalOpen(true); setOpenDropdownId(null); }}
          />
        ))}
      </div>

      {selectedSlider && (
        <>
          <EditSliderModal
            slider={selectedSlider}
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSuccess={() => refetch()}
          />

          <DeleteSliderModal
            slider={selectedSlider}
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onSuccess={() => refetch()}
          />
        </>
      )}
    </>
  );
};

export default SliderComponent;