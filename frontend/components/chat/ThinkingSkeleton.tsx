"use client";

export default function ThinkingSkeleton() {
    return (
        <div className="flex items-start gap-4 animate-fade-in-up">
            {/* Agent avatar */}
            <div className="w-10 h-10 rounded-full flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)' }}>
                <div className="w-full h-full rounded-full flex items-center justify-center">
                    <span className="text-lg" style={{ color: '#0C2C55' }}>✨</span>
                </div>
            </div>

            {/* Thinking bubble */}
            <div className="flex-1 p-4 rounded-2xl"
                style={{
                    background: 'rgba(41, 99, 116, 0.3)',
                    border: '2px solid rgba(98, 159, 173, 0.3)'
                }}>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                                background: '#629FAD',
                                animationDelay: '0s',
                                animationDuration: '1s'
                            }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                                background: '#629FAD',
                                animationDelay: '0.2s',
                                animationDuration: '1s'
                            }}></div>
                        <div className="w-2 h-2 rounded-full animate-bounce"
                            style={{
                                background: '#629FAD',
                                animationDelay: '0.4s',
                                animationDuration: '1s'
                            }}></div>
                    </div>
                    <span className="text-sm ml-2" style={{ color: '#629FAD' }}>
                        AI is thinking...
                    </span>
                </div>
            </div>
        </div>
    );
}
