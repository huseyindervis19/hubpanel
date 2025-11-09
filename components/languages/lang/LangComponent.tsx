"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { PencilIcon, TrashBinIcon } from "@/icons";
import Button from "@/components/ui/button/Button";
import { Search } from "lucide-react";
import { useLanguages } from "@/hooks/useLanguages";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

import AddLanguageModal from "./FormModals/AddLanguageModal";
import EditLanguageModal from "./FormModals/EditLanguageModal";
import DeleteLanguageModal from "./FormModals/DeleteLanguageModal";

const LanguagesComponent = () => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <p className="text-gray-600 dark:text-gray-300">Loading languages...</p>
      </div>
    );
  }

  return (
    <>
      {/* Header + Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 lg:mb-7">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Languages
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total: {filteredLanguages.length}
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search language..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border rounded-lg bg-white dark:bg-slate-900 dark:text-gray-100 dark:border-white/10 focus:ring-2 focus:ring-primary/40 outline-none"
              />
            </div>
          </div>

          {canAddLang && (
            <Button className="h-9 px-4 text-sm" onClick={() => setAddModalOpen(true)}>
              Add
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[500px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Code
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map((lang) => (
                    <TableRow key={lang.id}>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-lg dark:text-gray-100">
                        {lang.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-lg dark:text-gray-100">
                        {lang.code}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-800 dark:text-white">
                        <div className="flex items-center gap-5">
                          {canEditLang && (
                            <button onClick={() => openEditModal(lang)}>
                              <PencilIcon />
                            </button>
                          )}
                          {canDeleteLang && (
                            <button onClick={() => openDeleteModal(lang)}>
                              <TrashBinIcon />
                            </button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={3}
                      className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      No languages found.
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
