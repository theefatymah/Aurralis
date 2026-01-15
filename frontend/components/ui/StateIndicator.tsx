"use client";

import { useTransactionStore } from "@/store/transactionStore";
import { TransactionState } from "@/types/transaction";
import { Brain, Clock, CheckCircle2, Loader2, Shield, LucideIcon } from "lucide-react";

interface StateConfig {
    icon: LucideIcon;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
    glowColor: string;
    animate?: boolean;
    pulse?: boolean;
    spin?: boolean;
}

export default function StateIndicator() {
    const { currentState } = useTransactionStore();

    const stateConfig: Record<TransactionState, StateConfig> = {
        [TransactionState.IDLE]: {
            icon: Shield,
            label: "Ready",
            color: "#629FAD",
            bgColor: "rgba(41, 99, 116, 0.3)",
            borderColor: "#629FAD",
            glowColor: "rgba(98, 159, 173, 0.3)",
        },
        [TransactionState.THINKING]: {
            icon: Brain,
            label: "Analyzing",
            color: "#629FAD",
            bgColor: "rgba(98, 159, 173, 0.3)",
            borderColor: "#EDEDCE",
            glowColor: "rgba(98, 159, 173, 0.6)",
            animate: true,
        },
        [TransactionState.AWAITING_APPROVAL]: {
            icon: Clock,
            label: "Awaiting Approval",
            color: "#EDEDCE",
            bgColor: "rgba(237, 237, 206, 0.2)",
            borderColor: "#EDEDCE",
            glowColor: "rgba(237, 237, 206, 0.5)",
            pulse: true,
        },
        [TransactionState.EXECUTING]: {
            icon: Loader2,
            label: "Executing",
            color: "#296374",
            bgColor: "rgba(41, 99, 116, 0.3)",
            borderColor: "#629FAD",
            glowColor: "rgba(41, 99, 116, 0.5)",
            spin: true,
        },
        [TransactionState.CONFIRMED]: {
            icon: CheckCircle2,
            label: "Confirmed",
            color: "#629FAD",
            bgColor: "rgba(98, 159, 173, 0.3)",
            borderColor: "#EDEDCE",
            glowColor: "rgba(98, 159, 173, 0.7)",
        },
    };

    const config = stateConfig[currentState];
    const Icon = config.icon;

    return (
        <div className="relative group animate-fade-in">
            {/* Animated glow effect */}
            <div
                className={`absolute inset-0 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-smooth ${config.pulse ? 'animate-pulse' : ''}`}
                style={{ background: config.glowColor }}
            ></div>

            {/* Main indicator with all colors */}
            <div
                className="relative flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300 hover:scale-105 transform"
                style={{
                    background: config.bgColor,
                    border: `2px solid ${config.borderColor}`,
                    boxShadow: `0 0 20px ${config.glowColor}`
                }}
            >
                {/* Icon with animations */}
                <div className="relative">
                    <Icon
                        className={`w-5 h-5 ${config.spin ? "animate-spin" : ""
                            } ${config.pulse ? "animate-pulse" : ""} ${config.animate ? "animate-bounce-subtle" : ""
                            }`}
                        style={{ color: config.color }}
                    />
                    {/* Sparkle effect for active states */}
                    {(config.animate || config.pulse || config.spin) && (
                        <div
                            className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
                            style={{ background: config.color }}
                        ></div>
                    )}
                </div>

                {/* Label with gradient on active states */}
                <span
                    className="text-sm font-semibold"
                    style={{
                        ...(config.animate || config.pulse || config.spin
                            ? {
                                background: 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                            }
                            : { color: config.color })
                    }}
                >
                    {config.label}
                </span>

                {/* Status dot */}
                <div
                    className={`w-2 h-2 rounded-full ${config.pulse ? 'animate-pulse' : ''}`}
                    style={{ background: config.color }}
                ></div>
            </div>

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 rounded-full overflow-hidden opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none">
                <div className="w-full h-full" style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(98, 159, 173, 0.4) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite'
                }}></div>
            </div>
        </div>
    );
}
