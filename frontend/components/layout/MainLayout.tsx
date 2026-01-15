"use client";

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import ChatContainer from "./ChatContainer";
import ToastContainer from "@/components/ui/ToastContainer";
import { usePolicyStore } from "@/store/policyStore";
import { useActivityStore } from "@/store/activityStore";

export default function MainLayout() {
    const [currentView, setCurrentView] = useState<'chat' | 'policy' | 'activity'>('chat');
    const { fetchPolicy } = usePolicyStore();
    const { fetchActivities, subscribeToActivities, unsubscribe } = useActivityStore();

    useEffect(() => {
        // Initialize data on mount
        fetchPolicy();
        fetchActivities();

        // Subscribe to real-time updates
        subscribeToActivities();

        // Cleanup on unmount
        return () => {
            unsubscribe();
        };
    }, [fetchPolicy, fetchActivities, subscribeToActivities, unsubscribe]);

    return (
        <>
            <div className="flex h-screen overflow-hidden">
                <Sidebar currentView={currentView} onViewChange={setCurrentView} />
                <ChatContainer currentView={currentView} />
            </div>
            <ToastContainer />
        </>
    );
}
