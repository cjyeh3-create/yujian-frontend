"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { EditableConfig } from "./VisualInspectorModal";

// WooCommerce compatible product interface
export interface WooCommerceProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: {
    src: string;
    alt?: string;
  }[];
  stock_status: string;
  description?: string;
  short_description?: string;
  categories: { id: number; name: string }[];
  meta_data?: {
    key: string;
    value: string;
  }[];
}

interface ProductCardProps {
  product: WooCommerceProduct;
  onOpenDetails?: (product: WooCommerceProduct) => void;
  onEditClick?: (config: EditableConfig) => void;
}

export default function ProductCard({ product, onOpenDetails, onEditClick }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === "development");
  }, []);

  const mainImage = product.images[0]?.src || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80";
  const altText = product.images[0]?.alt || product.name;

  // Extract meta data or provide default mock values for App selling
  const version = product.meta_data?.find((m) => m.key === "_app_version")?.value || "v1.3.2";
  const rating = product.meta_data?.find((m) => m.key === "_app_rating")?.value || 
    (4.5 + (product.id % 5) * 0.1).toFixed(1);
  const downloads = product.meta_data?.find((m) => m.key === "_app_downloads")?.value || 
    (((product.id % 4) + 1) * 1.5).toFixed(1) + "k+";
  const platformsStr = product.meta_data?.find((m) => m.key === "_app_platforms")?.value || "Web, iOS, Android";
  const platforms = platformsStr.split(",").map((p) => p.trim());

  const onSale = product.sale_price !== "" && product.sale_price !== product.regular_price;
  const isFree = parseFloat(product.price) === 0 || product.price === "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // In dev mode, clicking the card background or unhandled sections opens the main name editor
    if (isDev) {
      e.stopPropagation();
      onEditClick?.({
        id: String(product.id),
        type: "product",
        label: `${product.name} 名稱`,
        value: product.name,
        targetField: "name"
      });
    } else {
      onOpenDetails?.(product);
    }
  };

  // Helper styles for dev editor hovering
  const editableStyle = isDev
    ? "hover:outline hover:outline-dashed hover:outline-1 hover:outline-[#8B5E3C]/50 hover:bg-[#8B5E3C]/5 cursor-pointer rounded px-0.5 transition-all duration-150 relative"
    : "";

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl p-5 border border-[#EBE5DC] hover:border-[#8B5E3C]/35 transition-all duration-300 shadow-md shadow-amber-900/5 hover:shadow-xl hover:shadow-amber-900/10 flex flex-col justify-between h-full overflow-hidden"
    >
      {/* Warm Latte Glow Effect on Hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-[#8B5E3C]/5 to-[#D9A05B]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      {/* Editor helper cog tag in development */}
      {isDev && (
        <div className="absolute top-2 right-2 z-10 bg-[#FAF6F0] border border-[#EBE5DC] text-[#6A5A53] hover:text-[#8B5E3C] hover:border-[#8B5E3C]/30 text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 select-none">
          <span>⚙️</span>
          <span>編輯</span>
        </div>
      )}

      <div>
        {/* Top: Icon + Title + Rating */}
        <div className="flex gap-4 items-start mb-4">
          {/* App Icon Image Block */}
          <div
            onClick={(e) => {
              if (isDev) {
                e.stopPropagation();
                onEditClick?.({
                  id: String(product.id),
                  type: "image",
                  label: `${product.name} 圖示`,
                  value: mainImage,
                  targetField: "image",
                });
              }
            }}
            className={`relative w-16 h-16 rounded-2xl overflow-hidden bg-[#FAF6F0] flex-shrink-0 border border-[#EBE5DC] group-hover:border-[#8B5E3C]/20 transition-colors duration-300 ${
              isDev ? "hover:outline hover:outline-dashed hover:outline-1 hover:outline-[#8B5E3C] cursor-pointer" : ""
            }`}
            title={isDev ? "點選更換圖示網址" : undefined}
          >
            <Image
              src={mainImage}
              alt={altText}
              fill
              sizes="64px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* Category tag */}
            <div
              onClick={(e) => {
                if (isDev) {
                  e.stopPropagation();
                  onEditClick?.({
                    id: String(product.id),
                    type: "product",
                    label: `${product.name} 分類`,
                    value: product.categories[0]?.name || "智慧工具",
                    targetField: "category",
                  });
                }
              }}
              className={`text-[10px] text-[#8B5E3C] font-extrabold tracking-wider uppercase mb-1 line-clamp-1 ${editableStyle}`}
              title={isDev ? "點選修改分類標籤" : undefined}
            >
              {product.categories[0]?.name || "智慧工具"}
            </div>
            {/* Title */}
            <h3
              onClick={(e) => {
                if (isDev) {
                  e.stopPropagation();
                  onEditClick?.({
                    id: String(product.id),
                    type: "product",
                    label: `${product.name} 名稱`,
                    value: product.name,
                    targetField: "name",
                  });
                }
              }}
              className={`text-[#2C221E] font-extrabold text-sm leading-snug group-hover:text-[#8B5E3C] transition-colors duration-200 truncate ${editableStyle}`}
              title={isDev ? "點選修改軟體名稱" : undefined}
            >
              {product.name}
            </h3>
            {/* Meta: Rating & Downloads */}
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#6A5A53]">
              <span className="flex items-center text-amber-500 gap-0.5">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </span>
              <span className="text-[#EBE5DC]">•</span>
              <span>{downloads} 下載</span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <div className="mb-4">
          <p
            onClick={(e) => {
              if (isDev) {
                e.stopPropagation();
                onEditClick?.({
                  id: String(product.id),
                  type: "product",
                  label: `${product.name} 詳情描述`,
                  value: product.description || "",
                  targetField: "description",
                });
              }
            }}
            className={`text-xs text-[#6A5A53] leading-relaxed line-clamp-2 ${editableStyle}`}
            title={isDev ? "點選編輯彈窗內部的詳細功能描述" : undefined}
          >
            {product.short_description
              ? product.short_description.replace(/<[^>]*>/g, "")
              : "為智慧漁業開發的專業雲端運算與數據視覺化應用，完美整合硬體數據與雲端分析。"}
          </p>
        </div>

        {/* Platforms & Version */}
        <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3.5 mb-4 text-[10px] text-[#8A7A72]">
          <div className="flex items-center gap-1.5">
            {platforms.map((plat) => (
              <span
                key={plat}
                className="bg-[#FAF6F0] border border-[#EBE5DC] text-[#6A5A53] px-1.5 py-0.5 rounded font-mono"
              >
                {plat}
              </span>
            ))}
          </div>
          <span className="font-mono text-[#8A7A72]/70">{version}</span>
        </div>
      </div>

      {/* Bottom: Price and Download/Add Actions */}
      <div className="flex items-center justify-between border-t border-[#FAF6F0] pt-3.5">
        {/* Price (Editable on click in Dev) */}
        <div
          onClick={(e) => {
            if (isDev) {
              e.stopPropagation();
              onEditClick?.({
                id: String(product.id),
                type: "product",
                label: `${product.name} 價格`,
                value: product.price,
                targetField: "price",
              });
            }
          }}
          className={`flex flex-col ${editableStyle}`}
          title={isDev ? "點選修改軟體售價" : undefined}
        >
          {isFree ? (
            <span className="text-[#52796F] font-extrabold text-sm tracking-wide">免費取得</span>
          ) : onSale ? (
            <div className="flex flex-col">
              <span className="text-[#8B5E3C] font-extrabold text-sm leading-none">
                NT$ {parseFloat(product.price).toLocaleString()}
              </span>
              <span className="text-[#8A7A72] line-through text-[10px] mt-0.5">
                NT$ {parseFloat(product.regular_price).toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-[#2C221E] font-extrabold text-sm">
              NT$ {parseFloat(product.price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Actions Button */}
        <div className="flex items-center gap-2">
          {/* Details CTA */}
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-[#EBE5DC] text-[#6A5A53] hover:text-[#2C221E] hover:border-[#8B5E3C]/30 text-xs font-bold tracking-wide transition-all"
            onClick={(e) => {
              // Details button ALWAYS opens details modal, even in dev mode
              e.stopPropagation();
              onOpenDetails?.(product);
            }}
          >
            詳情
          </button>

          {/* Add to Cart or Open App CTA */}
          {product.meta_data?.find((m) => m.key === "_app_route")?.value ? (
            <a
              href={product.meta_data.find((m) => m.key === "_app_route")!.value}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-lg font-bold text-xs bg-gradient-to-r from-[#8B5E3C] to-[#D9A05B] text-white hover:shadow-md hover:shadow-amber-900/10 active:scale-95 transition-all"
            >
              開啟
            </a>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={product.stock_status !== "instock"}
              className={`flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 ${
                product.stock_status !== "instock"
                  ? "bg-[#FAF6F0] text-[#8A7A72] cursor-not-allowed border border-[#EBE5DC]"
                  : isAdded
                  ? "bg-[#52796F] text-white shadow-md shadow-emerald-900/10"
                  : "bg-[#8B5E3C] hover:bg-[#724C30] text-white hover:shadow-md hover:shadow-amber-900/10 active:scale-95"
              }`}
            >
              {isAdded ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>已取得</span>
                </>
              ) : (
                <span>取得</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
