"use client";

import React, { useState, useEffect } from "react";

export interface EditableConfig {
  id: string; // key of pageTexts, layoutConfigs, or product ID
  type: "text" | "image" | "layout" | "product";
  label: string; // display label e.g., "Hero Title"
  value: string; // current value
  color?: string; // current color if text
  targetField?: string; // e.g., "gridColumns", "price", "description"
}

interface VisualInspectorModalProps {
  activeConfig: EditableConfig;
  onSave: (
    id: string,
    updated: {
      value: string;
      color?: string;
      targetField?: string;
      [key: string]: any;
    }
  ) => void;
  onClose: () => void;
}

const COLOR_PRESETS = [
  { name: "深濃縮咖 (Deep Espresso)", hex: "#2C221E" },
  { name: "焦糖拿鐵 (Caramel Brown)", hex: "#8B5E3C" },
  { name: "焙茶豆色 (Roasted Bean)", hex: "#6A5A53" },
  { name: "鼠尾草綠 (Sage Green)", hex: "#52796F" },
  { name: "琥珀金黃 (Amber Gold)", hex: "#D9A05B" },
];

const UNSPLASH_PRESETS = [
  { name: "智慧數據圖表", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" },
  { name: "程式開發介面", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80" },
  { name: "物聯網感測線路", url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80" },
  { name: "智慧養殖魚池", url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80" },
];

export default function VisualInspectorModal({
  activeConfig,
  onSave,
  onClose,
}: VisualInspectorModalProps) {
  const [textVal, setTextVal] = useState(activeConfig.value);
  const [colorVal, setColorVal] = useState(activeConfig.color || "#2C221E");
  const [layoutVal, setLayoutVal] = useState(activeConfig.value);
  const [productFields, setProductFields] = useState({
    name: activeConfig.type === "product" ? activeConfig.value : "",
    price: "",
    category: "",
    description: "",
  });

  // If activeConfig is a product, extract fields or load defaults
  useEffect(() => {
    setTextVal(activeConfig.value);
    setColorVal(activeConfig.color || "#2C221E");
    setLayoutVal(activeConfig.value);
    
    if (activeConfig.type === "product") {
      // Find the specific field from targetField
      setProductFields({
        name: activeConfig.targetField === "name" ? activeConfig.value : "",
        price: activeConfig.targetField === "price" ? activeConfig.value : "",
        category: activeConfig.targetField === "category" ? activeConfig.value : "",
        description: activeConfig.targetField === "description" ? activeConfig.value : "",
      });
    }
  }, [activeConfig]);

  const handleApply = () => {
    if (activeConfig.type === "text") {
      onSave(activeConfig.id, {
        value: textVal,
        color: colorVal,
      });
    } else if (activeConfig.type === "image") {
      onSave(activeConfig.id, {
        value: textVal, // holds the image URL
      });
    } else if (activeConfig.type === "layout") {
      onSave(activeConfig.id, {
        value: layoutVal,
        targetField: activeConfig.targetField,
      });
    } else if (activeConfig.type === "product") {
      const fieldName = activeConfig.targetField || "name";
      let val = textVal;
      if (fieldName === "price") val = productFields.price;
      if (fieldName === "category") val = productFields.category;
      if (fieldName === "description") val = productFields.description;
      if (fieldName === "name") val = productFields.name;

      onSave(activeConfig.id, {
        value: val,
        targetField: activeConfig.targetField,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2C221E]/60 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white border border-[#EBE5DC] rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col justify-between max-h-[90vh]">
        
        {/* Title */}
        <div className="flex items-center justify-between p-5 border-b border-[#EBE5DC] bg-[#FAF6F0]/50">
          <h3 className="text-[#2C221E] font-extrabold text-sm flex items-center gap-1.5">
            <span>⚙️</span>
            <span>修改物件樣式：{activeConfig.label}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6A5A53] hover:text-[#2C221E] bg-white border border-[#EBE5DC] rounded-lg hover:border-[#8B5E3C]/30 transition-all text-xs"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 flex-grow overflow-y-auto space-y-5 text-xs">
          
          {/* TYPE: TEXT */}
          {activeConfig.type === "text" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[#6A5A53] font-bold">文字內容：</label>
                <textarea
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl p-3 text-[#2C221E] placeholder-[#8A7A72] focus:outline-none focus:border-[#8B5E3C] focus:bg-white h-24 resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-[#6A5A53] font-bold">文字顏色選擇：</label>
                <div className="grid grid-cols-1 gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      onClick={() => setColorVal(preset.hex)}
                      className={`flex items-center gap-2.5 px-3 py-2 border rounded-xl w-full text-left transition-all ${
                        colorVal === preset.hex
                          ? "border-[#8B5E3C] bg-[#8B5E3C]/5 font-bold text-[#8B5E3C]"
                          : "border-[#EBE5DC] bg-white text-[#6A5A53] hover:border-[#8B5E3C]/20"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 flex-shrink-0"
                        style={{ backgroundColor: preset.hex }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <span className="text-[#6A5A53] font-bold">自訂 HEX 顏色碼：</span>
                  <input
                    type="text"
                    value={colorVal}
                    onChange={(e) => setColorVal(e.target.value)}
                    placeholder="#2C221E"
                    className="bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl px-3 py-1.5 text-[#2C221E] w-28 focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TYPE: IMAGE */}
          {activeConfig.type === "image" && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[#6A5A53] font-bold">圖片網址 (URL)：</label>
                <input
                  type="text"
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl px-3 py-2 text-[#2C221E] focus:outline-none focus:border-[#8B5E3C] focus:bg-white"
                />
              </div>

              {/* Image preview */}
              {textVal && (
                <div className="space-y-1.5">
                  <span className="text-[#8A7A72] block font-semibold">即時預覽：</span>
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[#EBE5DC] bg-gray-50">
                    <img src={textVal} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-[#6A5A53] font-bold">精選水產與科技圖示推薦：</label>
                <div className="grid grid-cols-2 gap-2">
                  {UNSPLASH_PRESETS.map((preset) => (
                    <button
                      key={preset.url}
                      onClick={() => setTextVal(preset.url)}
                      className={`group border rounded-xl overflow-hidden p-1 bg-white hover:border-[#8B5E3C]/35 text-left transition-all ${
                        textVal === preset.url ? "border-[#8B5E3C] shadow-md shadow-amber-900/5" : "border-[#EBE5DC]"
                      }`}
                    >
                      <div className="aspect-[16/10] w-full rounded-lg overflow-hidden bg-gray-150 mb-1 relative">
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-[#6A5A53] block truncate font-bold px-1 group-hover:text-[#8B5E3C]">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TYPE: LAYOUT */}
          {activeConfig.type === "layout" && (
            <div className="space-y-4">
              
              {/* Target: Grid Columns count */}
              {activeConfig.targetField === "gridColumns" && (
                <div className="space-y-2">
                  <label className="block text-[#6A5A53] font-bold">App 網格排版欄數：</label>
                  <div className="grid grid-cols-3 gap-2">
                    {["2", "3", "4"].map((col) => (
                      <button
                        key={col}
                        onClick={() => setLayoutVal(col)}
                        className={`py-3 px-4 border rounded-xl font-bold transition-all text-center ${
                          layoutVal === col
                            ? "border-[#8B5E3C] bg-[#8B5E3C] text-white shadow-md shadow-amber-900/10"
                            : "border-[#EBE5DC] bg-[#FAF6F0] text-[#6A5A53] hover:border-[#8B5E3C]/20"
                        }`}
                      >
                        {col} 欄排版
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target: Grid Gap spacing */}
              {activeConfig.targetField === "gridGap" && (
                <div className="space-y-2">
                  <label className="block text-[#6A5A53] font-bold">網格卡片間距：</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "緊湊排列 (gap-4)", value: "gap-4" },
                      { label: "標準間距 (gap-6)", value: "gap-6" },
                      { label: "寬敞間距 (gap-8)", value: "gap-8" },
                    ].map((gap) => (
                      <button
                        key={gap.value}
                        onClick={() => setLayoutVal(gap.value)}
                        className={`py-2 px-3 border rounded-xl text-left font-semibold transition-all ${
                          layoutVal === gap.value
                            ? "border-[#8B5E3C] bg-[#8B5E3C]/5 text-[#8B5E3C] font-bold"
                            : "border-[#EBE5DC] bg-white text-[#6A5A53] hover:border-[#8B5E3C]/20"
                        }`}
                      >
                        {gap.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target: Padding (heroPadding, devPadding) */}
              {(activeConfig.targetField === "heroPadding" || activeConfig.targetField === "devPadding") && (
                <div className="space-y-2">
                  <label className="block text-[#6A5A53] font-bold">區塊上下間距 (Padding)：</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "精簡舒適 (py-12)", value: "py-12" },
                      { label: "標準排版 (py-20)", value: "py-20" },
                      { label: "極致寬敞 (py-28)", value: "py-28" },
                    ].map((pad) => (
                      <button
                        key={pad.value}
                        onClick={() => setLayoutVal(pad.value)}
                        className={`py-2.5 px-3 border rounded-xl text-left font-semibold transition-all ${
                          layoutVal === pad.value
                            ? "border-[#8B5E3C] bg-[#8B5E3C]/5 text-[#8B5E3C] font-bold"
                            : "border-[#EBE5DC] bg-white text-[#6A5A53] hover:border-[#8B5E3C]/20"
                        }`}
                      >
                        {pad.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target: Ecosystem Background color */}
              {activeConfig.targetField === "ecosystemBg" && (
                <div className="space-y-2">
                  <label className="block text-[#6A5A53] font-bold">區塊背景底色：</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { label: "溫暖乳白 (bg-[#FAF6F0])", value: "bg-[#FAF6F0]" },
                      { label: "優閒燕麥 (bg-[#F3EFE9]/40)", value: "bg-[#F3EFE9]/40" },
                      { label: "無暇純白 (bg-white)", value: "bg-white" },
                    ].map((bg) => (
                      <button
                        key={bg.value}
                        onClick={() => setLayoutVal(bg.value)}
                        className={`py-2 px-3 border rounded-xl text-left font-semibold transition-all ${
                          layoutVal === bg.value
                            ? "border-[#8B5E3C] bg-[#8B5E3C]/5 text-[#8B5E3C] font-bold"
                            : "border-[#EBE5DC] bg-white text-[#6A5A53] hover:border-[#8B5E3C]/20"
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Target: Width (heroMockupWidth) */}
              {activeConfig.targetField === "heroMockupWidth" && (
                <div className="space-y-3">
                  <label className="block text-[#6A5A53] font-bold">Dashboard 框架寬度 (Width)：</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="350"
                      max="600"
                      step="10"
                      value={layoutVal}
                      onChange={(e) => setLayoutVal(e.target.value)}
                      className="w-full accent-[#8B5E3C]"
                    />
                    <span className="font-mono text-[#2C221E] font-bold w-16 text-right flex-shrink-0">
                      {layoutVal} px
                    </span>
                  </div>
                  <span className="text-[10px] text-[#8A7A72]">拖曳拉桿以即時縮放右側智慧漁業儀表板的寬度。</span>
                </div>
              )}
            </div>
          )}

          {/* TYPE: PRODUCT */}
          {activeConfig.type === "product" && (
            <div className="space-y-4">
              
              {/* Product: Name */}
              {activeConfig.targetField === "name" && (
                <div className="space-y-1.5">
                  <label className="block text-[#6A5A53] font-bold">App 名稱：</label>
                  <input
                    type="text"
                    value={productFields.name}
                    onChange={(e) => setProductFields({ ...productFields, name: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl px-3 py-2 text-[#2C221E] focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              )}

              {/* Product: Price */}
              {activeConfig.targetField === "price" && (
                <div className="space-y-1.5">
                  <label className="block text-[#6A5A53] font-bold">軟體定價 (NT$)：</label>
                  <input
                    type="number"
                    value={productFields.price}
                    onChange={(e) => setProductFields({ ...productFields, price: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl px-3 py-2 text-[#2C221E] focus:outline-none focus:border-[#8B5E3C]"
                    placeholder="輸入 0 代表免費取得"
                  />
                  <p className="text-[10px] text-[#8A7A72]">輸入 0 時，前端將自動包裝為「免費取得」標章。</p>
                </div>
              )}

              {/* Product: Category */}
              {activeConfig.targetField === "category" && (
                <div className="space-y-1.5">
                  <label className="block text-[#6A5A53] font-bold">主要分類標籤：</label>
                  <input
                    type="text"
                    value={productFields.category}
                    onChange={(e) => setProductFields({ ...productFields, category: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl px-3 py-2 text-[#2C221E] focus:outline-none focus:border-[#8B5E3C]"
                  />
                </div>
              )}

              {/* Product: Description / Short description */}
              {activeConfig.targetField === "description" && (
                <div className="space-y-1.5">
                  <label className="block text-[#6A5A53] font-bold">詳細功能簡介 (應用詳情彈窗內顯示)：</label>
                  <textarea
                    value={productFields.description}
                    onChange={(e) => setProductFields({ ...productFields, description: e.target.value })}
                    className="w-full bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl p-3 text-[#2C221E] focus:outline-none focus:border-[#8B5E3C] focus:bg-white h-36 resize-none leading-relaxed"
                  />
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-[#EBE5DC] bg-[#FAF6F0]/50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#EBE5DC] bg-white text-[#6A5A53] hover:text-[#2C221E] hover:bg-[#FAF6F0] text-xs font-bold rounded-xl transition-all"
          >
            取消
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 bg-[#8B5E3C] hover:bg-[#724C30] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-amber-900/10"
          >
            儲存修改
          </button>
        </div>

      </div>
    </div>
  );
}
