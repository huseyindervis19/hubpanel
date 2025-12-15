"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { useLocale } from "@/context/LocaleContext";
import TitleComponent from "@/components/ui/TitleComponent";
import Form from "@/components/form/Form";
import { IconPicker, IconName } from "../IconPicker";
import { useCreateSocialLink } from "@/hooks/useSocialLink";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddSocialLinkModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
    const { messages } = useLocale();
    const createSocialLink = useCreateSocialLink();
    const isPending = createSocialLink.isPending;

    const [form, setForm] = useState({
        platform: "",
        icon: "" as IconName | "",
        url: "",
        order: 1
    });

    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) {
            setMessage(null);
            setForm({
                platform: "",
                icon: "",
                url: "",
                order: 1
            });
        }
    }, [isOpen]);

    const handleChange = (field: string, value: any) => {
        setForm({ ...form, [field]: value });
    };

    const handleSubmit = async () => {
        setMessage(null);

        const payload = {
            platform: form.platform.trim(),
            icon: form.icon.trim(),
            url: form.url.trim(),
            order: form.order
        };

        try {
            await createSocialLink.mutateAsync(payload);
            setMessage(messages["created_successfully"] || "Created successfully!");

            await new Promise((resolve) => setTimeout(resolve, 1000));

            onSuccess();
            onClose();

        } catch (err) {
            console.error(err);
            setMessage(messages["created_error"] || "An error occurred while creating.");
        }

    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-[600px] p-8 lg:p-4 mx-2 sm:mx-auto">
            <div className="relative w-full h-[70vh] flex flex-col rounded-3xl bg-white dark:bg-gray-900">

                <TitleComponent
                    title={messages["social_links"] || "Social Links"}
                    className="mb-6 font-semibold text-center"
                />

                {message && (
                    <p
                        className={`mb-4 text-center font-medium ${message.includes("Error") ? "p-4 rounded-xl border border-error-200 bg-error-50 text-error-700 dark:border-error-700 dark:bg-error-900/20 transition-opacity duration-300" : "p-4 rounded-xl border border-success-200 bg-success-50 text-success-700 dark:border-success-700 dark:bg-success-900/20 transition-opacity duration-300"
                            }`}
                    >
                        {message}
                    </p>
                )}
                <Form onSubmit={handleSubmit} className="flex flex-col flex-1">
                    <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>{messages["platform"] || "Platform"}</Label>
                                <Input
                                    value={form.platform}
                                    onChange={e => handleChange("platform", e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>{messages["display_order"] || "Order"}</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={form.order}
                                    onChange={e => handleChange("order", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>{messages["url"] || "URL"}</Label>
                            <Input
                                value={form.url}
                                onChange={e => handleChange("url", e.target.value)}
                                placeholder="https://"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>{messages["icon_name"] || "Icon"}</Label>
                            <IconPicker
                                value={form.icon || ""}
                                onChange={(iconName) => handleChange("icon", iconName)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <Button size="sm" variant="outline" onClick={onClose} disabled={isPending}>
                            {messages["cancel"] || "Cancel"}
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? (messages["creating"] || "Creating...") : (messages["create"] || "Create")}
                        </Button>
                    </div>
                </Form>
            </div>
        </Modal>
    );
};
export default AddSocialLinkModal;