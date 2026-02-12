import random
import requests

def generate_otp():
    """6 digit ka random OTP banata hai"""
    return str(random.randint(100000, 999999))

def send_otp_sms(phone_number, otp):
    """
    Fast2SMS API Integration - Updated with Full API Key
    """
    try:
        # ✅ Aapki ASLI aur PURI API Key
        API_KEY = "W0BE4X6LlGFyIdhVOitwCx1rcUTpHDuYJoqN3m7gzek829ZbnfWghJpovSRG9El6ndP7MFI8squ1KXZN"
        
        url = "https://www.fast2sms.com/dev/bulkV2"
        
        # Phone number se +91 hatana (Fast2SMS 10 digit leta hai)
        clean_phone = phone_number.replace("+91", "").strip()
        
        # ✅ Correct Payload for Quick SMS (OTP Route)
        payload = {
            "route": "otp",
            "variables_values": otp,
            "numbers": clean_phone
        }
        
        headers = {
            "authorization": API_KEY,
            "Content-Type": "application/json"
        }

        print(f"📡 Sending OTP {otp} to {clean_phone} via Fast2SMS...")

        # POST Request bhejo
        response = requests.post(url, json=payload, headers=headers)
        
        # Response check karo
        if response.status_code == 200:
            return True
        else:
            print(f"❌ SMS Failed: {response.text}")
            return False

    except Exception as e:
        print(f"❌ SMS Error: {str(e)}")
        return False