"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, Td, Th } from "@/components/ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { Search } from "lucide-react";
import { useLanguages } from "@/hooks/useLanguages";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";
import AddLanguageModal from "./FormModals/AddLanguageModal";
import EditLanguageModal from "./FormModals/EditLanguageModal";
import DeleteLanguageModal from "./FormModals/DeleteLanguageModal";
import LoadingComponent from "@/components/ui/LoadingComponent";
import TitleComponent from "@/components/ui/TitleComponent";
import SearchBar from "@/components/form/input/SearchBar";
import { useLocale } from "@/context/LocaleContext";

const LanguagesComponent = () => {
  const { messages } = useLocale();
  const [selectedLang, setSelectedLang] = useState<any | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const canAddLang = useHasPermission(PERMISSIONS.ADD_LANGUAGE);
  const canEditLang = useHasPermission(PERMISSIONS.EDIT_LANGUAGE);
  const canDeleteLang = useHasPermission(PERMISSIONS.DELETE_LANGUAGE);

  const { languages = [], isLoading, refetch } = useLanguages();

  const filteredLanguages = useMemo(() => {
    return languages.filter(
      (lang) =>
        lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lang.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [languages, searchTerm]);

  const openEditModal = (lang: any) => {
    setSelectedLang(lang);
    setEditModalOpen(true);
  };

  const openDeleteModal = (lang: any) => {
    setSelectedLang(lang);
    setDeleteModalOpen(true);
  };

  const closeEditModal = () => setEditModalOpen(false);
  const closeDeleteModal = () => setDeleteModalOpen(false);

  if (isLoading) { <LoadingComponent title="Languages" /> }

  return (
    <>
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 lg:mb-7">
        <TitleComponent title="Languages" />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {messages["dashboard_total_categories"]?.replace("Categories", "Languages") || "Total"}: {filteredLanguages.length}
            </p>
            <div className="relative">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>
          </div>

          {/* {canAddLang && (
            <Button className="h-9 px-4 text-sm" onClick={() => setAddModalOpen(true)}>
              {messages["add"] || "Add"}
            </Button>
          )} */}
          <Button className="h-9 px-4 text-sm" onClick={() => setAddModalOpen(true)}>
            {messages["add"] || "Add"}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                  <Th> {messages["name"] || "Name"} </Th>
                  <Th> {messages["code"] || "Code"} </Th>
                  <Th> {messages["default"] || "Default"} </Th>
                  <Th> {messages["action"] || "Actions"}</Th>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((lang) => (
                    <TableRow key={lang.id}>
                      <Td>
                        {lang.name}
                      </Td>
                      <Td>
                        {lang.code}
                      </Td>
                      <Td>
                        {lang.isDefault ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            {messages["yes"] || "Yes"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800/30 dark:text-gray-500">
                            {messages["no"] || "No"}
                          </span>
                        )}
                      </Td>
                      <Td>
                        <div className="flex items-center">
                          {canEditLang && (
                            <Button  size="icon" variant="ghost" onClick={() => openEditModal(lang)} >
                            <PencilIcon width={20} height={20} />
                            </Button>
                          )}
                          {canDeleteLang && (
                            <Button size="icon" variant="ghost" onClick={() => openDeleteModal(lang)} >
                            <TrashBinIcon width={20} height={20} />
                            </Button>
                          )}
                        </div>
                      </Td>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={4}
                      className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      {messages["no_data"] || "No languages found."}
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddLanguageModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSuccess={() => refetch()}
      />

      <EditLanguageModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        onSuccess={() => refetch()}
        language={selectedLang}
      />

      <DeleteLanguageModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onSuccess={() => refetch()}
        language={selectedLang}
      />
    </>
  );
};

export default LanguagesComponent;