"use client";

import { useEffect } from "react";
import { usePolicyStore } from "@/store/policyStore";
import { formatUSDC } from "@/utils/formatters";
import { Shield, DollarSign, Calendar, List } from "lucide-react";

export default function PolicyDashboard() {
    const { policy, loading, fetchPolicy } = usePolicyStore();

    useEffect(() => {
        fetchPolicy();
    }, [fetchPolicy]);

    if (loading || !policy) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 rounded-full mx-auto mb-2"
                        style={{ borderColor: '#629FAD', borderTopColor: 'transparent' }}></div>
                    <p style={{ color: '#629FAD' }}>Loading policy...</p>
                </div>
            </div>
        );
    }

    const remaining = policy.monthly_budget - policy.current_monthly_spent;
    const percentUsed = (policy.current_monthly_spent / policy.monthly_budget) * 100;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold gradient-text mb-2">Policy Dashboard</h2>
                <p className="text-sm" style={{ color: '#629FAD' }}>
                    Current security guardrails and spending limits
                </p>
            </div>

            {/* Policy Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Max Transaction */}
                <div className="p-6 rounded-3xl"
                    style={{
                        background: 'rgba(41, 99, 116, 0.3)',
                        border: '2px solid #629FAD'
                    }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl"
                            style={{ background: 'rgba(98, 159, 173, 0.2)' }}>
                            <DollarSign className="w-6 h-6" style={{ color: '#629FAD' }} />
                        </div>
                        <div>
                            <div className="text-xs" style={{ color: '#629FAD' }}>Max Transaction</div>
                            <div className="text-2xl font-bold" style={{ color: '#EDEDCE' }}>
                                {formatUSDC(Number(policy.max_tx_amount))}
                            </div>
                        </div>
                    </div>
                    <p className="text-xs" style={{ color: '#629FAD' }}>
                        Maximum amount per transaction
                    </p>
                </div>

                {/* Monthly Limit */}
                <div className="p-6 rounded-3xl"
                    style={{
                        background: 'rgba(41, 99, 116, 0.3)',
                        border: '2px solid #629FAD'
                    }}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl"
                            style={{ background: 'rgba(98, 159, 173, 0.2)' }}>
                            <Calendar className="w-6 h-6" style={{ color: '#629FAD' }} />
                        </div>
                        <div>
                            <div className="text-xs" style={{ color: '#629FAD' }}>Monthly Limit</div>
                            <div className="text-2xl font-bold" style={{ color: '#EDEDCE' }}>
                                {formatUSDC(Number(policy.monthly_budget))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs" style={{ color: '#629FAD' }}>
                            <span>Spent: {formatUSDC(Number(policy.current_monthly_spent))}</span>
                            <span>Remaining: {formatUSDC(remaining)}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="w-full h-2 rounded-full overflow-hidden"
                            style={{ background: 'rgba(98, 159, 173, 0.2)' }}>
                            <div className="h-full transition-all duration-500"
                                style={{
                                    width: `${Math.min(percentUsed, 100)}%`,
                                    background: percentUsed > 90
                                        ? '#EF4444'
                                        : percentUsed > 70
                                            ? '#EDEDCE'
                                            : '#629FAD'
                                }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Allow List */}
            <div className="p-6 rounded-3xl"
                style={{
                    background: 'rgba(41, 99, 116, 0.3)',
                    border: '2px solid #629FAD'
                }}>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl"
                        style={{ background: 'rgba(98, 159, 173, 0.2)' }}>
                        <List className="w-6 h-6" style={{ color: '#629FAD' }} />
                    </div>
                    <div>
                        <div className="text-sm font-semibold" style={{ color: '#EDEDCE' }}>
                            Approved Vendors
                        </div>
                        <div className="text-xs" style={{ color: '#629FAD' }}>
                            Transactions to these vendors are pre-approved
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {policy.allow_list.map((vendor) => (
                        <div key={vendor}
                            className="px-4 py-2 rounded-xl font-medium text-sm"
                            style={{
                                background: 'rgba(98, 159, 173, 0.2)',
                                color: '#EDEDCE',
                                border: '1px solid rgba(98, 159, 173, 0.3)'
                            }}>
                            {vendor}
                        </div>
                    ))}
                </div>
            </div>

            {/* Security Info */}
            <div className="p-4 rounded-2xl flex items-center gap-3"
                style={{
                    background: 'rgba(98, 159, 173, 0.1)',
                    border: '1px solid rgba(98, 159, 173, 0.2)'
                }}>
                <Shield className="w-5 h-5" style={{ color: '#629FAD' }} />
                <p className="text-sm" style={{ color: '#629FAD' }}>
                    All transactions are validated against these policies before execution
                </p>
            </div>
        </div>
    );
}
