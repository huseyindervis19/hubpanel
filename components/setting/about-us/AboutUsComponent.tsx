"use client";

import { useModal } from "@/hooks/useModal";
import { useLocale } from "@/context/LocaleContext";
import { EditAboutUsModal } from "./EditAboutUsModal";
import { useAboutUs } from "@/hooks/useAboutUs";
import { PencilIcon } from "@/icons";

export const AboutUsComponent = () => {
  const { messages, locale } = useLocale();
  const { isOpen, openModal, closeModal } = useModal();
  const { data: aboutUsResponse, isLoading, isError, refetch } = useAboutUs(locale);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleSave = () => {
    closeModal();
    refetch();
  };

  if (isLoading) {
    return (
      <p className="text-gray-500 dark:text-gray-400">
        {messages["loading"] || "Loading..."}
      </p>
    );
  }

  if (isError || !aboutUsResponse?.data) {
    return (
      <p className="text-red-500">
        {messages["no_data"] || "No data found."}
      </p>
    );
  }

  const aboutUs = aboutUsResponse.data;

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

        <div className="space-y-10">
          <div className="flex flex-col md:flex-row items-start gap-8">
            <div className="w-full md:w-2/3 space-y-6">
              <section>
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  {messages["about_us_story"] || "Our Story"} :
                </h5>
                <div
                  className="flex items-start gap-4 p-4 rounded-xl border 
               bg-white/70 dark:bg-white/[0.05]
               border-gray-200 dark:border-gray-800
               shadow-sm hover:shadow-md transition duration-200">
                  <p className="text-base text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">
                    {aboutUs?.translated?.story ?? ""}
                  </p>
                </div>
              </section>

              <section>
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  {messages["about_us_values"] || "Our Values"} :
                </h5>
                <div
                  className="flex items-start gap-4 p-4 rounded-xl border 
               bg-white/70 dark:bg-white/[0.05]
               border-gray-200 dark:border-gray-800
               shadow-sm hover:shadow-md transition duration-200">                  <p className="text-base text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">
                    {aboutUs?.translated?.values ?? ""}
                  </p>
                </div>
              </section>

              <section>
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  {messages["about_us_mission"] || "Our Mission"} :
                </h5>
                <div
                  className="flex items-start gap-4 p-4 rounded-xl border 
               bg-white/70 dark:bg-white/[0.05]
               border-gray-200 dark:border-gray-800
               shadow-sm hover:shadow-md transition duration-200">                  <p className="text-base text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">
                    {aboutUs?.translated?.mission ?? ""}
                  </p>
                </div>
              </section>

              <section>
                <h5 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  {messages["about_us_vision"] || "Our Vision"} :
                </h5>
                <div
                  className="flex items-start gap-4 p-4 rounded-xl border 
               bg-white/70 dark:bg-white/[0.05]
               border-gray-200 dark:border-gray-800
               shadow-sm hover:shadow-md transition duration-200">                  <p className="text-base text-gray-800 dark:text-gray-100 leading-relaxed whitespace-pre-line">
                    {aboutUs?.translated?.vision ?? ""}
                  </p>
                </div>
              </section>
            </div>

            <div className="w-full md:w-1/3">
              <img
                src={aboutUs?.imageUrl ? `${baseUrl}${aboutUs.imageUrl}` : "/images/no_image.png"}
                alt="About us"
                className="w-full h-80 md:h-full rounded-2xl object-cover shadow-lg border border-white/20 dark:border-black/20"
              />
            </div>
          </div>
        </div>

        <EditAboutUsModal
          isOpen={isOpen}
          onClose={closeModal}
          onSuccess={handleSave}
          data={aboutUs}
        />
      </div>
    </>
  );
};
