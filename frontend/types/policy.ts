export interface Policy {
    maxTransaction: number;
    monthlyLimit: number;
    currentMonthlySpent: number;
    allowList: string[];
    blockList: string[];
}

export interface PolicyRule {
    id: string;
    name: string;
    value: string | number;
    description: string;
    enabled: boolean;
}
