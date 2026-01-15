export interface Activity {
    id: string;
    type: 'approved' | 'denied' | 'blocked';
    amount: number;
    currency: string;
    recipient: string;
    recipientName?: string;
    timestamp: Date;
    reason?: string;
    txHash?: string;
    policyViolation?: string;
}

export interface ProofData {
    txHash: string;
    status: 'pending' | 'confirmed' | 'failed';
    confirmations: number;
    timestamp: Date;
    explorerUrl: string;
    steps: ExecutionStep[];
}

export interface ExecutionStep {
    id: string;
    label: string;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
    timestamp?: Date;
}
