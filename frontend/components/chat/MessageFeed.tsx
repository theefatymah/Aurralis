"use client";

import { useEffect, useRef } from "react";
import { useMessageStore } from "@/store/messageStore";
import Message from "./Message";
import ThinkingSkeleton from "./ThinkingSkeleton";

export default function MessageFeed() {
    const { messages, isThinking } = useMessageStore();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    return (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}

            {isThinking && <ThinkingSkeleton />}

            <div ref={messagesEndRef} />
        </div>
    );
}
