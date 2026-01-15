import google.generativeai as genai
from app.config import settings
import re
import json

genai.configure(api_key=settings.gemini_api_key)

class IntentProcessor:
    def __init__(self):
        self.model = genai.GenerativeModel('gemini-pro')
    
    async def process_query(self, query: str, policy: dict) -> dict:
        """
        Process user query using Gemini to extract structured intent
        """
        system_prompt = f"""You are a financial AI assistant analyzing transaction requests.

Current Policy Limits:
- Max Transaction: ${policy.get('max_tx_amount', 1000)}
- Monthly Budget: ${policy.get('monthly_budget', 5000)}
- Current Monthly Spent: ${policy.get('current_monthly_spent', 0)}
- Approved Vendors: {', '.join(policy.get('allow_list', []))}

User Query: "{query}"

Extract the following information in JSON format:
1. amount: The transaction amount (number, no currency symbol)
2. currency: The currency (default: "USDC")
3. recipient: Generate a mock blockchain address or use vendor name
4. recipientName: The vendor/merchant name (e.g., "Stripe", "Circle")
5. reasoning: A brief explanation (2-3 sentences) of why this transaction is or isn't safe based on policy limits

If the query is not a transaction request, return null for amount.

Examples:
Query: "Send $50 to Stripe"
Response: {{"amount": 50, "currency": "USDC", "recipient": "0x1234abcd", "recipientName": "Stripe", "reasoning": "This $50 payment to Stripe is well within your $1,000 transaction limit and Stripe is on your approved vendor list. The transaction is safe to proceed."}}

Query: "Pay the dev $1500"
Response: {{"amount": 1500, "currency": "USDC", "recipient": "0x5678ef90",  "recipientName": "dev", "reasoning": "This $1,500 payment exceeds your maximum transaction limit of $1,000. This violates your policy and should be flagged for review."}}

Respond ONLY with valid JSON, no additional text.
"""
        
        try:
            response = self.model.generate_content(system_prompt)
            result = response.text.strip()
            
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', result, re.DOTALL)
            if json_match:
                intent_data = json.loads(json_match.group())
                
                # Generate mock address if needed
                if not intent_data.get('recipient') or intent_data['recipient'] == '':
                    import hashlib
                    hash_input = f"{intent_data.get('recipientName', 'unknown')}{intent_data.get('amount', 0)}"
                    address_hash = hashlib.md5(hash_input.encode()).hexdigest()[:8]
                    intent_data['recipient'] = f"0x{address_hash}...{address_hash[-4:]}"
                
                return intent_data
            else:
                # Fallback parsing
                return self._fallback_parse(query)
                
        except Exception as e:
            print(f"Gemini API error: {e}")
            return self._fallback_parse(query)
    
    def _fallback_parse(self, query: str) -> dict:
        """
        Fallback parser if Gemini fails
        """
        # Simple regex patterns
        amount_pattern = r'\$?(\d+(?:\.\d{2})?)'
        recipient_pattern = r'to\s+([a-zA-Z0-9]+)'
        
        amount_match = re.search(amount_pattern, query)
        recipient_match = re.search(recipient_pattern, query, re.IGNORECASE)
        
        if amount_match and recipient_match:
            amount = float(amount_match.group(1))
            recipient_name = recipient_match.group(1)
            
            import hashlib
            hash_input = f"{recipient_name}{amount}"
            address_hash = hashlib.md5(hash_input.encode()).hexdigest()[:8]
            
            return {
                "amount": amount,
                "currency": "USDC",
                "recipient": f"0x{address_hash}...{address_hash[-4:]}",
                "recipientName": recipient_name,
                "reasoning": f"Detected payment of ${amount} to {recipient_name}. Please review the transaction details and policy limits before approving."
            }
        
        return None

intent_processor = IntentProcessor()
