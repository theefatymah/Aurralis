"use client";

import { useState } from "react";
import { ProofData } from "@/types/proof";
import { formatTxHash, copyToClipboard } from "@/utils/formatters";
import { ExternalLink, Copy, Check, CheckCircle2 } from "lucide-react";
import ExecutionProgress from "./ExecutionProgress";
import { useToast } from "@/components/ui/ToastContainer";

interface ProofCardProps {
    data: ProofData;
}

export default function ProofCard({ data }: ProofCardProps) {
    const [copied, setCopied] = useState(false);
    const toast = useToast();

    const handleCopy = async () => {
        const success = await copyToClipboard(data.txHash);
        if (success) {
            setCopied(true);
            toast.success('Copied!', 'Transaction hash copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } else {
            toast.error('Failed to copy', 'Please copy manually');
        }
    };

    const handleViewExplorer = () => {
        window.open(data.explorerUrl, '_blank');
    };

    return (
        <div className="w-full p-6 rounded-3xl animate-scale-in"
            style={{
                background: 'rgba(41, 99, 116, 0.4)',
                border: '2px solid #629FAD',
                boxShadow: '0 8px 32px 0 rgba(98, 159, 173, 0.3)'
            }}>
            {/* Success Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-full animate-pulse-slow"
                    style={{
                        background: 'rgba(98, 159, 173, 0.2)',
                        boxShadow: '0 0 20px rgba(98, 159, 173, 0.5)'
                    }}>
                    <CheckCircle2 className="w-8 h-8" style={{ color: '#629FAD' }} />
                </div>
                <div>
                    <h3 className="text-xl font-bold gradient-text">Transaction Successful</h3>
                    <p className="text-sm" style={{ color: '#629FAD' }}>
                        Your transaction has been confirmed on Arc
                    </p>
                </div>
            </div>

            {/* Execution Progress */}
            <div className="mb-6 p-4 rounded-2xl"
                style={{
                    background: 'rgba(98, 159, 173, 0.1)',
                    border: '1px solid rgba(98, 159, 173, 0.2)'
                }}>
                <div className="text-xs font-semibold mb-4" style={{ color: '#629FAD' }}>
                    Execution Steps
                </div>
                <ExecutionProgress steps={data.steps} />
            </div>

            {/* Transaction Details */}
            <div className="space-y-4">
                {/* Transaction Hash */}
                <div>
                    <div className="text-xs mb-2" style={{ color: '#629FAD' }}>Transaction Hash</div>
                    <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 rounded-xl font-mono text-sm"
                            style={{
                                background: 'rgba(98, 159, 173, 0.2)',
                                color: '#EDEDCE',
                                border: '1px solid rgba(98, 159, 173, 0.3)'
                            }}>
                            {formatTxHash(data.txHash)}
                        </div>
                        <button
                            onClick={handleCopy}
                            className="p-3 rounded-xl transition-smooth hover:scale-105"
                            style={{
                                background: 'rgba(98, 159, 173, 0.2)',
                                border: '1px solid rgba(98, 159, 173, 0.3)'
                            }}>
                            {copied ? (
                                <Check className="w-5 h-5" style={{ color: '#629FAD' }} />
                            ) : (
                                <Copy className="w-5 h-5" style={{ color: '#629FAD' }} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirmations */}
                <div className="flex items-center justify-between p-3 rounded-xl"
                    style={{
                        background: 'rgba(98, 159, 173, 0.1)',
                        border: '1px solid rgba(98, 159, 173, 0.2)'
                    }}>
                    <span className="text-sm" style={{ color: '#629FAD' }}>Confirmations</span>
                    <span className="font-semibold" style={{ color: '#EDEDCE' }}>
                        {data.confirmations} / 12
                    </span>
                </div>

                {/* View on Explorer Button */}
                <button
                    onClick={handleViewExplorer}
                    className="w-full px-6 py-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-smooth hover:scale-105"
                    style={{
                        background: 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)',
                        color: '#0C2C55',
                        boxShadow: '0 4px 20px rgba(98, 159, 173, 0.5)'
                    }}>
                    <ExternalLink className="w-5 h-5" />
                    View on Arc Explorer
                </button>
            </div>

            {/* Status Badge */}
            <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                        background: 'rgba(98, 159, 173, 0.2)',
                        border: '2px solid #629FAD'
                    }}>
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#629FAD' }} />
                    <span className="text-sm font-semibold" style={{ color: '#629FAD' }}>
                        {data.status === 'confirmed' ? 'Confirmed on Chain' : 'Pending...'}
                    </span>
                </div>
            </div>
        </div>
    );
}
