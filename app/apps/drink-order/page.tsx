"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Drink item interface
interface DrinkItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

// Customized order item interface
interface CartItem {
  cartId: string;
  drink: DrinkItem;
  size: "M" | "L";
  ice: string;
  sugar: string;
  toppings: { name: string; price: number }[];
  quantity: number;
  totalPrice: number;
}

const DRINK_MENU: DrinkItem[] = [
  {
    id: "ruby-black",
    name: "經典紅玉 (Ruby Black Tea)",
    price: 35,
    category: "original",
    description: "嚴選日月潭紅玉紅茶，茶湯紅潤，帶有天然肉桂與薄荷淡雅香氣。",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "jasmine-green",
    name: "茉莉綠茶 (Jasmine Green Tea)",
    price: 35,
    category: "original",
    description: "頂級茶葉多次薰花，茉莉花香優雅馥郁，口感清爽回甘。",
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "spring-tea",
    name: "四季春青茶 (Four Seasons Tea)",
    price: 35,
    category: "original",
    description: "茶湯翠綠偏黃，帶有獨特梔子花香，香氣清高持久。",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "pearl-milk",
    name: "魚見珍珠奶茶 (Pearl Milk Tea)",
    price: 55,
    category: "milk-tea",
    description: "魚見嚴選香醇奶茶，搭配手作Q彈黑糖蜜珍珠，彈牙香甜。",
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "jelly-milk",
    name: "經典仙草奶凍 (Grass Jelly Milk)",
    price: 50,
    category: "milk-tea",
    description: "滑嫩手作仙草凍融入甘醇鮮奶，沁涼消暑滑順爽口。",
    image: "https://images.unsplash.com/photo-1508885368104-a48af168553a?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "black-latte",
    name: "紅玉紅茶拿鐵 (Black Tea Latte)",
    price: 65,
    category: "latte",
    description: "頂級紅玉紅茶加上濃醇小農鮮乳，完美融合出優雅漸層奶茶。",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "matcha-latte",
    name: "靜岡抹茶拿鐵 (Matcha Latte)",
    price: 70,
    category: "latte",
    description: "嚴選靜岡抹茶粉與香醇鮮乳，微苦回甘，日式道地風味。",
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "americano",
    name: "漁夫美式咖啡 (Americano)",
    price: 60,
    category: "coffee",
    description: "精選中深烘焙咖啡豆，醇厚可口，提神解疲的最佳選擇。",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "cafe-latte",
    name: "晨光拿鐵咖啡 (Cafe Latte)",
    price: 75,
    category: "coffee",
    description: "黃金比例濃縮咖啡與綿密鮮奶泡沫，奶香濃郁口感溫潤。",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=80"
  }
];

const ICE_OPTIONS = ["正常冰", "少冰", "微冰", "去冰", "熱"];
const SUGAR_OPTIONS = ["正常糖(100%)", "少糖(70%)", "半糖(50%)", "微糖(30%)", "無糖(0%)"];
const TOPPING_OPTIONS = [
  { name: "手作珍珠", price: 10 },
  { name: "椰果", price: 10 },
  { name: "布丁", price: 15 },
  { name: "仙草凍", price: 10 }
];

