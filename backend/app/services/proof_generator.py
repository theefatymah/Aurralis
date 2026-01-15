class ProofGenerator:
    """
    Generate blockchain proof and explorer URLs
    """
    
    def generate_explorer_url(self, tx_hash: str) -> str:
        """
        Generate Arc Explorer URL from transaction hash
        """
        return f"https://arc-explorer.com/tx/{tx_hash}"
    
    def generate_proof_data(self, tx_hash: str, amount: float, recipient: str) -> dict:
        """
        Generate complete proof data structure
        """
        return {
            "tx_hash": tx_hash,
            "explorer_url": self.generate_explorer_url(tx_hash),
            "amount": amount,
            "currency": "USDC",
            "recipient": recipient,
            "status": "confirmed",
            "confirmations": 12,
            "steps": [
                {
                    "id": "validate",
                    "label": "Valid ating Policy",
                    "status": "completed"
                },
                {
                    "id": "transfer",
                    "label": "Moving USDC",
                    "status": "completed"
                },
                {
                    "id": "confirm",
                    "label": "Confirming on Arc",
                    "status": "completed"
                }
            ]
        }

proof_generator = ProofGenerator()
