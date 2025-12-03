"use client";
import { useModal } from "@/hooks/useModal";
import { useLocale } from "@/context/LocaleContext";
import { EditAboutUsModal } from "./EditAboutUsModal";
import { useAboutUs } from "@/hooks/useAboutUs";
import { AboutUs } from "@/types/AboutUs";
import { PencilIcon } from "@/icons";

export const AboutUsComponent = () => {
  const { messages, locale } = useLocale();
  const { isOpen, openModal, closeModal } = useModal();
  const { aboutUs, loading, error, refetch } = useAboutUs(locale);

  const handleSave = () => {
    closeModal();
    refetch();
  };

  if (loading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        {messages["loading"] || "Loading..."}
      </p>
    );
  }

  if (error || !aboutUs) {
    return (
      <p className="text-red-500">
        {messages["no_data"] || "No data found."}
      </p>
    );
  }

  const getTranslatedText = (data: AboutUs, field: "story" | "vision" | "mission" | "values") => {
    if (data.translated) {
      return data.translated[field] || "";
    }
    if (data.translations && locale && data.translations[locale]) {
      return data.translations[locale][field] || "";
    }
    return "";
  };

  return (
    <>
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
        {messages["about_us"] || "About Us"}
      </h3>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white"></h4>
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
          >
            <PencilIcon width={20} height={20} />
            {messages["edit"] || "Edit"}
          </button>
        </div>

        <div className="space-y-8 whitespace-pre-line">
          <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {messages["about_us_story"] || "Our Story"}
          </h5>
          <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-base text-gray-800 dark:text-white/90 leading-relaxed">
              {getTranslatedText(aboutUs, "story") || "-"}
            </p>
          </div>

          <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {messages["about_us_mission"] || "Our Mission"}
          </h5>
          <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-base text-gray-800 dark:text-white/90 leading-relaxed">
              {getTranslatedText(aboutUs, "mission") || "-"}
            </p>
          </div>

          <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {messages["about_us_vision"] || "Our Vision"}
          </h5>
          <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-base text-gray-800 dark:text-white/90 leading-relaxed">
              {getTranslatedText(aboutUs, "vision") || "-"}
            </p>
          </div>

          <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {messages["about_us_values"] || "Our Values"}
          </h5>
          <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-base text-gray-800 dark:text-white/90 leading-relaxed">
              {getTranslatedText(aboutUs, "values") || "-"}
            </p>
          </div>
        </div>

        <EditAboutUsModal
          isOpen={isOpen}
          onClose={closeModal}
          handleSave={handleSave}
          data={aboutUs}
        />
      </div>
    </>
  );
}
