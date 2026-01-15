"use client";

import { useDemoStore } from "@/store/demoStore";
import { TestTube2 } from "lucide-react";

export default function DemoModeToggle() {
    const { isDemoMode, toggleDemoMode } = useDemoStore();

    return (
        <div className="flex items-center gap-3">
            {isDemoMode && (
                <div className="px-3 py-1 rounded-full flex items-center gap-2 animate-pulse"
                    style={{
                        background: 'rgba(237, 237, 206, 0.2)',
                        border: '1px solid #EDEDCE'
                    }}>
                    <TestTube2 className="w-3 h-3" style={{ color: '#EDEDCE' }} />
                    <span className="text-xs font-semibold" style={{ color: '#EDEDCE' }}>
                        Demo Mode
                    </span>
                </div>
            )}

            <button
                onClick={toggleDemoMode}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-smooth ${isDemoMode ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                    }`}
                style={{
                    background: isDemoMode
                        ? 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)'
                        : 'rgba(98, 159, 173, 0.3)'
                }}>
                <span className={`inline-block h-4 w-4 transform rounded-full transition-smooth ${isDemoMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                    style={{ background: '#0C2C55' }} />
            </button>
        </div>
    );
}
