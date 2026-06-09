"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Brain,
  Scroll,
  Upload,
  Download,
  Search,
  Sparkles,
  Fingerprint,
  PieChart,
  Pen,
  Check,
  Archive,
  RefreshCw,
  Info,
  Flame,
  FileText,
  Skull,
  Activity,
  ArrowRightLeft,
  Settings,
  ShieldAlert,
  Copy,
  Eye,
  EyeOff,
  Layers
} from 'lucide-react';
import { DeconstructionResult, TopicData } from './types';
import { INITIAL_DEFAULT_COPY, PRESETS_BY_THEME } from './presets';

const API_BASE_URL = (process.env.NEXT_PUBLIC_WORDPRESS_API_URL as string) || '';

export default function ViralArticlePage() {
  // --- Core States ---
  const [inputText, setInputText] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('viralcopy_inputText') || '';
      }
      return '';
    } catch {
      return '';
    }
  });
  const aiProvider = 'gemini';
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('keywords');
  const [activeCopiedText, setActiveCopiedText] = useState<string>('');
  const [collectedText, setCollectedText] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('viralcopy_collectedText') || '';
      }
      return '';
    } catch {
      return '';
    }
  });

  // Current deconstruction config (defaults to '家庭' theme preset)
  const [result, setResult] = useState<DeconstructionResult>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('viralcopy_result');
        return saved ? JSON.parse(saved) : PRESETS_BY_THEME['家庭'];
      }
      return PRESETS_BY_THEME['家庭'];
    } catch {
      return PRESETS_BY_THEME['家庭'];
    }
  });
  const [detectedTheme, setDetectedTheme] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('viralcopy_detectedTheme') || '家庭';
      }
      return '家庭';
    } catch {
      return '家庭';
    }
  });

  // Script Generator States
  const [selectedTopicNum, setSelectedTopicNum] = useState<number>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('viralcopy_selectedTopicNum');
        return saved ? parseInt(saved, 10) : 1;
      }
      return 1;
    } catch {
      return 1;
    }
  });
  const [wordCount, setWordCount] = useState<number>(1500);
  const [isGeneratingScript, setIsGeneratingScript] = useState<boolean>(false);
  const [generatedScript, setGeneratedScript] = useState<string>(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('viralcopy_generatedScript') || '';
      }
      return '';
    } catch {
      return '';
    }
  });
  const [generatingLogs, setGeneratingLogs] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [selectedTextExcerpt, setSelectedTextExcerpt] = useState<string>('');

  // Refs
  const scriptRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const collectorRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

  // --- Scroll Helper for smooth tab navigation on mobile ---
  const handleTabChangeWithScroll = (tabName: string) => {
    setActiveTab(tabName);
    setTimeout(() => {
      tabsContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  // --- Notification Toast Utility ---
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // --- Auth State & GSI Integration ---
  const [user, setUser] = useState<{ id?: string; email: string; name: string; picture: string; locale?: string } | null>(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('viralcopy_user');
        return saved ? JSON.parse(saved) : null;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isWebView, setIsWebView] = useState<boolean>(false);
  useEffect(() => {
    try {
      if (typeof navigator !== 'undefined') {
        const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
        const isAppBrowser = /line|fbav|fb_iab|messenger|instagram|wechat|micromessenger|wv/i.test(ua);
        setIsWebView(isAppBrowser);
      }
    } catch (e) {
      console.warn("無法取得 UserAgent:", e);
    }
  }, []);

  const decodeJwt = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length < 2) return null;
      const base64Url = parts[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const pad = base64.length % 4;
      if (pad) {
        base64 += '='.repeat(4 - pad);
      }
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('JWT 解密失敗:', e);
      return null;
    }
  };

  const handleGoogleLoginCallback = async (response: any) => {
    try {
      const decoded = decodeJwt(response.credential);
      if (!decoded || !decoded.email) {
        showToast("❌ 登入認證解析失敗，請重新嘗試");
        return;
      }

      const userProfile = {
        id: decoded.sub, // Unique Google Account/User ID
        email: decoded.email,
        name: decoded.name || decoded.email.split('@')[0],
        picture: decoded.picture || '',
        locale: decoded.locale || 'zh-TW' // Get Google Account Language Locale
      };

      setUser(userProfile);
      localStorage.setItem('viralcopy_user', JSON.stringify(userProfile));
      showToast(`🎉 歡迎回來，${userProfile.name}！`);

      // Sync log to backend
      try {
        await fetch(`${API_BASE_URL}/api/log-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-App-Handshake": "viralcopy-secure-handshake"
          },
          body: JSON.stringify(userProfile)
        });
      } catch (logErr) {
        console.error("日誌同步失敗:", logErr);
      }
    } catch (err: any) {
      console.error("Google 登入回調錯誤:", err);
      showToast("❌ 登入程序發生異常");
    }
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem('viralcopy_user');
      localStorage.removeItem('viralcopy_inputText');
      localStorage.removeItem('viralcopy_detectedTheme');
      localStorage.removeItem('viralcopy_result');
      localStorage.removeItem('viralcopy_collectedText');
      localStorage.removeItem('viralcopy_generatedScript');
      localStorage.removeItem('viralcopy_selectedTopicNum');
    } catch (e) {
      console.error('清除 localStorage 失敗:', e);
    }
    
    // Reset states to default values
    setInputText('');
    setDetectedTheme('家庭');
    setResult(PRESETS_BY_THEME['家庭']);
    setCollectedText('');
    setGeneratedScript('');
    setSelectedTopicNum(1);
    
    showToast("🔒 已安全登出系統且清除所有本機快取資料。");
  };

  const handleGuestLogin = () => {
    const guestUser = {
      id: 'guest_' + Math.random().toString(36).substring(2, 11),
      email: 'guest@viralcopy.local',
      name: '訪客體驗官',
      picture: '',
      locale: 'zh-TW'
    };
    setUser(guestUser);
    localStorage.setItem('viralcopy_user', JSON.stringify(guestUser));
    showToast("🔓 已以訪客身分進入系統！部分進階日誌功能已停用。");
    
    // Sync guest login log
    try {
      fetch(`${API_BASE_URL}/api/log-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-App-Handshake": "viralcopy-secure-handshake"
        },
        body: JSON.stringify(guestUser)
      });
    } catch (e) {
      console.warn("無法同步訪客日誌:", e);
    }
  };

  // --- Sync workspace states to localStorage ---
  useEffect(() => {
    try {
      localStorage.setItem('viralcopy_inputText', inputText);
    } catch (e) {
      console.error('同步 inputText 失敗:', e);
    }
  }, [inputText]);

  useEffect(() => {
    try {
      localStorage.setItem('viralcopy_detectedTheme', detectedTheme);
    } catch (e) {
      console.error('同步 detectedTheme 失敗:', e);
    }
  }, [detectedTheme]);

  useEffect(() => {
    try {
      localStorage.setItem('viralcopy_result', JSON.stringify(result));
    } catch (e) {
      console.error('同步 result 失敗:', e);
    }
  }, [result]);

  useEffect(() => {
    try {
      localStorage.setItem('viralcopy_collectedText', collectedText);
    } catch (e) {
      console.error('同步 collectedText 失敗:', e);
    }
  }, [collectedText]);

  useEffect(() => {
    try {
      localStorage.setItem('viralcopy_generatedScript', generatedScript);
    } catch (e) {
      console.error('同步 generatedScript 失敗:', e);
    }
  }, [generatedScript]);

  useEffect(() => {
    try {
      localStorage.setItem('viralcopy_selectedTopicNum', selectedTopicNum.toString());
    } catch (e) {
      console.error('同步 selectedTopicNum 失敗:', e);
    }
  }, [selectedTopicNum]);

  useEffect(() => {
    if (user) return; // If already logged in, no need to init GSI sign-in button

    let clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes("您的_")) {
      clientId = "1084707973121-c41bo0fg23tljbr0btttqj1pda8hpioi.apps.googleusercontent.com";
    }

    let intervalId: any;
    let attempts = 0;

    const initGsi = () => {
      const google = (window as any).google;
      if (google?.accounts?.id) {
        clearInterval(intervalId);
        
        try {
          google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleLoginCallback,
            auto_select: false,
          });
          
          const btnParent = document.getElementById('google-signin-btn');
          if (btnParent) {
            google.accounts.id.renderButton(btnParent, {
              type: 'standard',
              theme: 'filled_blue',
              size: 'large',
              text: 'signin_with',
              shape: 'pill',
              logo_alignment: 'left',
              width: 280
            });
          }
        } catch (err) {
          console.error("GSI 模組初始化失敗:", err);
        }
      }
    };

    intervalId = setInterval(() => {
      attempts++;
      if (attempts > 50) {
        clearInterval(intervalId);
        console.error("無法載入 Google Identity Services SDK，請確認網路連線。");
      }
      initGsi();
    }, 150);

    // Initial check
    initGsi();

    return () => clearInterval(intervalId);
  }, [user]);

  // --- Copy to Clipboard Utility ---
  const handleCopyToClipboard = (text: string, label: string) => {
    if (!text) return;
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.top = "-9999px";
      document.body.appendChild(textArea);

      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (successful) {
        showToast(`📋 ${label}已複製！`);
      } else {
        throw new Error('Fallback execCommand failed');
      }
    } catch (err) {
      console.error('複製失敗:', err);
      showToast(`❌ 複製失敗，請手動複製。`);
    }
  };

  // --- Sentences Dissection Helper ---
  const getDynamicSentenceDissection = () => {
    if (!inputText || !inputText.trim()) return [];

    const rawSentences = inputText
      .split(/([。？！\n\r；])/g)
      .reduce((acc: string[], cur: string, idx: number) => {
        if (idx % 2 === 0) {
          if (cur.trim()) acc.push(cur.trim());
        } else {
          if (acc.length > 0) {
            acc[acc.length - 1] += cur;
          }
        }
        return acc;
      }, [])
      .filter((s: string) => s.length > 2);

    if (rawSentences.length === 0) {
      return [{
        phase: "【無法拆解】",
        desc: "請輸入更完整的段落文字以進行黃金骨架自動對照與拆解。",
        text: inputText,
        colorClass: "text-rose-400 border-rose-500/20 bg-rose-500/5"
      }];
    }

    const phases = [
      { badge: "1. 開篇吸睛 / 痛點突刺 (Immediate Pain Hook)", color: "text-pink-400 border-pink-500/20 bg-pink-500/5", desc: "用直接且帶有痛點挑釁、刺中焦慮的字詞破局，強行終止用戶的無感滑屏。" },
      { badge: "2. 衝突構建 / 認知失調 (Conflict & Dissonance)", color: "text-amber-500 border-amber-500/20 bg-amber-500/5", desc: "運用逆常識的質問，動搖受眾常規認知，建立強烈的心理學衝突張力。" },
      { badge: "3. 底層核心 / 人性代碼 (Core Human Code)", color: "text-emerald-450 border-emerald-500/20 bg-emerald-500/5", desc: "給出專業級、大師級的原理剖析，將個人遭遇上升到規律與法則層面。" },
      { badge: "4. 概念包裝 / 心理定錨 (Concept Anchoring)", color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5", desc: "植入武器化、黑沙專屬的名詞概念（如高尚帽子法、人設置換），用以提供稀缺感。" },
      { badge: "5. 具體行動 / 語氣指令 (Directive Command)", color: "text-violet-400 border-violet-500/20 bg-violet-500/5", desc: "給予極為具體的言行或語句指導，用指令型句型直接操控後續決策。" }
    ];

    const mapped = [];
    const maxPhases = phases.length;

    for (let i = 0; i < Math.min(rawSentences.length, maxPhases); i++) {
      let textSegment = rawSentences[i];
      if (i === maxPhases - 1 && rawSentences.length > maxPhases) {
        textSegment = rawSentences.slice(i).join(" ");
      }
      mapped.push({
        phase: phases[i].badge,
        colorClass: phases[i].color,
        desc: phases[i].desc,
        text: textSegment
      });
    }

    if (mapped.length < maxPhases && rawSentences.length > 0) {
      return rawSentences.map((sentence, idx) => {
        const item = phases[Math.min(idx, maxPhases - 1)];
        return {
          phase: item.badge,
          colorClass: item.color,
          desc: item.desc,
          text: sentence
        };
      });
    }

    return mapped;
  };

  // --- Local Fast Text Classification ---
  const runLocalClassifier = (text: string) => {
    if (!text.trim() || text === "請輸入對標文案") return;

    const textClean = text.toLowerCase();
    const scores = { workplace: 0, sales: 0, family: 0, social: 0 };

    const workplaceKeywords = [/職場/, /老闆/, /公司/, /員工/, /下屬/, /同事/, /車間/, /主任/, /老王/, /老李/, /晉升/, /裁員/, /管理者/, /上班/, /職權/, /組織/, /職缺/, /打工/, /上司/];
    const salesKeywords = [/銷售/, /成交/, /下單/, /購買/, /賣點/, /產品/, /溢價/, /定價/, /打折/, /客單價/, /商品/, /賣東西/, /買單/, /行銷頁/, /一頁式/, /文案要從/, /解決問題/, /價值堆疊 /, /限時優惠/];
    const familyKeywords = [/老公/, /妻子/, /孩子/, /寶貝/, /家長/, /媽媽/, /爸爸/, /家庭/, /婚姻/, /兩性/, /教育/, /夫妻/, /娶/, /嫁/, /小孩/, /教育法/];
    const socialKeywords = [/社群/, /社交/, /聊天/, /朋友/, /溝通/, /相見恨晚/, /互動感/, /認同感/, /轉發率/, /點擊率/, /心佔率/, /口語化/, /fb/, /ig/, /threads/, /自戀/, /情緒置幻/, /品牌/, /故事/, /標語/, /口號/];

    workplaceKeywords.forEach(kw => { if (kw.test(textClean)) scores.workplace += 2; });
    salesKeywords.forEach(kw => { if (kw.test(textClean)) scores.sales += 2.5; });
    familyKeywords.forEach(kw => { if (kw.test(textClean)) scores.family += 2.5; });
    socialKeywords.forEach(kw => { if (kw.test(textClean)) scores.social += 2; });

    let theme = "家庭"; // default
    let maxScore = 0;
    Object.entries(scores).forEach(([key, score]) => {
      if (score > maxScore) {
        maxScore = score;
        if (key === "workplace") theme = "職場";
        else if (key === "sales") theme = "銷售";
        else if (key === "family") theme = "家庭";
        else if (key === "social") theme = "社交";
      }
    });

    if (maxScore === 0) {
      if (textClean.includes("老王") || textClean.includes("老李") || textClean.includes("工廠")) theme = "職場";
      else if (textClean.includes("社群") || textClean.includes("threads")) theme = "社交";
    }

    setDetectedTheme(theme);

    if (!result.isRealAI) {
      setResult(PRESETS_BY_THEME[theme]);
    }
  };

  // --- Auto Analysis Effect ---
  useEffect(() => {
    setIsAutoAnalyzing(true);
    const timer = setTimeout(() => {
      runLocalClassifier(inputText);
      setIsAutoAnalyzing(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputText]);

  // --- Real Cloud AI Deconstruction Trigger ---
  const handleCloudDeconstruct = async () => {
    if (!inputText.trim()) {
      showToast('請先輸入對標文案內容');
      return;
    }

    setIsAnalyzing(true);
    try {
      showToast(`⚡ 正在與 Gemini AI 伺服器同步解構...`);
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-App-Handshake": "viralcopy-secure-handshake"
        },
        body: JSON.stringify({ 
          action: 'analyze',
          provider: 'gemini',
          text: inputText 
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errMessage = "解構請求失敗";
        try {
          const errData = JSON.parse(responseText);
          errMessage = errData.error || errMessage;
        } catch (e) {
          errMessage = `API 錯誤，狀態碼: ${response.status}`;
        }
        throw new Error(errMessage);
      }

      if (!responseText.trim()) {
        throw new Error("API 回傳為空內容");
      }

      const data = JSON.parse(responseText);
      setResult({
        ...data,
        isRealAI: true
      });
      setDetectedTheme(data.theme);
      showToast(`🔥 Gemini AI 精準解構完成：對標【${data.theme}】心戰領域！`);
    } catch (e: any) {
      console.error(e);
      showToast(`❌ AI 聯機失敗: ${e.message || "未知錯誤"}。已自動降級為高速預設算力`);
      runLocalClassifier(inputText);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // --- Script Generator ---
  const generateScript = async () => {
    if (!result.topics || result.topics.length === 0) {
      showToast('請先進行對標解構');
      return;
    }

    const selectedTopic = result.topics.find((t: TopicData) => t.id === selectedTopicNum) || result.topics[0];
    setIsGeneratingScript(true);
    setGeneratingLogs([]);

    const logsList = [
      "🧬 正在識別選題類別及目標受眾...",
      "🔬 載入專屬心戰資料庫與底層人性代碼...",
      `✍️ 正在與 Gemini AI 建立深度說服關聯，切入細分類：【${selectedTopic.cat}】...`,
      "💡 注入真實對抗案例與心理學重組定錨...",
      `🔥 正在精雕細琢 ${wordCount} 字的『黑沙專屬心戰劇本』正文...`,
      "💎 完成冷酷金句拋光與推廣閉環，正在輸出文本內容..."
    ];

    let logIdx = 0;
    const logInterval = setInterval(() => {
      if (logIdx < logsList.length) {
        setGeneratingLogs(prev => [...prev, logsList[logIdx]]);
        logIdx++;
      } else {
        clearInterval(logInterval);
      }
    }, 350);

    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-App-Handshake": "viralcopy-secure-handshake"
        },
        body: JSON.stringify({
          action: 'generate-script',
          provider: 'gemini',
          topicTitle: selectedTopic.title,
          topicCat: selectedTopic.cat,
          targetLength: wordCount,
          benchmarkContext: inputText,
          theme: detectedTheme,
          keywords: result.keywords,
          analysis: result.analysis,
          collectedKeywords: collectedText
        }),
      });

      const responseText = await response.text();

      if (!response.ok) {
        let errMessage = "生成失敗";
        try {
          const errData = JSON.parse(responseText);
          errMessage = errData.error || errMessage;
        } catch (e) {
          errMessage = `API 錯誤，狀態碼: ${response.status}`;
        }
        throw new Error(errMessage);
      }

      if (!responseText.trim()) {
        throw new Error("API 回傳為空內容");
      }

      const data = JSON.parse(responseText);
      let finalScript = data.script || "";
      const topicTitle = selectedTopic.title;
      if (finalScript && topicTitle && !finalScript.trim().startsWith(topicTitle.trim())) {
        finalScript = `${topicTitle}\n\n${finalScript}`;
      }
      setGeneratedScript(finalScript);
      showToast(`🔥 降維心戰正文（選題 #${selectedTopicNum}）已精準生成！`);
    } catch (e: any) {
      console.error(e);
      showToast(`❌ 發射失敗: ${e.message || "API 解析失敗"}`);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // --- Document Exporter (TXT format) ---
  const handleExportTxt = (text: string, filename: string) => {
    if (!text) {
      showToast("❌ 當前內容為空，無法導出。");
      return;
    }
    try {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`💾 下載已發送: ${filename}`);
    } catch (err) {
      console.error(err);
      showToast("❌ 導出失敗");
    }
  };

  // --- Document Exporter for Analysis Report (Markdown format) ---
  const handleExportReport = () => {
    if (!result.analysis) {
      showToast("❌ 暫無分析數據");
      return;
    }
    const reportContent = `# 黑沙心戰 —— 爆款人性解構分析報告
報告生成時間: ${new Date().toLocaleDateString()}
已識別心戰領域: ${detectedTheme} 領域
是否經由 AI 即時精準解構: ${result.isRealAI ? "是 (Gemini API)" : "否 (高效本地快拆)"}

=========================================

## 一、 賬號定位描述
${result.analysis.positioning}

## 二、 內容風格特點
${result.analysis.style}

## 三、 語言表達習慣
${result.analysis.linguistics}

## 四、 情緒調性與讀者心理姿態
${result.analysis.tone}

## 五、 黃金說服模式與骨架
${result.analysis.structure}

=========================================
Power of Neural Dark Psychology © 2026 BlackSand Engine.`;

    handleExportTxt(reportContent, `黑沙心戰_${detectedTheme}領域_爆款架構拆解報告.md`);
  };

  // --- File Reading Handler ---
  const readFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setInputText(text);
        showToast(`📂 成功導入文檔: ${file.name}`);
      }
    };
    reader.onerror = () => showToast("❌ 讀取檔案失敗！");
    reader.readAsText(file, 'UTF-8');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFileContent(file);
    e.target.value = '';
  };

  // --- Smart Word Masking / Anonymizer ---
  const handleHideSelectedText = () => {
    const textarea = document.getElementById('benchmark-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    if (start !== end && start !== undefined && end !== undefined) {
      const selectedText = inputText.substring(start, end);
      const maskedText = "○".repeat(selectedText.length);
      const updated = inputText.substring(0, start) + maskedText + inputText.substring(end);
      
      setInputText(updated);
      setSelectedTextExcerpt("");
      showToast(`🔒 已對指定字詞「${selectedText.substring(0, 8)}${selectedText.length > 8 ? '...' : ''}」進行隱藏字處理！`);
      
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start, start + maskedText.length);
      }, 50);
      return;
    }

    let newText = inputText;
    const automasks = [
      { pattern: /老王/g, replacement: "王經理" },
      { pattern: /老李/g, replacement: "李經理" },
      { pattern: /李工/g, replacement: "李專員" },
      { pattern: /工廠/g, replacement: "「公司部門」" },
      { pattern: /09\d{8}/g, replacement: "09XXXXXXXX" },
      { pattern: /\d{4,19}/g, replacement: (m: string) => "○".repeat(m.length) },
    ];

    let changed = false;
    automasks.forEach(({ pattern, replacement }) => {
      const temp = newText.replace(pattern, replacement as any);
      if (temp !== newText) {
        newText = temp;
        changed = true;
      }
    });

    if (changed) {
      setInputText(newText);
      showToast("👁️ 已自動替換/隱藏核心代稱、特殊人名及數字！");
    } else {
      showToast("💡 提示：您可以選取輸入框中任何字詞，然後點擊「隱藏字」即可將選定字詞完美覆蓋為「○○○」！");
    }
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    if (start !== end && start !== undefined && end !== undefined) {
      const sel = target.value.substring(start, end);
      setSelectedTextExcerpt(sel);
    } else {
      setSelectedTextExcerpt("");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const validExtensions = ['.txt', '.md', '.text', '.json', '.html', '.csv'];
      const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

      if (file.type.startsWith('text/') || validExtensions.includes(fileExt)) {
        readFileContent(file);
      } else {
        showToast("❌ 僅支援純文字格式文檔（如 .txt, .md）");
      }
    }
  };

  const selectElementText = (element: HTMLElement | null) => {
    if (!element) return;
    try {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } catch (err) {
      console.warn('Text selection highlight failed:', err);
    }
  };

  const appendToCollector = (text: string) => {
    setCollectedText(prev => {
      if (!prev) return text;
      const items = prev.split('\n');
      if (items.includes(text)) return prev;
      return prev + '\n' + text;
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col font-sans relative justify-center items-center bg-[#020617] text-slate-200 overflow-hidden">
        {/* Glowing radial background meshes */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/15 via-[#020617] to-[#020617] pointer-events-none z-0" />

        <div className="max-w-md w-full mx-4 p-8 bg-slate-900/35 backdrop-blur-2xl border border-slate-800/80 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center space-y-6 select-none relative overflow-hidden z-10">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />

          {/* Logo container */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center border border-indigo-400/20 shadow-[0_0_35px_rgba(99,102,241,0.55)] relative z-10">
            <Brain className="text-white w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2 relative z-10">
            <h1 className="text-3xl font-black font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              ViralCopy AI
            </h1>
            <p className="text-xs text-indigo-400 tracking-widest uppercase font-bold">黑沙心戰 ✕ 人性解構儀</p>
          </div>

          <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-sm relative z-10">
            解鎖暗黑大師心智：爆款文案心理學對標與終極仿寫說服場。極限人性洞察，從未如此簡單。
          </p>

          {/* Notice box */}
          <div className="p-4 bg-indigo-950/25 border border-indigo-500/20 rounded-2xl text-left text-xs text-indigo-300/90 leading-relaxed relative z-10 w-full">
            <div className="flex items-center gap-1.5 font-bold text-indigo-400 mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>隱私與安全提示</span>
            </div>
            本系統為私人極限說服探測器。在開始操作前，請先使用 Google 帳號進行身份認證。登入後所有操作紀錄皆受高強度隱私協定保護，僅限合法商務與學術文案 analysis 使用。
          </div>

          {/* WebView in-app browser caution */}
          {isWebView && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/35 rounded-2xl text-left text-xs text-amber-300 leading-relaxed relative z-10 w-full animate-fadeIn shadow-lg shadow-amber-950/20 border-dashed">
              <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>⚠️ LINE/FB 內建瀏覽器限制</span>
              </div>
              <p className="mb-2">
                偵測到您目前處於 App 內建瀏覽器。Google 基於安全考量，<strong>不支援</strong>在內建網頁（LINE、FB、IG、Messenger 等）直接進行 Google 登入，會導致登入畫面出現空白或載入失敗。
              </p>
              <div className="pl-2 border-l-2 border-amber-500/40 space-y-1 text-slate-350 text-[11px] bg-amber-950/15 py-1.5 px-2.5 rounded-r-lg">
                <p>💡 <strong>如何正常登入與使用？</strong></p>
                <p>請點擊右上角「<span className="font-bold">...</span>」或分享按鈕，選擇<strong>「在瀏覽器開啟」</strong>或<strong>「使用預設瀏覽器開啟」</strong>（如 Safari 或 Chrome）即可流暢完成認證！</p>
              </div>
            </div>
          )}

          {/* Sign in Button container */}
          <div className="relative z-10 py-2 w-full flex flex-col items-center space-y-4">
            <div id="google-signin-btn" className="min-w-[280px] min-h-[46px] flex justify-center shadow-lg shadow-indigo-600/10 rounded-full transition-transform active:scale-[0.98]"></div>
            
            <div className="flex items-center justify-center w-full max-w-[280px] py-1 select-none">
              <div className="h-[1px] bg-slate-800/80 flex-grow"></div>
              <span className="text-[10px] text-slate-500 font-bold px-3 uppercase tracking-widest">或</span>
              <div className="h-[1px] bg-slate-800/80 flex-grow"></div>
            </div>

            <button
              onClick={handleGuestLogin}
              className="min-w-[280px] py-3 px-6 rounded-full bg-indigo-950/20 hover:bg-indigo-600/10 border border-slate-800 hover:border-indigo-500/45 text-slate-300 hover:text-indigo-300 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.97] shadow-md shadow-indigo-950/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>訪客免登入直接試用</span>
            </button>
          </div>

          {/* Footer note */}
          <div className="text-[10px] font-mono text-slate-600 tracking-wider relative z-10 pt-2">
            Power of Neural Dark Psychology © 2026 BlackSand Engine.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative pb-12 bg-[#020617] text-slate-200 overflow-x-hidden">
      {/* Script tag for Google GSI client API */}
      <script src="https://accounts.google.com/gsi/client" async></script>

      {/* Indigo Radial Mesh and Background Glow */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-indigo-950/20 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Navigation Header */}
      <header className="border-b border-slate-800 py-4 px-6 md:px-12 bg-[#020617]/85 backdrop-blur-md sticky top-0 z-50 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <Link
            href="/"
            className="flex items-center gap-1.5 p-2 bg-slate-900 border border-slate-800 text-slate-400 hover:text-indigo-400 rounded-xl hover:border-indigo-500/30 transition-all font-bold text-xs"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            <span>返回商城</span>
          </Link>
          <div className="h-6 w-[1px] bg-slate-800"></div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center border border-indigo-450/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <Brain className="text-white w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black font-sans tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
              ViralCopy AI <span className="font-sans text-xs font-bold border border-indigo-500/50 px-1.5 py-0.5 rounded text-indigo-400 ml-1.5">人性解構儀</span>
            </h1>
            <p className="text-[11px] text-slate-400 tracking-wider">人性弱點破解 ✕ 社交說服黑盒 ✕ 爆款文案裂變場</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs bg-slate-900 px-3.5 py-2 rounded-full border border-slate-800 flex items-center gap-2 shadow-inner">
            {isAutoAnalyzing ? (
              <>
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                <span className="text-indigo-400 font-medium">智慧流式探測中...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-400">當前對標領域:</span>
                <strong className="text-indigo-350 font-bold bg-indigo-500/10 border border-indigo-500/25 px-2 py-0.5 rounded-full">
                  {detectedTheme} 領域 ({result.isRealAI ? 'Gemini 精準' : '本機快拆'})
                </strong>
              </>
            )}
          </span>

          {user && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800 shadow-inner select-none">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-5.5 h-5.5 rounded-full border border-slate-700 object-cover" />
                ) : (
                  <div className="w-5.5 h-5.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-[10px] text-indigo-400 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-300 max-w-[85px] truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-450 hover:text-white bg-rose-950/20 hover:bg-rose-600 border border-rose-500/10 hover:border-rose-500/40 px-3 py-2 rounded-full font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-md shadow-rose-950/10 active:scale-[0.97]"
                title="登出黑沙人性解構儀"
              >
                登出
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10 relative">

        {/* LEFT COLUMN: Input benchmark copywriting */}
        <section className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 md:p-6 panel-glow flex flex-col h-full min-h-[550px] space-y-4">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-sm font-semibold tracking-wide text-slate-300 flex items-center gap-2">
                <Scroll className="text-indigo-400 w-4 h-4" />
                1. 輸入或粘貼對標文案
              </h2>

              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".txt,.md,.text,.html,.csv"
                  className="hidden"
                />
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-indigo-500/40 cursor-pointer"
                  title="支援導入 .txt, .md 文書檔案"
                >
                  <Upload className="w-3.5 h-3.5" />
                  匯入
                </button>

                <button
                  onClick={() => handleExportTxt(inputText, `黑沙心戰_備份對標文案_${detectedTheme}領域.txt`)}
                  className="text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg hover:border-indigo-500/40 cursor-pointer"
                  title="匯出當前左側文字為純文字備份"
                >
                  <Download className="w-3.5 h-3.5" />
                  匯出
                </button>

                <button 
                  onClick={() => {
                    setInputText(INITIAL_DEFAULT_COPY);
                    setResult(PRESETS_BY_THEME['家庭']);
                    setDetectedTheme("家庭");
                    showToast("🧹 已重置為經典家庭爆款對標範例");
                  }}
                  className="text-xs text-slate-500 hover:text-indigo-400 transition cursor-pointer"
                  title="恢復黑沙心戰經典家庭博弈文案範例"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Editor Textarea with drag & drop support */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex-grow relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-950/20 ring-2 ring-indigo-500/30'
                  : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              {isDragging && (
                <div className="absolute inset-0 bg-slate-950/95 flex flex-col items-center justify-center space-y-3 z-10 rounded-xl pointer-events-none">
                  <Flame className="w-8 h-8 text-indigo-400 animate-bounce" />
                  <p className="text-indigo-300 text-xs font-bold tracking-widest uppercase">
                    丟下滑鼠，立即可引入此文案至編輯器
                  </p>
                  <p className="text-slate-500 text-[10px]">支援 .txt / .md 等格式</p>
                </div>
              )}
              
              <textarea
                id="benchmark-textarea"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onSelect={handleTextareaSelect}
                placeholder="請在此輸入或粘貼您想要對標和解構的行銷文案..."
                className="w-full h-full min-h-[360px] bg-transparent p-4.5 pb-12 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-0 text-sm leading-relaxed overflow-y-auto resize-none font-light"
              />

              <div className="absolute bottom-3.5 right-3.5 text-xs text-slate-500 bg-slate-900/90 border border-slate-800/80 px-2.5 py-1 rounded-md font-mono select-none shadow-md z-[5]">
                {inputText.length} 字符
              </div>
            </div>

            {/* Cloud trigger API button */}
            <button
              onClick={handleCloudDeconstruct}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-3.5 px-4 rounded-xl hover:brightness-110 active:scale-[0.99] hover:scale-[1.01] transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-5 h-5 animate-spin text-white" />
                  <span className="tracking-wider">Gemini 正在解構底層心智中...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-indigo-100 fill-indigo-100 animate-pulse" />
                  <span className="tracking-wider">啟動 Gemini AI 雲端極致解構</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Tabs & Code Generation Box */}
        <section className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 md:p-6 panel-glow flex flex-col h-full min-h-[550px]">
            
            {/* TABS CONTAINER */}
            <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2.5 mb-6 select-none" ref={tabsContainerRef}>
              <button
                onClick={() => setActiveTab('keywords')}
                className={`px-3 py-2.5 text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 cursor-pointer border rounded-xl select-none ${
                  activeTab === 'keywords'
                    ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10 font-bold shadow-lg shadow-indigo-500/5'
                    : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700/40'
                }`}
              >
                <Fingerprint className="w-4 h-4 text-indigo-400" />
                1. 心戰關鍵詞
              </button>
              <button
                onClick={() => setActiveTab('topics')}
                className={`px-3 py-2.5 text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 cursor-pointer border rounded-xl select-none ${
                  activeTab === 'topics'
                    ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10 font-bold shadow-lg shadow-indigo-500/5'
                    : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700/40'
                }`}
              >
                <Flame className="w-4 h-4 text-indigo-400" />
                2. 20個爆款選題
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-3 py-2.5 text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 cursor-pointer border rounded-xl select-none ${
                  activeTab === 'analysis'
                    ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10 font-bold shadow-lg shadow-indigo-500/5'
                    : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700/40'
                }`}
              >
                <PieChart className="w-4 h-4 text-indigo-400" />
                3. 爆款架構拆解
              </button>
              <button
                onClick={() => setActiveTab('step2')}
                className={`px-3 py-2.5 text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center sm:justify-start gap-2 relative cursor-pointer border rounded-xl select-none ${
                  activeTab === 'step2'
                    ? 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10 font-bold shadow-lg shadow-indigo-500/5'
                    : 'border-slate-800 bg-slate-900/30 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 hover:border-slate-700/40'
                }`}
              >
                <Pen className="w-4 h-4 text-indigo-400" />
                4. 心戰正文仿寫
                <span className="absolute -top-1.5 -right-1 bg-indigo-500 text-white text-[9px] px-1.5 py-0.5 font-bold rounded-full animate-pulse">
                  AI
                </span>
              </button>
            </div>

            {/* TAB CONTENT VIEWPORT */}
            <div className="flex-grow overflow-y-auto max-h-[460px] pr-1.5 space-y-4">
              
              {/* Tab 1: Keywords Extraction */}
              {activeTab === 'keywords' && (
                <div className="space-y-6 animate-fadeIn">
                  {result.keywords ? (
                    <>
                      <div>
                        <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2 select-none">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                          人性心理效應與偏見標籤 (點選即複製且自動累加至收集箱)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.keywords.psychological.map((kw, i) => {
                            const isActive = activeCopiedText === kw;
                            return (
                              <span
                                key={i}
                                onClick={(e) => {
                                  handleCopyToClipboard(kw, kw);
                                  const target = e.currentTarget.querySelector('.select-target') || e.currentTarget;
                                  selectElementText(target as HTMLElement);
                                  setActiveCopiedText(kw);
                                  appendToCollector(kw);
                                }}
                                className={`px-3 py-2 rounded-full cursor-pointer transition-all duration-200 flex items-center gap-2 text-xs select-text ${
                                  isActive
                                    ? 'bg-indigo-950/40 border border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/20 font-medium'
                                    : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 text-slate-300'
                                }`}
                              >
                                {isActive ? (
                                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                                ) : (
                                  <Brain className="w-3.5 h-3.5 text-indigo-500/70" />
                                )}
                                <span className="select-target">{kw}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2 select-none">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                          暗黑說服與情感洗腦戰術 (極具侵略性的心理流量密碼)
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {result.keywords.tactics.map((kw, i) => {
                            const isActive = activeCopiedText === kw;
                            return (
                              <span
                                key={i}
                                onClick={(e) => {
                                  handleCopyToClipboard(kw, kw);
                                  const target = e.currentTarget.querySelector('.select-target') || e.currentTarget;
                                  selectElementText(target as HTMLElement);
                                  setActiveCopiedText(kw);
                                  appendToCollector(kw);
                                }}
                                className={`px-3 py-2 rounded-full cursor-pointer transition-all duration-200 flex items-center gap-2 text-xs select-text ${
                                  isActive
                                    ? 'bg-indigo-950/40 border border-indigo-500 text-indigo-300 shadow-md shadow-indigo-500/20 font-medium'
                                    : 'bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-300'
                                }`}
                              >
                                {isActive ? (
                                  <Check className="w-3.5 h-3.5 text-indigo-400" />
                                ) : (
                                  <Skull className="w-3.5 h-3.5 text-indigo-500/70" />
                                )}
                                <span className="select-target">{kw}</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider flex items-center gap-2 select-none">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                          同類對標搜索長尾詞組 (已依據文意語境深度生成)
                        </h3>
                        <div className="space-y-2">
                          {result.keywords.searchPhrases.map((kw, i) => {
                            const isActive = activeCopiedText === kw;
                            return (
                              <div
                                key={i}
                                onClick={(e) => {
                                  handleCopyToClipboard(kw, kw);
                                  const target = e.currentTarget.querySelector('.select-target') || e.currentTarget;
                                  selectElementText(target as HTMLElement);
                                  setActiveCopiedText(kw);
                                  appendToCollector(kw);
                                }}
                                className={`p-3 rounded-lg flex justify-start items-center cursor-pointer transition-all border text-xs ${
                                  isActive
                                    ? 'bg-indigo-950/25 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                                    : 'bg-slate-900/70 hover:bg-slate-800/95 border-slate-800 hover:border-indigo-500/30'
                                }`}
                              >
                                <span className={`italic select-target ${isActive ? 'text-indigo-300 font-medium' : 'text-slate-350'}`}>
                                  "{kw}"
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Navigate to Step 2 button */}
                      <button
                        onClick={() => {
                          handleTabChangeWithScroll('topics');
                          showToast("已切換至「2. 20個爆款選題」面板！");
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 font-bold py-3.5 px-4 rounded-xl active:scale-[0.99] transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer"
                      >
                        <Flame className="w-4 h-4 text-indigo-400 animate-pulse" />
                        <span className="text-xs uppercase tracking-wider">⚡ 前往步驟 2：20個爆款選題</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-12 text-zinc-650 font-light select-none">
                      請在左側點擊「啟動 Gemini AI 雲端解構」獲取實時數據...
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: 20 Hot Copywriting Mapped Topics */}
              {activeTab === 'topics' && (
                <div className="space-y-4 animate-fadeIn">
                  {result.topics && result.topics.length > 0 ? (
                    <>
                      <div className="bg-indigo-950/10 border border-indigo-500/20 rounded-xl p-3.5 text-xs text-indigo-305 flex items-start gap-2.5 shadow-inner select-none">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>{result.isRealAI ? "✨ Gemini AI 智能衍生策劃" : "📌 常規本機算力備選庫"}：</strong>
                          已基於您的對標文案關聯剖析出 10-20 個爆款衍生選題。點擊下面任意選題，可一鍵推送至「心戰正文仿寫」面板。
                        </div>
                      </div>

                      <div className="space-y-2">
                        {result.topics.map((t: TopicData) => (
                          <div
                            key={t.id}
                            onClick={() => {
                              setSelectedTopicNum(t.id);
                              handleTabChangeWithScroll('analysis');
                              showToast(`已選定選題 #${t.id}，即將切換至架構拆解面板！`);
                            }}
                            className={`p-3.5 bg-slate-950/60 hover:bg-slate-900 border ${
                              selectedTopicNum === t.id ? 'border-indigo-500 bg-indigo-950/5' : 'border-slate-800/80'
                            } rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200`}
                          >
                            <div className="flex items-center space-x-3 pr-2">
                              <span className="w-6.5 h-6.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] font-semibold text-indigo-400 flex items-center justify-center shrink-0">
                                {t.id}
                              </span>
                              <p className="text-slate-300 text-sm font-medium leading-relaxed">{t.title}</p>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-400 rounded-md border border-slate-800 font-bold whitespace-nowrap shrink-0">
                              {t.cat}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Navigate to Step 3 button */}
                      <button
                        onClick={() => {
                          handleTabChangeWithScroll('analysis');
                          showToast("已切換至「3. 爆款架構拆解」面板！");
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 font-bold py-3.5 px-4 rounded-xl active:scale-[0.99] transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer"
                      >
                        <PieChart className="w-4 h-4 text-indigo-400 animate-pulse" />
                        <span className="text-xs uppercase tracking-wider">⚡ 前往步驟 3：爆款架構拆解</span>
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-12 text-zinc-650 font-light select-none">
                      請在左側點擊「啟動 Gemini AI 雲端極致解構」獲取實時衍生主題...
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Detailed Structural Breakdown Analysis Report */}
              {activeTab === 'analysis' && (
                <div className="space-y-5 animate-fadeIn">
                  {result.analysis ? (
                    <div className="space-y-4 text-sm">
                      
                      {/* Report header with Markdown exporter */}
                      <div className="flex justify-between items-center bg-slate-900/65 p-3 rounded-xl border border-slate-800 select-none">
                        <span className="text-xs text-indigo-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                          <Activity className="w-4 h-4 text-indigo-400" />
                          已生成解構報告 ({result.isRealAI ? "Gemini 雲端精密版" : "本地靜態拆解"})
                        </span>
                        <button
                          onClick={handleExportReport}
                          className="text-[11px] font-bold tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1 cursor-pointer"
                        >
                          <span>導出報告 (.md)</span>
                          <Download className="w-3 h-3 text-white" />
                        </button>
                      </div>

                      {/* Live Sentence Deconstruction Section */}
                      <div className="bg-slate-900/40 p-5 rounded-xl border border-slate-800 space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                            <Layers className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div>
                            <h3 className="font-bold text-zinc-100 text-xs md:text-sm">對標文案黃金骨架逐句解構</h3>
                            <p className="text-[10px] text-zinc-550 font-light">依據左側各句原文進行段落對稱拆解 & 心理解密</p>
                          </div>
                        </div>

                        <div className="space-y-3.5">
                          {getDynamicSentenceDissection().map((item: any, index: number) => (
                            <div key={index} className="relative pl-4 border-l border-slate-800 transition-all hover:border-indigo-500/50">
                              <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-950 border-2 border-slate-800 hover:border-indigo-500 transition-colors" />
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <span className={`text-[10px] font-semibold tracking-wider px-2 py-0.5 rounded border ${item.colorClass}`}>
                                  {item.phase}
                                </span>
                              </div>
                              <p className="text-[10px] md:text-[11px] text-zinc-400 font-light mb-1.5 leading-relaxed">{item.desc}</p>
                              <div className="bg-slate-950/90 rounded-lg p-2.5 border border-slate-850/60 leading-relaxed text-zinc-205 text-xs font-mono relative">
                                <span className="absolute right-2 top-2 text-[9px] text-zinc-500 font-sans tracking-wide">對應左側原文</span>
                                {item.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-850 space-y-1.5">
                        <h4 className="text-xs font-bold text-indigo-400 tracking-wider uppercase select-none flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          1. 賬號定位
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-light text-xs md:text-sm">{result.analysis.positioning}</p>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-850 space-y-1.5">
                        <h4 className="text-xs font-bold text-indigo-400 tracking-wider uppercase select-none flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          2. 選題特點與說服風格
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-light text-xs md:text-sm">{result.analysis.style}</p>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-850 space-y-1.5">
                        <h4 className="text-xs font-bold text-indigo-400 tracking-wider uppercase select-none flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          3. 語言表達習慣與詞庫
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-light text-xs md:text-sm">{result.analysis.linguistics}</p>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-850 space-y-1.5">
                        <h4 className="text-xs font-bold text-indigo-400 tracking-wider uppercase select-none flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          4. 情緒調性與心理姿態
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-light text-xs md:text-sm">{result.analysis.tone}</p>
                      </div>

                      <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-850 space-y-1.5">
                        <h4 className="text-xs font-bold text-indigo-400 tracking-wider uppercase select-none flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                          5. 黃金心戰說服骨架
                        </h4>
                        <p className="text-slate-300 leading-relaxed font-light text-xs md:text-sm whitespace-pre-line">{result.analysis.structure}</p>
                      </div>

                      {/* Navigate to Step 4 button */}
                      <button
                        onClick={() => {
                          handleTabChangeWithScroll('step2');
                          showToast("已切換至「4. 心戰正文仿寫」面板！");
                        }}
                        className="w-full bg-slate-900 hover:bg-slate-805 border border-indigo-500/30 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 font-bold py-3.5 px-4 rounded-xl active:scale-[0.99] transition-all flex items-center justify-center space-x-2 cursor-pointer mt-4"
                      >
                        <Pen className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs uppercase tracking-wider">⚡ 前往步驟 4：心戰正文仿寫</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-zinc-650 font-light select-none">
                      請在左側點擊「啟動 Gemini AI 雲端極致解構」獲取實時大師報告分析...
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Interactive Script Generation */}
              {activeTab === 'step2' && (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Parameter sliders */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1.5 select-none">
                        期望正文長度 ({wordCount} 字)
                      </label>
                      <div className="flex items-center space-x-3.5 pt-1">
                        <input
                          type="range"
                          min="1000"
                          max="2000"
                          step="100"
                          value={wordCount}
                          onChange={(e) => setWordCount(parseInt(e.target.value))}
                          className="flex-grow accent-indigo-500 h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-xs font-mono font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2 py-1 rounded-md select-none shrink-0">
                          {wordCount} 字
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-850 select-none">
                      <span className="text-[10px] text-slate-500 block uppercase tracking-wider font-bold">已鎖定寫作選題：</span>
                      <p className="text-slate-200 text-sm font-medium mt-1">
                        {result.topics && result.topics.length > 0
                          ? result.topics.find((t: TopicData) => t.id === selectedTopicNum)?.title
                          : "請提取對標選題"
                        }
                      </p>
                    </div>

                    <button
                      onClick={generateScript}
                      disabled={isGeneratingScript || !result.topics || result.topics.length === 0}
                      className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold py-2.5 px-4 rounded-lg hover:brightness-110 active:scale-[0.99] hover:scale-[1.01] transition-all duration-200 text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-500/20 select-none cursor-pointer"
                    >
                      <WandIcon />
                      🧠 注入大師心戰靈魂・即刻生成正文 (Gemini)
                    </button>
                  </div>

                  {/* Interactive script results & Loader */}
                  {isGeneratingScript ? (
                    <div className="p-8 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-4">
                      <div className="flex justify-center">
                        <Activity className="w-8 h-8 animate-spin text-indigo-400" />
                      </div>
                      <div className="text-[11px] font-mono text-indigo-300 space-y-1.5 select-none max-w-md mx-auto text-center">
                        {generatingLogs.map((log, i) => (
                          <div key={i} className="animate-fadeIn">{log}</div>
                        ))}
                      </div>
                    </div>
                  ) : generatedScript ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center bg-slate-900 p-2 px-3 rounded-lg border border-slate-850 select-none">
                        <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-bold">
                          ✨ 完美文案正文已產出 ({generatedScript.length} 字)
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyToClipboard(generatedScript, "生成文案正文")}
                            className="text-[10px] text-white font-bold bg-indigo-605 hover:bg-indigo-700 px-2.5 py-1 rounded transition cursor-pointer"
                          >
                            複製全文
                          </button>
                          <button
                            onClick={() => handleExportTxt(generatedScript, `黑沙心戰_正文仿寫_${detectedTheme}_選題${selectedTopicNum}.txt`)}
                            className="text-[10px] text-indigo-400 font-bold bg-slate-950 border border-slate-850 hover:border-indigo-500/30 px-2.5 py-1.5 rounded transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>下載</span>
                            <Download className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      {/* Render text scripts nicely */}
                      <div
                        ref={scriptRef}
                        className="bg-slate-950/80 rounded-xl p-5 border border-slate-850 leading-relaxed text-slate-205 text-sm whitespace-pre-wrap font-sans select-text max-h-[380px] overflow-y-auto"
                      >
                        {generatedScript}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-zinc-650 font-light select-none">
                      請選取上方期望字數，然後點擊「注入大師心戰靈魂」按鈕生成您的文案正文...
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* COLLECTOR BOX (BOTTOM STICKY) */}
            <div className="border-t border-slate-800 pt-4 mt-4 space-y-2 select-none">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Archive className="w-3.5 h-3.5 text-indigo-400" />
                  我的心戰關鍵詞收集箱
                </span>
                
                {collectedText && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (collectedText) {
                          handleCopyToClipboard(collectedText, "收集箱關鍵詞");
                          selectElementText(collectorRef.current);
                        }
                        setActiveCopiedText(collectedText);
                      }}
                      className="text-[10px] text-white font-bold bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded transition cursor-pointer"
                    >
                      複製箱
                    </button>

                    <button
                      onClick={() => handleExportTxt(collectedText, "黑沙心戰_關鍵詞收集箱.txt")}
                      className="text-[10px] text-indigo-400 font-bold bg-slate-950 border border-slate-850 hover:border-indigo-500/30 px-2.5 py-1 rounded transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>匯出</span>
                      <Download className="w-2.5 h-2.5" />
                    </button>

                    <button
                      onClick={() => {
                        setCollectedText('');
                        showToast('🧹 收集箱已清空');
                      }}
                      className="text-[10px] text-slate-500 hover:text-red-450 transition cursor-pointer"
                    >
                      清空
                    </button>
                  </div>
                )}
              </div>
              
              <div
                ref={collectorRef}
                onClick={(e) => {
                  if (collectedText) {
                    selectElementText(e.currentTarget);
                    setActiveCopiedText(collectedText);
                  }
                }}
                className={`w-full h-18 text-xs rounded-lg p-2.5 leading-relaxed overflow-y-auto cursor-pointer transition-all duration-300 border select-text ${
                  collectedText
                    ? 'bg-slate-950 text-slate-200 border-indigo-500/30 hover:border-indigo-500/60 font-medium'
                    : 'bg-slate-950/40 text-slate-500 border-slate-900 italic flex items-center justify-center text-center text-[11px]'
                }`}
              >
                {collectedText || "（當您點擊上方的心理效應、洗腦戰術或對標搜索詞組時，內容會自動在此框內不斷堆疊，形成您的爆款詞典）"}
              </div>
            </div>

            {/* Smart Word Masking Option (Float Left inside right box) */}
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3.5 mt-4 text-[10px] text-slate-500 select-none">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                選取左側文案任意詞句，點擊「隱藏字」可將隱私/代名詞防護遮蔽為○○○
              </span>
              <button
                onClick={handleHideSelectedText}
                className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 px-3 py-1.5 rounded-lg text-slate-300 hover:text-indigo-300 font-bold transition-all cursor-pointer flex items-center gap-1"
                title="遮蔽人名、公司名、數字或手動選定文字，防範敏感資訊上傳 AI 伺服器"
              >
                <span>隱藏字 (脫敏)</span>
                {selectedTextExcerpt ? (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                ) : (
                  <EyeOff className="w-3 h-3 text-slate-400" />
                )}
              </button>
            </div>

          </div>
        </section>

      </main>

      {/* Footer bar */}
      <footer className="mt-12 text-center text-slate-600 text-[11px] font-mono tracking-wider select-none z-10 relative">
        Power of Neural Dark Psychology © 2026 BlackSand Engine. All Rights Reserved.
      </footer>

      {/* Elegant floating notification toast */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 border-l-4 border-indigo-500 text-slate-100 px-4.5 py-3 rounded-lg shadow-2xl z-[100] flex items-center gap-2 animate-slideIn text-xs select-none">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

// Named Icon helper
function WandIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wand">
      <path d="M15 4V2"/>
      <path d="M15 16v-2"/>
      <path d="M8 9h2"/>
      <path d="M20 9h2"/>
      <path d="M17.8 6.2l1.4-1.4"/>
      <path d="M17.8 11.8l1.4 1.4"/>
      <path d="M12.2 6.2L10.8 4.8"/>
      <path d="M12.2 11.8L10.8 13.2"/>
      <path d="M2 22l6.5-6.5"/>
      <path d="M12 2l3 3-9 9-3-3z"/>
    </svg>
  );
}
