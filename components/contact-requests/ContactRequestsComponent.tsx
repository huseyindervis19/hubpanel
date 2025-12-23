"use client";
import { useLocale } from "@/context/LocaleContext";
import { Table, TableBody, TableHeader, TableRow, Td, Th } from "@/components/ui/table";
import { useContactRequests } from "@/hooks/useContactRequests";
import { ContactRequest, RequestStatus } from "@/types/ContactRequest";
import { EyeIcon } from "@/icons";
import { useState } from "react";
import ShowModal from "./ShowModal";
import Select from "@/components/form/Select";
import { useHasPermission } from "@/hooks/useAuth";
import { PERMISSIONS } from "@/types/Permissions";

export const ContactRequestsComponent = () => {
    const { requests, refetch, update } = useContactRequests();
    const { messages } = useLocale();
    const [showModalOpen, setShowModalOpen] = useState(false);
    const [contactToShow, setContactToShow] = useState<ContactRequest | null>(null);

    const canUpdateRequestStatus = useHasPermission(PERMISSIONS.EDIT_CONTACT_REQUEST);
    
    const getRequestId = (request: Partial<ContactRequest>): string => `${request.id || ""}`;

    const handleStatusChange = async (id: string, newStatus: RequestStatus) => {
        if (!id) return;
        await update(id as unknown as number, { status: newStatus });
        refetch();
    };

    const handleShow = (contact: ContactRequest) => {
        setContactToShow(contact);
        setShowModalOpen(true);
    };

    const closeShowModal = () => {
        setContactToShow(null);
        setShowModalOpen(false);
    };

    const statusOptions = [
        { value: "pending" as RequestStatus, label: messages["status_pending"] || "Pending" },
        { value: "in_progress" as RequestStatus, label: messages["status_in_progress"] || "In Progress" },
        { value: "completed" as RequestStatus, label: messages["status_completed"] || "Completed" },
    ];

    const getStatusColor = (status: RequestStatus) => {
        switch (status) {
            case "pending":
                return "bg-yellow-500 dark:bg-yellow-400";
            case "in_progress":
                return "bg-blue-500 dark:bg-blue-400";
            case "completed":
                return "bg-green-500 dark:bg-green-400";
            default:
                return "bg-gray-400";
        }
    };

    return (
        <>
            {contactToShow && (
                <ShowModal
                    isOpen={showModalOpen}
                    contact={contactToShow}
                    onClose={closeShowModal}
                />
            )}

            <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
                {messages["contact_requests"] || "Contact Requests"}
            </h3>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[900px]">
                        <Table>
                            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                                <TableRow>
                                    <Th className="w-8 text-center">
                                        -
                                    </Th>
                                    <Th>{messages["contact_status"] || "Status"}</Th>
                                    <Th>{messages["contact_date"] || "Date"}</Th>
                                    <Th>{messages["contact_name"] || "Name"}</Th>
                                    <Th>{messages["contact_phone"] || "Phone"}</Th>
                                    <Th>{messages["contact_message"] || "Message"}</Th>
                                    <Th>{messages["actions"] || "Actions"}</Th>
                                </TableRow>
                            </TableHeader>

                            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                                {requests?.length > 0 &&
                                    requests.map((request, index) => (
                                        <TableRow
                                            key={getRequestId(request) || `${request.phone || "row"}-${index}`}
                                            className="h-[185px] align-top"
                                        >
                                            <Td className="px-6 py-4 text-gray-800 dark:text-white">
                                                <span
                                                    className={`inline-block w-3 h-3 rounded-full ${getStatusColor(request.status)}`}
                                                ></span>
                                            </Td>
                                            <Td className="px-6 py-4 text-gray-800 dark:text-white">
                                                <Select
                                                    value={request.status}
                                                    options={statusOptions}
                                                    placeholder={messages["contact_status"] || "Status"}
                                                    disabled={!canUpdateRequestStatus}
                                                    onChange={(value) => handleStatusChange(getRequestId(request), value as RequestStatus)}
                                                />
                                            </Td>
                                            <Td className="px-6 py-4 text-gray-800 dark:text-white">
                                                {request.createdAt
                                                    ? new Date(request.createdAt).toLocaleDateString()
                                                    : "N/A"}
                                            </Td>
                                            <Td className="px-6 py-4 text-gray-800 dark:text-white">
                                                {request.name}
                                            </Td>
                                            <Td className="px-6 py-4 text-gray-800 dark:text-white">
                                                {request.phone}
                                            </Td>
                                            <Td className="px-6 py-4 text-gray-800 dark:text-white">
                                                {(request.message ?? "").length > 150
                                                    ? request.message!.substring(0, 150) + "..."
                                                    : request.message ?? ""}
                                            </Td>
                                            {/* Actions */}
                                            <Td className="px-6 py-4 text-gray-800 dark:text-white">
                                                <button onClick={() => handleShow(request)}>
                                                    <EyeIcon />
                                                </button>
                                            </Td>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </>
    );
};
