"use client";

import { create } from "zustand";
import Toast, { ToastType } from "./Toast";

interface ToastData {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    duration?: number;
}

interface ToastStore {
    toasts: ToastData[];
    addToast: (toast: Omit<ToastData, 'id'>) => void;
    removeToast: (id: string) => void;
}

const useToastStore = create<ToastStore>((set) => ({
    toasts: [],

    addToast: (toast) => {
        const id = crypto.randomUUID();
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }]
        }));
    },

    removeToast: (id) => {
        set((state) => ({
            toasts: state.toasts.filter(t => t.id !== id)
        }));
    }
}));

// Export hook for easy toast creation
export function useToast() {
    const { addToast } = useToastStore();

    return {
        success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
        error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
        warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),
        info: (title: string, message?: string) => addToast({ type: 'info', title, message })
    };
}

export default function ToastContainer() {
    const { toasts, removeToast } = useToastStore();

    return (
        <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
}
