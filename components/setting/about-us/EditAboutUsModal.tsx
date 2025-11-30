import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { AboutUs } from "@/types/AboutUs";
import { useLocale } from "@/context/LocaleContext";
import { useAboutUs } from "@/hooks/useAboutUs";
import Textarea from "@/components/form/input/TextArea";

interface EditAboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSave: () => void;
  data: AboutUs;
}

export const EditAboutUsModal = ({
  isOpen,
  onClose,
  handleSave,
  data,
}: EditAboutUsModalProps) => {
  const { messages, locale } = useLocale();
  const { update, updating, error } = useAboutUs();

  const [form, setForm] = useState({
    story: "",
    mission: "",
    vision: "",
    values: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const currentTranslation = data.translated || (data.translations?.[locale] || {}) as {
        story?: string;
        mission?: string;
        vision?: string;
        values?: string;
      };

      setForm({
        story: currentTranslation.story ?? "",
        mission: currentTranslation.mission ?? "",
        vision: currentTranslation.vision ?? "",
        values: currentTranslation.values ?? "",
      });
    }
  }, [data, locale]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      story: form.story,
      mission: form.mission,
      vision: form.vision,
      values: form.values,
    };

    try {
      await update(data.id, payload, locale);
      setSuccessMessage(messages["updated_successfully"] || "Updated successfully");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        handleSave();
      }, 1500);
    } catch (err) {
      console.error("Error updating about us:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="relative max-h-[90vh]  max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">

          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {messages["edit_about_us_modal_title"] || "Edit About Us"}
          </h4>
          
          {successMessage && (
            <div className="w-full mb-4 px-4 py-2 text-center text-green-700 bg-green-100 rounded-lg border border-green-300">
              {successMessage}
            </div>
          )}
        </div>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="custom-scrollbar max-h-[calc(100vh-250px)] overflow-y-auto px-4 pb-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-1">
                <Label className="text-lg font-medium text-gray-800">
                  {messages["about_us_story"] || "Our Story"}
                </Label>
                <Textarea
                  className="w-full min-h-[110px] text-gray-800"
                  value={form.story}
                  onChange={(value) => handleChange("story", value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-lg font-medium text-gray-800">
                  {messages["about_us_mission"] || "Our Mission"}
                </Label>
                <Textarea
                  className="w-full min-h-[110px] text-gray-800"
                  value={form.mission}
                  onChange={(value) => handleChange("mission", value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-lg font-medium text-gray-800">
                  {messages["about_us_vision"] || "Our Vision"}
                </Label>
                <Textarea
                  className="w-full min-h-[110px] text-gray-800"
                  value={form.vision}
                  onChange={(value) => handleChange("vision", value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-lg font-medium text-gray-800">
                  {messages["about_us_values"] || "Our Values"}
                </Label>
                <Textarea
                  className="w-full min-h-[110px] text-gray-800"
                  value={form.values}
                  onChange={(value) => handleChange("values", value)}
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-500 mt-2">{error.message || "An error occurred"}</p>}


          <div className="flex items-center gap-3 px-2 lg:justify-end">
            <Button size="sm" variant="outline" onClick={onClose}>
              {messages["cancel"] || "Cancel"}
            </Button>
            <Button
              size="sm"
              type="submit"
              disabled={updating}
              className="bg-primary-500 hover:bg-primary-600 text-white"
            >
              {updating
                ? messages["updating"] || "Updating..."
                : messages["update"] || "Update"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
