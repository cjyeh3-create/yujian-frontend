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

// Resilient Gemini fetcher with model fallback and basic retry
async function fetchGeminiWithFallback(
  geminiApiKey: string,
  modelList: string[],
  requestBody: any
): Promise<{ response: Response; modelUsed: string }> {
  let lastError: Error | null = null;
  
  for (const model of modelList) {
    try {
      console.log(`[INFO] Attempting to call Gemini API with model: ${model}`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(requestBody)
        }
      );

      if (response.ok) {
        console.log(`[SUCCESS] Gemini API responded successfully using model: ${model}`);
        return { response, modelUsed: model };
      }

      const errText = await response.text();
      lastError = new Error(`Model ${model} returned status ${response.status}. Detail: ${errText.substring(0, 150)}`);
      console.warn(`[WARN] Model ${model} call failed: ${lastError.message}`);
    } catch (err: any) {
      lastError = err;
      console.error(`[ERROR] Connection error for model ${model}:`, err);
    }
  }
  
  throw lastError || new Error("All Gemini models in fallback list failed to respond.");
}

// Default Analysis Fallback structure in case NVIDIA/Gemini completely fails
const getFallbackAnalysis = (text: string) => {
  return {
    theme: "職場",
    keywords: {
      psychological: ["投射性認同 (Projective Identification)", "期望效應 (Pygmalion Effect)", "認知偏差", "舒適圈效應", "社會比較理論", "稀缺心態"],
      tactics: ["高尚帽子法", "反向自尊綁架", "痛點重錘", "顛覆暗示", "情緒置幻", "高位定錨"],
      searchPhrases: ["如何突破職場瓶頸", "打破底層打工思維", "向上管理談判技巧", "職場情緒勒索應對", "高難度溝通話術", "職場狠人晉升術"]
    },
    topics: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `如何利用人性心戰打破第 ${i + 1} 種職場與家庭博弈，悄悄實現降維突圍！`,
      cat: i % 2 === 0 ? "狠人思維" : "職場管理"
    })),
    analysis: {
      positioning: "高段位人性剖析智囊，冷酷理智，引導眾生。",
      style: "極具穿透力，注重弱點突刺，直擊生存焦慮，反常識輸出。",
      linguistics: "多使用意志指令、金屬質感語彙、以及充滿博弈權謀的暗黑金句。",
      tone: "高位俯瞰、透徹冰冷、充滿不可挑戰的權威掌控感。",
      structure: "（引用原文「" + text.substring(0, 15) + "...」）對應了第一階段痛點引入；進而透過底層邏輯拆解與案例博弈完成轉化閉環。"
    }
  };
};

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

  let reqBody: any = null;
  try {
    reqBody = await request.json();
    const { action, provider, text, ...scriptParams } = reqBody;

    // ACTION 1: ANALYZE BENCHMARK COPYWRITING
    if (action === "analyze") {
      if (!text || typeof text !== "string") {
        return createCorsResponse(400, { error: "請輸入有效的對標文案內容" }, origin);
      }

      const systemInstruction = "你是一位世界頂級的『黑沙心戰』暗黑心理學行銷文案大師與權力關係智囊。你的專長是精準解構用戶左側輸入的這段『對標文案』物料，剖析其每句話底層的人性操縱代碼，並將其重組、仿寫成最具爆發力的爆款文案。請務必依據該具體文案進行結構、定位、詞彙和調性的多維度深度剖析。所有的分析內容必須針針見血地直指左邊的實際文字，拒絕泛泛而談的通用原原理。所有的生成部分，包括爆款選題標題等，必須皆使用繁體中文（zh-TW）。選題數量必須剛好為20個。";
      const prompt = `對標文案內容如下：\n"""\n${text}\n"""\n\n請對其進行爆款文案多維度深度解構與衍生策劃。`;

      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        return createCorsResponse(500, { error: "伺服器未配置 Gemini AI 存取金鑰，請聯繫管理員配置環境變數。" }, origin);
      }

      const responseSchema = {
        type: "OBJECT",
        properties: {
          theme: {
            type: "STRING",
            description: "對標文案的核心主要領域名稱，只能是一到二個字的詞，例如：'職場', '銷售', '家庭', '社交', '創業', '成長'"
          },
          keywords: {
            type: "OBJECT",
            properties: {
              psychological: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "6個精細提取、與該文案人性心理深度相關 of 心理學效應或認知偏差，例如：'投射性認同 (Projective Identification)'"
              },
              tactics: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "6個精準提取自本篇對標文案的暗黑說服力或情感操縱戰術名，例如：'高尚帽子法', '反向自尊綁架'"
              },
              searchPhrases: {
                type: "ARRAY",
                items: { type: "STRING" },
                description: "6個依據本篇文意語境深度生成、可用於搜尋同類高轉化爆款的長尾關鍵詞"
              }
            },
            required: ["psychological", "tactics", "searchPhrases"]
          },
          topics: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "INTEGER" },
                title: { type: "STRING", description: "衍生設計的好標題，字數約30-50字，切入點犀利扎心，充滿反直覺觀點、強烈的情感和痛點刺激，能激發點擊率" },
                cat: { type: "STRING", description: "本選題的細分類目，例如：'職場管理', '狠人思維', '逆向金句', '高轉化文案', '家庭博弈'" }
              },
              required: ["id", "title", "cat"]
            },
            description: "精準策劃的20個衍生爆款選題，必須剛好是20個，編號從1到20"
          },
          analysis: {
            type: "OBJECT",
            properties: {
              positioning: { type: "STRING", description: "精準分析該篇對標發言人的賬號定位與強者人設，必須直接引用並針對此篇對標文案內容分析，字數約 50-120 字。" },
              style: { type: "STRING", description: "分析本篇文案的寫作說服風格特點（如何切入痛點、反常識輸出特點），必須結合左側文字，字數約 50-120 字。" },
              linguistics: { type: "STRING", description: "提取本篇文案的語言表達與金句習慣。精準指出其中具備強大博弈張力的特定語句 and 高頻詞，字數約 50-120 字。" },
              tone: { type: "STRING", description: "析本篇文案的情緒調性與心理對抗姿態（如高位俯瞰、不可挑戰的掌控感），必須結合具體文脈，字數約 50-120 字。" },
              structure: { type: "STRING", description: "【重要：必須精準依據左側當前輸入的原始文案句子 and 語境，直接引用左側原始字句進行細緻的大步驟剖析！】請列出例如『（引用原文「...」）對應了第一階段痛點引入；（引用原文「...」）對應第二階段底層邏輯拆解』等脈絡分解，展示其起承轉合的黃金說服脈絡骨架。字數約 120-250 字。" }
            },
            required: ["positioning", "style", "linguistics", "tone", "structure"]
          }
        },
        required: ["theme", "keywords", "topics", "analysis"]
      };

      const models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-latest"];
      const { response: geminiResponse } = await fetchGeminiWithFallback(
        geminiApiKey,
        models,
        {
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
            responseSchema: responseSchema
          }
        }
      );

      const data: any = await geminiResponse.json();
      const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error("Gemini AI API 傳回了空內容");
      }

      const resultObj = JSON.parse(responseText.trim());
      return createCorsResponse(200, resultObj, origin);
    }

    // ACTION 2: GENERATE COPYWRITING SCRIPT
    else if (action === "generate-script") {
      const {
        topicTitle,
        topicCat,
        targetLength,
        benchmarkContext,
        theme,
        keywords,
        analysis,
        collectedKeywords
      } = scriptParams;

      if (!topicTitle) {
        return createCorsResponse(400, { error: "請指定要生成的選題標題" }, origin);
      }

      const themeVal = theme || "通用人性";
      const psychologicalKws = (keywords && keywords.psychological && keywords.psychological.length > 0)
        ? keywords.psychological.join("、")
        : "認知偏誤、權力非對稱";
      const tacticsKws = (keywords && keywords.tactics && keywords.tactics.length > 0)
        ? keywords.tactics.join("、")
        : "顛覆暗示、情緒置幻、高位人設置換";
      const collectedKwsStr = collectedKeywords ? collectedKeywords.trim() : "";

      const positioningVal = (analysis && analysis.positioning) ? analysis.positioning : "高段位人性剖析智囊，冷酷理智，俯瞰眾生。";
      const styleVal = (analysis && analysis.style) ? analysis.style : "極具穿透力，注重弱點突刺，直擊生存焦慮，反常識輸出。";
      const linguisticsVal = (analysis && analysis.linguistics) ? analysis.linguistics : "多使用意志指令、金屬質感語彙、以及充滿博弈權謀的暗黑金句。";
      const toneVal = (analysis && analysis.tone) ? analysis.tone : "高位俯瞰、透徹冰冷、充滿不可挑戰的權威掌控感。";
      const structureVal = (analysis && analysis.structure) ? analysis.structure : "顛覆認知 -> 底層邏輯 -> 案例博弈 -> 執行清單 -> 金句收尾。";

      const systemInstruction = `你是一位世界頂級的『黑沙心戰』暗黑心理學行銷文案大師與權力關係智囊。你受委託為爆款選題撰寫一篇大師級的行銷與人性說服文案正文。
請確保整篇文案展現出極致冷酷、對人性透析、具備顛覆性認知的『黑沙心戰』繁體中文文風。
你編寫的正文，必須深入融合與扣緊用戶提供的【1~3步驟對標數據】：
- 你的主體思想、文風必須與『步驟3：發言人定位、說服風格、語言習慣、情緒調性、黃金說服脈絡骨架』強烈對標並緊密結合，使文章渾然天成。
- 你的底層心理解釋必須完美帶入『步驟1：心理效應與暗黑戰術』，且融匯用戶特選/指定的關鍵詞。
- 你的選題標題及細分類目對標自『步驟2：爆款衍生選題』。

【神級寫作與文風規範】
1. **文字姿態**：語氣絕對自信、帶有俯瞰感，多使用語氣堅定的指令型短句（如『錯了』決不吝嗇、『聽懂這一點』、『你要記住』）、反問句 and 金屬質感、博弈感的暗黑字眼（如『手術刀』、『慢性毒藥』、
『底層代碼』環境變數，『強行關閉接收器』，『情緒置幻』，『自戀供養』，『高位人設置換』）。
2. **正文架構**：必須嚴格遵循以下黃金說服骨架，並且在輸出的繁體正文中明確保留下列標籤分段：
   - **【顛覆痛點引入】**：用刺進骨髓的痛點與反其道而行之的斷言，徹底敲擊普通人的好好防衛，指出致命錯誤。
   - **【底層邏輯拆解】**：拋出專業的心理學效應或認知偏見作為思維核彈，深層次解釋人性運作機理和為什麼常規思維只能挨宰。務必點題對標『步驟1』的核心心理效應。
   - **【實操案例落地】**：分享 1 到 2 個高爽感、富有畫面感與細節的現實博弈對比案例。可以圍繞職場老闆 and 部屬（工廠老王、老李、李工、老王）、家庭伴侶（家務博弈、老婆、倒垃圾等）或客戶推銷、限時優惠等。
   - **【具體執行清單】**：給出 2 到 3 個直接上手的指令式文案 and 通話/溝通行動技巧（要有對白、具體話術細節，富有實用度）。
   - **【結尾金句昇華與轉化閉環】**：用極具哲理、冷峻的高逼格比喻收尾與昇華，引導讀者進行高段位的認知與思維淬煉，引發強烈共鳴並提升轉化。切記：此處【絕對不能】出現任何推廣特定產品、課程、付費鏈接或『當然，掌握這套邏輯只是拿到了一把鑰匙……狠人進化論……就等於掌控了所有人的選擇！』等相關的特定行銷與宣傳導流段落，請純粹以高深冰冷、發人省思的哲理金句完美收官。

3. **字數要求**：文案總體長度必須在繁體 ${targetLength || 1500} 字左右，情節高潮迭起，思想含金量極高。
請返回純文字正文結構，不需使用 Markdown 程式碼塊符號（如 \`\`\` ），直接輸出排版優雅的文字正文。`;

      const prompt = `【心戰仿寫對標指南與背景數據】
1. 當前對標領域（步驟1對標）：【${themeVal}】
2. 當前選定的爆款衍生選題（步驟2對標）：【${topicTitle}】（細分類目：${topicCat || "心戰爆款"}）
3. 心戰關鍵詞與暗黑操縱戰術（步驟1對標）：
   - 核心心理學效應或認知偏差：${psychologicalKws}
   - 暗黑說服或情感洗腦戰術：${tacticsKws}
   ${collectedKwsStr ? `- 用戶特選/指定的核心關鍵詞密碼（必須主動融合）：\n"""\n${collectedKwsStr}\n"""` : ""}
4. 爆款架擴拆解分析報告對標（步驟3對標）：
   - 發言人與賬號定位：""" ${positioningVal} """
   - 內容說服風格特點：""" ${styleVal} """
   - 語言表達與金句習慣：""" ${linguisticsVal} """
   - 情緒調性與讀者心理姿態：""" ${toneVal} """
   - 黃金說服脈絡骨架：""" ${structureVal} """

5. 原始對標參考文案：
"""
${benchmarkContext || ""}
"""

請在此對標要求和背景下，為選題標題 【${topicTitle}】 生成一篇 ${targetLength || 1500}字左右的大師級行銷與人性說服文案正文。`;

      const geminiApiKey = process.env.GEMINI_API_KEY;
      if (!geminiApiKey) {
        return createCorsResponse(500, { error: "伺服器未配置 Gemini AI 存取金鑰，請聯繫管理員配置環境變數。" }, origin);
      }

      const models = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-flash-latest"];
      const { response: geminiResponse } = await fetchGeminiWithFallback(
        geminiApiKey,
        models,
        {
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { temperature: 0.8 }
        }
      );

      const data: any = await geminiResponse.json();
      const script = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return createCorsResponse(200, { script }, origin);
    }

    else {
      return createCorsResponse(400, { error: "無效的行為操作類型" }, origin);
    }

  } catch (error: any) {
    console.error("[API ERROR]:", error);
    // Return fallback analysis if action is analyze
    try {
      if (reqBody && reqBody.action === "analyze" && reqBody.text) {
        console.warn("[WARN] Gemini API call failed. Using local fallback analysis.");
        const fallback = getFallbackAnalysis(reqBody.text);
        return createCorsResponse(200, fallback, origin);
      }
    } catch (e) {
      console.error("[FALLBACK ERROR]:", e);
    }

    return createCorsResponse(
      500,
      { error: `AI 服務暫時無法回應：${error.message || "內部伺服器錯誤"}` },
      origin
    );
  }
}
