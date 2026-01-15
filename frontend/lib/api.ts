const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface IntentRequest {
    query: string;
}

export interface IntentResponse {
    activity_id: string;
    structured_intent: {
        amount: number;
        currency: string;
        recipient: string;
        recipientName?: string;
    };
    ai_reasoning: string;
    policy_checks: {
        rule: string;
        passed: boolean;
        message: string;
    }[];
    status: string;
}

export interface ApproveResponse {
    activity_id: string;
    tx_hash: string;
    explorer_url: string;
    status: string;
}

// Process user intent
export async function processIntent(query: string): Promise<IntentResponse> {
    const response = await fetch(`${API_URL}/api/intent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    });

    if (!response.ok) {
        throw new Error('Failed to process intent');
    }

    return response.json();
}

// Approve transaction
export async function approveTransaction(activityId: string): Promise<ApproveResponse> {
    const response = await fetch(`${API_URL}/api/approve/${activityId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to approve transaction');
    }

    return response.json();
}

// Deny transaction
export async function denyTransaction(activityId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/deny/${activityId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Failed to deny transaction');
    }
}

// Get activities
export async function getActivities() {
    const response = await fetch(`${API_URL}/api/activities`);

    if (!response.ok) {
        throw new Error('Failed to fetch activities');
    }

    return response.json();
}

// Get policy
export async function getPolicy() {
    const response = await fetch(`${API_URL}/api/policy`);

    if (!response.ok) {
        throw new Error('Failed to fetch policy');
    }

    return response.json();
}

// Update policy
export async function updatePolicy(policy: any) {
    const response = await fetch(`${API_URL}/api/policy`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(policy),
    });

    if (!response.ok) {
        throw new Error('Failed to update policy');
    }

    return response.json();
}
