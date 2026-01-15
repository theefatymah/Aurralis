"use client";

import { useState } from "react";
import { DecisionCardData } from "@/types/message";
import { formatUSDC, maskAddress } from "@/utils/formatters";
import { Check, X, Loader2, ExternalLink, Shield, AlertCircle } from "lucide-react";
import { usePolicyStore } from "@/store/policyStore";
import { useActivityStore } from "@/store/activityStore";
import { useTransactionStore, TransactionState } from "@/store/transactionStore";
import { useToast } from "@/components/ui/ToastContainer";
import { useDemoStore } from "@/store/demoStore";

interface DecisionCardProps {
    data: DecisionCardData;
}

export default function DecisionCard({ data }: DecisionCardProps) {
    const [isApproving, setIsApproving] = useState(false);
    const [isDenying, setIsDenying] = useState(false);
    const [decision, setDecision] = useState<'approved' | 'denied' | null>(null);

    const { validateTransaction } = usePolicyStore();
    const { addActivity } = useActivityStore();
    const { requestApproval, approveTransaction, rejectTransaction } = useTransactionStore();
    const toast = useToast();
    const { isDemoMode } = useDemoStore();

    const validation = validateTransaction(data.amount, data.recipientName || data.recipient);

    const handleApprove = async () => {
        if (!validation.isValid) {
            toast.error('Policy Violation', validation.violations[0]);
            return;
        }

        setIsApproving(true);
        requestApproval();

        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, isDemoMode ? 1000 : 2000));

        // Add to activity
        addActivity({
            type: 'approved',
            amount: data.amount,
            currency: data.currency,
            recipient: data.recipient,
            recipientName: data.recipientName,
            reason: 'User approved transaction',
            txHash: isDemoMode ? '0xdemo' + Math.random().toString(16).slice(2, 10) : undefined
        });

        approveTransaction();
        setDecision('approved');
        setIsApproving(false);

        toast.success('Transaction Approved', `${formatUSDC(data.amount)} will be sent to ${data.recipientName || data.recipient}`);
    };

    const handleDeny = async () => {
        setIsDenying(true);

        await new Promise(resolve => setTimeout(resolve, 500));

        addActivity({
            type: 'denied',
            amount: data.amount,
            currency: data.currency,
            recipient: data.recipient,
            recipientName: data.recipientName,
            reason: 'User denied transaction'
        });

        rejectTransaction();
        setDecision('denied');
        setIsDenying(false);

        toast.info('Transaction Denied', 'The transaction was not executed');
    };

    return (
        <div className="w-full p-6 rounded-3xl animate-scale-in"
            style={{
                background: 'rgba(41, 99, 116, 0.4)',
                border: '2px solid #629FAD',
                boxShadow: '0 8px 32px 0 rgba(98, 159, 173, 0.3)'
            }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5" style={{ color: '#629FAD' }} />
                    <h3 className="font-semibold text-sm" style={{ color: '#EDEDCE' }}>
                        Decision Required
                    </h3>
                </div>
                {!validation.isValid && (
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full"
                        style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '1px solid #EF4444'
                        }}>
                        <AlertCircle className="w-3 h-3" style={{ color: '#EF4444' }} />
                        <span className="text-xs" style={{ color: '#EF4444' }}>Policy Violation</span>
                    </div>
                )}
            </div>

            {/* Amount */}
            <div className="mb-4">
                <div className="text-xs mb-1" style={{ color: '#629FAD' }}>Amount</div>
                <div className="text-3xl font-bold gradient-text">
                    {formatUSDC(data.amount)}
                </div>
                <div className="text-xs mt-1" style={{ color: '#629FAD' }}>in {data.currency}</div>
            </div>

            {/* Recipient */}
            <div className="mb-4">
                <div className="text-xs mb-1" style={{ color: '#629FAD' }}>Recipient</div>
                <div className="flex items-center gap-2">
                    {data.recipientName && (
                        <span className="font-semibold" style={{ color: '#EDEDCE' }}>{data.recipientName}</span>
                    )}
                    <span className="text-sm font-mono px-2 py-1 rounded"
                        style={{
                            background: 'rgba(98, 159, 173, 0.2)',
                            color: '#629FAD'
                        }}>
                        {maskAddress(data.recipient)}
                    </span>
                </div>
            </div>

            {/* Reasoning */}
            <div className="mb-6 p-4 rounded-xl"
                style={{
                    background: 'rgba(98, 159, 173, 0.1)',
                    border: '1px solid rgba(98, 159, 173, 0.2)'
                }}>
                <div className="text-xs font-semibold mb-2" style={{ color: '#629FAD' }}>
                    AI Reasoning
                </div>
                <p className="text-sm leading-relaxed" style={{ color: '#EDEDCE' }}>
                    {data.reasoning}
                </p>
            </div>

            {/* Policy Violations */}
            {!validation.isValid && (
                <div className="mb-6 p-4 rounded-xl"
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid #EF4444'
                    }}>
                    <div className="text-xs font-semibold mb-2" style={{ color: '#EF4444' }}>
                        Policy Violations
                    </div>
                    <ul className="space-y-1">
                        {validation.violations.map((violation, index) => (
                            <li key={index} className="text-sm flex items-start gap-2" style={{ color: '#EDEDCE' }}>
                                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                                <span>{violation}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action Buttons */}
            {!decision && (
                <div className="flex gap-3">
                    <button
                        onClick={handleDeny}
                        disabled={isDenying || isApproving}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-smooth hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            border: '2px solid #EF4444',
                            color: '#EF4444'
                        }}
                    >
                        {isDenying ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Denying...
                            </>
                        ) : (
                            <>
                                <X className="w-4 h-4" />
                                Deny
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleApprove}
                        disabled={isApproving || isDenying || !validation.isValid}
                        className="flex-1 px-4 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-smooth hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{
                            background: validation.isValid
                                ? 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)'
                                : 'rgba(98, 159, 173, 0.2)',
                            color: '#0C2C55',
                            border: '2px solid #629FAD'
                        }}
                    >
                        {isApproving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Approving...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Approve
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Decision feedback */}
            {decision && (
                <div className={`flex items-center justify-center gap-2 p-4 rounded-xl ${decision === 'approved' ? 'animate-pulse' : ''
                    }`}
                    style={{
                        background: decision === 'approved'
                            ? 'rgba(98, 159, 173, 0.2)'
                            : 'rgba(239, 68, 68, 0.1)',
                        border: `2px solid ${decision === 'approved' ? '#629FAD' : '#EF4444'}`
                    }}>
                    {decision === 'approved' ? (
                        <>
                            <Check className="w-5 h-5" style={{ color: '#629FAD' }} />
                            <span className="font-semibold" style={{ color: '#629FAD' }}>
                                Transaction Approved - Processing...
                            </span>
                        </>
                    ) : (
                        <>
                            <X className="w-5 h-5" style={{ color: '#EF4444' }} />
                            <span className="font-semibold" style={{ color: '#EF4444' }}>
                                Transaction Denied
                            </span>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
