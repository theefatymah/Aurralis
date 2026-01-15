"use client";

import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
    onClose: (id: string) => void;
}

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onClose(id);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [id, duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: '#296374',
            borderColor: '#629FAD',
            iconColor: '#629FAD'
        },
        error: {
            icon: AlertCircle,
            bgColor: 'rgba(239, 68, 68, 0.2)',
            borderColor: '#EF4444',
            iconColor: '#EF4444'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'rgba(237, 237, 206, 0.2)',
            borderColor: '#EDEDCE',
            iconColor: '#EDEDCE'
        },
        info: {
            icon: Info,
            bgColor: 'rgba(98, 159, 173, 0.2)',
            borderColor: '#629FAD',
            iconColor: '#629FAD'
        }
    };

    const { icon: Icon, bgColor, borderColor, iconColor } = config[type];

    return (
        <div
            className="flex items-start gap-3 p-4 rounded-2xl shadow-glow-md animate-slide-in-right min-w-[300px] max-w-[400px]"
            style={{
                background: bgColor,
                border: `2px solid ${borderColor}`
            }}
        >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: iconColor }} />

            <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-1" style={{ color: '#EDEDCE' }}>
                    {title}
                </h4>
                {message && (
                    <p className="text-xs" style={{ color: '#629FAD' }}>
                        {message}
                    </p>
                )}
            </div>

            <button
                onClick={() => onClose(id)}
                className="flex-shrink-0 hover:scale-110 transition-smooth"
                style={{ color: '#629FAD' }}
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}
