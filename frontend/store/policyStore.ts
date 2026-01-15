"use client";

import { create } from "zustand";
import { supabase, type Policy } from "@/lib/supabase";

interface PolicyStore {
    policy: Policy | null;
    loading: boolean;
    error: string | null;

    fetchPolicy: () => Promise<void>;
    updateMaxTransaction: (amount: number) => Promise<void>;
    updateMonthlyLimit: (amount: number) => Promise<void>;
    addToAllowList: (address: string) => Promise<void>;
    removeFromAllowList: (address: string) => Promise<void>;
    addToBlockList: (address: string) => Promise<void>;
    removeFromBlockList: (address: string) => Promise<void>;
    addSpending: (amount: number) => Promise<void>;
    resetMonthlySpending: () => Promise<void>;

    validateTransaction: (amount: number, recipient: string) => {
        isValid: boolean;
        violations: string[];
    };
}

export const usePolicyStore = create<PolicyStore>((set, get) => ({
    policy: null,
    loading: false,
    error: null,

    fetchPolicy: async () => {
        set({ loading: true, error: null });
        try {
            const { data, error } = await supabase
                .from('policies')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error) {
                // If no policy exists, create default
                if (error.code === 'PGRST116') {
                    const { data: newPolicy, error: insertError } = await supabase
                        .from('policies')
                        .insert({
                            max_tx_amount: 1000,
                            monthly_budget: 5000,
                            current_monthly_spent: 250,
                            required_approval_threshold: 500,
                            allow_list: ['Stripe', 'Circle', 'Amazon'],
                            block_list: []
                        })
                        .select()
                        .single();

                    if (insertError) throw insertError;
                    set({ policy: newPolicy, loading: false });
                } else {
                    throw error;
                }
            } else {
                set({ policy: data, loading: false });
            }
        } catch (err: any) {
            set({ error: err.message, loading: false });
        }
    },

    updateMaxTransaction: async (amount) => {
        const { policy } = get();
        if (!policy) return;

        const { error } = await supabase
            .from('policies')
            .update({ max_tx_amount: amount })
            .eq('id', policy.id);

        if (!error) {
            set({ policy: { ...policy, max_tx_amount: amount } });
        }
    },

    updateMonthlyLimit: async (amount) => {
        const { policy } = get();
        if (!policy) return;

        const { error } = await supabase
            .from('policies')
            .update({ monthly_budget: amount })
            .eq('id', policy.id);

        if (!error) {
            set({ policy: { ...policy, monthly_budget: amount } });
        }
    },

    addToAllowList: async (address) => {
        const { policy } = get();
        if (!policy) return;

        const newAllowList = [...policy.allow_list, address];
        const { error } = await supabase
            .from('policies')
            .update({ allow_list: newAllowList })
            .eq('id', policy.id);

        if (!error) {
            set({ policy: { ...policy, allow_list: newAllowList } });
        }
    },

    removeFromAllowList: async (address) => {
        const { policy } = get();
        if (!policy) return;

        const newAllowList = policy.allow_list.filter(a => a !== address);
        const { error } = await supabase
            .from('policies')
            .update({ allow_list: newAllowList })
            .eq('id', policy.id);

        if (!error) {
            set({ policy: { ...policy, allow_list: newAllowList } });
        }
    },

    addToBlockList: async (address) => {
        const { policy } = get();
        if (!policy) return;

        const newBlockList = [...policy.block_list, address];
        const { error } = await supabase
            .from('policies')
            .update({ block_list: newBlockList })
            .eq('id', policy.id);

        if (!error) {
            set({ policy: { ...policy, block_list: newBlockList } });
        }
    },

    removeFromBlockList: async (address) => {
        const { policy } = get();
        if (!policy) return;

        const newBlockList = policy.block_list.filter(a => a !== address);
        const { error } = await supabase
            .from('policies')
            .update({ block_list: newBlockList })
            .eq('id', policy.id);

        if (!error) {
            set({ policy: { ...policy, block_list: newBlockList } });
        }
    },

    addSpending: async (amount) => {
        const { policy } = get();
        if (!policy) return;

        const newSpent = policy.current_monthly_spent + amount;
        const { error } = await supabase
            .from('policies')
            .update({ current_monthly_spent: newSpent })
            .eq('id', policy.id);

        if (!error) {
            set({ policy: { ...policy, current_monthly_spent: newSpent } });
        }
    },

    resetMonthlySpending: async () => {
        const { policy } = get();
        if (!policy) return;

        const { error } = await supabase
            .from('policies')
            .update({ current_monthly_spent: 0 })
            .eq('id', policy.id);

        if (!error) {
            set({ policy: { ...policy, current_monthly_spent: 0 } });
        }
    },

    validateTransaction: (amount, recipient) => {
        const { policy } = get();
        if (!policy) {
            return { isValid: false, violations: ['Policy not loaded'] };
        }

        const violations: string[] = [];

        // Check max transaction
        if (amount > policy.max_tx_amount) {
            violations.push(`Amount exceeds max transaction limit of $${policy.max_tx_amount}`);
        }

        // Check monthly limit
        if (policy.current_monthly_spent + amount > policy.monthly_budget) {
            const remaining = policy.monthly_budget - policy.current_monthly_spent;
            violations.push(`Would exceed monthly limit. Remaining: $${remaining.toFixed(2)}`);
        }

        // Check block list
        if (policy.block_list.some(blocked =>
            recipient.toLowerCase().includes(blocked.toLowerCase())
        )) {
            violations.push(`Recipient is on the block list`);
        }

        return {
            isValid: violations.length === 0,
            violations
        };
    }
}));
