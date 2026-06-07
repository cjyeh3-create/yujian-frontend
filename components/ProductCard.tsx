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
  // Custom metadata for fish e-commerce (e.g., origin, weight)
  meta_data?: {
    key: string;
    value: string;
  }[];
}

interface ProductCardProps {
  product: WooCommerceProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const mainImage = product.images[0]?.src || "/vercel.svg";
  const altText = product.images[0]?.alt || product.name;

  // Extract custom meta
  const weight = product.meta_data?.find((m) => m.key === "_weight_spec")?.value || "500g ± 10%";
  const origin = product.meta_data?.find((m) => m.key === "_origin_loc")?.value || "台灣基隆";
  const catchTime = product.meta_data?.find((m) => m.key === "_catch_time")?.value || "今日清晨";

  const onSale = product.sale_price !== "";
  const discountPercent = onSale
    ? Math.round(
        ((parseFloat(product.regular_price) - parseFloat(product.sale_price)) /
          parseFloat(product.regular_price)) *
          100
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50">
        <Image
          src={mainImage}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          priority={false}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="bg-[#0B192C] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {catchTime}
          </span>
          {onSale && (
            <span className="bg-[#FF6B35] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              折 {discountPercent}%
            </span>
          )}
        </div>

        {/* Stock status overlay */}
        {product.stock_status !== "instock" && (
          <div className="absolute inset-0 bg-[#0B192C]/75 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="text-white font-bold tracking-widest text-lg px-4 py-2 border-2 border-white/60 rounded">
              已售完
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-2">
          {product.categories.slice(0, 1).map((cat) => (
            <span key={cat.id} className="text-[#FF6B35] text-xs font-semibold tracking-wider">
              {cat.name}
            </span>
          ))}
          <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
          <span className="text-gray-500 text-xs">{origin}</span>
        </div>

        {/* Title */}
        <h3 className="text-[#0B192C] font-bold text-lg mb-2 line-clamp-1 group-hover:text-[#FF6B35] transition-colors duration-200">
          {product.name}
        </h3>

        {/* Spec Information */}
        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs text-gray-500 mb-4 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            <span>規格: {weight}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>低溫冷鏈配送</span>
          </div>
        </div>

        {/* Price & Cart Action */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            {onSale ? (
              <>
                <span className="text-[#FF6B35] font-extrabold text-xl">
                  NT$ {parseFloat(product.price).toLocaleString()}
                </span>
                <span className="text-gray-400 line-through text-xs">
                  NT$ {parseFloat(product.regular_price).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-[#0B192C] font-extrabold text-xl">
                NT$ {parseFloat(product.price).toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock_status !== "instock"}
            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
              product.stock_status !== "instock"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : isAdded
                ? "bg-green-600 text-white"
                : "bg-[#FF6B35] text-white hover:bg-[#e05621] hover:shadow-md active:scale-95"
            }`}
          >
            {isAdded ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>已加入</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                <span>加入購物車</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
