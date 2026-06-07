import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard, { WooCommerceProduct } from "../components/ProductCard";

// Mock WooCommerce products list representing API response
const mockProducts: WooCommerceProduct[] = [
  {
    id: 101,
    name: "澎湖現撈紅甘魚 (整尾/去鰓去內臟)",
    price: "720",
    regular_price: "850",
    sale_price: "720",
    images: [
      {
        src: "/fish-snapper.png",
        alt: "澎湖現撈紅甘魚",
      },
    ],
    stock_status: "instock",
    categories: [{ id: 1, name: "今日現撈" }],
    meta_data: [
      { key: "_weight_spec", value: "750g ± 10%" },
      { key: "_origin_loc", value: "澎湖七美海域" },
      { key: "_catch_time", value: "今日現撈" },
    ],
  },
  {
    id: 102,
    name: "宜蘭野生特大大頭蝦 (急速冷凍)",
    price: "480",
    regular_price: "480",
    sale_price: "",
    images: [
      {
        src: "/shrimp-prawn.png",
        alt: "宜蘭野生大頭蝦",
      },
    ],
    stock_status: "instock",
    categories: [{ id: 2, name: "新鮮急凍" }],
    meta_data: [
      { key: "_weight_spec", value: "600g ± 10% (約12-15尾)" },
      { key: "_origin_loc", value: "宜蘭大溪漁港" },
      { key: "_catch_time", value: "清晨剛上岸" },
    ],
  },
  {
    id: 103,
    name: "東港嚴選黑鮪魚大腹 (Sashimi 等級)",
    price: "1350",
    regular_price: "1680",
    sale_price: "1350",
    images: [
      {
        src: "/tuna-sashimi.png",
        alt: "東港黑鮪魚大腹",
      },
    ],
    stock_status: "instock",
    categories: [{ id: 1, name: "極致生鮮" }],
    meta_data: [
      { key: "_weight_spec", value: "300g ± 5%" },
      { key: "_origin_loc", value: "屏東東港漁港" },
      { key: "_catch_time", value: "低溫直送" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="bg-white text-[#0B192C] font-sans antialiased min-h-screen flex flex-col">
      {/* 1. Sticky Navigation Header */}
      <Header />

      {/* 2. Hero Section */}
      <section className="relative h-[80vh] flex items-center bg-[#0B192C] px-8 md:px-16 overflow-hidden">
        {/* Background Image with Dark Blue Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.png"
            alt="漁見新鮮海鮮背景"
            fill
            priority
            className="object-cover object-center opacity-40 select-none"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B192C] via-[#0B192C]/80 to-transparent" />
        </div>

        <div className="max-w-xl z-10 text-white space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF6B35]/20 border border-[#FF6B35]/30 text-[#FF6B35] text-xs font-semibold tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-ping" />
            本日漁獲已到港
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider leading-tight">
            從深海，到您的餐桌。
            <br />
            <span className="text-[#FF6B35]">今日現撈，低溫直送。</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-md leading-relaxed">
            嚴選當季最肥美的深海海鮮，捕撈後立即進入低溫冷鏈，為您保留海洋最初的鮮美甘甜。
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <a
              href="#today-catch"
              className="bg-[#FF6B35] text-white font-semibold px-8 py-3.5 rounded-lg text-sm hover:bg-[#e05621] hover:shadow-lg hover:shadow-[#FF6B35]/20 transition-all duration-300 active:scale-95"
            >
              探索今日漁獲
            </a>
            <a
              href="#about"
              className="bg-transparent border border-white/30 text-white font-semibold px-8 py-3.5 rounded-lg text-sm hover:bg-white/10 hover:border-white transition-all duration-300"
            >
              品牌故事
            </a>
          </div>
        </div>

        {/* Decorative Wave Design */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none z-10" />
      </section>

      {/* Value Propositions / Trust Features */}
      <section className="bg-white py-12 border-b border-gray-100 z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "當季現撈直送",
              desc: "每日港口第一手挑選，新鮮不經過中盤商，直接配送至府。",
              icon: (
                <svg className="w-8 h-8 text-[#FF6B35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
              ),
            },
            {
              title: "全程 -18°C 冷鏈",
              desc: "與專業低溫物流合作，包裝內含專用保冷設備，確保鮮度完美鎖住。",
              icon: (
                <svg className="w-8 h-8 text-[#FF6B35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3m14.5-5.5l-11 11m0-11l11 11" />
                </svg>
              ),
            },
            {
              title: "來源安全透明",
              desc: "每批海鮮均附產地與捕撈資訊，通過國家重金屬與藥物檢驗合格。",
              icon: (
                <svg className="w-8 h-8 text-[#FF6B35]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              ),
            },
          ].map((feat, index) => (
            <div key={index} className="flex gap-4 items-start p-4 hover:bg-gray-50 rounded-xl transition-colors duration-300">
              <div className="p-3 bg-[#FF6B35]/10 rounded-xl flex-shrink-0">
                {feat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-[#0B192C] text-base">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Product Grid */}
      <section id="today-catch" className="max-w-7xl mx-auto px-6 py-20 w-full scroll-mt-20">
        <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
          <span className="text-[#FF6B35] font-semibold tracking-widest text-xs uppercase">Seafood Recommendations</span>
          <h2 className="text-3xl font-extrabold tracking-wide text-[#0B192C]">
            今日推薦現撈
          </h2>
          <div className="w-12 h-1 bg-[#FF6B35] mx-auto rounded-full" />
          <p className="text-gray-500 text-sm">
            每日由合作船長帶回的限量極品，依季節與當日風浪狀況隨時調整，錯過即等下一航次。
          </p>
        </div>

        {/* Product Cards Map */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* About Us section to round up a premium brand presentation */}
      <section id="about" className="bg-[#0B192C]/5 py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-[#FF6B35] font-semibold tracking-widest text-xs uppercase">Our Story</span>
            <h2 className="text-3xl font-extrabold text-[#0B192C]">
              漁見，見證每一次的海上捕撈
            </h2>
            <p className="text-gray-600 leading-relaxed">
              我們是一群生長在海邊的子弟，看著老船長們用一輩子的經驗在波濤中帶回珍貴的漁獲。我們成立「漁見」品牌，旨在打破傳統魚市冗長的運送與拍賣過程。
            </p>
            <p className="text-gray-600 leading-relaxed">
              我們在漁船靠港的一瞬間進行篩選、封裝與冰鎮，並透過現代化的冷鏈物流行銷全台，讓您在家也能享有與港口同步的鮮美海味。
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-[#FF6B35] font-bold hover:text-[#e05621] transition-colors group"
              >
                <span>瞭解我們的產地與船隊</span>
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Decorative Seafood Presentation Container */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-[#0B192C] group">
            <Image
              src="/hero-bg.png"
              alt="老船長出海捕魚"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/80 via-[#0B192C]/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
              <p className="text-xs text-[#FF6B35] font-bold tracking-widest uppercase">產地直接選品</p>
              <p className="font-extrabold text-lg">宜蘭南方澳與蘇澳港出海船隊合作</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}
