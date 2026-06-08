"use client";

import { useState } from "react";
import Image from "next/image";

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
}

export default function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);

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

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(product)}
      className="group relative bg-gray-900/50 hover:bg-gray-900/90 rounded-2xl p-5 border border-gray-800/80 hover:border-cyan-500/30 transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-cyan-950/10 flex flex-col justify-between h-full cursor-pointer overflow-hidden"
    >
      {/* Glow Effect on Hover */}
      <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

      <div>
        {/* Top: Icon + Title + Rating */}
        <div className="flex gap-4 items-start mb-4">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-850 flex-shrink-0 border border-gray-800/80 group-hover:border-cyan-500/20 transition-colors duration-300">
            <Image
              src={mainImage}
              alt={altText}
              fill
              sizes="64px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 min-w-0">
            {/* Categories */}
            <div className="text-[10px] text-cyan-400 font-bold tracking-wider uppercase mb-1 line-clamp-1">
              {product.categories[0]?.name || "智慧工具"}
            </div>
            {/* Title */}
            <h3 className="text-white font-extrabold text-sm leading-snug group-hover:text-cyan-300 transition-colors duration-200 truncate">
              {product.name}
            </h3>
            {/* Meta: Rating & Downloads */}
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-gray-400">
              <span className="flex items-center text-amber-400 gap-0.5">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {rating}
              </span>
              <span className="text-gray-600">•</span>
              <span>{downloads} 下載</span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4 group-hover:text-gray-300 transition-colors">
          {product.short_description
            ? product.short_description.replace(/<[^>]*>/g, "")
            : "為智慧漁業開發的專業雲端運算與數據視覺化應用，完美整合硬體數據與雲端分析。"}
        </p>

        {/* Platforms & Version */}
        <div className="flex items-center justify-between border-t border-gray-900 pt-3.5 mb-4 text-[10px] text-gray-500">
          <div className="flex items-center gap-1.5">
            {platforms.map((plat) => (
              <span
                key={plat}
                className="bg-gray-900 border border-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono"
              >
                {plat}
              </span>
            ))}
          </div>
          <span className="font-mono text-gray-600">{version}</span>
        </div>
      </div>

      {/* Bottom: Price and Download/Add Actions */}
      <div className="flex items-center justify-between border-t border-gray-900/50 pt-3.5">
        {/* Price */}
        <div className="flex flex-col">
          {isFree ? (
            <span className="text-emerald-400 font-extrabold text-sm tracking-wide">免費取得</span>
          ) : onSale ? (
            <div className="flex flex-col">
              <span className="text-white font-extrabold text-sm leading-none">
                NT$ {parseFloat(product.price).toLocaleString()}
              </span>
              <span className="text-gray-500 line-through text-[10px] mt-0.5">
                NT$ {parseFloat(product.regular_price).toLocaleString()}
              </span>
            </div>
          ) : (
            <span className="text-white font-extrabold text-sm">
              NT$ {parseFloat(product.price).toLocaleString()}
            </span>
          )}
        </div>

        {/* Actions Button */}
        <div className="flex items-center gap-2">
          {/* Details CTA */}
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-700 text-xs font-semibold tracking-wide transition-all"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails && onOpenDetails(product);
            }}
          >
            詳情
          </button>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock_status !== "instock"}
            className={`flex items-center justify-center gap-1 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-300 ${
              product.stock_status !== "instock"
                ? "bg-gray-950 text-gray-600 cursor-not-allowed border border-gray-900"
                : isAdded
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-cyan-500 hover:bg-cyan-600 text-gray-950 hover:shadow-md hover:shadow-cyan-500/10 active:scale-95"
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
        </div>
      </div>
    </div>
  );
}
