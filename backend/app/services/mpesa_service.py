import requests
import base64
from datetime import datetime
import json
import os
from dotenv import load_dotenv

load_dotenv()

class MpesaService:
    def __init__(self):
        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY', 'your_consumer_key_here')
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET', 'your_consumer_secret_here')
        self.business_shortcode = os.getenv('MPESA_BUSINESS_SHORTCODE', '174379')
        self.passkey = os.getenv('MPESA_PASSKEY', 'your_passkey_here')
        self.callback_url = os.getenv('MPESA_CALLBACK_URL', 'https://yourdomain.com/api/mpesa-callback')
        self.environment = os.getenv('MPESA_ENVIRONMENT', 'sandbox')  # sandbox or production
        
        if self.environment == 'sandbox':
            self.base_url = 'https://sandbox.safaricom.co.ke'
        else:
            self.base_url = 'https://api.safaricom.co.ke'
    
    def get_access_token(self):
        """Get M-Pesa access token"""
        try:
            url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
            auth_string = f"{self.consumer_key}:{self.consumer_secret}"
            encoded_auth = base64.b64encode(auth_string.encode()).decode()
            
            headers = {
                'Authorization': f'Basic {encoded_auth}'
            }
            
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            return data.get('access_token')
            
        except Exception as e:
            print(f"Error getting access token: {str(e)}")
            return None
    
    def stk_push(self, phone_number, amount, account_reference, transaction_desc):
        """Initiate STK Push"""
        try:
            access_token = self.get_access_token()
            if not access_token:
                return None, "Failed to get access token"
            
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            password = base64.b64encode(
                f"{self.business_shortcode}{self.passkey}{timestamp}".encode()
            ).decode()
            
            payload = {
                "BusinessShortCode": self.business_shortcode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone_number,
                "PartyB": self.business_shortcode,
                "PhoneNumber": phone_number,
                "CallBackURL": self.callback_url,
                "AccountReference": account_reference,
                "TransactionDesc": transaction_desc
            }
            
            url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            response = requests.post(url, json=payload, headers=headers, timeout=30)
            response_data = response.json()
            
            if response.status_code == 200:
                return response_data, None
            else:
                return None, response_data.get('errorMessage', 'STK Push failed')
                
        except Exception as e:
            print(f"Error in STK Push: {str(e)}")
            return None, str(e)