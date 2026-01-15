"use client";

import { FileText, Activity, ChevronRight, Shield, Sparkles, Lock, MessageSquare } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
    currentView: 'chat' | 'policy' | 'activity';
    onViewChange: (view: 'chat' | 'policy' | 'activity') => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
    return (
        <aside className="w-80 flex flex-col h-screen" style={{ background: 'linear-gradient(180deg, #296374 0%, #0C2C55 100%)' }}>
            {/* Header */}
            <div className="p-6" style={{
                borderBottom: '2px solid #629FAD',
                background: 'rgba(41, 99, 116, 0.6)'
            }}>
                <div className="flex items-center gap-3 animate-fade-in-up">
                    <div className="relative group">
                        <div className="absolute inset-0 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-smooth"
                            style={{ background: '#629FAD' }}></div>
                        <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center shadow-glow-md animate-float"
                            style={{ background: 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)' }}>
                            <Shield className="w-7 h-7" style={{ color: '#0C2C55' }} />
                            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 animate-pulse" style={{ color: '#EDEDCE' }} />
                        </div>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold" style={{
                            background: 'linear-gradient(135deg, #629FAD 0%, #EDEDCE 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Aurralis</h1>
                        <p className="text-xs flex items-center gap-1" style={{ color: '#EDEDCE' }}>
                            <Lock className="w-3 h-3" />
                            AI Transaction Assistant
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <NavButton
                    icon={MessageSquare}
                    label="Chat"
                    isActive={currentView === 'chat'}
                    onClick={() => onViewChange('chat')}
                />
                <NavButton
                    icon={FileText}
                    label="Policy"
                    isActive={currentView === 'policy'}
                    onClick={() => onViewChange('policy')}
                />
                <NavButton
                    icon={Activity}
                    label="Activity"
                    isActive={currentView === 'activity'}
                    onClick={() => onViewChange('activity')}
                />
            </div>

            {/* Footer */}
            <div className="p-4" style={{
                borderTop: '2px solid #629FAD',
                background: 'rgba(41, 99, 116, 0.6)'
            }}>
                <div className="flex items-center justify-center gap-2 text-xs" style={{ color: '#EDEDCE' }}>
                    <Shield className="w-3 h-3" style={{ color: '#629FAD' }} />
                    <span>Secure</span>
                    <span>•</span>
                    <Lock className="w-3 h-3" style={{ color: '#629FAD' }} />
                    <span>Encrypted</span>
                    <span>•</span>
                    <Sparkles className="w-3 h-3 animate-pulse" style={{ color: '#EDEDCE' }} />
                    <span>AI-Powered</span>
                </div>
            </div>
        </aside>
    );
}

function NavButton({
    icon: Icon,
    label,
    isActive,
    onClick
}: {
    icon: any;
    label: string;
    isActive: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 p-4 rounded-xl transition-smooth group ${isActive ? 'scale-105' : 'hover:scale-102'
                }`}
            style={{
                background: isActive
                    ? 'rgba(98, 159, 173, 0.3)'
                    : 'rgba(41, 99, 116, 0.3)',
                border: `2px solid ${isActive ? '#629FAD' : 'rgba(98, 159, 173, 0.2)'}`,
                boxShadow: isActive ? '0 4px 20px rgba(98, 159, 173, 0.3)' : 'none'
            }}>
            <div className={`p-2 rounded-lg transition-smooth ${isActive ? 'bg-opacity-30' : ''
                }`}
                style={{ background: isActive ? 'rgba(98, 159, 173, 0.3)' : 'rgba(98, 159, 173, 0.2)' }}>
                <Icon className="w-5 h-5" style={{ color: isActive ? '#EDEDCE' : '#629FAD' }} />
            </div>
            <span className="font-semibold" style={{ color: isActive ? '#EDEDCE' : '#629FAD' }}>
                {label}
            </span>
            {isActive && (
                <ChevronRight className="w-4 h-4 ml-auto" style={{ color: '#629FAD' }} />
            )}
        </button>
    );
}
