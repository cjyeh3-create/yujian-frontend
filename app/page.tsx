import React from 'react';

// 1. 定義從 WordPress 撈回來的商品資料型態
interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  images: { src: string; alt?: string }[];
  permalink: string;
}

// 2. 建立 API 請求函式
async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;
  const ck = process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const cs = process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;

  const res = await fetch(`${apiUrl}/products?consumer_key=${ck}&consumer_secret=${cs}`, {
    next: { revalidate: 60 } // 自動快取 60 秒，兼顧速度與資料即時性
  });

  if (!res.ok) {
    throw new Error('無法從 WooCommerce 後台取得商品資料');
  }

  return res.json();
}

// 3. 首頁組件本體
export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="bg-white text-[#0B192C] font-sans antialiased min-h-screen">
      {/* 焦點大圖區 (Hero Section) */}
      <section className="relative h-[60vh] flex items-center bg-[#0B192C] px-8 text-white">
        <div className="max-w-xl z-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">從深海，到您的餐桌。<br/>今日現撈，低溫直送。</h1>
          <button className="bg-[#FF6B35] text-white font-medium px-6 py-3 rounded text-[14px] hover:bg-[#e05621] transition-all">
            探索今日漁獲
          </button>
        </div>
      </section>

      {/* 今日主打商品網格區 */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold mb-8 text-center tracking-wide">今日推薦現撈</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="border border-slate-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-all bg-white">
              {/* 商品圖片 */}
              <div className="aspect-square w-full overflow-hidden rounded-md bg-slate-100 mb-4">
                <img 
                  src={product.images[0]?.src || 'https://via.placeholder.com/300'} 
                  alt={product.images[0]?.alt || product.name}
                  className="h-full w-full object-cover object-center hover:scale-105 transition-all"
                />
              </div>
              {/* 品名與價格 */}
              <h3 className="text-[14px] font-bold text-[#0B192C] mb-2">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#FF6B35]">NT$ {product.price}</span>
                <button className="bg-[#0B192C] text-white text-[12px] px-3 py-1.5 rounded hover:bg-[#1e3552]">
                  加入購物車
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}