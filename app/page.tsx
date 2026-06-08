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
    description: "<p>AquaPredict 透過串接多通道物聯網水質偵測儀，能即時收集溶解氧 (DO)、pH 值、氧化還原電位 (ORP)、溫度及電導率等環境數據。內置 AI 預測模型，能分析歷史日誌，在水質因子跌落臨界點前 24 小時進行氣候交叉比對，發出溶氧或酸化風險警告，給予養殖主充足時間啟動水車或投入水質改良劑。</p>",
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