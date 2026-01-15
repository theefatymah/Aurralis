"use client";

import { create } from "zustand";
import { Message, DecisionCardData } from "@/types/message";

interface MessageStore {
    messages: Message[];
    isThinking: boolean;

    addMessage: (type: 'user' | 'agent' | 'system', content: string | DecisionCardData) => void;
    setThinking: (isThinking: boolean) => void;
    clearMessages: () => void;
}

export const useMessageStore = create<MessageStore>((set) => ({
    messages: [
        {
            id: '1',
            type: 'agent',
            content: 'Hello! I\'m Aurralis, your AI transaction assistant. I can help you make secure payments. Try telling me something like "Send $50 to Stripe".',
            timestamp: new Date(),
            status: 'sent'
        }
    ],
    isThinking: false,

    addMessage: (type, content) => {
        const message: Message = {
            id: crypto.randomUUID(),
            type,
            content,
            timestamp: new Date(),
            status: type === 'user' ? 'sent' : 'pending'
        };

        set((state) => ({
            messages: [...state.messages, message]
        }));

        // Simulate agent response delay
        if (type === 'user') {
            set({ isThinking: true });
        }
    },

    setThinking: (isThinking) => set({ isThinking }),

    clearMessages: () => set({ messages: [] })
}));
