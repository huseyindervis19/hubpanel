"use client";
import { useModal } from "@/hooks/useModal";
import { useLocale } from "@/context/LocaleContext";
import { EditAboutUsModal } from "./EditAboutUsModal";
import { useAboutUs } from "@/hooks/useAboutUs";
import { AboutUs } from "@/types/AboutUs";

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
        {messages["nav_about_us"] || "About Us"}
      </h3>
      <div className="p-6 border border-gray-200 rounded-2xl dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-center mb-6">
          <h4 className="text-xl font-semibold text-gray-800 dark:text-white"></h4>
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-white/[0.05]"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              />
            </svg>
            {messages["u_edit"] || "Edit"}
          </button>
        </div>

        <div className="space-y-8 whitespace-pre-line">
          <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {messages["story"] || "Story"}
          </h5>
          <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-base text-gray-800 dark:text-white/90 leading-relaxed">
              {getTranslatedText(aboutUs, "story") || "-"}
            </p>
          </div>

          <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {messages["mission"] || "Mission"}
          </h5>
          <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-base text-gray-800 dark:text-white/90 leading-relaxed">
              {getTranslatedText(aboutUs, "mission") || "-"}
            </p>
          </div>

          <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {messages["vision"] || "Vision"}
          </h5>
          <div className="flex items-start gap-4 p-4 bg-white/20 dark:bg-black/20 rounded-xl border border-white/30 dark:border-black/30 shadow-[2px_2px_8px_rgba(0,0,0,0.1)]">
            <p className="text-base text-gray-800 dark:text-white/90 leading-relaxed">
              {getTranslatedText(aboutUs, "vision") || "-"}
            </p>
          </div>

          <h5 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
            {messages["values"] || "Values"}
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
