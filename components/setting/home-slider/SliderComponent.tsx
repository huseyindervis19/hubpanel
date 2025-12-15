"use client";

import React, { useState } from "react";
import TitleComponent from "@/components/ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";
import { useHomeSlider } from "@/hooks/useHomeSlider";
import HomeSliderCard from "./HomeSliderCard";
import AddModal from "./FormModals/AddModal";
import EditModal from "./FormModals/EditModal";
import DeleteModal from "./FormModals/DeleteModal";
import { HomeSlider } from "@/types/HomeSlider";
import Button from "@/components/ui/button/Button";

const SliderComponent: React.FC = () => {
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [selectedSlider, setSelectedSlider] = useState<HomeSlider | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { messages, locale } = useLocale();
  const { data: homeSlider, isLoading, error, refetch } = useHomeSlider(locale);
  const slider = homeSlider?.data || [];
  return (
    <>
      <div className="mb-5 flex items-center justify-between lg:mb-7">
        <TitleComponent title={messages["home_slider"] || "Home Slider"} />
        <Button className="h-9 px-4 text-sm" onClick={() => setAddModalOpen(true)}>
          {messages["create"] || "Create"}
        </Button>
      </div>

      {isLoading && <div className="p-6">{messages["loading"] || "Loading..."}</div>}
      {error && <div className="p-6 text-red-600">{messages["error"] || "Failed to load sliders"}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {slider.map((s) => (
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

      {addModalOpen && (
        <AddModal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={() => refetch()}
        />
      )}

      {selectedSlider && (
        <>
          <EditModal
            slider={selectedSlider}
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            onSuccess={() => refetch()}
          />
          <DeleteModal
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
