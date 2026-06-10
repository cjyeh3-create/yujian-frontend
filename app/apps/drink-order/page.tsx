"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Customized interfaces
export interface SizeOption {
  name: string;
  priceOffset: number;
}

export interface ToppingOption {
  name: string;
  price: number;
}

export interface DrinkItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  sizes?: SizeOption[];
  sugars?: string[];
  ices?: string[];
  toppings?: ToppingOption[];
}

export interface CartItem {
  cartId: string;
  drink: DrinkItem;
  size: SizeOption;
  ice: string;
  sugar: string;
  toppings: ToppingOption[];
  quantity: number;
  totalPrice: number;
}

// Fallback System Defaults
const DEFAULT_ICE_OPTIONS = ["正常冰", "少冰", "微冰", "去冰", "熱"];
const DEFAULT_SUGAR_OPTIONS = ["正常糖(100%)", "少糖(70%)", "半糖(50%)", "微糖(30%)", "無糖(0%)"];
const DEFAULT_SIZE_OPTIONS: SizeOption[] = [
  { name: "中杯 (Medium)", priceOffset: 0 },
  { name: "大杯 (Large)", priceOffset: 10 }
];
const DEFAULT_TOPPING_OPTIONS: ToppingOption[] = [
  { name: "手作珍珠", price: 10 },
  { name: "椰果", price: 10 },
  { name: "布丁", price: 15 },
  { name: "仙草凍", price: 10 }
];

// Seed Menu Data
const DRINK_MENU: DrinkItem[] = [
  {
    id: "ruby-black",
    name: "經典紅玉 (Ruby Black Tea)",
    price: 35,
    category: "original",
    description: "嚴選日月潭紅玉紅茶，茶湯紅潤，帶有天然肉桂與薄荷淡雅香氣。",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80",
    sizes: [
      { name: "中杯 (Medium)", priceOffset: 0 },
      { name: "大杯 (Large)", priceOffset: 10 }
    ],
    sugars: ["正常糖(100%)", "少糖(70%)", "半糖(50%)", "微糖(30%)", "無糖(0%)"],
    ices: ["正常冰", "少冰", "微冰", "去冰", "熱"],
    toppings: [
      { name: "手作珍珠", price: 10 },
      { name: "椰果", price: 10 },
      { name: "布丁", price: 15 },
      { name: "仙草凍", price: 10 }
    ]
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
    image: "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=400&auto=format&fit=crop&q=80",
    toppings: [
      { name: "手作黑糖珍珠", price: 12 },
      { name: "椰果", price: 10 },
      { name: "雙倍珍珠", price: 18 }
    ]
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
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=400&auto=format&fit=crop&q=80",
    toppings: [
      { name: "紅豆豆沙", price: 15 },
      { name: "小農鮮奶泡", price: 10 }
    ]
  },
  {
    id: "americano",
    name: "漁夫美式咖啡 (Americano)",
    price: 60,
    category: "coffee",
    description: "精選中深烘焙咖啡豆，醇厚可口，提神解疲的最佳選擇。",
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop&q=80",
    sizes: [
      { name: "標準杯 (Standard)", priceOffset: 0 },
      { name: "大杯 (Grande)", priceOffset: 15 },
      { name: "特大杯 (Venti)", priceOffset: 25 }
    ],
    sugars: ["無糖(0%)", "微糖(30%)", "半糖(50%)"],
    ices: ["冰美式", "去冰美式", "熱美式"],
    toppings: [
      { name: "義式濃縮單份 (Extra Shot)", price: 20 },
      { name: "焦糖淋醬", price: 10 }
    ]
  },
  {
    id: "cafe-latte",
    name: "晨光拿鐵咖啡 (Cafe Latte)",
    price: 75,
    category: "coffee",
    description: "黃金比例濃縮咖啡與綿密鮮奶泡沫，奶香濃郁口感溫潤。",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop&q=80",
    sizes: [
      { name: "標準杯 (Standard)", priceOffset: 0 },
      { name: "特大杯 (Venti)", priceOffset: 20 }
    ],
    sugars: ["無糖(0%)", "微糖(30%)", "半糖(50%)", "正常糖(100%)"],
    ices: ["冰拿鐵", "去冰拿鐵", "熱拿鐵"],
    toppings: [
      { name: "香草風味糖漿", price: 15 },
      { name: "榛果風味糖漿", price: 15 },
      { name: "燕麥奶更換", price: 20 }
    ]
  }
];

