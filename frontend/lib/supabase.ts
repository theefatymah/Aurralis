import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// Database types
export type Policy = {
    id: string;
    user_id?: string;
    max_tx_amount: number;
    daily_budget: number;
    monthly_budget: number;
    current_monthly_spent: number;
    required_approval_threshold: number;
    allow_list: string[];
    block_list: string[];
    created_at: string;
    updated_at: string;
};

export type AgentActivity = {
    id: string;
    user_id?: string;
    user_query: string;
    structured_intent: {
        amount: number;
        currency: string;
        recipient: string;
        recipientName?: string;
    };
    ai_reasoning: string;
    status: 'pending_approval' | 'authorized' | 'executing' | 'executed' | 'rejected' | 'flagged_by_policy' | 'failed';
    policy_checks?: {
        rule: string;
        passed: boolean;
        message: string;
    }[];
    created_at: string;
    updated_at: string;
};

export type Transaction = {
    id: string;
    activity_id: string;
    tx_hash?: string;
    explorer_url?: string;
    amount: number;
    currency: string;
    recipient: string;
    status: 'pending' | 'pending_on_chain' | 'confirmed' | 'failed';
    confirmations: number;
    created_at: string;
    confirmed_at?: string;
};
