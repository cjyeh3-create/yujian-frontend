export default function Footer() {
  return (
    <footer className="bg-[#0B192C] text-gray-400 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Info */}
        <div className="space-y-4">
          <a href="#" className="flex items-center gap-2">
            <svg
              className="w-8 h-8 text-[#FF6B35]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <span className="text-xl font-bold tracking-wider text-white">
              漁見 <span className="text-[#FF6B35]">Yujian</span>
            </span>
          </a>
          <p className="text-sm leading-relaxed text-gray-400">
            從深海，到您的餐桌。<br />
            今日現撈，低溫直送。我們秉持對海洋的敬畏，將最純淨、最鮮美的滋味原封不動呈獻給您。
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">
            探索漁獲
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "今日推薦現撈", href: "#today-catch" },
              { label: "急速冷凍專區", href: "#" },
              { label: "禮盒與嚴選", href: "#" },
              { label: "安心產銷履歷", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-[#FF6B35] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">
            顧客服務
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: "配送與運費政策", href: "#" },
              { label: "退換貨細則", href: "#" },
              { label: "常見問題 FAQ", href: "#" },
              { label: "會員權益說明", href: "#" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="hover:text-[#FF6B35] transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 text-sm">
          <h3 className="text-white font-semibold text-sm tracking-widest uppercase">
            聯絡我們
          </h3>
          <p className="flex items-center gap-2">
            <span className="text-[#FF6B35]">電話:</span> (02) 2345-6789
          </p>
          <p className="flex items-center gap-2">
            <span className="text-[#FF6B35]">信箱:</span> support@yujianseafood.com
          </p>
          <p className="flex items-center gap-2">
            <span className="text-[#FF6B35]">地址:</span> 宜蘭縣蘇澳鎮漁港路 88 號
          </p>
          <p className="flex items-center gap-2 text-gray-500">
            <span>營業時間: 週一至週六 08:00 - 18:00</span>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} 漁見 Yujian. All rights reserved. 版權所有，轉載必究。
        </p>
      </div>
    </footer>
  );
}