export default function DrinkOrderPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedDrink, setSelectedDrink] = useState<DrinkItem | null>(null);
  
  // Customization modal states
  const [customSize, setCustomSize] = useState<SizeOption | null>(null);
  const [customIce, setCustomIce] = useState("微冰");
  const [customSugar, setCustomSugar] = useState("半糖(50%)");
  const [selectedToppings, setSelectedToppings] = useState<ToppingOption[]>([]);
  const [quantity, setQuantity] = useState(1);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Checkout & receipt states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderReceipt, setOrderReceipt] = useState<any | null>(null);

  // Dynamic Custom Menu State
  const [menu, setMenu] = useState<DrinkItem[]>([]);
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Admin form state
  const [editingDrink, setEditingDrink] = useState<DrinkItem | null>(null);
  const [isNewDrink, setIsNewDrink] = useState(false);

  const [formName, setFormName] = useState("");
  const [formPrice, setFormPrice] = useState(35);
  const [formCategory, setFormCategory] = useState("original");
  const [formImage, setFormImage] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formSizes, setFormSizes] = useState<SizeOption[]>([]);
  const [formSugars, setFormSugars] = useState("");
  const [formIces, setFormIces] = useState("");
  const [formToppings, setFormToppings] = useState<ToppingOption[]>([]);

  // Local storage initialization
  useEffect(() => {
    const savedMenu = localStorage.getItem("yujian_drink_menu");
    if (savedMenu) {
      try {
        setMenu(JSON.parse(savedMenu));
      } catch (e) {
        setMenu(DRINK_MENU);
      }
    } else {
      setMenu(DRINK_MENU);
    }
    setMounted(true);
  }, []);

  const saveMenu = (newMenu: DrinkItem[]) => {
    setMenu(newMenu);
    localStorage.setItem("yujian_drink_menu", JSON.stringify(newMenu));
  };

  const handleResetMenu = () => {
    if (window.confirm("確定要重設為預設菜單嗎？這會清除所有自訂品項及客製化設定。")) {
      saveMenu(DRINK_MENU);
      setEditingDrink(null);
      setIsNewDrink(false);
    }
  };

  // Filter menu
  const currentMenu = mounted ? menu : DRINK_MENU;
  const filteredMenu = activeCategory === "all" 
    ? currentMenu 
    : currentMenu.filter(item => item.category === activeCategory);

  // Load configuration details for selected drink
  const handleOpenCustomizer = (drink: DrinkItem) => {
    setSelectedDrink(drink);
    
    const sizes = drink.sizes && drink.sizes.length > 0 ? drink.sizes : DEFAULT_SIZE_OPTIONS;
    const sugars = drink.sugars && drink.sugars.length > 0 ? drink.sugars : DEFAULT_SUGAR_OPTIONS;
    const ices = drink.ices && drink.ices.length > 0 ? drink.ices : DEFAULT_ICE_OPTIONS;
    
    setCustomSize(sizes[0]);
    setCustomIce(ices.includes("微冰") ? "微冰" : ices[0] || "");
    setCustomSugar(sugars.includes("半糖(50%)") ? "半糖(50%)" : sugars[0] || "");
    setSelectedToppings([]);
    setQuantity(1);
  };

  const handleToppingToggle = (topping: ToppingOption) => {
    if (selectedToppings.some(t => t.name === topping.name)) {
      setSelectedToppings(selectedToppings.filter(t => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const calculateItemPrice = () => {
    if (!selectedDrink || !customSize) return 0;
    const basePrice = selectedDrink.price;
    const sizeOffset = customSize.priceOffset;
    const toppingsPrice = selectedToppings.reduce((acc, cur) => acc + cur.price, 0);
    return (basePrice + sizeOffset + toppingsPrice) * quantity;
  };

  const handleAddToCart = () => {
    if (!selectedDrink || !customSize) return;

    const toppingsPrice = selectedToppings.reduce((acc, cur) => acc + cur.price, 0);
    const itemPrice = (selectedDrink.price + customSize.priceOffset + toppingsPrice) * quantity;

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
  };

  const handleRemoveFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const getCartTotal = () => {
    return cart.reduce((acc, cur) => acc + cur.totalPrice, 0);
  };

  // Submit Order to Gateway
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/drink-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            id: item.drink.id,
            name: item.drink.name,
            size: item.size.name,
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
        setCart([]);
      } else {
        throw new Error("API call failed, fallback to simulated receipt");
      }
    } catch (error) {
      console.warn("API route not found, generating simulated response:", error);
      setTimeout(() => {
        setOrderReceipt({
          orderId: `DK-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2, "0")}${new Date().getDate().toString().padStart(2, "0")}-${Math.floor(1000 + Math.random() * 9000)}`,
          status: "received",
          items: cart,
          totalAmount: getCartTotal(),
          waitTimeMinutes: 10 + Math.floor(Math.random() * 15),
          timestamp: new Date().toLocaleString()
        });
        setCart([]);
      }, 1500);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };

  // Admin Dashboard Operations
  const handleStartEdit = (drink: DrinkItem) => {
    setEditingDrink(drink);
    setIsNewDrink(false);
    
    setFormName(drink.name);
    setFormPrice(drink.price);
    setFormCategory(drink.category);
    setFormImage(drink.image);
    setFormDescription(drink.description);
    
    setFormSizes(drink.sizes || [...DEFAULT_SIZE_OPTIONS]);
    setFormSugars((drink.sugars || DEFAULT_SUGAR_OPTIONS).join(","));
    setFormIces((drink.ices || DEFAULT_ICE_OPTIONS).join(","));
    setFormToppings(drink.toppings || [...DEFAULT_TOPPING_OPTIONS]);
  };

  const handleStartNewDrink = () => {
    setEditingDrink(null);
    setIsNewDrink(true);
    
    setFormName("");
    setFormPrice(35);
    setFormCategory("original");
    setFormImage("https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80");
    setFormDescription("");
    setFormSizes([...DEFAULT_SIZE_OPTIONS]);
    setFormSugars(DEFAULT_SUGAR_OPTIONS.join(","));
    setFormIces(DEFAULT_ICE_OPTIONS.join(","));
    setFormToppings([...DEFAULT_TOPPING_OPTIONS]);
  };

  const handleAddSizeRow = () => {
    setFormSizes([...formSizes, { name: "", priceOffset: 0 }]);
  };

  const handleRemoveSizeRow = (index: number) => {
    setFormSizes(formSizes.filter((_, i) => i !== index));
  };

  const handleSizeChange = (index: number, field: "name" | "priceOffset", value: any) => {
    const updated = formSizes.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: field === "priceOffset" ? Number(value) : value };
      }
      return item;
    });
    setFormSizes(updated);
  };

  const handleAddToppingRow = () => {
    setFormToppings([...formToppings, { name: "", price: 0 }]);
  };

  const handleRemoveToppingRow = (index: number) => {
    setFormToppings(formToppings.filter((_, i) => i !== index));
  };

  const handleToppingChange = (index: number, field: "name" | "price", value: any) => {
    const updated = formToppings.map((item, i) => {
      if (i === index) {
        return { ...item, [field]: field === "price" ? Number(value) : value };
      }
      return item;
    });
    setFormToppings(updated);
  };

  const handleSaveDrink = () => {
    if (!formName.trim()) {
      alert("請輸入商品名稱");
      return;
    }
    
    const sizeList = formSizes.filter(s => s.name.trim() !== "");
    const toppingList = formToppings.filter(t => t.name.trim() !== "");
    const sugarList = formSugars.split(",").map(s => s.trim()).filter(s => s !== "");
    const iceList = formIces.split(",").map(i => i.trim()).filter(i => i !== "");
    
    const drinkData: DrinkItem = {
      id: editingDrink ? editingDrink.id : `drink-${Date.now()}`,
      name: formName,
      price: Number(formPrice),
      category: formCategory,
      description: formDescription,
      image: formImage || "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&auto=format&fit=crop&q=80",
      sizes: sizeList,
      sugars: sugarList,
      ices: iceList,
      toppings: toppingList
    };
    
    let newMenu = [];
    if (isNewDrink) {
      newMenu = [...menu, drinkData];
      setIsNewDrink(false);
    } else {
      newMenu = menu.map(m => m.id === drinkData.id ? drinkData : m);
    }
    
    saveMenu(newMenu);
    setEditingDrink(null);
    alert("商品設定儲存成功！");
  };

  const handleDeleteDrink = (id: string) => {
    if (window.confirm("確定要刪除此商品嗎？")) {
      const newMenu = menu.filter(m => m.id !== id);
      saveMenu(newMenu);
      if (editingDrink?.id === id) {
        setEditingDrink(null);
      }
      alert("商品已刪除！");
    }
  };

  return (
    <div className="bg-[#FAF6F0] text-[#2C221E] font-sans antialiased min-h-screen selection:bg-[#8B5E3C] selection:text-white">
      {/* App Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EBE5DC]/80 shadow-md shadow-gray-200/40 py-4 px-6">
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
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAdminMode(!isAdminMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border shadow-sm flex items-center gap-1.5 cursor-pointer ${
                isAdminMode
                  ? "bg-[#D9A05B] text-white border-[#D9A05B]"
                  : "bg-white hover:bg-[#F3EFE9] text-[#6A5A53] hover:text-[#2C221E] border-[#EBE5DC]"
              }`}
            >
              <span>{isAdminMode ? "👁️ 瀏覽菜單" : "🛠️ 系統資料自訂模式"}</span>
            </button>
            <div className="hidden sm:flex text-xs font-mono text-[#8B5E3C] font-bold bg-[#8B5E3C]/10 border border-[#8B5E3C]/20 px-3 py-1 rounded-full items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-[#8B5E3C] rounded-full animate-ping"></span>
              <span>API Gateway Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main layout */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
          
          {/* Left Main Dashboard Area (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Conditional Rendering: Admin Console vs Menu Selector */}
            {isAdminMode ? (
              <div className="bg-white border border-[#EBE5DC] rounded-2xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-[#EBE5DC] pb-4 flex-wrap gap-3">
                  <div>
                    <h2 className="text-base font-extrabold text-[#2C221E]">🍹 商品與規格管理後台</h2>
                    <p className="text-xs text-[#8A7A72] mt-0.5">您可以自訂各種飲料品項、基礎金額、尺寸容量、自選配料與細部糖冰選項</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleStartNewDrink}
                      className="px-3.5 py-2 bg-[#8B5E3C] hover:bg-[#724C30] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      + 新建商品
                    </button>
                    <button
                      onClick={handleResetMenu}
                      className="px-3.5 py-2 bg-white hover:bg-rose-50 border border-[#EBE5DC] hover:border-rose-300 text-rose-600 hover:text-rose-700 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
                    >
                      重設為預設
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* Left Column: Drink selector */}
                  <div className="md:col-span-4 border-r border-[#EBE5DC] pr-2 space-y-2 max-h-[500px] overflow-y-auto pr-3">
                    <div className="text-[11px] font-bold text-[#8A7A72] uppercase tracking-wider mb-2">商品列表 ({currentMenu.length})</div>
                    {currentMenu.map(drink => (
                      <div
                        key={drink.id}
                        onClick={() => handleStartEdit(drink)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                          editingDrink?.id === drink.id && !isNewDrink
                            ? "bg-[#8B5E3C]/5 border-[#8B5E3C]"
                            : "bg-[#FAF6F0]/50 hover:bg-[#FAF6F0] border-[#EBE5DC]"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white border border-[#EBE5DC] flex-shrink-0">
                            <Image src={drink.image} alt={drink.name} fill sizes="32px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-extrabold text-[#2C221E] truncate">{drink.name}</div>
                            <div className="text-[10px] text-[#8B5E3C] font-extrabold">NT$ {drink.price} 起</div>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDrink(drink.id);
                          }}
                          className="text-[#8A7A72] hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors flex-shrink-0"
                          title="刪除"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Customizer Editor Form */}
                  <div className="md:col-span-8 space-y-4">
                    {(editingDrink || isNewDrink) ? (
                      <div className="space-y-4 animate-fadeIn">
                        <div className="text-xs font-extrabold text-[#8B5E3C] bg-[#8B5E3C]/5 border border-[#8B5E3C]/15 px-3 py-2 rounded-xl">
                          {isNewDrink ? "✨ 正在建立全新飲品資料" : `🛠️ 正在修改：${editingDrink?.name}`}
                        </div>

                        {/* Basic Info */}
                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div className="space-y-1">
                            <label className="font-bold text-[#2C221E]">商品名稱</label>
                            <input
                              type="text"
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              placeholder="例如：手採蜜香紅茶"
                              className="w-full bg-[#FAF6F0] border border-[#EBE5DC] p-2 rounded-lg text-xs focus:outline-none focus:border-[#8B5E3C]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-[#2C221E]">基礎定價 (NT$)</label>
                            <input
                              type="number"
                              value={formPrice}
                              onChange={(e) => setFormPrice(Number(e.target.value))}
                              className="w-full bg-[#FAF6F0] border border-[#EBE5DC] p-2 rounded-lg text-xs focus:outline-none focus:border-[#8B5E3C]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-[11px]">
                          <div className="space-y-1">
                            <label className="font-bold text-[#2C221E]">商品分類</label>
                            <select
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value)}
                              className="w-full bg-[#FAF6F0] border border-[#EBE5DC] p-2 rounded-lg text-xs focus:outline-none focus:border-[#8B5E3C]"
                            >
                              <option value="original">經典原茶</option>
                              <option value="milk-tea">醇香奶茶</option>
                              <option value="latte">鮮奶拿鐵</option>
                              <option value="coffee">研磨咖啡</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-[#2C221E]">商品圖片網址</label>
                            <input
                              type="text"
                              value={formImage}
                              onChange={(e) => setFormImage(e.target.value)}
                              placeholder="https://..."
                              className="w-full bg-[#FAF6F0] border border-[#EBE5DC] p-2 rounded-lg text-xs focus:outline-none focus:border-[#8B5E3C]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1 text-[11px]">
                          <label className="font-bold text-[#2C221E]">商品描述說明</label>
                          <textarea
                            value={formDescription}
                            onChange={(e) => setFormDescription(e.target.value)}
                            placeholder="請填寫飲品簡短介紹..."
                            rows={2}
                            className="w-full bg-[#FAF6F0] border border-[#EBE5DC] p-2 rounded-lg text-xs focus:outline-none focus:border-[#8B5E3C] resize-none"
                          />
                        </div>

                        {/* Size Config */}
                        <div className="space-y-2 border-t border-dashed border-[#EBE5DC] pt-3 text-[11px]">
                          <div className="flex justify-between items-center">
                            <label className="font-extrabold text-[#2C221E] text-xs">📏 規格容量與加價</label>
                            <button
                              onClick={handleAddSizeRow}
                              className="text-[#8B5E3C] hover:text-[#724C30] font-bold text-[10px]"
                            >
                              + 新增尺寸
                            </button>
                          </div>
                          <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                            {formSizes.map((sz, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="尺寸名稱 (例如: 大杯)"
                                  value={sz.name}
                                  onChange={(e) => handleSizeChange(idx, "name", e.target.value)}
                                  className="flex-grow bg-[#FAF6F0] border border-[#EBE5DC] p-1.5 rounded-lg text-[11px] focus:outline-none focus:border-[#8B5E3C]"
                                />
                                <span className="text-[#8A7A72]">+</span>
                                <input
                                  type="number"
                                  placeholder="增價"
                                  value={sz.priceOffset}
                                  onChange={(e) => handleSizeChange(idx, "priceOffset", e.target.value)}
                                  className="w-20 bg-[#FAF6F0] border border-[#EBE5DC] p-1.5 rounded-lg text-[11px] text-center focus:outline-none focus:border-[#8B5E3C]"
                                />
                                <span className="text-[#8A7A72]">元</span>
                                <button
                                  onClick={() => handleRemoveSizeRow(idx)}
                                  className="text-rose-500 hover:text-rose-600 p-1"
                                >
                                  🗑️
                                </button>
                              </div>
                            ))}
                            {formSizes.length === 0 && (
                              <div className="text-center py-2 text-[#8A7A72] text-[10px]">無自訂尺寸，將套用預設尺寸</div>
                            )}
                          </div>
                        </div>

                        {/* Sugar & Ice Config */}
                        <div className="grid grid-cols-2 gap-3 border-t border-dashed border-[#EBE5DC] pt-3 text-[11px]">
                          <div className="space-y-1">
                            <label className="font-extrabold text-[#2C221E] text-xs">🍬 甜度選項 (英文逗號區隔)</label>
                            <input
                              type="text"
                              value={formSugars}
                              onChange={(e) => setFormSugars(e.target.value)}
                              placeholder="正常糖(100%),少糖(70%),半糖(50%)..."
                              className="w-full bg-[#FAF6F0] border border-[#EBE5DC] p-2 rounded-lg text-[11px] focus:outline-none focus:border-[#8B5E3C]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-extrabold text-[#2C221E] text-xs">❄️ 冰量選項 (英文逗號區隔)</label>
                            <input
                              type="text"
                              value={formIces}
                              onChange={(e) => setFormIces(e.target.value)}
                              placeholder="正常冰,少冰,微冰,去冰,熱"
                              className="w-full bg-[#FAF6F0] border border-[#EBE5DC] p-2 rounded-lg text-[11px] focus:outline-none focus:border-[#8B5E3C]"
                            />
                          </div>
                        </div>

                        {/* Topping Config */}
                        <div className="space-y-2 border-t border-dashed border-[#EBE5DC] pt-3 text-[11px]">
                          <div className="flex justify-between items-center">
                            <label className="font-extrabold text-[#2C221E] text-xs">🍧 自選加料配料設定</label>
                            <button
                              onClick={handleAddToppingRow}
                              className="text-[#8B5E3C] hover:text-[#724C30] font-bold text-[10px]"
                            >
                              + 新增配料
                            </button>
                          </div>
                          <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                            {formToppings.map((tp, idx) => (
                              <div key={idx} className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="配料名稱 (例如: 珍珠)"
                                  value={tp.name}
                                  onChange={(e) => handleToppingChange(idx, "name", e.target.value)}
                                  className="flex-grow bg-[#FAF6F0] border border-[#EBE5DC] p-1.5 rounded-lg text-[11px] focus:outline-none focus:border-[#8B5E3C]"
                                />
                                <span className="text-[#8A7A72]">+</span>
                                <input
                                  type="number"
                                  placeholder="配料定價"
                                  value={tp.price}
                                  onChange={(e) => handleToppingChange(idx, "price", e.target.value)}
                                  className="w-20 bg-[#FAF6F0] border border-[#EBE5DC] p-1.5 rounded-lg text-[11px] text-center focus:outline-none focus:border-[#8B5E3C]"
                                />
                                <span className="text-[#8A7A72]">元</span>
                                <button
                                  onClick={() => handleRemoveToppingRow(idx)}
                                  className="text-rose-500 hover:text-rose-600 p-1"
                                >
                                  🗑️
                                </button>
                              </div>
                            ))}
                            {formToppings.length === 0 && (
                              <div className="text-center py-2 text-[#8A7A72] text-[10px]">無自訂配料，將套用預設配料</div>
                            )}
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-3">
                          <button
                            onClick={handleSaveDrink}
                            className="flex-1 py-2 bg-[#8B5E3C] hover:bg-[#724C30] text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer text-center"
                          >
                            儲存商品資料
                          </button>
                          <button
                            onClick={() => {
                              setEditingDrink(null);
                              setIsNewDrink(false);
                            }}
                            className="px-6 py-2 bg-white hover:bg-[#FAF6F0] border border-[#EBE5DC] text-[#6A5A53] hover:text-[#2C221E] rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer text-center"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-24 bg-[#FAF6F0]/30 border border-dashed border-[#EBE5DC] rounded-2xl space-y-3">
                        <div className="text-4xl text-[#8A7A72]">📝</div>
                        <h4 className="text-xs font-extrabold text-[#2C221E]">尚未選取商品進行編輯</h4>
                        <p className="text-[10px] text-[#8A7A72] max-w-xs mx-auto">
                          請於左側列表點選任何現有商品，或點擊「+ 新建商品」來編寫您的自訂規格。
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Intro banner */}
                <div className="bg-gradient-to-r from-[#8B5E3C]/10 via-[#FAF6F0] to-white border border-[#EBE5DC] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center gap-6 animate-fadeIn">
                  <div className="relative w-16 h-16 bg-[#8B5E3C] rounded-2xl flex items-center justify-center text-white text-3xl shadow-md flex-shrink-0">
                    🍹
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <h2 className="text-base font-extrabold text-[#2C221E]">歡迎使用手搖飲自助點餐系統</h2>
                    <p className="text-xs text-[#6A5A53] leading-relaxed">
                      本應用程式已支援<b>「全功能規格自訂」</b>！您可以點選右上角<b>「🛠️ 系統資料自訂模式」</b>，自由地更換飲品內容、更改價額或自定義各飲品的不同容量與配料設定。
                    </p>
                  </div>
                </div>

                {/* Category Selector Tabs */}
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
                      className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all border shadow-sm cursor-pointer ${
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
                      onClick={() => handleOpenCustomizer(drink)}
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
                  {filteredMenu.length === 0 && (
                    <div className="md:col-span-2 text-center py-20 text-[#8A7A72] text-xs">
                      目前分類下沒有任何飲品，您可以在資料自訂模式中新增品項。
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* Right Sidebar: Cart Details (4 Cols) */}
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
                  <p className="text-[10px] text-[#8A7A72] max-w-xs mx-auto">點選選單中感興趣的飲品，調整甜度冰量或容量規格，即可加入清單。</p>
                </div>
              ) : (
                <>
                  {/* Cart items list */}
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {cart.map(item => (
                      <div key={item.cartId} className="bg-[#FAF6F0]/50 border border-[#EBE5DC]/50 rounded-xl p-3 flex justify-between gap-3 text-[11px]">
                        <div className="min-w-0 space-y-1">
                          <div className="font-extrabold text-[#2C221E] truncate">{item.drink.name} ({item.size.name})</div>
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
                            className="text-[#8A7A72] hover:text-rose-500 p-0.5 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
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
                    className="w-full bg-gradient-to-r from-[#8B5E3C] to-[#D9A05B] hover:from-[#724C30] hover:to-[#B69F83] text-white py-3 rounded-xl text-xs font-extrabold tracking-wide shadow-md shadow-amber-900/10 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>傳送訂單 Payload...</span>
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

      {/* Item Customization Modal Dialog */}
      {selectedDrink && customSize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-[#2C221E]/60 backdrop-blur-[2px]"
            onClick={() => setSelectedDrink(null)}
          />

          {/* Modal Box */}
          <div className="relative w-full max-w-lg bg-white border border-[#EBE5DC] rounded-2xl shadow-2xl overflow-hidden z-10 text-xs flex flex-col justify-between max-h-[90vh] animate-scaleUp">
            
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
                className="text-[#6A5A53] hover:text-[#2C221E] p-1 border border-[#EBE5DC] bg-white rounded-lg hover:border-[#8B5E3C]/30 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Customizer Option Fields */}
            <div className="p-5 overflow-y-auto space-y-5 flex-grow">
              
              {/* Sizes */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">規格容量</div>
                <div className={`grid gap-3 ${
                  (selectedDrink.sizes && selectedDrink.sizes.length > 2) || DEFAULT_SIZE_OPTIONS.length > 2 
                    ? 'grid-cols-3' 
                    : 'grid-cols-2'
                }`}>
                  {(selectedDrink.sizes && selectedDrink.sizes.length > 0 ? selectedDrink.sizes : DEFAULT_SIZE_OPTIONS).map(szOpt => (
                    <button
                      key={szOpt.name}
                      onClick={() => setCustomSize(szOpt)}
                      className={`py-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                        customSize.name === szOpt.name
                          ? "bg-[#8B5E3C]/10 border-[#8B5E3C] text-[#8B5E3C]"
                          : "bg-white border-[#EBE5DC] text-[#6A5A53] hover:bg-[#FAF6F0]"
                      }`}
                    >
                      <span>{szOpt.name}</span>
                      {szOpt.priceOffset > 0 && (
                        <span className="text-[10px] text-[#8B5E3C] font-extrabold ml-1">
                          (+{szOpt.priceOffset}元)
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sugars */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">甜度客製 (冰飲適用)</div>
                <div className="grid grid-cols-3 gap-2">
                  {(selectedDrink.sugars && selectedDrink.sugars.length > 0 ? selectedDrink.sugars : DEFAULT_SUGAR_OPTIONS).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setCustomSugar(opt)}
                      className={`py-2 rounded-xl border font-bold text-center transition-all cursor-pointer ${
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

              {/* Ices */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">冰量選擇</div>
                <div className={`grid gap-2 ${
                  (selectedDrink.ices && selectedDrink.ices.length > 4) || DEFAULT_ICE_OPTIONS.length > 4
                    ? 'grid-cols-5' 
                    : 'grid-cols-3'
                }`}>
                  {(selectedDrink.ices && selectedDrink.ices.length > 0 ? selectedDrink.ices : DEFAULT_ICE_OPTIONS).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setCustomIce(opt)}
                      className={`py-1.5 rounded-xl border font-bold text-[10px] text-center transition-all cursor-pointer ${
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
                  {(selectedDrink.toppings && selectedDrink.toppings.length > 0 ? selectedDrink.toppings : DEFAULT_TOPPING_OPTIONS).map(topping => {
                    const isSelected = selectedToppings.some(t => t.name === topping.name);
                    return (
                      <button
                        key={topping.name}
                        onClick={() => handleToppingToggle(topping)}
                        className={`py-2 px-3 rounded-xl border font-bold flex items-center justify-between transition-all cursor-pointer ${
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
                  {((selectedDrink.toppings && selectedDrink.toppings.length === 0) || (!selectedDrink.toppings && DEFAULT_TOPPING_OPTIONS.length === 0)) && (
                    <div className="col-span-2 text-center py-2 text-[#8A7A72]">此飲品不支援額外加料。</div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex justify-between items-center border-t border-[#EBE5DC] pt-4">
                <span className="font-extrabold text-[#2C221E]">購買數量</span>
                <div className="flex items-center gap-3 bg-[#FAF6F0] border border-[#EBE5DC] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DC] flex items-center justify-center font-bold text-base hover:text-[#8B5E3C] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-extrabold text-[#2C221E]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-[#EBE5DC] flex items-center justify-center font-bold text-base hover:text-[#8B5E3C] cursor-pointer"
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
                className="bg-[#8B5E3C] hover:bg-[#724C30] text-white font-extrabold px-6 py-2.5 rounded-xl shadow-md shadow-amber-900/15 active:scale-95 transition-all cursor-pointer"
              >
                加入購物車
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Checkout Receipt modal overlay */}
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

            {/* Order details */}
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

              {/* Items明細 */}
              <div className="space-y-2">
                <div className="font-extrabold text-[#2C221E]">訂購品項明細</div>
                <div className="border border-[#EBE5DC] rounded-xl overflow-hidden divide-y divide-[#EBE5DC]">
                  {orderReceipt.items?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white flex justify-between gap-3 items-center">
                      <div>
                        <div className="font-extrabold text-[#2C221E]">{item.drink?.name || item.name} ({item.size?.name || item.size})</div>
                        <div className="text-[10px] text-[#8A7A72] mt-0.5">
                          {item.sugar} / {item.ice} 
                          {item.toppings?.length > 0 && ` / 加料: ${Array.isArray(item.toppings) ? item.toppings.join(", ") : item.toppings}`}
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

            {/* QR Code */}
            <div className="text-center p-4 bg-[#FAF6F0]/60 border border-[#EBE5DC] rounded-xl space-y-2">
              <div className="flex justify-center">
                <svg className="w-24 h-24 text-[#2C221E]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
                  <rect x="5" y="5" width="25" height="25" rx="2" />
                  <rect x="10" y="10" width="15" height="15" fill="currentColor" />
                  <rect x="70" y="5" width="25" height="25" rx="2" />
                  <rect x="75" y="10" width="15" height="15" fill="currentColor" />
                  <rect x="5" y="70" width="25" height="25" rx="2" />
                  <rect x="10" y="75" width="15" height="15" fill="currentColor" />
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

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setOrderReceipt(null)}
                className="flex-1 bg-[#FAF6F0] hover:bg-[#F3EFE9] border border-[#EBE5DC] text-[#6A5A53] hover:text-[#2C221E] py-2.5 rounded-xl font-bold transition-all text-center cursor-pointer"
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
