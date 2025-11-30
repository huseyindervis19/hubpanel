import { Modal } from "@/components/ui/modal";
import { motion } from "framer-motion";
import { ContactRequest } from "@/types/ContactRequest";
import { useLocale } from "@/context/LocaleContext";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  contact: ContactRequest | null;
}

export default function ShowModal({ isOpen, onClose, contact }: Props) {

  const { messages } = useLocale();
  const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
      {children}
    </div>
  );

  const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
      <IconWrapper>{icon}</IconWrapper>
      <div>
        <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">{label}</h3>
        <p className="text-gray-800 dark:text-gray-100 break-words">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="text-center mb-6">
          <h4 className="text-xl font-bold text-gray-800 dark:text-white">
            {messages["contact_requests"] || "Contact Requests"}
          </h4>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <InfoItem
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-12 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
              </svg>
            }
            label={messages["contact_date"] || "Date"}
            value={contact?.createdAt ? new Date(contact.createdAt).toLocaleDateString() : "N/A"}
          />
          <InfoItem
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.79.657 6.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
            label={messages["contact_name"] || "Name"}
            value={contact?.name}
          />
          <InfoItem
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.197 3.59a1 1 0 01-.502 1.21l-2.266 1.133a11.042 11.042 0 005.516 5.516l1.133-2.266a1 1 0 011.21-.502l3.59 1.197a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.163 21 3 14.837 3 7V5z" />
              </svg>
            }
            label={messages["contact_phone"] || "Phone"}
            value={contact?.phone}
          />
          <InfoItem
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.2-3.6A7.966 7.966 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
            label={messages["contact_message"] || "Message"}
            value={contact?.message}
          />
        </div>
      </motion.div>
    </Modal>
  );
}
