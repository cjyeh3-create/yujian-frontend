import React from "react";
import AppStoreDashboard from "@/components/AppStoreDashboard";
import { WooCommerceProduct } from "@/components/ProductCard";

// High-quality mock apps data used as fallback when API credentials are not set
const mockApps: WooCommerceProduct[] = [
  {
    id: 101,
    name: "魚見 AI 監控助手 (FishEye AI Monitor)",
    price: "1280",
    regular_price: "1980",
    sale_price: "1280",
    images: [
      { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", alt: "FishEye AI Monitor" }
    ],
    stock_status: "instock",
    short_description: "利用 AI 即時影像辨識技術，自動計算養殖池內魚隻數量、估算體重，並即時監測魚群活動力與異常攝食行為。",
    description: "<p>魚見 AI 監控助手是專門針對高價值水產養殖開發的邊緣運算 AI 軟體。它能直接讀取您現有的防水網路攝影機 (RTSP) 串流，透過 YOLOv8 與卷積神經網路演算法，24 小時不間斷偵測魚隻動態。不需人工撈捕，即可智慧估算池內魚隻平均體重、游動速率，並在發現活動力下滑或搶食異常時，第一時間傳送 App 與 LINE 警報通知。</p>",
    categories: [{ id: 1, name: "智慧監控" }],
    meta_data: [
      { key: "_app_version", value: "v2.1.0" },
      { key: "_app_rating", value: "4.9" },
      { key: "_app_downloads", value: "3.5k" },
      { key: "_app_platforms", value: "Web, iOS, Android" }
    ]
  },
  {
    id: 102,
    name: "AquaPredict 水質預測大師",
    price: "950",
    regular_price: "1200",
    sale_price: "950",
    images: [
      { src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80", alt: "AquaPredict" }
    ],
    stock_status: "instock",
    short_description: "對接池底多感測器，透過大數據演算法，提前 24 小時預測溶氧量、pH 值與氨氮濃度變化，防止集體缺氧事件。",
    description: "<p>AquaPredict 透過串接多通道物聯網水質偵測儀，能即時收集溶解氧 (DO)、pH 值、氧化 redox 電位 (ORP)、溫度及電導率等環境數據。內置 AI 預測模型，能分析歷史日誌，在水質因子跌落臨界點前 24 小時進行氣候交叉比對，發出溶氧或酸化風險警告，給予養殖主充足時間啟動水車或投入水質改良劑。</p>",
    categories: [{ id: 2, name: "數據分析" }],
    meta_data: [
      { key: "_app_version", value: "v1.8.4" },
      { key: "_app_rating", value: "4.8" },
      { key: "_app_downloads", value: "2.8k" },
      { key: "_app_platforms", value: "Web, Android" }
    ]
  },
  {
    id: 103,
    name: "OceanCast 航海氣象專家",
    price: "0",
    regular_price: "0",
    sale_price: "",
    images: [
      { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80", alt: "OceanCast" }
    ],
    stock_status: "instock",
    short_description: "為遠洋與近海捕撈量身打造。提供高解析度風浪、流速、流向及海溫圖層，整合颱風預警與避風港導航。",
    description: "<p>OceanCast 航海氣象專家整合 NOAA、ECMWF 等國際權威氣象機構之全球海洋氣象數據，提供漁船駕駛艙平板離線下載服務。支援風速風向、浪高浪向、洋流速度流向、海表溫度等高精度網格預報，協助船長優化航路、節省油耗、規避風浪威脅，並精準鎖定最適水溫漁場。</p>",
    categories: [{ id: 3, name: "氣象與預警" }],
    meta_data: [
      { key: "_app_version", value: "v3.0.2" },
      { key: "_app_rating", value: "4.7" },
      { key: "_app_downloads", value: "12.4k" },
      { key: "_app_platforms", value: "iOS, Android" }
    ]
  },
  {
    id: 104,
    name: "漁見 ERP 智慧銷存系統",
    price: "3600",
    regular_price: "4500",
    sale_price: "3600",
    images: [
      { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80", alt: "Fishery ERP" }
    ],
    stock_status: "instock",
    short_description: "專為水產貿易與養殖業設計的 ERP。涵蓋魚獲入庫、冷鏈履歷追蹤、即時報價與多通路銷售對帳單生成。",
    description: "<p>漁見 ERP 是國內少數專為水產業客製化的銷存系統。功能涵蓋每日撈捕量入庫、分級規格管理、急速冷凍/加工製程追蹤、智慧冷鏈物流派單、以及各批發批零售通路對帳。系統能與電子秤、條碼掃描槍直接對接，有效解決紙本抄寫易出錯、庫存不準確等產業痛點。</p>",
    categories: [{ id: 4, name: "生產與管理" }],
    meta_data: [
      { key: "_app_version", value: "v1.2.0" },
      { key: "_app_rating", value: "4.6" },
      { key: "_app_downloads", value: "1.2k" },
      { key: "_app_platforms", value: "Web, Windows, macOS" }
    ]
  },
  {
    id: 105,
    name: "AquaDrone 潛航操控 App",
    price: "1990",
    regular_price: "2500",
    sale_price: "1990",
    images: [
      { src: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80", alt: "AquaDrone Pilot" }
    ],
    stock_status: "instock",
    short_description: "搭配水下遙控無人機 (ROV) 使用。支援低延遲 4K 串流、水底網籠破損自動標記及深海環境參數監測儀錶板。",
    description: "<p>AquaDrone Pilot 是一款高精度的水下遙控設備 (ROV) 控制 App。通過平板或電腦連線，能提供低延遲 4K 水底監控實時畫面，並利用邊緣運算自動識別網籠破洞、浮力球漏氣、或網底魚類殘骸堆積情況，防範逃魚危機，是箱網養殖業者不可或缺的黑科技。</p>",
    categories: [{ id: 1, name: "智慧監控" }],
    meta_data: [
      { key: "_app_version", value: "v1.1.5" },
      { key: "_app_rating", value: "4.9" },
      { key: "_app_downloads", value: "850" },
      { key: "_app_platforms", value: "iOS, Android, Windows" }
    ]
  },
  {
    id: 106,
    name: "TraceChain 履歷區塊鏈對接器",
    price: "1500",
    regular_price: "1500",
    sale_price: "",
    images: [
      { src: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80", alt: "TraceChain" }
    ],
    stock_status: "instock",
    short_description: "一鍵將捕撈紀錄、低溫感測日誌與檢驗報告加密寫入區塊鏈，為消費者提供不可篡改的安心水產履歷。",
    description: "<p>TraceChain 連接器旨在為水產品建立真實誠信的身分證。系統能無縫擷取物聯網貨卡 GPRS 溫度計數據，將出貨點、運輸溫度日誌、重金屬檢驗合格報告等關鍵資訊簽章並上鏈。消費者掃描產品 QR Code 即可一目了然，樹立高規水產的品牌透明度。</p>",
    categories: [{ id: 4, name: "生產與管理" }],
    meta_data: [
      { key: "_app_version", value: "v2.0.1" },
      { key: "_app_rating", value: "4.5" },
      { key: "_app_downloads", value: "1.9k" },
      { key: "_app_platforms", value: "Web" }
    ]
  },
  {
    id: 107,
    name: "商品文案生成 (AI Product Copywriter)",
    price: "690",
    regular_price: "990",
    sale_price: "690",
    images: [
      { src: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80", alt: "Product Copywriter" }
    ],
    stock_status: "instock",
    short_description: "專為水產電商與零售商設計的 AI 文案工具。輸入產品規格與特色，即可在 5 秒內生成吸引人的社群貼文、電商詳情頁與廣告文案。",
    description: "<p>商品文案生成是一款基於最新語言模型的 AI 寫作助手。針對漁獲、加工水產、以及周邊設備，內建多種專業行銷框架（如 AIDA、PAS）。只需輸入基礎規格（如產地、重量、口感、冷凍方式），AI 即可自動撰寫符合品牌調性的繁體中文行銷文案，大幅縮短上架時間與行銷成本。</p>",
    categories: [{ id: 5, name: "行銷與內容" }],
    meta_data: [
      { key: "_app_version", value: "v1.2.0" },
      { key: "_app_rating", value: "4.8" },
      { key: "_app_downloads", value: "1.5k" },
      { key: "_app_platforms", value: "Web" }
    ]
  },
  {
    id: 108,
    name: "報價單生成 (Smart Quotation)",
    price: "450",
    regular_price: "600",
    sale_price: "450",
    images: [
      { src: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80", alt: "Smart Quotation" }
    ],
    stock_status: "instock",
    short_description: "快速建立與管理水產貿易報價單。支援多幣別換算、即時稅率計算，並能一鍵匯出 PDF 或生成線上專屬報價連結。",
    description: "<p>報價單生成系統讓批發商與貿易商擺脫繁瑣的 Word 與 Excel 手工報價。本系統內建多套美觀的漁業貿易報價範本，支援依據歷史庫存與即時行情自動帶入產品價格，並可彈性設定批量折扣、運費估算、以及付款條款。一鍵產生 PDF 檔案或專屬加密網址，方便客戶直接在線上確認回覆。</p>",
    categories: [{ id: 4, name: "生產與管理" }],
    meta_data: [
      { key: "_app_version", value: "v1.0.8" },
      { key: "_app_rating", value: "4.6" },
      { key: "_app_downloads", value: "820" },
      { key: "_app_platforms", value: "Web, iOS, Android" }
    ]
  },
  {
    id: 109,
    name: "庫存管理 (Inventory Hub)",
    price: "1500",
    regular_price: "1800",
    sale_price: "1500",
    images: [
      { src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80", alt: "Inventory Hub" }
    ],
    stock_status: "instock",
    short_description: "多倉庫、冷鏈溫控批次庫存追蹤。整合進銷存數據，支援安全庫存水位警報，讓您精準掌控活魚及凍品即時庫存。",
    description: "<p>庫存管理系統專為冷凍水產與生鮮批發設計。支援跨多個倉庫、冷凍庫進行分區管理。特有的批次追蹤機制，能與溫度感測器結合，追蹤每一批產品的入庫時間、有效期限（FIFO 規則）以及保存狀態。當庫存低於預設水位時，系統會自動發出補貨通知，防止庫存短缺影響銷售。</p>",
    categories: [{ id: 4, name: "生產與管理" }],
    meta_data: [
      { key: "_app_version", value: "v2.3.1" },
      { key: "_app_rating", value: "4.9" },
      { key: "_app_downloads", value: "2.1k" },
      { key: "_app_platforms", value: "Web, iOS, Android" }
    ]
  },
  {
    id: 110,
    name: "客戶管理 (Client Relationship Manager)",
    price: "880",
    regular_price: "1200",
    sale_price: "880",
    images: [
      { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop&q=80", alt: "Client Relationship Manager" }
    ],
    stock_status: "instock",
    short_description: "完整記錄水產買家與契作農戶資料。追蹤歷次採購喜好、報價紀錄與信用額度，精準進行二次行銷與關係維護。",
    description: "<p>客戶管理系統協助您整合散亂的通訊錄與客戶名單。系統能記錄各家批發商、餐廳、量販店的採購週期與特定規格偏好（如魚隻重量級距、包裝規格）。內建信用額度控管與未收帳款催收提醒，並能分析客戶流失風險，協助業務團隊精準拜訪，提昇客單價與回購率。</p>",
    categories: [{ id: 4, name: "生產與管理" }],
    meta_data: [
      { key: "_app_version", value: "v1.6.2" },
      { key: "_app_rating", value: "4.7" },
      { key: "_app_downloads", value: "1.1k" },
      { key: "_app_platforms", value: "Web, iOS" }
    ]
  },
  {
    id: 111,
    name: "產銷履歷查詢 (Traceability Query)",
    price: "0",
    regular_price: "0",
    sale_price: "",
    images: [
      { src: "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=600&auto=format&fit=crop&q=80", alt: "Traceability Query" }
    ],
    stock_status: "instock",
    short_description: "提供給末端消費者與通路的履歷展示面板。掃描 QR 碼即可查詢養殖水質、投料紀錄、捕撈日期與食品檢驗證書。",
    description: "<p>產銷履歷查詢是面向終端市場的透明度工具。與後台的生產日誌無縫串接，自動將養殖過程中的水質監測、藥檢合格報告、以及捕撈冷凍時間，轉化為消費者易讀的動態圖表。消費者掃描包裝上的 QR Code 即可進入此頁面，增強品牌信任感，提高產品溢價空間。</p>",
    categories: [{ id: 4, name: "生產與管理" }],
    meta_data: [
      { key: "_app_version", value: "v1.4.5" },
      { key: "_app_rating", value: "4.5" },
      { key: "_app_downloads", value: "5.4k" },
      { key: "_app_platforms", value: "Web, iOS, Android" }
    ]
  },
  {
    id: 112,
    name: "LINE客服 (LINE Chat Integration)",
    price: "1200",
    regular_price: "1800",
    sale_price: "1200",
    images: [
      { src: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=600&auto=format&fit=crop&q=80", alt: "LINE Chat Integration" }
    ],
    stock_status: "instock",
    short_description: "串接 LINE 官方帳號，實現漁友與買家即時溝通。支援 AI 自動回覆常見問答、群發訊息精準推播與多人共同客服管理。",
    description: "<p>LINE客服連線模組是您與本地買家、合作漁民最貼近的溝通管道。系統能整合 LINE 官方帳號 (LINE OA)，提供多人協同對話介面。您可以為客戶標記標籤（如：活蝦買家、契作戶），進行分眾訊息推播。支援自訂快速回覆範本與 AI 初步篩選過濾，大幅減輕線上人工客服負擔。</p>",
    categories: [{ id: 6, name: "客服與支援" }],
    meta_data: [
      { key: "_app_version", value: "v2.1.0" },
      { key: "_app_rating", value: "4.8" },
      { key: "_app_downloads", value: "1.7k" },
      { key: "_app_platforms", value: "Web, Android, iOS" }
    ]
  },
  {
    id: 113,
    name: "內容生成 (AI Content Creator)",
    price: "890",
    regular_price: "1250",
    sale_price: "890",
    images: [
      { src: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80", alt: "AI Content Creator" }
    ],
    stock_status: "instock",
    short_description: "AI 撰寫漁業部落格、食譜介紹、產地故事與電子報。一鍵生成 SEO 友善的優質內容，輕鬆吸引消費者與通路商關注。",
    description: "<p>內容生成工具是為水產品牌經營自媒體而生的 AI 工具。系統內建多種漁業行銷模板，例如：『海鮮烹飪指南』、『產地旬魚故事』、『永續漁業倡議』等。您只需提供關鍵字，AI 即可在數秒內產出排版良好、引人入勝的長篇文章或社群短影音腳本，大幅提昇網站流量與品牌聲量。</p>",
    categories: [{ id: 5, name: "行銷與內容" }],
    meta_data: [
      { key: "_app_version", value: "v1.5.0" },
      { key: "_app_rating", value: "4.7" },
      { key: "_app_downloads", value: "950" },
      { key: "_app_platforms", value: "Web" }
    ]
  },
  {
    id: 114,
    name: "客服系統 (Support Desk Pro)",
    price: "1990",
    regular_price: "2600",
    sale_price: "1990",
    images: [
      { src: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=600&auto=format&fit=crop&q=80", alt: "Support Desk Pro" }
    ],
    stock_status: "instock",
    short_description: "整合網頁線上對談、Email、電話工單的全管道客服中心。支援智慧分流與工單進度追蹤，提昇售後服務滿意度。",
    description: "<p>客服系統 (Support Desk Pro) 為水產冷凍物流、設備供應商提供專業的售後工單管理。當買家回報出貨瑕疵、配送延遲或設備故障時，系統會自動建立追蹤工單，並根據權責分派給品管、物流或工程部門。內建 SLA 時效警告，確保每位客戶的詢問都能在黃金時間內得到妥善處置。</p>",
    categories: [{ id: 6, name: "客服與支援" }],
    meta_data: [
      { key: "_app_version", value: "v3.0.1" },
      { key: "_app_rating", value: "4.6" },
      { key: "_app_downloads", value: "1.2k" },
      { key: "_app_platforms", value: "Web, Windows, macOS" }
    ]
  },
  {
    id: 115,
    name: "知識庫 (Smart Wiki & FAQ)",
    price: "490",
    regular_price: "750",
    sale_price: "490",
    images: [
      { src: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&auto=format&fit=crop&q=80", alt: "Smart Wiki & FAQ" }
    ],
    stock_status: "instock",
    short_description: "建立內部養殖技術手冊、SOP 規範，或外部客戶常見問題集。強大語意搜尋功能，協助員工與買家快速解惑。",
    description: "<p>知識庫系統是累積企業智慧資產的數位圖書館。對內，可建立養殖場操作 SOP（如：水車故障排除、飼料投餵標準）、新進員工教育訓練手冊；對外，可作為公開的 FAQ 專區，解答買家關於出貨天數、溫控說明、退換貨原則等疑問，支援智慧模糊檢索，快速找到正確資訊。</p>",
    categories: [{ id: 6, name: "客服與支援" }],
    meta_data: [
      { key: "_app_version", value: "v1.1.2" },
      { key: "_app_rating", value: "4.5" },
      { key: "_app_downloads", value: "1.1k" },
      { key: "_app_platforms", value: "Web" }
    ]
  },
  {
    id: 116,
    name: "影片剪輯 (Cloud Video Editor)",
    price: "1200",
    regular_price: "1800",
    sale_price: "1200",
    images: [
      { src: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80", alt: "Cloud Video Editor" }
    ],
    stock_status: "instock",
    short_description: "瀏覽器直接運作的輕量影片剪輯工具。內建智慧字幕生成、背景音樂庫及海鮮商品行銷影片模板，剪影片免安裝。",
    description: "<p>影片剪輯軟體專為沒有專業剪輯基礎的電商與自媒體人員設計。支援將手機錄製的產地捕撈、加工流程、烹飪示範等影片上傳，在網頁端即可快速裁切、加入轉場效果與音樂。內建高準確度語音轉文字功能，一鍵產生中文字幕，並提供多種為社群媒體最佳化的直式與橫式輸出格式。</p>",
    categories: [{ id: 5, name: "行銷與內容" }],
    meta_data: [
      { key: "_app_version", value: "v2.0.2" },
      { key: "_app_rating", value: "4.7" },
      { key: "_app_downloads", value: "2.3k" },
      { key: "_app_platforms", value: "Web, macOS, Windows" }
    ]
  },
  {
    id: 117,
    name: "AI數據分析 (AI Analytics Engine)",
    price: "2500",
    regular_price: "3500",
    sale_price: "2500",
    images: [
      { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80", alt: "AI Analytics Engine" }
    ],
    stock_status: "instock",
    short_description: "連接您的資料庫或匯入 Excel 報表，由 AI 自動探索數據規律、繪製趨勢圖，並以自然語言回答您的業務分析問題。",
    description: "<p>AI數據分析平台能將生硬的數字轉化為實用的經營洞察。只需將水溫溶氧日誌、飼料消耗表、或是銷售對帳單導入，AI 即可自動偵測異常值、分析各池飼料轉化率 (FCR) 趨勢、或預測未來月份的產品銷量。支援對話式分析，像聊天一樣輸入：『幫我找出上個月銷售額最高的產品與客戶組合』，即時為您生成報表與分析結論。</p>",
    categories: [{ id: 2, name: "數據分析" }],
    meta_data: [
      { key: "_app_version", value: "v2.0.0" },
      { key: "_app_rating", value: "4.9" },
      { key: "_app_downloads", value: "3.2k" },
      { key: "_app_platforms", value: "Web, macOS" }
    ]
  },
  {
    id: 118,
    name: "AI Agent 智慧代理 (FishAgent)",
    price: "3200",
    regular_price: "4500",
    sale_price: "3200",
    images: [
      { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", alt: "FishAgent" }
    ],
    stock_status: "instock",
    short_description: "自主運作的漁業智慧助手。24 小時監控氣象與設備異常，能自動規劃應對任務並回報進度。",
    description: "<p>AI Agent (FishAgent) 是下一代的自主自動化工具。它不只被動接收警報，還能主動思考與執行任務。例如當氣象預警系統發布颱風警告時，AI Agent 會自動比對當前庫存與船期，撰寫客戶延遲出貨聲明草稿、提醒養殖場經理固定防颱網具，並排定颱風期間發電機自我檢測行程，實現智慧化場域自動營運。</p>",
    categories: [{ id: 2, name: "數據分析" }],
    meta_data: [
      { key: "_app_version", value: "v1.0.1" },
      { key: "_app_rating", value: "4.9" },
      { key: "_app_downloads", value: "620" },
      { key: "_app_platforms", value: "Web, Linux" }
    ]
  },
  {
    id: 119,
    name: "AI ERP 智慧銷存旗艦版",
    price: "5200",
    regular_price: "6800",
    sale_price: "5200",
    images: [
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80", alt: "AI ERP Premium" }
    ],
    stock_status: "instock",
    short_description: "結合 AI 需求的次世代漁業 ERP。自動預測產量、智慧指派冷鏈冷藏路徑、多管道帳務智能對帳，全面提昇組織效能。",
    description: "<p>AI ERP 智慧銷存旗艦版將傳統 ERP 模組與 AI 演算法深度整合。系統能透過歷年養殖紀錄與氣候因子預測當季捕撈量與規格分佈，提前規劃冷凍庫倉位；並在收到大量訂單時，自動規劃最佳冷鏈派車路徑與裝載比重，大幅減少空車率與物流損耗。財務端則能自動解析銀行匯款單與出貨單，進行智慧核帳，將銷存流程推向自動化巔峰。</p>",
    categories: [{ id: 4, name: "生產與管理" }],
    meta_data: [
      { key: "_app_version", value: "v3.1.0" },
      { key: "_app_rating", value: "4.8" },
      { key: "_app_downloads", value: "1.5k" },
      { key: "_app_platforms", value: "Web, Windows, macOS" }
    ]
  },
  {
    id: 120,
    name: "AI CRM 智能客戶關係系統",
    price: "3800",
    regular_price: "4800",
    sale_price: "3800",
    images: [
      { src: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&auto=format&fit=crop&q=80", alt: "AI CRM System" }
    ],
    stock_status: "instock",
    short_description: "導入 AI 分析客戶行為與訂購偏好。預測客戶流失機率、自動發送專屬節慶優惠、優化銷售漏斗，牢牢鎖定每筆商機。",
    description: "<p>AI CRM 智能客戶關係系統能洞察買家的潛在需求。AI 演算法會持續分析客戶的交易歷史與溝通日誌（如 LINE 與 Email 對話），為每位買家計算『滿意度指數』與『流失機率』。在買家可能轉移訂單前，系統會發出警示並自動建議挽回策略（例如提供特定魚種折扣、主動撥打關懷電話），協助企業建立長久且健康的客戶夥伴關係。</p>",
    categories: [{ id: 4, name: "生產與管理" }],
    meta_data: [
      { key: "_app_version", value: "v2.5.0" },
      { key: "_app_rating", value: "4.7" },
      { key: "_app_downloads", value: "1.8k" },
      { key: "_app_platforms", value: "Web, iOS, Android" }
    ]
  },
  {
    id: 121,
    name: "電商助手 (E-commerce Assistant)",
    price: "1450",
    regular_price: "2000",
    sale_price: "1450",
    images: [
      { src: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80", alt: "E-commerce Assistant" }
    ],
    stock_status: "instock",
    short_description: "自動同步蝦皮、Momo、自有官網的水產訂單與庫存。自動化出貨排程與冷鏈物流託運單列印，一人也能輕鬆做電商。",
    description: "<p>電商助手 (E-commerce Assistant) 為水產養殖戶與盤商跨足零售電商量身打造。系統能無縫串接各大主流電商平台，當有新訂單時，自動扣減共用庫存，防範超賣；並能自動下載收件資料，一鍵產出冷凍超商、黑貓宅急便等宅配託運單與撿貨清單。簡化出貨包裝流程，顯著提昇出貨效率。</p>",
    categories: [{ id: 5, name: "行銷與內容" }],
    meta_data: [
      { key: "_app_version", value: "v1.9.0" },
      { key: "_app_rating", value: "4.6" },
      { key: "_app_downloads", value: "2.5k" },
      { key: "_app_platforms", value: "Web, iOS, Android" }
    ]
  },
  {
    id: 122,
    name: "SEO工具 (SEO Optimization Tool)",
    price: "950",
    regular_price: "1500",
    sale_price: "950",
    images: [
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80", alt: "SEO Optimization Tool" }
    ],
    stock_status: "instock",
    short_description: "分析您的水產品牌網站，指出載入速度、標題結構與關鍵字佈局問題。自動產出競爭對手流量分析與關鍵字推薦清單。",
    description: "<p>SEO工具為您的官方商城、部落格與形象官網進行全方位健檢。它會每日掃描網站頁面，檢測是否有圖片過大（影響行動端讀取）、缺少 Meta Tag、或是關鍵字（如：現撈生鮮、產地直銷）密度不合適的情形。提供詳細的修復步驟指南與每週排名追蹤，讓您的網站在 Google 搜尋引擎中脫穎而出。</p>",
    categories: [{ id: 5, name: "行銷與內容" }],
    meta_data: [
      { key: "_app_version", value: "v1.6.4" },
      { key: "_app_rating", value: "4.5" },
      { key: "_app_downloads", value: "1.4k" },
      { key: "_app_platforms", value: "Web" }
    ]
  }
];

// Fetch products from WordPress WooCommerce REST API
async function getWooCommerceProducts(): Promise<WooCommerceProduct[]> {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  const ck = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  // If consumer key or secret is placeholder, bypass API fetch and use mock fallback immediately
  if (!apiUrl || !ck || !cs || ck.includes("您的真實") || cs.includes("您的真實")) {
    console.warn("WooCommerce API 金鑰尚未設定或為預設值，將載入模擬 App 資料！");
    return mockApps;
  }

  try {
    const res = await fetch(`${apiUrl}/products?consumer_key=${ck}&consumer_secret=${cs}`, {
      next: { revalidate: 60 } // Cache results for 60 seconds
    });

    if (!res.ok) {
      throw new Error("無法從 WooCommerce 伺服器獲取商品");
    }

    const data = await res.json();
    
    if (!Array.isArray(data) || data.length === 0) {
      console.warn("WooCommerce API 回傳商品清單為空，將載入模擬 App 資料！");
      return mockApps;
    }
    
    // Map WooCommerce response to local WooCommerceProduct structure
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      price: item.price || "0",
      regular_price: item.regular_price || "0",
      sale_price: item.sale_price || "",
      images: item.images?.length > 0 ? item.images.map((img: any) => ({ src: img.src, alt: img.alt })) : [
        { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80" }
      ],
      stock_status: item.stock_status || "instock",
      short_description: item.short_description || "",
      description: item.description || "",
      categories: item.categories?.length > 0 ? item.categories.map((cat: any) => ({ id: cat.id, name: cat.name })) : [
        { id: 99, name: "數位軟體" }
      ],
      meta_data: item.meta_data || []
    }));
  } catch (error) {
    console.error("WooCommerce API 讀取失敗，降級載入模擬 App 資料:", error);
    return mockApps;
  }
}

// Title and SEO meta values
export const metadata = {
  title: "漁見 App Hub - 智慧漁業物聯網軟體商城",
  description: "全方位的智慧海洋軟體應用商城。匯聚 IoT 水質監控、AI 魚隻識別、海洋氣象預測及漁業 ERP 系統，推動水產養殖與遠洋捕撈的數位化升級。",
  keywords: "智慧漁業, 智慧水產養殖, 漁業App, 漁獲ERP, 水底無人機, 產銷履歷, 漁見科技"
};

export default async function HomePage() {
  const products = await getWooCommerceProducts();

  return <AppStoreDashboard initialProducts={products} />;
}