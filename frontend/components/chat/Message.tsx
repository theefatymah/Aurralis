"use client";

import { Message as MessageType } from "@/types/message";
import { formatTimestamp } from "@/utils/formatters";
import { User, Sparkles } from "lucide-react";
import DecisionCard from "./DecisionCard";

interface MessageProps {
    message: MessageType;
}

export default function Message({ message }: MessageProps) {
    const isUser = message.type === 'user';
    const isSystem = message.type === 'system';

    // Check if message content is a decision card
    const isDecisionCard = typeof message.content === 'object';

    if (isSystem) {
        return (
            <div className="flex justify-center my-4">
                <div className="px-4 py-2 rounded-full text-xs"
                    style={{
                        background: 'rgba(98, 159, 173, 0.2)',
                        color: '#629FAD',
                        border: '1px solid rgba(98, 159, 173, 0.3)'
                    }}>
                    {typeof message.content === 'string' ? message.content : ''}
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-start gap-4 animate-fade-in-up ${isUser ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center"
                style={{
                    background: isUser
                        ? 'linear-gradient(135deg, #629FAD 0%, #296374 100%)'
                        : 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)'
                }}>
                {isUser ? (
                    <User className="w-5 h-5" style={{ color: '#EDEDCE' }} />
                ) : (
                    <Sparkles className="w-5 h-5" style={{ color: '#0C2C55' }} />
                )}
            </div>

            {/* Message content */}
            <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {isDecisionCard && !isUser ? (
                    <DecisionCard data={message.content as any} />
                ) : (
                    <div className={`p-4 rounded-2xl ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                        style={{
                            background: isUser
                                ? 'rgba(98, 159, 173, 0.3)'
                                : 'rgba(41, 99, 116, 0.3)',
                            border: `2px solid ${isUser ? '#629FAD' : 'rgba(98, 159, 173, 0.3)'}`
                        }}>
                        <p className="text-sm leading-relaxed" style={{ color: '#EDEDCE' }}>
                            {typeof message.content === 'string' ? message.content : ''}
                        </p>
                    </div>
                )}

                <span className="text-xs px-2" style={{ color: '#629FAD' }}>
                    {formatTimestamp(message.timestamp)}
                </span>
            </div>
        </div>
    );
}
