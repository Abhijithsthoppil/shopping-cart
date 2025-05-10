# app/api/paytm.py
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import uuid, os, json
from paytmchecksum import PaytmChecksum

paytm_router = APIRouter()

MERCHANT_ID = os.getenv("PAYTM_MID")
MERCHANT_KEY = os.getenv("PAYTM_KEY")
WEBSITE = "WEBSTAGING"
CALLBACK_URL = ""

class PaytmInitiateRequest(BaseModel):
    amount: float

@paytm_router.post("/initiate")
def initiate_transaction(req: PaytmInitiateRequest):
    order_id = str(uuid.uuid4())
    body = {
        "requestType": "Payment",
        "mid": MERCHANT_ID,
        "websiteName": WEBSITE,
        "orderId": order_id,
        "callbackUrl": CALLBACK_URL,
        "txnAmount": {
            "value": f"{req.amount:.2f}",
            "currency": "INR"
        },
        "userInfo": {
            "custId": ""
        }
    }

    # Serialize and checksum
    body_str = json.dumps(body, separators=(",", ":"), sort_keys=True)
    try:
        checksum = PaytmChecksum.generateSignature(body_str, MERCHANT_KEY)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Checksum error: {e}")

    return JSONResponse(content={
        "orderId": order_id,
        "body": body,
        "signature": checksum
    })
