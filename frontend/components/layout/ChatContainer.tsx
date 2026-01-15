"use client";

import { Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useMessageStore } from "@/store/messageStore";
import { parsePaymentIntent } from "@/utils/demoData";
import StateIndicator from "@/components/ui/StateIndicator";
import MessageFeed from "@/components/chat/MessageFeed";
import PolicyDashboard from "@/components/policy/PolicyDashboard";
import ActivityTimeline from "@/components/policy/ActivityTimeline";
import { usePolicyStore } from "@/store/policyStore";
import DemoModeToggle from "@/components/demo/DemoModeToggle";

interface ChatContainerProps {
    currentView: 'chat' | 'policy' | 'activity';
}

export default function ChatContainer({ currentView }: ChatContainerProps) {
    const [input, setInput] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const { addMessage, setThinking } = useMessageStore();
    const { validateTransaction } = usePolicyStore();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        addMessage('user', input);

        // Parse payment intent
        const paymentIntent = parsePaymentIntent(input);

        // Simulate AI response
        setTimeout(() => {
            setThinking(false);

            if (paymentIntent) {
                // Validate against policy
                const validation = validateTransaction(
                    paymentIntent.amount,
                    paymentIntent.recipientName || paymentIntent.recipient
                );

                // Update policy checks
                paymentIntent.policyChecks = [
                    {
                        rule: 'Max Transaction Limit',
                        passed: paymentIntent.amount <= 1000,
                        message: paymentIntent.amount <= 1000
                            ? `Within limit ($${paymentIntent.amount} ≤ $1,000)`
                            : `Exceeds limit ($${paymentIntent.amount} > $1,000)`
                    },
                    {
                        rule: 'Monthly Budget',
                        passed: validation.isValid,
                        message: validation.isValid
                            ? 'Within monthly budget'
                            : validation.violations[0]
                    }
                ];

                // Add decision card
                addMessage('agent', paymentIntent);
            } else {
                // Regular text response
                addMessage('agent', "I'd be happy to help you with that transaction. Please provide the amount and recipient. For example: 'Send $100 to Stripe'");
            }
        }, 2000);

        setInput("");
    };

    return (
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <div className="relative p-6 animate-slide-in-right"
                style={{
                    background: 'linear-gradient(90deg, #296374 0%, rgba(41, 99, 116, 0.8) 100%)',
                    borderBottom: '2px solid #629FAD'
                }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(98, 159, 173, 0.1), transparent)' }}></div>
                <div className="relative flex items-center justify-between">
                    <div classNames="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-2xl blur-xl opacity-50 animate-pulse-slow"
                                style={{ background: '#629FAD' }}></div>
                            <div className="relative p-3 rounded-2xl shadow-glow-md"
                                style={{ background: 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)' }}>
                                <Sparkles className="w-6 h-6 animate-bounce-subtle" style={{ color: '#0C2C55' }} />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold" style={{
                                background: 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }}>
                                {currentView === 'chat' ? 'AI Assistant' : currentView === 'policy' ? 'Policy' : 'Activity'}
                            </h2>
                            <p className="text-sm" style={{ color: '#EDEDCE' }}>
                                {currentView === 'chat'
                                    ? 'Secure transaction management'
                                    : currentView === 'policy'
                                        ? 'Security guardrails'
                                        : 'Transaction history'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <DemoModeToggle />
                        {currentView === 'chat' && <StateIndicator />}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {currentView === 'chat' ? (
                <>
                    <MessageFeed />

                    {/* Input Area */}
                    <div className="p-6 relative overflow-hidden"
                        style={{
                            background: 'linear-gradient(180deg, rgba(41, 99, 116, 0.6) 0%, #296374 100%)',
                            borderTop: '2px solid #629FAD'
                        }}>
                        <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(to top, rgba(12, 44, 85, 0.5), transparent)' }}></div>

                        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative z-10">
                            <div className={`relative transition-all duration-300 ${isFocused ? 'scale-105' : 'scale-100'}`}>
                                {isFocused && (
                                    <div className="absolute inset-0 rounded-3xl blur-xl -z-10 animate-glow"
                                        style={{ background: 'rgba(98, 159, 173, 0.4)' }}></div>
                                )}

                                <div className="relative rounded-3xl overflow-hidden"
                                    style={{
                                        background: 'rgba(12, 44, 85, 0.6)',
                                        border: '2px solid #629FAD',
                                        boxShadow: '0 8px 32px 0 rgba(98, 159, 173, 0.3)'
                                    }}>
                                    <div className="flex items-center gap-2 px-6 py-4">
                                        <input
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            placeholder="Send $100 to Stripe..."
                                            className="flex-1 bg-transparent text-base focus:outline-none"
                                            style={{
                                                color: '#EDEDCE',
                                                caretColor: '#629FAD'
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={!input.trim()}
                                            className="relative group"
                                        >
                                            <div className="absolute inset-0 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-smooth"
                                                style={{ background: '#629FAD' }}></div>
                                            <div className="relative px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105 transform"
                                                style={{
                                                    background: 'linear-gradient(135deg, #EDEDCE 0%, #629FAD 100%)',
                                                    color: '#0C2C55',
                                                    boxShadow: '0 4px 20px rgba(98, 159, 173, 0.5)'
                                                }}>
                                                <Send className="w-4 h-4" />
                                                <span>Send</span>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </>
            ) : currentView === 'policy' ? (
                <div className="flex-1 overflow-y-auto" style={{ background: '#0C2C55' }}>
                    <PolicyDashboard />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto" style={{ background: '#0C2C55' }}>
                    <ActivityTimeline />
                </div>
            )}
        </main>
    );
}
