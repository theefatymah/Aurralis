"use client";

import { useEffect } from "react";
import { useActivityStore } from "@/store/activityStore";
import { formatUSDC, formatTimestamp, maskAddress } from "@/utils/formatters";
import { CheckCircle, XCircle, AlertTriangle, ExternalLink } from "lucide-react";

export default function ActivityTimeline() {
    const { activities, loading, fetchActivities } = useActivityStore();

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    const getStatusConfig = (status: string) => {
        // Map database status to display config
        if (status === 'executed' || status === 'authorized') {
            return {
                icon: CheckCircle,
                color: '#629FAD',
                bgColor: 'rgba(98, 159, 173, 0.2)',
                label: 'Approved'
            };
        } else if (status === 'rejected') {
            return {
                icon: XCircle,
                color: '#EF4444',
                bgColor: 'rgba(239, 68, 68, 0.1)',
                label: 'Denied by User'
            };
        } else if (status === 'flagged_by_policy') {
            return {
                icon: AlertTriangle,
                color: '#EDEDCE',
                bgColor: 'rgba(237, 237, 206, 0.1)',
                label: 'Blocked by Policy'
            };
        } else {
            return {
                icon: AlertTriangle,
                color: '#629FAD',
                bgColor: 'rgba(98, 159, 173, 0.2)',
                label: status
            };
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 rounded-full mx-auto mb-2"
                        style={{ borderColor: '#629FAD', borderTopColor: 'transparent' }}></div>
                    <p style={{ color: '#629FAD' }}>Loading activities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold gradient-text mb-2">Activity Timeline</h2>
                <p className="text-sm" style={{ color: '#629FAD' }}>
                    Complete history of all transaction decisions
                </p>
            </div>

            {/* Timeline */}
            <div className="relative space-y-6">
                {/* Vertical line */}
                {activities.length > 0 && (
                    <div className="absolute left-6 top-0 bottom-0 w-0.5"
                        style={{ background: 'rgba(98, 159, 173, 0.2)' }} />
                )}

                {activities.map((activity, index) => {
                    const config = getStatusConfig(activity.status);
                    const Icon = config.icon;
                    const intent = activity.structured_intent;
                    const transaction = activity.transactions?.[0];

                    return (
                        <div key={activity.id} className="relative flex gap-4 animate-fade-in-up"
                            style={{ animationDelay: `${index * 0.1}s` }}>
                            {/* Icon */}
                            <div className="relative z-10 flex-shrink-0">
                                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                                    style={{
                                        background: config.bgColor,
                                        border: `2px solid ${config.color}`,
                                        boxShadow: `0 0 0 4px #0C2C55`
                                    }}>
                                    <Icon className="w-5 h-5" style={{ color: config.color }} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-6">
                                <div className="p-4 rounded-2xl"
                                    style={{
                                        background: 'rgba(41, 99, 116, 0.3)',
                                        border: `2px solid ${config.color}`
                                    }}>
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm px-2 py-0.5 rounded"
                                                    style={{
                                                        background: config.bgColor,
                                                        color: config.color
                                                    }}>
                                                    {config.label}
                                                </span>
                                                <span className="text-xs" style={{ color: '#629FAD' }}>
                                                    {formatTimestamp(new Date(activity.created_at))}
                                                </span>
                                            </div>
                                            <div className="text-2xl font-bold" style={{ color: '#EDEDCE' }}>
                                                {formatUSDC(Number(intent.amount))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span style={{ color: '#629FAD' }}>Recipient:</span>
                                            <div className="flex items-center gap-2">
                                                {intent.recipientName && (
                                                    <span style={{ color: '#EDEDCE' }}>{intent.recipientName}</span>
                                                )}
                                                <span className="font-mono text-xs px-2 py-1 rounded"
                                                    style={{
                                                        background: 'rgba(98, 159, 173, 0.2)',
                                                        color: '#629FAD'
                                                    }}>
                                                    {maskAddress(intent.recipient)}
                                                </span>
                                            </div>
                                        </div>

                                        {activity.ai_reasoning && (
                                            <div className="flex items-start gap-2 pt-2"
                                                style={{ borderTop: '1px solid rgba(98, 159, 173, 0.2)' }}>
                                                <span style={{ color: '#629FAD' }}>Reason:</span>
                                                <span style={{ color: '#EDEDCE' }}>{activity.ai_reasoning}</span>
                                            </div>
                                        )}

                                        {transaction?.tx_hash && (
                                            <div className="flex items-center gap-2 mt-3 pt-3"
                                                style={{ borderTop: '1px solid rgba(98, 159, 173, 0.2)' }}>
                                                <span className="font-mono text-xs px-3 py-1.5 rounded"
                                                    style={{
                                                        background: 'rgba(98, 159, 173, 0.2)',
                                                        color: '#629FAD'
                                                    }}>
                                                    {maskAddress(transaction.tx_hash)}
                                                </span>
                                                {transaction.explorer_url && (
                                                    <a
                                                        href={transaction.explorer_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-1 px-3 py-1.5 rounded transition-smooth hover:scale-105"
                                                        style={{
                                                            background: 'rgba(98, 159, 173, 0.2)',
                                                            color: '#629FAD'
                                                        }}>
                                                        <ExternalLink className="w-3 h-3" />
                                                        <span className="text-xs">Explorer</span>
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {activities.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p style={{ color: '#629FAD' }}>No activity yet</p>
                </div>
            )}
        </div>
    );
}
