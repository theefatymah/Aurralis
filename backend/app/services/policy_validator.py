from typing import Dict, List

class PolicyValidator:
    """
    Validates transactions against policy rules
    """
    
    def validate(self, intent: dict, policy: dict) -> Dict[str, any]:
        """
        Validate transaction intent against policy
        
        Returns:
            {
                "is_valid": bool,
                "violations": List[str],
                "policy_checks": List[dict]
            }
        """
        violations = []
        policy_checks = []
        
        amount = intent.get('amount', 0)
        recipient_name = intent.get('recipientName', '')
        
        # Check 1: Max Transaction Limit
        max_tx = policy.get('max_tx_amount', 1000)
        max_tx_passed = amount <= max_tx
        policy_checks.append({
            "rule": "Max Transaction Limit",
            "passed": max_tx_passed,
            "message": f"${amount} {'≤' if max_tx_passed else '>'} ${max_tx}"
        })
        if not max_tx_passed:
            violations.append(f"Amount ${amount} exceeds max transaction limit of ${max_tx}")
        
        # Check 2: Monthly Budget
        monthly_budget = policy.get('monthly_budget', 5000)
        current_spent = policy.get('current_monthly_spent', 0)
        remaining = monthly_budget - current_spent
        monthly_passed = (current_spent + amount) <= monthly_budget
        
        policy_checks.append({
            "rule": "Monthly Budget",
            "passed": monthly_passed,
            "message": f"Remaining: ${remaining:.2f}" if monthly_passed else f"Would exceed by ${(current_spent + amount - monthly_budget):.2f}"
        })
        if not monthly_passed:
            violations.append(f"Would exceed monthly limit. Remaining: ${remaining:.2f}")
        
        # Check 3: Allow List
        allow_list = policy.get('allow_list', [])
        on_allow_list = any(vendor.lower() in recipient_name.lower() for vendor in allow_list) if recipient_name else False
        
        if allow_list:
            policy_checks.append({
                "rule": "Approved Vendor",
                "passed": on_allow_list,
                "message": f"{recipient_name} is {'on' if on_allow_list else 'not on'} approved list"
            })
        
        # Check 4: Block List
        block_list = policy.get('block_list', [])
        on_block_list = any(blocked.lower() in recipient_name.lower() for blocked in block_list) if recipient_name else False
        
        if on_block_list:
            policy_checks.append({
                "rule": "Block List",
                "passed": False,
                "message": f"{recipient_name} is on the block list"
            })
            violations.append(f"Recipient {recipient_name} is on the block list")
        
        return {
            "is_valid": len(violations) == 0,
            "violations": violations,
            "policy_checks": policy_checks
        }
    
    def determine_status(self, is_valid: bool) -> str:
        """
        Determine activity status based on validation
        """
        return "pending_approval" if is_valid else "flagged_by_policy"

policy_validator = PolicyValidator()
