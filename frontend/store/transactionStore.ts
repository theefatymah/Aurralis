"use client";

import { create } from "zustand";
import { TransactionState, Transaction, TransactionStore } from "@/types/transaction";

export const useTransactionStore = create<TransactionStore>((set, get) => ({
    currentState: TransactionState.IDLE,
    currentTransaction: null,
    history: [],

    startThinking: (description: string) => {
        const transaction: Transaction = {
            id: crypto.randomUUID(),
            state: TransactionState.THINKING,
            description,
            timestamp: new Date(),
        };

        set({
            currentState: TransactionState.THINKING,
            currentTransaction: transaction,
        });
    },

    requestApproval: () => {
        const { currentTransaction } = get();
        if (!currentTransaction || currentTransaction.state !== TransactionState.THINKING) {
            console.warn("Cannot request approval: invalid state transition");
            return;
        }

        set({
            currentState: TransactionState.AWAITING_APPROVAL,
            currentTransaction: {
                ...currentTransaction,
                state: TransactionState.AWAITING_APPROVAL,
            },
        });
    },

    approveTransaction: () => {
        const { currentTransaction } = get();
        if (!currentTransaction || currentTransaction.state !== TransactionState.AWAITING_APPROVAL) {
            console.warn("Cannot approve: invalid state transition");
            return;
        }

        get().executeTransaction();
    },

    rejectTransaction: () => {
        const { currentTransaction, history } = get();
        if (!currentTransaction) return;

        set({
            currentState: TransactionState.IDLE,
            currentTransaction: null,
            history: [...history, { ...currentTransaction, metadata: { rejected: true } }],
        });
    },

    executeTransaction: () => {
        const { currentTransaction } = get();
        if (!currentTransaction) {
            console.warn("Cannot execute: no current transaction");
            return;
        }

        set({
            currentState: TransactionState.EXECUTING,
            currentTransaction: {
                ...currentTransaction,
                state: TransactionState.EXECUTING,
            },
        });

        // Simulate execution delay
        setTimeout(() => {
            get().confirmTransaction();
        }, 2000);
    },

    confirmTransaction: () => {
        const { currentTransaction, history } = get();
        if (!currentTransaction) return;

        const confirmedTransaction = {
            ...currentTransaction,
            state: TransactionState.CONFIRMED,
        };

        set({
            currentState: TransactionState.CONFIRMED,
            currentTransaction: confirmedTransaction,
            history: [...history, confirmedTransaction],
        });

        // Auto-reset to IDLE after confirmation
        setTimeout(() => {
            get().resetToIdle();
        }, 3000);
    },

    resetToIdle: () => {
        set({
            currentState: TransactionState.IDLE,
            currentTransaction: null,
        });
    },
}));
