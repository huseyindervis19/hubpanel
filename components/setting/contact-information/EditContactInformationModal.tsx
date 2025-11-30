import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { ContactInformation } from "@/types/ContactInformation";
import { useLocale } from "@/context/LocaleContext";
import { useContactInformations } from "@/hooks/useContactInformations";

interface EditContactInformationModalProps {
  isOpen: boolean;
  onClose: () => void;
  handleSave: () => void;
  data: ContactInformation;
}

export const EditContactInformationModal = ({
  isOpen,
  onClose,
  handleSave,
  data,
}: EditContactInformationModalProps) => {
  const { messages, locale } = useLocale();
  const { update, updating, error } = useContactInformations(locale);

  const [form, setForm] = useState({
    phone: "",
    whatsapp: "",
    email: "",
    latitude: "",
    longitude: "",
    address: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      const currentTranslation = (data.translations?.[locale] || {}) as {
        address?: string;
      };
      setForm({
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        latitude:
          data.latitude !== undefined && data.latitude !== null
            ? String(data.latitude)
            : "",
        longitude:
          data.longitude !== undefined && data.longitude !== null
            ? String(data.longitude)
            : "",
        address: currentTranslation.address || "",
      });
    }
  }, [data, locale]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      phone: form.phone,
      whatsapp: form.whatsapp,
      email: form.email,
      latitude: form.latitude ? Number(form.latitude) : undefined,
      longitude: form.longitude ? Number(form.longitude) : undefined,
      address: form.address,
    };

    const result = await update(data.id, payload, locale);
    if (result) {
      setSuccessMessage(messages["updated_successfully"] || "Updated successfully");
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
        handleSave();
      }, 1500);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 px-2 pr-8">
          {messages["edit_contact_info"] || "Edit Contact Information"}
        </h4>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
          {messages["edit_contact_info_desc"] || "Update the displayed contact information."}
        </p>
          {successMessage && (
          <div className="p-4 rounded-xl border border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 transition-opacity duration-300">
            {successMessage}
          </div>
        )}

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["phone"] || "Phone"}
              </Label>
              <Input
                className="w-full"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder={messages["phone_placeholder"] || "Enter phone number"}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["whatsapp"] || "WhatsApp"}
              </Label>
              <Input
                className="w-full"
                value={form.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder={messages["whatsapp_placeholder"] || "Enter WhatsApp number"}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["email"] || "Email"}
              </Label>
              <Input
                type="email"
                className="w-full"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder={messages["email_placeholder"] || "Enter email address"}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["latitude"] || "Latitude"}
              </Label>
              <Input
                type="number"
                className="w-full"
                value={form.latitude}
                onChange={(e) => handleChange("latitude", e.target.value)}
                placeholder={messages["latitude_placeholder"] || "21.4858"}
                step={0.0001}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["longitude"] || "Longitude"}
              </Label>
              <Input
                type="number"
                className="w-full"
                value={form.longitude}
                onChange={(e) => handleChange("longitude", e.target.value)}
                placeholder={messages["longitude_placeholder"] || "39.1925"}
                step={0.0001}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label className="text-sm font-medium text-gray-800 dark:text-white/80">
                {messages["address"] || "Address"}
              </Label>
              <Input
                className="w-full"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
                placeholder={messages["address_placeholder"] || "Enter address"}
              />
            </div>
          </div>

          {error && <p className="text-red-500 mt-4">{error.message}</p>}

          {/* {successMessage && (
            <p className="mt-4 text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          )} */}

          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
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
