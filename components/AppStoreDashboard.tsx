"use client";

import { useState, useMemo, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import ProductCard, { WooCommerceProduct } from "./ProductCard";
import EditableField from "./EditableField";
import Image from "next/image";

interface AppStoreDashboardProps {
  initialProducts: WooCommerceProduct[];
}

export default function AppStoreDashboard({ initialProducts }: AppStoreDashboardProps) {
  const [isDev, setIsDev] = useState(false);
  const [products, setProducts] = useState<WooCommerceProduct[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [activeProduct, setActiveProduct] = useState<WooCommerceProduct | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"overview" | "changelog" | "specs">("overview");
  const [purchaseSuccess, setPurchaseSuccess] = useState<number | null>(null);

  // Local Page text elements state
  const [pageTexts, setPageTexts] = useState({
    heroBadge: "智慧海洋與物聯網軟體解決方案",
    heroTitlePrefix: "引領智慧漁業",
    heroTitleGradient: "數位化雲端",
    heroTitleSuffix: " 時代",
    heroDesc: "漁見 App Hub 匯聚多款專為遠洋漁業與智慧水產養殖設計的 App。從 AI 魚群影像辨識、智慧水質大數據預報到漁業銷存管理 ERP，一鍵快速下載，極速部署。",
    storeTitle: "智慧漁業應用程式商城",
    storeDesc: "篩選符合您漁船或養殖場硬體規格的數位 App 工具。",
    ecosystemTitle: "漁業物聯網生態系 (Ecosystem)",
    ecosystemDesc: "所有應用程式皆基於 Yujian Open API 規範開發，無縫整合浮標、水中無人機、水質感測器與氣象觀測終端。",
    feat1Title: "1. 快速安裝與部署",
    feat1Desc: "透過網頁控制台或專屬 SDK，將 App 部署至聯網監控設備、漁船平板或電腦中，免除複雜設定。",
    feat2Title: "2. 雲端大數據整合",
    feat2Desc: "所有數據自動備份並同步於雲端數據湖中，支援跨 App 交叉分析，輔助管理決策。",
    feat3Title: "3. 安全去中心化履歷",
    feat3Desc: "出貨數據串接 Hyperledger 區塊鏈，防篡改的銷存紀錄大幅提昇品牌價值與消費者信任度。",
    devTitle: "加入漁見應用開發計畫",
    devDesc: "不論您是獨立軟體開發者或硬體廠商，都可以使用我們的 API，為漁民和水產經銷商提供解決方案。上架軟體，開啟您的 SaaS 訂閱商業模式。",
  });

  // Sync state with parent updates
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  // Load custom values from localStorage in dev mode
  useEffect(() => {
    const devMode = process.env.NODE_ENV === "development";
    setIsDev(devMode);

    if (devMode) {
      // 1. Load custom page texts
      const savedTexts = localStorage.getItem("yujian_local_texts");
      if (savedTexts) {
        try {
          setPageTexts((prev) => ({ ...prev, ...JSON.parse(savedTexts) }));
        } catch (e) {
          console.error("Error loading local page texts", e);
        }
      }

      // 2. Load custom products
      const savedProducts = localStorage.getItem("yujian_local_products");
      if (savedProducts) {
        try {
          setProducts(JSON.parse(savedProducts));
        } catch (e) {
          console.error("Error loading local products", e);
        }
      }
    }
  }, []);

  // Handler to update page texts in dev mode
  const handleSaveText = (key: keyof typeof pageTexts, value: string) => {
    const updatedTexts = { ...pageTexts, [key]: value };
    setPageTexts(updatedTexts);
    if (process.env.NODE_ENV === "development") {
      localStorage.setItem("yujian_local_texts", JSON.stringify(updatedTexts));
    }
  };

  // Handler to update product fields in dev mode
  const handleUpdateProduct = (id: number, updatedFields: Partial<WooCommerceProduct>) => {
    const updatedProducts = products.map((p) => {
      if (p.id === id) {
        const nextProd = { ...p, ...updatedFields };
        // If modal details is open for this product, sync it immediately
        if (activeProduct && activeProduct.id === id) {
          setActiveProduct(nextProd);
        }
        return nextProd;
      }
      return p;
    });

    setProducts(updatedProducts);
    if (process.env.NODE_ENV === "development") {
      localStorage.setItem("yujian_local_products", JSON.stringify(updatedProducts));
    }
  };

  // Extract all unique categories
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.categories.forEach((cat) => set.add(cat.name));
    });
    return ["all", ...Array.from(set)];
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const descMatch = p.short_description && p.short_description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSearch = nameMatch || descMatch;
        
        const matchesCategory =
          selectedCategory === "all" ||
          p.categories.some((cat) => cat.name === selectedCategory);

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return parseFloat(a.price || "0") - parseFloat(b.price || "0");
        }
        if (sortBy === "price-desc") {
          return parseFloat(b.price || "0") - parseFloat(a.price || "0");
        }
        if (sortBy === "rating") {
          const ratingA = parseFloat(a.meta_data?.find((m) => m.key === "_app_rating")?.value || "0");
          const ratingB = parseFloat(b.meta_data?.find((m) => m.key === "_app_rating")?.value || "0");
          return ratingB - ratingA;
        }
        // default "popular" sorting by downloads count
        const downA = parseFloat(a.meta_data?.find((m) => m.key === "_app_downloads")?.value || "0");
        const downB = parseFloat(b.meta_data?.find((m) => m.key === "_app_downloads")?.value || "0");
        return downB - downA;
      });
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handlePurchase = (productId: number) => {
    setPurchaseSuccess(productId);
    setTimeout(() => setPurchaseSuccess(null), 3000);
  };

  // Screenshots mock for active modal
  const appScreenshots = useMemo(() => {
    return [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80",
    ];
  }, []);

  return (
    <div className="bg-[#FAF6F0] text-[#2C221E] font-sans antialiased min-h-screen flex flex-col justify-between selection:bg-[#8B5E3C] selection:text-white relative">
      
      {/* Floating dev visual editor indicator */}
      {isDev && (
        <div className="fixed bottom-6 right-6 z-[120] bg-gradient-to-r from-[#8B5E3C] to-[#D9A05B] text-white px-4 py-2.5 rounded-2xl shadow-xl shadow-amber-900/20 border border-white/20 flex items-center gap-2 text-xs font-bold animate-pulse select-none pointer-events-none">
          <span className="text-sm">🛠️</span>
          <span>視覺編輯模式已啟用 (僅限本地)</span>
        </div>
      )}

      {/* Header component */}
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Main Container */}
      <main className="flex-grow pt-24">
        
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-6 border-b border-[#EBE5DC] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FAF6F0] via-[#FAF6F0] to-white">
          {/* Coffee-colored warm decorative spots */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#8B5E3C]/3 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute top-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-[#D9A05B]/3 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            {/* Hero Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 text-[#8B5E3C] text-xs font-bold tracking-wide">
                <span className="w-1.5 h-1.5 bg-[#8B5E3C] rounded-full"></span>
                <EditableField
                  value={pageTexts.heroBadge}
                  onSave={(val) => handleSaveText("heroBadge", val)}
                />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#2C221E] leading-tight">
                <EditableField
                  value={pageTexts.heroTitlePrefix}
                  onSave={(val) => handleSaveText("heroTitlePrefix", val)}
                />
                <br />
                進入{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5E3C] to-[#D9A05B]">
                  <EditableField
                    value={pageTexts.heroTitleGradient}
                    onSave={(val) => handleSaveText("heroTitleGradient", val)}
                  />
                </span>
                <EditableField
                  value={pageTexts.heroTitleSuffix}
                  onSave={(val) => handleSaveText("heroTitleSuffix", val)}
                />
              </h1>
              <div className="text-sm md:text-base text-[#6A5A53] max-w-xl mx-auto lg:mx-0 leading-relaxed font-semibold">
                <EditableField
                  as="p"
                  value={pageTexts.heroDesc}
                  onSave={(val) => handleSaveText("heroDesc", val)}
                />
              </div>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <a
                  href="#apps-store"
                  className="bg-gradient-to-r from-[#8B5E3C] to-[#C8B195] hover:from-[#724C30] hover:to-[#B69F83] text-white font-extrabold px-6 py-3 rounded-xl text-sm transition-all duration-300 shadow-lg shadow-amber-900/10 active:scale-98"
                >
                  探索 App 商城
                </a>
                <a
                  href="#developer"
                  className="bg-white hover:bg-[#FAF6F0] text-[#6A5A53] hover:text-[#2C221E] border border-[#EBE5DC] hover:border-[#8B5E3C]/30 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 active:scale-98 shadow-sm"
                >
                  上架應用程式 (SDK)
                </a>
              </div>
            </div>

            {/* Hero Right: Cafe-dashboard Mockup */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-[500px] aspect-[4/3] rounded-2xl bg-white border border-[#EBE5DC] p-3 shadow-xl shadow-amber-900/5 backdrop-blur-md overflow-hidden group">
                {/* Inside Dashboard mockup */}
                <div className="w-full h-full rounded-xl bg-[#FAF6F0] border border-[#EBE5DC]/50 p-4 flex flex-col justify-between select-none">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-[#EBE5DC]/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                      <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                      <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                    </div>
                    <span className="text-[10px] text-[#8A7A72] font-mono tracking-widest uppercase font-semibold">Yujian OS v2.0 Dashboard</span>
                  </div>
                  
                  {/* Chart and stats grid */}
                  <div className="grid grid-cols-3 gap-3 my-4 flex-grow">
                    <div className="col-span-2 rounded-lg bg-white border border-[#EBE5DC]/60 p-3 flex flex-col justify-between shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#6A5A53] font-bold">即時溶氧量 (DO)</span>
                        <span className="text-[10px] text-[#52796F] font-extrabold">● 安全</span>
                      </div>
                      <div className="h-20 flex items-end gap-1 pt-2">
                        {[40, 45, 38, 55, 60, 68, 72, 65, 80, 85, 90].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-[#8B5E3C]/80 to-[#C8B195] rounded-sm" style={{ height: `${h}%` }}></div>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-1 rounded-lg bg-white border border-[#EBE5DC]/60 p-3 flex flex-col justify-between shadow-sm">
                      <span className="text-[10px] text-[#6A5A53] font-bold">智慧辨識計數</span>
                      <div className="text-xl font-extrabold text-[#2C221E] font-mono mt-1">2,482 <span className="text-[9px] text-[#8B5E3C]">隻</span></div>
                      <span className="text-[9px] text-[#8A7A72] leading-normal font-semibold">AI 攝影機即時監測中</span>
                    </div>

                    <div className="col-span-1 rounded-lg bg-white border border-[#EBE5DC]/60 p-2.5 text-center shadow-sm">
                      <div className="text-[10px] text-[#8A7A72] font-semibold">水溫預測</div>
                      <div className="text-sm font-bold mt-1 text-[#2C221E] font-mono">26.8°C</div>
                    </div>
                    <div className="col-span-1 rounded-lg bg-white border border-[#EBE5DC]/60 p-2.5 text-center shadow-sm">
                      <div className="text-[10px] text-[#8A7A72] font-semibold">PH 水質</div>
                      <div className="text-sm font-bold mt-1 text-[#2C221E] font-mono">7.8</div>
                    </div>
                    <div className="col-span-1 rounded-lg bg-white border border-[#EBE5DC]/60 p-2.5 text-center shadow-sm">
                      <div className="text-[10px] text-[#8A7A72] font-semibold">連線感測器</div>
                      <div className="text-sm font-bold mt-1 text-[#8B5E3C] font-mono">18 <span className="text-[9px] text-[#6A5A53]">組</span></div>
                    </div>
                  </div>

                  {/* Status footer */}
                  <div className="flex items-center justify-between text-[9px] text-[#8A7A72] border-t border-[#EBE5DC]/80 pt-3">
                    <span>訊號連線強度: 優良 (98%)</span>
                    <span>更新時間: {new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* E-Commerce App Store Section */}
        <section id="apps-store" className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#2C221E] tracking-wide">
                <EditableField
                  value={pageTexts.storeTitle}
                  onSave={(val) => handleSaveText("storeTitle", val)}
                />
              </h2>
              <div className="text-xs md:text-sm text-[#6A5A53] mt-2 font-semibold">
                <EditableField
                  value={pageTexts.storeDesc}
                  onSave={(val) => handleSaveText("storeDesc", val)}
                />
              </div>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#8A7A72] font-bold">排序方式</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white text-xs text-[#6A5A53] border border-[#EBE5DC] rounded-xl px-4 py-2.5 focus:outline-none focus:border-[#8B5E3C] transition-colors shadow-sm"
              >
                <option value="popular">最受歡迎</option>
                <option value="rating">最高評分</option>
                <option value="price-asc">價格：由低到高</option>
                <option value="price-desc">價格：由高到低</option>
              </select>
            </div>
          </div>

          {/* Categories Tab and Search Input Row */}
          <div className="flex flex-col gap-6 mb-8 border-b border-[#EBE5DC] pb-6">
            <div className="flex flex-wrap items-center gap-2">
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide capitalize transition-all duration-300 shadow-sm border ${
                    selectedCategory === cat
                      ? "bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-amber-900/10"
                      : "bg-[#FAF6F0] hover:bg-[#F3EFE9] text-[#6A5A53] hover:text-[#2C221E] border-[#EBE5DC]"
                  }`}
                >
                  {cat === "all" ? "全部軟體" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Apps Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onOpenDetails={(p) => {
                    setActiveProduct(p);
                    setActiveModalTab("overview");
                  }}
                  onUpdateProduct={handleUpdateProduct}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-[#F3EFE9]/50 rounded-2xl border border-[#EBE5DC]">
              <svg className="w-12 h-12 text-[#8A7A72] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
              <h3 className="text-base font-bold text-[#6A5A53]">找不到相符的應用程式</h3>
              <p className="text-xs text-[#8A7A72] mt-1">請嘗試修改篩選條件或搜尋關鍵字。</p>
            </div>
          )}
        </section>

        {/* Feature / Ecosystem Section */}
        <section id="solutions" className="bg-[#F3EFE9]/40 border-y border-[#EBE5DC] py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#2C221E]">
                <EditableField
                  value={pageTexts.ecosystemTitle}
                  onSave={(val) => handleSaveText("ecosystemTitle", val)}
                />
              </h2>
              <div className="text-xs md:text-sm text-[#6A5A53] leading-relaxed font-semibold">
                <EditableField
                  as="p"
                  value={pageTexts.ecosystemDesc}
                  onSave={(val) => handleSaveText("ecosystemDesc", val)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  titleKey: "feat1Title" as const,
                  descKey: "feat1Desc" as const,
                  icon: (
                    <svg className="w-6 h-6 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  ),
                },
                {
                  titleKey: "feat2Title" as const,
                  descKey: "feat2Desc" as const,
                  icon: (
                    <svg className="w-6 h-6 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
                {
                  titleKey: "feat3Title" as const,
                  descKey: "feat3Desc" as const,
                  icon: (
                    <svg className="w-6 h-6 text-[#8B5E3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                },
              ].map((feat, index) => (
                <div key={index} className="bg-white border border-[#EBE5DC] rounded-2xl p-6 space-y-4 hover:border-[#8B5E3C]/20 transition-all duration-300 shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-[#FAF6F0] border border-[#EBE5DC] flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h3 className="text-[#2C221E] font-extrabold text-base">
                    <EditableField
                      value={pageTexts[feat.titleKey]}
                      onSave={(val) => handleSaveText(feat.titleKey, val)}
                    />
                  </h3>
                  <div className="text-xs text-[#6A5A53] leading-relaxed">
                    <EditableField
                      as="p"
                      value={pageTexts[feat.descKey]}
                      onSave={(val) => handleSaveText(feat.descKey, val)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Portal Section */}
        <section id="developer" className="max-w-7xl mx-auto px-6 py-24 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#8B5E3C]/3 to-[#D9A05B]/3 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2C221E]">
              <EditableField
                value={pageTexts.devTitle}
                onSave={(val) => handleSaveText("devTitle", val)}
              />
            </h2>
            <div className="text-xs md:text-sm text-[#6A5A53] leading-relaxed font-semibold">
              <EditableField
                as="p"
                value={pageTexts.devDesc}
                onSave={(val) => handleSaveText("devDesc", val)}
              />
            </div>
            <div className="pt-4 flex justify-center gap-4">
              <button className="bg-gradient-to-r from-[#8B5E3C] to-[#C8B195] hover:from-[#724C30] hover:to-[#B69F83] text-white font-extrabold px-6 py-3 rounded-xl text-xs tracking-wide transition-all shadow-md active:scale-98">
                獲取開發者金鑰 (SDK)
              </button>
              <button className="bg-white hover:bg-[#FAF6F0] text-[#6A5A53] border border-[#EBE5DC] hover:border-[#8B5E3C]/30 px-6 py-3 rounded-xl text-xs font-bold transition-all active:scale-98 shadow-sm">
                閱讀 API 文件
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer component */}
      <Footer />

      {/* App Details Modal (Overlay) */}
      {activeProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#2C221E]/50 backdrop-blur-[2px] transition-opacity duration-300"
            onClick={() => setActiveProduct(null)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-3xl bg-white border border-[#EBE5DC] rounded-2xl shadow-2xl my-8 overflow-hidden z-10 animate-scaleUp max-h-[85vh] flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-[#EBE5DC] bg-[#FAF6F0]/50">
              <div className="flex gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white border border-[#EBE5DC]">
                  <Image
                    src={activeProduct.images[0]?.src || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80"}
                    alt={activeProduct.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-[#2C221E] font-extrabold text-lg leading-snug">
                    <EditableField
                      value={activeProduct.name}
                      onSave={(newVal) => handleUpdateProduct(activeProduct.id, { name: newVal })}
                    />
                  </h3>
                  <div className="flex items-center gap-2.5 mt-1 text-[11px] text-[#6A5A53]">
                    <span className="text-[#8B5E3C] font-extrabold">
                      <EditableField
                        value={activeProduct.categories[0]?.name || "智慧工具"}
                        onSave={(newCatVal) =>
                          handleUpdateProduct(activeProduct.id, {
                            categories: [{ id: activeProduct.categories[0]?.id || 1, name: newCatVal }]
                          })
                        }
                      />
                    </span>
                    <span>•</span>
                    <span className="flex items-center text-amber-500 gap-0.5">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <EditableField
                        value={activeProduct.meta_data?.find((m) => m.key === "_app_rating")?.value || "4.8"}
                        onSave={(newVal) => {
                          const updatedMeta = (activeProduct.meta_data || []).map((m) =>
                            m.key === "_app_rating" ? { ...m, value: newVal } : m
                          );
                          if (!updatedMeta.some((m) => m.key === "_app_rating")) {
                            updatedMeta.push({ key: "_app_rating", value: newVal });
                          }
                          handleUpdateProduct(activeProduct.id, { meta_data: updatedMeta });
                        }}
                      />
                    </span>
                    <span>•</span>
                    <span>
                      <EditableField
                        value={activeProduct.meta_data?.find((m) => m.key === "_app_downloads")?.value || "1.5k"}
                        onSave={(newVal) => {
                          const updatedMeta = (activeProduct.meta_data || []).map((m) =>
                            m.key === "_app_downloads" ? { ...m, value: newVal } : m
                          );
                          if (!updatedMeta.some((m) => m.key === "_app_downloads")) {
                            updatedMeta.push({ key: "_app_downloads", value: newVal });
                          }
                          handleUpdateProduct(activeProduct.id, { meta_data: updatedMeta });
                        }}
                      /> 下載
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveProduct(null)}
                className="p-2 text-[#6A5A53] hover:text-[#2C221E] bg-white border border-[#EBE5DC] rounded-xl hover:border-[#8B5E3C]/30 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
              
              {/* Tab Selector */}
              <div className="flex border-b border-[#EBE5DC] gap-6">
                {[
                  { id: "overview", label: "應用程式簡介" },
                  { id: "changelog", label: "版本更新日誌" },
                  { id: "specs", label: "系統與要求" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModalTab(tab.id as any)}
                    className={`pb-3 text-xs font-bold tracking-wide border-b-2 transition-all ${
                      activeModalTab === tab.id
                        ? "border-[#8B5E3C] text-[#8B5E3C]"
                        : "border-transparent text-[#6A5A53] hover:text-[#2C221E]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Contents */}
              {activeModalTab === "overview" && (
                <div className="space-y-6">
                  {/* Screenshots carousel */}
                  <div className="grid grid-cols-3 gap-3">
                    {appScreenshots.map((url, idx) => (
                      <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#EBE5DC]">
                        <Image
                          src={url}
                          alt="Screenshot"
                          fill
                          sizes="(max-width: 768px) 33vw, 250px"
                          className="object-cover hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Rich description */}
                  <div className="space-y-4 text-xs leading-relaxed text-[#6A5A53]">
                    <h4 className="text-[#2C221E] font-extrabold text-sm">核心特點與價值 (可編輯內容)</h4>
                    <div className="bg-[#FAF6F0]/20 p-4 border border-[#EBE5DC]/50 rounded-2xl">
                      <EditableField
                        as="div"
                        value={
                          activeProduct.description
                            ? activeProduct.description.replace(/<[^>]*>/g, "")
                            : "此軟體針對水產供應鏈提供全面數位化支持，具備流暢的使用介面、毫秒級的物聯網監控延遲、與可靠的安全區塊鏈認證。能有效解決海鮮追蹤、冷鏈控溫與即時水質預測痛點，最大化降低水產養殖的損失率。"
                        }
                        onSave={(newDesc) => handleUpdateProduct(activeProduct.id, { description: newDesc })}
                        className="leading-relaxed block"
                      />
                    </div>

                    {/* Features list */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      {[
                        "無縫串接 Yujian IoT 感測器",
                        "智慧 AI 本地離線推論與識別",
                        "24/7 自動水質異常簡訊預警",
                        "匯出完整安心履歷與 CSV 報表",
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[#6A5A53] bg-[#FAF6F0]/60 p-2.5 rounded-xl border border-[#EBE5DC]/50">
                          <svg className="w-4 h-4 text-[#52796F] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === "changelog" && (
                <div className="space-y-4">
                  <div className="relative border-l-2 border-[#EBE5DC] pl-5 ml-2.5 space-y-6 text-xs text-[#6A5A53]">
                    <div className="relative">
                      <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#8B5E3C] border-2 border-white"></span>
                      <div className="flex items-center justify-between text-[#2C221E] font-bold mb-1">
                        <span>v2.1.0 (最新發布)</span>
                        <span className="text-[10px] text-[#8A7A72] font-mono">2026/05/18</span>
                      </div>
                      <p className="leading-relaxed">優化 AI 演算法推論核心，提升多路監控攝影機下的檢測速度；修正了水質溶氧預警系統的通知誤報 Bug。</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#C8B195] border-2 border-white"></span>
                      <div className="flex items-center justify-between text-[#2C221E] font-bold mb-1">
                        <span>v2.0.0 (重大重構)</span>
                        <span className="text-[10px] text-[#8A7A72] font-mono">2026/02/10</span>
                      </div>
                      <p className="leading-relaxed">重構系統 UI，引入暗黑模式並強化儀表板的自定義佈局功能；整合全新的區塊鏈節點對接器。</p>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[27px] top-0.5 w-3 h-3 rounded-full bg-[#C8B195] border-2 border-white"></span>
                      <div className="flex items-center justify-between text-[#2C221E] font-bold mb-1">
                        <span>v1.0.0 (初版釋出)</span>
                        <span className="text-[10px] text-[#8A7A72] font-mono">2025/11/01</span>
                      </div>
                      <p className="leading-relaxed">智慧漁業應用核心版本發行，正式支援基本感測器數據繪製與遠端控制功能。</p>
                    </div>
                  </div>
                </div>
              )}

              {activeModalTab === "specs" && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  {[
                    {
                      label: "軟體支援平台",
                      val: activeProduct.meta_data?.find((m) => m.key === "_app_platforms")?.value || "Web, iOS, Android",
                      key: "_app_platforms",
                    },
                    {
                      label: "版本號碼",
                      val: activeProduct.meta_data?.find((m) => m.key === "_app_version")?.value || "v2.1.0",
                      key: "_app_version",
                    },
                    {
                      label: "授權類型",
                      val: parseFloat(activeProduct.price) === 0 ? "免費授權" : "付費訂閱制 / 買斷授權",
                      key: null,
                    },
                    {
                      label: "最低系統需求",
                      val: "iOS 15.0+ / Android 9.0+ / Chrome 100+ 瀏覽器",
                      key: null,
                    },
                    {
                      label: "物聯網通訊協定",
                      val: "MQTT, HTTP REST API, Modbus TCP",
                      key: null,
                    },
                    {
                      label: "網路需求",
                      val: "具備 4G/5G 或 Wi-Fi 網路連線能力 (離線模式支援最長 48 小時數據暫存)",
                      key: null,
                    },
                  ].map((spec, idx) => (
                    <div key={idx} className="bg-[#FAF6F0]/60 p-3 rounded-xl border border-[#EBE5DC]/60">
                      <div className="text-[#8A7A72] mb-1 font-semibold">{spec.label}</div>
                      <div className="text-[#2C221E] font-bold">
                        {spec.key ? (
                          <EditableField
                            value={spec.val}
                            onSave={(newVal) => {
                              const updatedMeta = (activeProduct.meta_data || []).map((m) =>
                                m.key === spec.key ? { ...m, value: newVal } : m
                              );
                              if (!updatedMeta.some((m) => m.key === spec.key)) {
                                updatedMeta.push({ key: spec.key, value: newVal });
                              }
                              handleUpdateProduct(activeProduct.id, { meta_data: updatedMeta });
                            }}
                          />
                        ) : (
                          spec.val
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-[#EBE5DC] bg-[#FAF6F0]/50 flex items-center justify-between">
              <div>
                <span className="text-xs text-[#8A7A72] font-bold">軟體授權費用</span>
                <div className="text-[#2C221E] font-extrabold text-lg mt-0.5">
                  {parseFloat(activeProduct.price) === 0 || activeProduct.price === "" ? (
                    <span className="text-[#52796F] font-extrabold">免費取得</span>
                  ) : (
                    `NT$ ${parseFloat(activeProduct.price).toLocaleString()}`
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setActiveProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-[#EBE5DC] text-[#6A5A53] hover:text-[#2C221E] hover:bg-[#FAF6F0] text-xs font-bold transition-all"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => handlePurchase(activeProduct.id)}
                  disabled={activeProduct.stock_status !== "instock"}
                  className={`px-6 py-2.5 rounded-xl text-xs font-extrabold tracking-wide transition-all ${
                    activeProduct.stock_status !== "instock"
                      ? "bg-[#FAF6F0] text-[#8A7A72] border border-[#EBE5DC] cursor-not-allowed"
                      : purchaseSuccess === activeProduct.id
                      ? "bg-[#52796F] text-white"
                      : "bg-[#8B5E3C] hover:bg-[#724C30] text-white"
                  }`}
                >
                  {purchaseSuccess === activeProduct.id ? (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      購買成功，取得金鑰中...
                    </span>
                  ) : parseFloat(activeProduct.price) === 0 || activeProduct.price === "" ? (
                    "立即下載應用"
                  ) : (
                    "加入購物車"
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
