-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    max_tx_amount NUMERIC NOT NULL DEFAULT 1000,
    daily_budget NUMERIC NOT NULL DEFAULT 5000,
    monthly_budget NUMERIC NOT NULL DEFAULT 5000,
    current_monthly_spent NUMERIC NOT NULL DEFAULT 0,
    required_approval_threshold NUMERIC NOT NULL DEFAULT 500,
    allow_list TEXT[] DEFAULT ARRAY['Stripe', 'Circle', 'Amazon']::TEXT[],
    block_list TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent activities table
CREATE TABLE IF NOT EXISTS agent_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    user_query TEXT NOT NULL,
    structured_intent JSONB NOT NULL,
    ai_reasoning TEXT,
    status TEXT CHECK (status IN (
        'pending_approval',
        'authorized',
        'executing',
        'executed',
        'rejected',
        'flagged_by_policy',
        'failed'
    )) DEFAULT 'pending_approval',
    policy_checks JSONB,
    locked BOOLEAN DEFAULT FALSE,
    locked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID REFERENCES agent_activities(id) ON DELETE CASCADE,
    tx_hash TEXT UNIQUE,
    explorer_url TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USDC',
    recipient TEXT NOT NULL,
    status TEXT CHECK (status IN (
        'pending',
        'pending_on_chain',
        'confirmed',
        'failed'
    )) DEFAULT 'pending',
    confirmations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agent_activities_user_id ON agent_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_activities_status ON agent_activities(status);
CREATE INDEX IF NOT EXISTS idx_transactions_activity_id ON transactions(activity_id);
CREATE INDEX IF NOT EXISTS idx_transactions_tx_hash ON transactions(tx_hash);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to policies
CREATE TRIGGER update_policies_updated_at
    BEFORE UPDATE ON policies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to agent_activities
CREATE TRIGGER update_agent_activities_updated_at
    BEFORE UPDATE ON agent_activities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default policy
INSERT INTO policies (max_tx_amount, daily_budget, monthly_budget, required_approval_threshold)
VALUES (1000, 5000, 5000, 500)
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, refine later with auth)
CREATE POLICY "Enable all for policies" ON policies FOR ALL USING (true);
CREATE POLICY "Enable all for agent_activities" ON agent_activities FOR ALL USING (true);
CREATE POLICY "Enable all for transactions" ON transactions FOR ALL USING (true);
