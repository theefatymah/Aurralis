import { DecisionCardData } from "@/types/message";
import { useDemoStore } from "@/store/demoStore";

// Parse user input to detect payment intent
export function parsePaymentIntent(input: string): DecisionCardData | null {
    // Simple regex patterns for demo
    const amountPattern = /\$?(\d+(?:\.\d{2})?)/;
    const recipientPattern = /to\s+([a-zA-Z0-9]+)/i;

    const amountMatch = input.match(amountPattern);
    const recipientMatch = input.match(recipientPattern);

    if (amountMatch && recipientMatch) {
        const amount = parseFloat(amountMatch[1]);
        const recipient = recipientMatch[1];

        // Generate mock address
        const mockAddress = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 4)}`;

        return {
            amount,
            currency: 'USDC',
            recipient: mockAddress,
            recipientName: recipient,
            reasoning: generateReasoning(amount, recipient),
            policyChecks: []
        };
    }

    return null;
}

function generateReasoning(amount: number, recipient: string): string {
    if (amount <= 100) {
        return `Small transaction of $${amount} to ${recipient}. Within your $500 monthly budget for SaaS tools and below the $1,000 single transaction limit.`;
    } else if (amount <= 500) {
        return `Medium-sized transaction of $${amount} to ${recipient}. This is within policy limits and ${recipient} is on your approved vendor list.`;
    } else {
        return `Large transaction of $${amount} to ${recipient}. This requires careful review as it approaches your transaction limits.`;
    }
}

// Demo data scenarios
export const demoScenarios = {
    successfulPayment: {
        txHash: '0x' + 'a'.repeat(64),
        confirmations: 12,
        explorerUrl: 'https://arc-explorer.com/tx/0x' + 'a'.repeat(64)
    },

    insufficientFunds: {
        error: 'Insufficient USDC balance. You have $432.50 available, but this transaction requires $500.00 plus gas fees.'
    },

    policyViolation: {
        error: 'Transaction blocked by policy: Amount exceeds maximum transaction limit of $1,000'
    },

    networkError: {
        error: 'Network error: Unable to connect to Arc testnet. Please try again later.'
    }
};
