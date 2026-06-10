import { NextResponse } from "next/server";

// CORS validation & response helper
function createCorsResponse(status: number, data: any, origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-App-Handshake",
  };
  
  if (origin && (
    origin.startsWith("http://localhost:") ||
    origin.startsWith("http://127.0.0.1:") ||
    origin.endsWith(".pages.dev") ||
    origin.endsWith(".vercel.app") ||
    origin === "https://yujian.ceo" ||
    origin === "https://www.yujian.ceo"
  )) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "https://secured-system.local";
  }

  if (status === 204) {
    return new NextResponse(null, { status, headers });
  }

  return NextResponse.json(data, { status, headers });
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return createCorsResponse(204, null, origin);
}

// Convert Date object to Taiwan Local Time (UTC+8) format: YYYY/M/D 上午/下午 hh:mm:ss
function formatTaiwanDateTime(date: Date): string {
  const taipeiOffset = 8 * 60 * 60 * 1000;
  const localTime = new Date(date.getTime() + taipeiOffset);
  
  const year = localTime.getUTCFullYear();
  const month = localTime.getUTCMonth() + 1; // 0-based
  const day = localTime.getUTCDate();
  let hour = localTime.getUTCHours();
  const minute = localTime.getUTCMinutes();
  const second = localTime.getUTCSeconds();
  
  const dayPeriod = hour >= 12 ? '下午' : '上午';
  
  hour = hour % 12;
  if (hour === 0) {
    hour = 12;
  }
  
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  return `${year}/${month}/${day} ${dayPeriod} ${hour}:${pad(minute)}:${pad(second)}`;
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const handshake = request.headers.get("x-app-handshake") || "";

  // Verify handshake
  if (handshake !== "viralcopy-secure-handshake") {
    return createCorsResponse(
      403,
      { error: "伺服器拒絕存取：不安全的客戶端請求。請使用官方原版網頁進行存取。" },
      origin
    );
  }

  try {
    const reqBody = await request.json();
    const { id, email, name, picture, locale } = reqBody;

    if (!email || !name) {
      return createCorsResponse(400, { error: "無效的用戶登入認證資料。" }, origin);
    }

    // Resolve client IP (next.js request info)
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    console.log(`[AUTH LOGGER] User logged in: ${email} (${name}) from IP: ${ip} (ID: ${id || "unknown"})`);

    const gasUrl = process.env.GOOGLE_DRIVE_LOG_URL;
    if (gasUrl && !gasUrl.includes("您的_")) {
      try {
        const nowStr = formatTaiwanDateTime(new Date());
        
        const mappedPayload = {
          "帳戶標識": id || "UNKNOWN_" + new Date().getTime(),
          "電子郵件": email,
          "姓名": name,
          "個人基本資料": name,
          "頭像URL": picture || "",
          "語系": locale || "zh-TW",
          "國家": locale ? (locale.split('-')[1] || "TW") : "TW",
          "註冊時間": nowStr,
          "最後登入時間": nowStr,
          "最後登入時間2": nowStr,
          "登入次數": 1,
          "狀態": "正常",
          "權限角色": "一般使用者",
          "建立時間": nowStr,
          "更新時間": nowStr
        };

        const gasResponse = await fetch(gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(mappedPayload),
          redirect: 'follow'
        });

        if (!gasResponse.ok) {
          console.warn(`[AUTH LOGGER WARNING] Google Sheets GAS sync failed with status: ${gasResponse.status}`);
        } else {
          console.log(`[AUTH LOGGER SUCCESS] Login sync to Google Sheets completed.`);
        }
      } catch (gasErr: any) {
        console.error("[AUTH LOGGER ERROR] Failed to connect to Google Apps Script:", gasErr.message);
      }
    } else {
      console.warn("[AUTH LOGGER WARNING] GOOGLE_DRIVE_LOG_URL is not configured in production env!");
    }

    return createCorsResponse(200, { success: true, message: "登入日誌同步程序已啟動。" }, origin);
  } catch (error: any) {
    console.error("[SERVERLESS AUTH ERROR]:", error);
    return createCorsResponse(
      500,
      { error: `登入認證日誌處理失敗：${error.message || "內部伺服器錯誤"}` },
      origin
    );
  }
}
