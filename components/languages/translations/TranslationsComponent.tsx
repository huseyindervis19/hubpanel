"use client";

import { useState, useMemo, useEffect } from "react";
import { Search } from "lucide-react";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { useTranslations, useUpdateTranslation } from "@/hooks/useTranslations";
import { useLanguages } from "@/hooks/useLanguages";
import { Translation } from "@/types/Translation";
import LoadingComponent from "@/components/ui/LoadingComponent";
import TitleComponent from "@/components/ui/TitleComponent";
import SearchBar from "@/components/form/input/SearchBar";
import Form from "@/components/form/Form";
import InputField from "@/components/form/input/InputField";
import Label from "@/components/form/Label";

const TranslationsComponent = () => {
  const { translations = [], isLoading, isError, refetch } = useTranslations();
  const updateMutation = useUpdateTranslation();
  const { languages = [], isLoading: langsLoading } = useLanguages();

  const [selectedLang, setSelectedLang] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [editedValues, setEditedValues] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const storedLocale = localStorage.getItem("locale");
    if (storedLocale && languages.length > 0) {
      const foundLang = languages.find((lang) => lang.code === storedLocale);
      if (foundLang) setSelectedLang(foundLang.id);
    }
  }, [languages]);

  const filteredTranslations = useMemo(() => {
    if (!selectedLang) return [];
    return translations
      .filter((t) => t.languageId === selectedLang)
      .filter(
        (t) =>
          t.TranslationKey?.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.value.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [translations, searchTerm, selectedLang]);

  const handleChangeValue = (id: number, newValue: string) => {
    setEditedValues((prev) => ({ ...prev, [id]: newValue }));
  };

  const handleSave = async () => {
    if (!Object.keys(editedValues).length) return;
    setLoading(true);
    setMessage(null);

    try {
      for (const [id, value] of Object.entries(editedValues)) {
        await updateMutation.mutateAsync({
          id: Number(id),
          data: { value },
        });
      }

      setEditedValues({});
      refetch();
      setMessage("Translations updated successfully!");
      setTimeout(() => setMessage(null), 1000);
    } catch (error) {
      console.error("Update failed:", error);
      setMessage("Error updating translations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) { <LoadingComponent title="translations" /> }
  if (isError)
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-red-500">Failed to load translations.</p>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <TitleComponent title="Translations" />
        <div className="flex items-center gap-2">
          {/* Language Select */}
          <Select
            value={selectedLang?.toString() || ""}
            onChange={(value) => setSelectedLang(value ? Number(value) : null)}
            options={languages.map((l) => ({ value: String(l.id), label: l.name }))}
            placeholder={langsLoading ? "Loading..." : "Language"}
            disabled={langsLoading}
            className="w-36 h-10 text-sm"
          />

          {/* Search Input */}
          <div className="relative">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </div>
      </div>

      {/* Translations Form */}
      {selectedLang ? (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="space-y-8"
        >
          {message && (
            <p
              className={`text-center font-medium ${message.includes("Error") ? "text-red-600" : "text-green-600"
                }`}
            >
              {message}
            </p>
          )}

          {filteredTranslations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {filteredTranslations.map((item: Translation) => (
                <div
                  key={item.id}
                  className="flex flex-col p-4 rounded-2xl border border-gray-200 bg-white shadow-sm dark:bg-slate-900 dark:border-white/[0.08]"
                >
                  <Label>
                    {item.TranslationKey?.key}
                  </Label>
                  <InputField
                    type="text"
                    value={editedValues[item.id] ?? item.value}
                    onChange={(e) => handleChangeValue(item.id, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-white/10 focus:ring-2 focus:ring-primary/40 outline-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No translations found for this language.
            </p>
          )}

          {/* Save Button */}
          <div className="pt-6 flex justify-end">
            <Button
              size="sm"
              type="submit"
              disabled={loading || Object.keys(editedValues).length === 0}
            >
              {loading ? "Saving..." : "Update"}
            </Button>
          </div>
        </Form>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">Select a language to view translations.</p>
      )}
    </div>
  );
};

export default TranslationsComponent;
