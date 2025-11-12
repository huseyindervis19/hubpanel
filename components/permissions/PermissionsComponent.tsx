"use client";

import { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow, Td, Th } from "../ui/table";
import { usePermissions } from "@/hooks/usePermissions";
import RefreshButton from "@/components/ui/button/RefreshButton";
import SearchBar from "@/components/form/input/SearchBar";
import LoadingComponent from "../ui/LoadingComponent";
import TitleComponent from "../ui/TitleComponent";
import { useLocale } from "@/context/LocaleContext";


const PermissionsComponent = () => {
  const { messages } = useLocale();
  const { permissions = [], isLoading, refetch } = usePermissions();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPermissions = useMemo(() => {
    return permissions.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [permissions, searchTerm]);

  if (isLoading) { <LoadingComponent title={messages["permissions"] || "Permissions"} /> }


  const hasPermissions = permissions.length > 0;
  const hasResults = filteredPermissions.length > 0;

  return (
    <>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 lg:mb-7">
        <TitleComponent title={messages["nav_permissions"] || "Permissions"} />
        <div className="flex flex-wrap items-center gap-3">
          {/* Search + Total */}
          <div className="flex items-center gap-3">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {messages["dashboard_total_categories"]?.replace("Categories", "Permissions") || "Total"}: {filteredPermissions.length}
            </p>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
          {/* Refresh */}
          <RefreshButton onRefresh={refetch} />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03] shadow-sm">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <Th> {messages["name"] || "Name"} </Th>
                  <Th> {messages["endpoint"] || "Endpoint"} </Th>
                  <Th> {messages["date"] || "Created At"} </Th>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {hasResults ? (
                  filteredPermissions.map((permission) => (
                    <TableRow
                      key={permission.id}
                      className="hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
                    >
                      <Td>{permission.name}</Td>
                      <Td>{permission.endpoint}</Td>
                      <Td> {new Date(permission.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</Td>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <td
                      colSpan={3}
                      className="px-5 py-6 text-center text-gray-500 dark:text-gray-400"
                    >
                      {hasPermissions
                        ? (messages["no_results_found"]?.replace("{term}", searchTerm) || `No results found for "${searchTerm}".`)
                        : (messages["no_data"] || "No permissions available.")
                      }
                    </td>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default PermissionsComponent;