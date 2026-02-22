import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const reqUrl = new URL(req.url);
    const transactionId = reqUrl.searchParams.get("id");

    if (!transactionId) {
      return NextResponse.json({ error: "Transaction ID missing" }, { status: 400 });
    }

    const clientId = process.env.PHONEPE_CLIENT_ID?.trim(); 
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET?.trim();
    const clientVersion = process.env.PHONEPE_CLIENT_VERSION?.trim() || "1";

    // 1. Auth Token दोबारा लेना
    const authUrl = `https://api.phonepe.com/apis/identity-manager/v1/oauth/token?grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}&client_version=${clientVersion}`;
    
    const authRes = await fetch(authUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });
    const authData = await authRes.json();

    // 2. असली Status Check करना
    const statusUrl = `https://api.phonepe.com/apis/pg/checkout/v2/order/${transactionId}/status`;

    const response = await fetch(statusUrl, {
      method: "GET",
      headers: {
        "accept": "application/json",
        "Authorization": `O-Bearer ${authData.access_token}`,
      },
    });

    const resData = await response.json();
    console.log("PHONEPE V2 STATUS:", resData);
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://nandanicollection.com";

    if (resData.state === "COMPLETED") {
      return Response.redirect(`${baseUrl}/checkout/success?id=${transactionId}`, 303);
    } else {
      return Response.redirect(`${baseUrl}/checkout/failed`, 303);
    }

  } catch (error: any) {
    console.error("Status Error:", error);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://nandanicollection.com";
    return Response.redirect(`${baseUrl}/checkout/failed`, 303);
  }
}

export async function GET(req: Request) {
  return POST(req);
}