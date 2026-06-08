"use client";

import { useState, useEffect } from "react";

interface CookieConsentProps {
  isOpenSettings: boolean;
  onCloseSettings: () => void;
  onOpenSettings: () => void;
}

export default function CookieConsent({
  isOpenSettings,
  onCloseSettings,
  onOpenSettings,
}: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [analyticalEnabled, setAnalyticalEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedConsent = localStorage.getItem("yujian_cookie_consent");
    if (!savedConsent) {
      // If no choice made yet, show the consent banner
      setShowBanner(true);
    } else {
      try {
        const { analytical } = JSON.parse(savedConsent);
        setAnalyticalEnabled(!!analytical);
      } catch (e) {
        console.error("Error parsing cookie consent", e);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = { necessary: true, analytical: true };
    localStorage.setItem("yujian_cookie_consent", JSON.stringify(consent));
    setAnalyticalEnabled(true);
    setShowBanner(false);
  };

  const handleSaveSettings = () => {
    const consent = { necessary: true, analytical: analyticalEnabled };
    localStorage.setItem("yujian_cookie_consent", JSON.stringify(consent));
    setShowBanner(false);
    onCloseSettings();
  };

  if (!mounted) return null;

  return (
    <>
      {/* 1. Cookie Consent Banner */}
      {showBanner && !isOpenSettings && (
        <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-xl z-[90] bg-[#FAF6F0]/95 backdrop-blur-md border border-[#EBE5DC] shadow-xl rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-scaleUp">
          <div className="flex-1 text-xs text-[#6A5A53] leading-relaxed">
            <strong className="text-[#2C221E] font-bold block mb-1">關於 Cookies</strong>
            我們使用 Cookies 提升您的體驗並優化網站功能。閱讀我們的
            <a href="#" className="text-[#8B5E3C] underline hover:text-[#724C30] mx-1 font-semibold">
              《隱私政策》
            </a>
            以了解更多資訊。繼續瀏覽本網站，即表示您同意我們使用 Cookies。您可以於
            <button
              onClick={onOpenSettings}
              className="text-[#8B5E3C] underline hover:text-[#724C30] font-bold cursor-pointer mx-1 focus:outline-none"
            >
              此處
            </button>
            修改您的 Cookie 設置。
          </div>
          <button
            onClick={handleAcceptAll}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#8B5E3C] hover:bg-[#724C30] transition-all cursor-pointer whitespace-nowrap shadow-md shadow-amber-900/10 flex-shrink-0 text-center"
          >
            好的
          </button>
        </div>
      )}

      {/* 2. Cookie Settings Modal */}
      {isOpenSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#2C221E]/50 backdrop-blur-[2px] transition-opacity duration-300"
            onClick={onCloseSettings}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white border border-[#EBE5DC] rounded-3xl shadow-2xl my-8 overflow-hidden z-10 animate-scaleUp flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#EBE5DC] bg-[#FAF6F0]/50">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#8B5E3C]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <h3 className="text-[#2C221E] font-extrabold text-base tracking-wide">Cookie 設置</h3>
              </div>
              
              <button
                type="button"
                onClick={onCloseSettings}
                className="p-2 text-[#6A5A53] hover:text-[#2C221E] bg-white border border-[#EBE5DC] rounded-xl hover:border-[#8B5E3C]/30 transition-all focus:outline-none"
              >
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="flex-grow p-6 overflow-y-auto space-y-6">
              <p className="text-xs text-[#6A5A53] leading-relaxed">
                請在下方選擇您在本網站的 Cookie 設置。您可以按類別選擇允許或拒絕使用 Cookies。您可以隨時返回此網頁並訪問「Cookie 設置」鏈接來更改您的設置。有關詳細資訊，請閱讀我們的
                <a href="#" className="text-[#8B5E3C] underline hover:text-[#724C30] font-semibold mx-1">
                  《隱私政策》
                </a>
                。
              </p>

              <hr className="border-[#EBE5DC]/80" />

              {/* Necessary Cookies Option */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#2C221E]">必要性 Cookies</h4>
                  <span className="text-[10px] font-bold text-[#8A7A72] bg-[#FAF6F0] border border-[#EBE5DC] px-2 py-0.5 rounded-full select-none">
                    始終啟用
                  </span>
                </div>
                <p className="text-[11px] text-[#8A7A72] leading-relaxed">
                  這些 Cookies 是為了提供網站的服務或其他功能而必需的，不能在我們的網站上關閉，否則相關功能將無法使用。它們通常僅在您進行某些操作（例如請求服務時）後設置，比如訪問令牌，用於識別用戶的登錄狀態。
                </p>
              </div>

              {/* Analytical Cookies Option */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-[#2C221E]">分析性 Cookies</h4>
                  
                  {/* Switch Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={analyticalEnabled}
                      onChange={(e) => setAnalyticalEnabled(e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-[#EBE5DC] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B5E3C] focus:outline-none"></div>
                  </label>
                </div>
                <p className="text-[11px] text-[#8A7A72] leading-relaxed">
                  這些 Cookies 由我們或第三方合作夥伴使用，用於提供與我們網站的性能和可用性相關的指標。它們主要針對收集您與我們網站互動的信息，包括：按鈕點擊次數和頁面瀏覽次數，這使我們能夠審查和分析訪問者的行為，幫助改進網站的可用性和功能。
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-[#EBE5DC] bg-[#FAF6F0]/30 flex justify-center">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-44 py-2.5 rounded-full text-xs font-bold text-white bg-[#8B5E3C] hover:bg-[#724C30] transition-all cursor-pointer shadow-md shadow-amber-900/10 text-center"
              >
                已保存
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
