"use client";

interface ProgressBarProps {
    steps: {
        id: string;
        label: string;
        status: 'pending' | 'in-progress' | 'completed' | 'failed';
    }[];
}

export default function ExecutionProgress({ steps }: ProgressBarProps) {
    return (
        <div className="space-y-4">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;

                const getStatusColor = () => {
                    switch (step.status) {
                        case 'completed':
                            return '#629FAD';
                        case 'in-progress':
                            return '#EDEDCE';
                        case 'failed':
                            return '#EF4444';
                        default:
                            return 'rgba(98, 159, 173, 0.3)';
                    }
                };

                return (
                    <div key={step.id} className="relative flex items-start gap-4">
                        {/* Connector line */}
                        {!isLast && (
                            <div className="absolute left-4 top-8 bottom-0 w-0.5"
                                style={{
                                    background: step.status === 'completed'
                                        ? '#629FAD'
                                        : 'rgba(98, 159, 173, 0.2)'
                                }} />
                        )}

                        {/* Step indicator */}
                        <div className="relative z-10 flex-shrink-0">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step.status === 'in-progress' ? 'animate-pulse' : ''
                                }`}
                                style={{
                                    background: step.status === 'pending'
                                        ? 'transparent'
                                        : step.status === 'in-progress'
                                            ? 'rgba(237, 237, 206, 0.2)'
                                            : step.status === 'completed'
                                                ? 'rgba(98, 159, 173, 0.2)'
                                                : 'rgba(239, 68, 68, 0.2)',
                                    border: `2px solid ${getStatusColor()}`
                                }}>
                                {step.status === 'completed' && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={getStatusColor()}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                                {step.status === 'in-progress' && (
                                    <div className="w-3 h-3 rounded-full" style={{ background: getStatusColor() }} />
                                )}
                                {step.status === 'failed' && (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={getStatusColor()}>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )}
                            </div>
                        </div>

                        {/* Step label */}
                        <div className="flex-1 pt-1">
                            <div className="font-medium text-sm"
                                style={{
                                    color: step.status === 'pending'
                                        ? '#629FAD'
                                        : '#EDEDCE'
                                }}>
                                {step.label}
                            </div>
                            {step.status === 'in-progress' && (
                                <div className="text-xs mt-1" style={{ color: '#629FAD' }}>
                                    In progress...
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
