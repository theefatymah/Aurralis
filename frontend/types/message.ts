export interface Message {
    id: string;
    type: 'user' | 'agent' | 'system';
    content: string | DecisionCardData;
    timestamp: Date;
    status?: 'pending' | 'sent' | 'error';
}

export interface DecisionCardData {
    amount: number;
    currency: string;
    recipient: string;
    recipientName?: string;
    reasoning: string;
    policyChecks: PolicyCheck[];
}

export interface PolicyCheck {
    rule: string;
    passed: boolean;
    message: string;
}
