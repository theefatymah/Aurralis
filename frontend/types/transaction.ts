export enum TransactionState {
    IDLE = "IDLE",
    THINKING = "THINKING",
    AWAITING_APPROVAL = "AWAITING_APPROVAL",
    EXECUTING = "EXECUTING",
    CONFIRMED = "CONFIRMED",
}

export interface Transaction {
    id: string;
    state: TransactionState;
    description: string;
    timestamp: Date;
    metadata?: Record<string, any>;
}

export interface TransactionStore {
    currentState: TransactionState;
    currentTransaction: Transaction | null;
    history: Transaction[];

    // State transition methods
    startThinking: (description: string) => void;
    requestApproval: () => void;
    approveTransaction: () => void;
    rejectTransaction: () => void;
    executeTransaction: () => void;
    confirmTransaction: () => void;
    resetToIdle: () => void;
}
