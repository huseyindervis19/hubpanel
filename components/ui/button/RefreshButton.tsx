"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import Button from "./Button";

interface RefreshButtonProps {
    onRefresh: () => Promise<any> | void;
    label?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh, label = "Refresh" }) => {
    const [rotating, setRotating] = useState(false);

    const handleClick = async () => {
        if (rotating) return;
        setRotating(true);

        try {
            await Promise.resolve(onRefresh());
        } finally {
            setTimeout(() => setRotating(false), 800);
        }
    };

    return (
        <Button
            size="sm"
            variant="outline"
            onClick={handleClick}
            disabled={rotating}
            className={`flex items-center gap-2 h-9 px-4`}
        >
            <RotateCcw
                className={`w-4 h-4 transition-transform duration-700 ${rotating ? "animate-spin-reverse" : ""
                    }`}
            />
            {label}
        </Button>
    );
};

export default RefreshButton;
