interface FooterProps {
  onOpenCookieSettings?: () => void;
}

export default function Footer({ onOpenCookieSettings }: FooterProps) {
  return (
    <footer className="bg-[#F3EFE9] text-[#6A5A53] border-t border-[#EBE5DC]">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <a href="#" className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8B5E3C] to-[#D9A05B] shadow-md shadow-amber-900/10">
              <svg
                className="w-4.5 h-4.5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 21L14.907 18M18 10.5c0 3.29-2.29 6-5.5 6s-5.5-2.71-5.5-6s2.29-6 5.5-6s5.5 2.71 5.5 6z"
                />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-wider text-[#2C221E]">
              漁見 <span className="text-[#8B5E3C]">App Hub</span>
            </span>
          </a>
          <p className="text-xs leading-relaxed text-[#6A5A53]">
            引領智慧海洋新視界。<br />
            我們透過物聯網 (IoT)、人工智慧 (AI) 與大數據預測，為遠洋捕撈與智慧養殖提供最頂尖的數位應用軟體與 SaaS 解決方案。
          </p>
          <div className="flex items-center gap-3 pt-2">
            {["github", "twitter", "linkedin"].map((item) => (
              <a
                key={item}
                href="#"
                className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DC] flex items-center justify-center text-[#6A5A53] hover:text-[#8B5E3C] hover:border-[#8B5E3C]/35 transition-all duration-300 shadow-sm"
              >
                <span className="sr-only">{item}</span>
                <span className="text-xs font-semibold capitalize font-mono">{item[0]}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-[#2C221E] font-bold mb-4 text-xs tracking-wider uppercase">
            智慧應用分類
          </h3>
          <ul className="space-y-2 text-xs">
            {[
              { label: "AI 影像與監控助手", href: "#" },
              { label: "水質物聯網監控", href: "#" },
              { label: "海洋氣象與航路預測", href: "#" },
              { label: "產銷履歷區塊鏈系統", href: "#" },
              { label: "漁場進銷存管理 ERP", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-[#8B5E3C] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Developer / Docs */}
        <div>
          <h3 className="text-[#2C221E] font-bold mb-4 text-xs tracking-wider uppercase">
            開發者中心
          </h3>
          <ul className="space-y-2 text-xs">
            {[
              { label: "API 參考文件", href: "#" },
              { label: "物聯網 SDK 下載", href: "#" },
              { label: "開源專案與範例", href: "#" },
              { label: "開發者沙盒測試 (Sandbox)", href: "#" },
              { label: "應用上架申請與條款", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-[#8B5E3C] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-xs">
          <h3 className="text-[#2C221E] font-bold text-xs tracking-wider uppercase">
            技術支援與聯絡
          </h3>
          <p className="flex items-center gap-2">
            <span className="text-[#8B5E3C] font-extrabold">合作專線:</span> (02) 2720-8889
          </p>
          <p className="flex items-center gap-2">
            <span className="text-[#8B5E3C] font-extrabold">支援信箱:</span> dev-support@yujian.io
          </p>
          <p className="flex items-center gap-2">
            <span className="text-[#8B5E3C] font-extrabold">總部地址:</span> 台北市信義區信義路五段 7 號 (台北 101 大樓 88 樓)
          </p>
          <p className="text-[#8A7A72] pt-1 leading-normal">
            服務時間: 週一至週五 09:00 - 18:00 (例假日及國定假日除外)
          </p>
        </div>
      </div>

      <div className="border-t border-[#EBE5DC] py-6 text-center text-[10px] text-[#8A7A72]">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <p>
            &copy; {new Date().getFullYear()} 漁見科技 Yujian Digital Tech. All rights reserved.
          </p>
          {onOpenCookieSettings && (
            <>
              <span className="hidden sm:inline text-[#EBE5DC]">|</span>
              <button
                onClick={onOpenCookieSettings}
                className="hover:text-[#8B5E3C] transition-colors duration-200 cursor-pointer focus:outline-none"
              >
                Cookie 設置
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