export default function DrinkOrderPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);
  
  // Customization states
  const [customSize, setCustomSize] = useState<"M" | "L">("L");
  const [customIce, setCustomIce] = useState("微冰");
  const [customSugar, setCustomSugar] = useState("半糖(50%)");
  const [selectedToppings, setSelectedToppings] = useState<{ name: string; price: number }[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout & receipt states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any | null>(null);

  // Filter menu
  const filteredMenu = activeCategory === "all" 
    ? DRINK_MENU 
    : DRINK_MENU.filter(item => item.category === activeCategory);

  const handleToppingToggle = (topping: { name: string; price: number }) => {
    if (selectedToppings.some(t => t.name === topping.name)) {
      setSelectedToppings(selectedToppings.filter(t => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const calculateItemPrice = () => {
    if (!selectedDrink) return 0;
    let basePrice = selectedDrink.price;
    if (customSize === "L") basePrice += 10;
    const toppingsPrice = selectedToppings.reduce((acc, cur) => acc + cur.price, 0);
    return (basePrice + toppingsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedDrink) return;

    const toppingsPrice = selectedToppings.reduce((acc, cur) => acc + cur.price, 0);
    const itemPrice = (selectedDrink.price + (customSize === "L" ? 10 : 0) + toppingsPrice) * quantity;

    const newCartItem: CartItem = {
      cartId: `${selectedDrink.id}-${Date.now()}`,
      drink: selectedDrink,
      size: customSize,
      ice: customIce,
      sugar: customSugar,
      toppings: [...selectedToppings],
      quantity,
      totalPrice: itemPrice
    };

    setCart([...cart, newCartItem]);
    setSelectedDrink(null); // Close modal
    
    // Reset options
    setCustomSize("L");
    setCustomIce("微冰");
    setCustomSugar("半糖(50%)");
    setSelectedToppings([]);
    setQuantity(1);
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const getCartTotal = () => {
    return cart.reduce((acc, cur) => acc + cur.totalPrice, 0);
  };

  // Submit Order to Simulated API Gateway
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      // Simulate API Gateway call POST /api/drink-order
      const response = await fetch("/api/drink-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.drink.id,
            name: item.drink.name,
            size: item.size,
            ice: item.ice,
            sugar: item.sugar,
            toppings: item.toppings.map(t => t.name),
            quantity: item.quantity,
            price: item.totalPrice
          })),
          totalAmount: getCartTotal(),
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const orderData = await response.json();
        setOrderReceipt(orderData);
        setCart([]); // Clear cart
      } else {
        // Fallback simulated order receipt in case routing fails
        throw new Error("API call failed, fallback to simulated receipt");
      }
    } catch (error) {
      console.warn("API route not found, generating simulated response:", error);
      // Simulate successful client-side fallback response
      setTimeout(() => {
        setOrderReceipt({
          orderId: `DK-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
          status: "received",
          items: cart,
          totalAmount: getCartTotal(),
          waitTimeMinutes: 10 + Math.floor(Math.random() * 15),
          timestamp: new Date().toLocaleString()
        });
        setCart([]); // Clear cart
      }, 1500);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };

  return (
    <div className="bg-[#FAF6F0] text-[#2C221E] font-sans antialiased min-h-screen selection:bg-[#8B5E3C] selection:text-white">
      {/* App Header */}
      <header className="fixed top-0 left-0 right-0 z-45 bg-white/95 backdrop-blur-md border-b border-[#EBE5DC]/80 shadow-md shadow-gray-200/40 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 p-2 bg-[#FAF6F0] border border-[#EBE5DC] text-[#6A5A53] hover:text-[#8B5E3C] rounded-xl hover:border-[#8B5E3C]/30 transition-all font-bold text-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              <span>返回商城</span>
            </Link>
            <div className="h-6 w-[1px] bg-[#EBE5DC]"></div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-wide text-[#2C221E] leading-none flex items-center gap-1.5">
                🍹 漁見飲料訂購系統
              </span>
              <span className="text-[10px] text-[#8A7A72] font-semibold tracking-wider mt-1 font-mono">App Portal Demonstration</span>
            </div>
          </div>
          <div className="text-xs font-mono text-[#8B5E3C] font-bold bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#8B5E3C] rounded-full animate-ping"></span>
            <span>API Gateway Active</span>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          
          {/* Left Menu Section (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Intro banner */}
            <div className="bg-gradient-to-r from-[#8B5E3C]/10 via-[#FAF6F0] to-white border border-[#EBE5DC] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-16 h-16 bg-[#8B5E3C] rounded-2xl flex items-center justify-center text-white text-3xl shadow-md flex-shrink-0">
                🍹
              </div>
              <div className="space-y-1 text-center sm:text-left">
                <h2 className="text-base font-extrabold text-[#2C221E]">歡迎使用手搖飲自助點餐系統</h2>
                <p className="text-xs text-[#6A5A53] leading-relaxed">
                  本應用程式為 <strong>App Portal 平台</strong> 中的模組範例。您在此點餐並按下結帳後，前台介面會發送點單 Payload 呼叫 API Gateway，展示雲端 SDK 調用與訂單生成流向。
                </p>
              </div>
            </div>

            {/* Menu Category tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#EBE5DC] pb-4">
              {[
                { id: "all", label: "全部飲品" },
                { id: "original", label: "經典原茶" },
                { id: "milk-tea", label: "醇香奶茶" },
                { id: "latte", label: "鮮奶拿鐵" },
                { id: "coffee", label: "研磨咖啡" }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all border shadow-sm ${
                    activeCategory === cat.id
                      ? "bg-[#8B5E3C] text-white border-[#8B5E3C] shadow-amber-900/10"
                      : "bg-white hover:bg-[#F3EFE9] text-[#6A5A53] hover:text-[#2C221E] border-[#EBE5DC]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Drink items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMenu.map(drink => (
                <div 
                  key={drink.id}
                  onClick={() => setSelectedDrink(drink)}
                  className="bg-white border border-[#EBE5DC] rounded-2xl p-4 flex gap-4 hover:border-[#8B5E3C]/30 hover:shadow-lg hover:shadow-amber-900/5 transition-all duration-300 cursor-pointer group relative"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#EBE5DC]/50 flex-shrink-0">
                    <Image
                      src={drink.image}
                      alt={drink.name}
                      fill
                      sizes="96px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-between flex-grow min-w-0">
                    <div>
                      <h3 className="text-sm font-extrabold text-[#2C221E] group-hover:text-[#8B5E3C] transition-colors line-clamp-1">{drink.name}</h3>
                      <p className="text-[11px] text-[#6A5A53] mt-1 line-clamp-2 leading-relaxed">{drink.description}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-extrabold text-[#8B5E3C]">NT$ {drink.price} <span className="text-[10px] text-[#8A7A72] font-normal">起</span></span>
                      <span className="text-[10px] bg-[#FAF6F0] text-[#8B5E3C] font-extrabold px-2.5 py-1 rounded-lg border border-[#EBE5DC] group-hover:bg-[#8B5E3C] group-hover:text-white group-hover:border-[#8B5E3C] transition-all">
                        選擇
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Cart Section (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#EBE5DC] rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-[#2C221E] flex items-center gap-2 border-b border-[#EBE5DC] pb-3">
                🛒 您的點購清單
                <span className="text-[10px] bg-[#8B5E3C] text-white px-2 py-0.5 rounded-full font-mono">{cart.length}</span>
              </h3>

              {cart.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <div className="text-4xl">🍹</div>
                  <div className="text-xs font-bold text-[#6A5A53]">購物車目前為空</div>
                  <p className="text-[10px] text-[#8A7A72] max-w-xs mx-auto">點選左側的飲品卡片，客製化甜度與冰量，將它們加入清單吧！</p>
                </div>
              ) : (
                <>
                  {/* Cart items list */}
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div key={item.cartId} className="bg-[#FAF6F0]/50 border border-[#EBE5DC]/50 rounded-xl p-3 flex justify-between gap-3 text-[11px]">
                        <div className="min-w-0 space-y-1">
                          <div className="font-extrabold text-[#2C221E] truncate">{item.drink.name} ({item.size})</div>
                          <div className="text-[#8A7A72] text-[10px] flex flex-wrap gap-1 items-center">
                            <span>{item.sugar}</span>
                            <span>/</span>
                            <span>{item.ice}</span>
                            {item.toppings.length > 0 && (
                              <>
                                <span>/</span>
                                <span className="text-[#8B5E3C]">{item.toppings.map(t => t.name).join(", ")}</span>
                              </>
                            )}
                          </div>
                          <div className="text-[#6A5A53]">數量: {item.quantity} 杯</div>
                        </div>
                        <div className="flex flex-col justify-between items-end flex-shrink-0">
                          <button
                            onClick={() => handleRemoveFromCart(item.cartId)}
                            className="text-[#8A7A72] hover:text-rose-500 p-0.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="刪除品項"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                          <span className="font-extrabold text-[#2C221E]">NT$ {item.totalPrice}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="border-t border-[#EBE5DC] pt-4 space-y-2 text-xs">
                    <div className="flex justify-between font-bold text-[#6A5A53]">
                      <span>小計</span>
                      <span>NT$ {getCartTotal()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#6A5A53]">
                      <span>運費 / 服務費</span>
                      <span className="text-[#52796F]">免費</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-sm text-[#2C221E] pt-2 border-t border-dashed border-[#EBE5DC]">
                      <span>應付金額</span>
                      <span className="text-[#8B5E3C] text-base">NT$ {getCartTotal()}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={handleCheckout}
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#D9A05B] hover:from-[#724C30] hover:to-[#B69F83] text-white py-3 rounded-xl text-xs font-extrabold tracking-wide shadow-md shadow-amber-900/10 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>傳送訂單 Payload 至 API...</span>
                      </>
                    ) : (
                      <>
                        <span>送出訂單 (呼叫 API Checkout)</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Item Customization Modal */}
      {selectedDrink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#2C221E]/60 backdrop-blur-[2px]"
            onClick={() => setSelectedDrink(null)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-lg bg-white border border-[#EBE5DC] rounded-2xl shadow-2xl overflow-hidden z-10 animate-scaleUp text-xs flex flex-col justify-between max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-[#EBE5DC] flex justify-between items-start bg-[#FAF6F0]/50">
              <div className="flex gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#EBE5DC]">
                  <Image src={selectedDrink.image} alt={selectedDrink.name} fill sizes="48px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-extrabold text-[#2C221E] text-sm">{selectedDrink.name}</h4>
                  <div className="text-[10px] text-[#6A5A53] mt-0.5">基礎價: NT$ {selectedDrink.price}</div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedDrink(null)}
                className="text-[#6A5A53] hover:text-[#2C221E] p-1 border border-[#EBE5DC] bg-white rounded-lg hover:border-[#8B5E3C]/30 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Customizer Body */}
            <div className="p-5 overflow-y-auto space-y-5 flex-grow">
              
              {/* Size */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">規格容量</div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setCustomSize("M")}
                    className={`py-2 rounded-xl border font-bold text-center transition-all ${
                      customSize === "M"
                        ? "bg-[#8B5E3C]/10 border-[#8B5E3C] text-[#8B5E3C]"
                        : "bg-white border-[#EBE5DC] text-[#6A5A53] hover:bg-[#FAF6F0]"
                    }`}
                  >
                    中杯 (Medium)
                  </button>
                  <button
                    onClick={() => setCustomSize("L")}
                    className={`py-2 rounded-xl border font-bold text-center transition-all ${
                      customSize === "L"
                        ? "bg-[#8B5E3C]/10 border-[#8B5E3C] text-[#8B5E3C]"
                        : "bg-white border-[#EBE5DC] text-[#6A5A53] hover:bg-[#FAF6F0]"
                    }`}
                  >
                    大杯 (Large) <span className="text-[10px] text-[#8B5E3C] font-extrabold">(+10元)</span>
                  </button>
                </div>
              </div>

              {/* Sugar Level */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">甜度客製 (冰飲適用)</div>
                <div className="grid grid-cols-3 gap-2">
                  {SUGAR_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setCustomSugar(opt)}
                      className={`py-2 rounded-xl border font-bold text-center transition-all ${
                        customSugar === opt
                          ? "bg-[#8B5E3C]/10 border-[#8B5E3C] text-[#8B5E3C]"
                          : "bg-white border-[#EBE5DC] text-[#6A5A53] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      {opt.split("(")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ice Level */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">冰量選擇</div>
                <div className="grid grid-cols-5 gap-2">
                  {ICE_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setCustomIce(opt)}
                      className={`py-1.5 rounded-xl border font-bold text-[10px] text-center transition-all ${
                        customIce === opt
                          ? "bg-[#8B5E3C]/10 border-[#8B5E3C] text-[#8B5E3C]"
                          : "bg-white border-[#EBE5DC] text-[#6A5A53] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toppings */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">自選加料 (配料客製)</div>
                <div className="grid grid-cols-2 gap-3">
                  {TOPPING_OPTIONS.map(topping => {
                    const isSelected = selectedToppings.some(t => t.name === topping.name);
                    return (
                      <button
                        key={topping.name}
                        onClick={() => handleToppingToggle(topping)}
                        className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-between transition-all ${
                          isSelected
                            ? "bg-[#8B5E3C]/10 border-[#8B5E3C] text-[#8B5E3C]"
                            : "bg-white border-[#EBE5DC] text-[#6A5A53] hover:bg-[#FAF6F0]"
                        }`}
                      >
                        <span>{topping.name}</span>
                        <span className="text-[10px] text-[#8B5E3C] font-extrabold">+{topping.price}元</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex justify-between items-center border-t border-[#EBE5DC] pt-4">
                <span className="font-extrabold text-[#2C221E]">購買數量</span>
                <div className="flex items-center gap-3 bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DC] flex items-center justify-center font-bold text-base hover:text-[#8B5E3C]"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-extrabold text-[#2C221E]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DC] flex items-center justify-center font-bold text-base hover:text-[#8B5E3C]"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Customizer Footer */}
            <div className="p-5 border-t border-[#EBE5DC] bg-[#FAF6F0]/50 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-[#8A7A72] font-bold">品項金額</span>
                <div className="text-base font-extrabold text-[#8B5E3C] mt-0.5">NT$ {calculateItemPrice()}</div>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-[#8B5E3C] hover:bg-[#724C30] text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md shadow-amber-900/15 active:scale-95 transition-all"
              >
                加入購物車
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Order Success / Receipt Modal Overlay */}
      {orderReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-[#2C221E]/60 backdrop-blur-[2px]" />

          {/* Receipt Panel */}
          <div className="relative w-full max-w-md bg-white border border-[#EBE5DC] rounded-2xl shadow-2xl p-6 z-10 animate-scaleUp text-xs space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Header status */}
            <div className="text-center space-y-2 border-b border-[#EBE5DC] pb-5">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto shadow-sm">
                ✓
              </div>
              <h3 className="text-base font-extrabold text-[#2C221E]">訂單生成成功</h3>
              <p className="text-[10px] text-[#52796F] font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full inline-block">
                狀態: 製作中 (Preparing)
              </p>
            </div>

            {/* Order details details */}
            <div className="space-y-4">
              <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#EBE5DC] space-y-2">
                <div className="flex justify-between text-[#8A7A72] font-semibold font-mono">
                  <span>訂單編號</span>
                  <span className="text-[#2C221E] font-extrabold">{orderReceipt.orderId}</span>
                </div>
                <div className="flex justify-between text-[#8A7A72] font-semibold font-mono">
                  <span>交易時間</span>
                  <span>{orderReceipt.timestamp}</span>
                </div>
                <div className="flex justify-between text-[#8A7A72] font-semibold font-mono">
                  <span>預估等待時間</span>
                  <span className="text-[#8B5E3C] font-extrabold">{orderReceipt.waitTimeMinutes} 分鐘</span>
                </div>
                <div className="flex justify-between text-[#8A7A72] font-semibold font-mono">
                  <span>處理端閘道</span>
                  <span>API Gateway Vercel</span>
                </div>
              </div>

              {/* Items Summary list */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">訂購品項明細</div>
                <div className="border border-[#EBE5DC] rounded-xl overflow-hidden divide-y divide-[#EBE5DC]">
                  {orderReceipt.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white flex justify-between gap-3 items-center">
                      <div>
                        <div className="font-extrabold text-[#2C221E]">{item.drink?.name || item.name} ({item.size})</div>
                        <div className="text-[10px] text-[#8A7A72] mt-0.5">
                          {item.sugar} / {item.ice} 
                          {item.toppings?.length > 0 && ` / 加料: ${item.toppings.join(", ")}`}
                        </div>
                        <div className="text-[10px] text-[#8A7A72] mt-0.5">數量: {item.quantity} 杯</div>
                      </div>
                      <span className="font-extrabold text-[#2C221E] text-xs">NT$ {item.totalPrice || item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price total */}
              <div className="flex justify-between items-center border-t border-dashed border-[#EBE5DC] pt-4 font-extrabold text-sm text-[#2C221E]">
                <span>結帳總額 (已付)</span>
                <span className="text-[#8B5E3C] text-lg">NT$ {orderReceipt.totalAmount}</span>
              </div>
            </div>

            {/* QR Code section */}
            <div className="text-center p-4 bg-[#FAF6F0]/60 border border-[#EBE5DC] rounded-xl space-y-2">
              <div className="flex justify-center">
                {/* Simulated QR Code SVG */}
                <svg className="w-24 h-24 text-[#2C221E]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                  <rect x="5" y="5" width="25" height="25" rx="2" />
                  <rect x="10" y="10" width="15" height="15" fill="currentColor" />
                  <rect x="70" y="5" width="25" height="25" rx="2" />
                  <rect x="75" y="10" width="15" height="15" fill="currentColor" />
                  <rect x="5" y="70" width="25" height="25" rx="2" />
                  <rect x="10" y="75" width="15" height="15" fill="currentColor" />
                  {/* Random QR pixels */}
                  <rect x="40" y="10" width="10" height="10" fill="currentColor" />
                  <rect x="50" y="20" width="10" height="15" fill="currentColor" />
                  <rect x="15" y="45" width="10" height="10" fill="currentColor" />
                  <rect x="40" y="45" width="15" height="15" fill="currentColor" />
                  <rect x="45" y="70" width="15" height="15" fill="currentColor" />
                  <rect x="80" y="45" width="10" height="10" fill="currentColor" />
                  <rect x="70" y="80" width="15" height="10" fill="currentColor" />
                </svg>
              </div>
              <div className="text-[9px] text-[#8A7A72] font-semibold leading-normal font-sans">
                請憑此 QR Code 至櫃檯取餐<br />或提供代碼給外送服務人員
              </div>
            </div>

            {/* Bottom action */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOrderReceipt(null)}
                className="flex-1 bg-[#FAF6F0] hover:bg-[#F3EFE9] border border-[#EBE5DC] text-[#6A5A53] hover:text-[#2C221E] py-2.5 rounded-xl font-bold transition-all text-center"
              >
                再點一單
              </button>
              <Link
                href="/"
                className="flex-1 bg-[#8B5E3C] hover:bg-[#724C30] text-white py-2.5 rounded-xl font-bold transition-all text-center block"
              >
                返回工具中心
              </Link>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
