import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, transactionId } = body;

    // ✅ .env से दोनों अलग-अलग ID निकाल रहे हैं
    const merchantId = process.env.PHONEPE_MID?.trim(); 
    const clientId = process.env.PHONEPE_CLIENT_ID?.trim(); 
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET?.trim(); 
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION?.trim() || "1";
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://nandanicollection.com";

    // 1. Auth Token बनाना (Client ID इस्तेमाल करके)
    const authUrl = `https://api.phonepe.com/apis/identity-manager/v1/oauth/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&client_version=${clientVersion}`;
    
    const authRes = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    
    const authData = await authRes.json();
    
    if (!authData.access_token) {
        console.log("AUTH ERROR:", authData);
        return NextResponse.json({ error: "Auth failed with PhonePe", success: false });
    }

    // 2. Payment Request भेजना
    const payload = {
      merchantId: merchantId, // 👈 यहाँ MID जाएगी
      merchantOrderId: transactionId,
      amount: Math.round(amount * 100), 
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Nandani Collection Order",
        merchantUrls: {
          redirectUrl: `${baseUrl}/payment/status?id=${transactionId}`,
          callbackUrl: `${baseUrl}/payment/status?id=${transactionId}`
        }
      }
    };

    const PHONEPE_API_URL = "https://api.phonepe.com/apis/pg/checkout/v2/pay";

    const response = await fetch(PHONEPE_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `O-Bearer ${authData.access_token}`, 
      },
      body: JSON.stringify(payload),
    });

    const resData = await response.json();
    console.log("PHONEPE V2 PAY RESPONSE:", resData);

    if (resData.redirectUrl) {
      return NextResponse.json({ url: resData.redirectUrl, success: true });
    } else {
      return NextResponse.json({ error: "Payment initiation failed", success: false });
    }

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}