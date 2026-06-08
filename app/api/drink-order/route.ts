import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Generate a unique order ID
    const today = new Date();
    const dateStr = today.getFullYear() + 
      (today.getMonth() + 1).toString().padStart(2, "0") + 
      today.getDate().toString().padStart(2, "0");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `DK-${dateStr}-${randomSuffix}`;
    
    // Estimate a dynamic waiting time between 10 to 25 minutes
    const waitTimeMinutes = 10 + Math.floor(Math.random() * 15);
    
    // Simulate order persistence and reply with receipt payload
    return NextResponse.json({
      success: true,
      orderId,
      status: "received",
      items: body.items,
      totalAmount: body.totalAmount,
      waitTimeMinutes,
      timestamp: new Date().toLocaleString("zh-TW", { timeZone: "Asia/Taipei" })
    });
  } catch (error) {
    console.error("Failed to process order API request:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process order payload" }, 
      { status: 400 }
    );
  }
}
