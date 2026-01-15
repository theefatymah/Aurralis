"use client";

import { create } from "zustand";
import { supabase, type AgentActivity, type Transaction } from "@/lib/supabase";

type ActivityWithTransaction = AgentActivity & {
    transactions?: Transaction[];
};

interface ActivityStore {
    activities: ActivityWithTransaction[];
    loading: boolean;
    error: string | null;
    subscription: any;

    fetchActivities: () => Promise<void>;
    addActivity: (activity: Omit<AgentActivity, 'id' | 'created_at' | 'updated_at'>) => Promise<AgentActivity | null>;
    updateActivity: (id: string, updates: Partial<AgentActivity>) => Promise<void>;
    subscribeToActivities: () => void;
    unsubscribe: () => void;
    clearActivities: () => void;
}

export const useActivityStore = create<ActivityStore>((set, get) => ({
    activities: [],
    loading: false,
    error: null,
    subscription: null,

    fetchActivities: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('agent_activities')
                .select(`
          *,
          transactions (*)
        `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            set({ activities: data || [], loading: false });
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    addActivity: async (activity) => {
        try {
            const { data, error } = await supabase
                .from('agent_activities')
                .insert([activity])
                .select()
                .single();

            if (error) throw error;

            // Add to local state
            set((state) => ({
                activities: [data, ...state.activities]
            }));

            return data;
        } catch (err: any) {
            console.error('Failed to add activity:', err);
            return null;
        }
    },

    updateActivity: async (id, updates) => {
        try {
            const { error } = await supabase
                .from('agent_activities')
                .update(updates)
                .eq('id', id);

            if (error) throw error;

            // Update local state
            set((state) => ({
                activities: state.activities.map(act =>
                    act.id === id ? { ...act, ...updates } : act
                )
            }));
        } catch (err: any) {
            console.error('Failed to update activity:', err);
        }
    },

    subscribeToActivities: () => {
        const subscription = supabase
            .channel('agent_activities_changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'agent_activities'
                },
                (payload) => {
                    console.log('Activity changed:', payload);

                    if (payload.eventType === 'INSERT') {
                        set((state) => ({
                            activities: [payload.new as AgentActivity, ...state.activities]
                        }));
                    } else if (payload.eventType === 'UPDATE') {
                        set((state) => ({
                            activities: state.activities.map(act =>
                                act.id === payload.new.id ? { ...act, ...(payload.new as AgentActivity) } : act
                            )
                        }));
                    } else if (payload.eventType === 'DELETE') {
                        set((state) => ({
                            activities: state.activities.filter(act => act.id !== payload.old.id)
                        }));
                    }
                }
            )
            .subscribe();

        set({ subscription });
    },

    unsubscribe: () => {
        const { subscription } = get();
        if (subscription) {
            supabase.removeChannel(subscription);
            set({ subscription: null });
        }
    },

    clearActivities: () => set({ activities: [] })
}));
