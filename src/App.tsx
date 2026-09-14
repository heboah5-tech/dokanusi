import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Sparkles, Gift, Flame, Eye, Check, X, LayoutDashboard } from "lucide-react";
import { base44, Product } from "@/api/base44Client";
import { Header } from "@/src/components/Header";
import { Footer } from "@/src/components/Footer";
import { CartDrawer } from "@/src/components/CartDrawer";
import { Checkout } from "@/src/components/Checkout";
import { QuickViewModal } from "@/src/components/QuickViewModal";
import { WhatsAppDashboard } from "@/src/components/WhatsAppDashboard";
import { CartItem } from "@/src/types";
import { startVisitorTracking } from "@/src/lib/visitorTracking";

const ProductEntity = base44.entities.Product;

interface AnimatedElementProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setIsVisible(true);
      return;
    }
    const fallback = setTimeout(() => setIsVisible(true), 800 + delay);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          clearTimeout(fallback);
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px 200px 0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      } ${className || ""}`}
    >
      {children}
    </div>
  );
};

const staticFallback: Product[] = [
  {
    id: 1,
    name: "باقة لندن",
    image_url: "/products/london-1.webp",
    price: 296,
    original_price: 296,
    discount_percent: 0,
    category: "london",
    product_url: "#",
  },
  {
    id: "london-bundle-offer",
    name: "باقة لندن - عرض R20",
    image_url: "/products/london-bundle.webp",
    price: 396,
    original_price: 2796,
    discount_percent: 86,
    category: "london",
    product_url: "#",
  },
  {
    id: 2,
    name: "MISS DKHONI 150 ml",
    image_url:
      "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 195,
    original_price: 495,
    discount_percent: 61,
    category: "london",
    product_url: "#",
  },
  {
    id: 3,
    name: "LADY DKHONI 75 ml",
    image_url:
      "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 150,
    original_price: 350,
    discount_percent: 57,
    category: "london",
    product_url: "#",
  },
  {
    id: 4,
    name: "عطر خيال",
    image_url:
      "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 288,
    original_price: 550,
    discount_percent: 47,
    category: "national_day",
    product_url: "#",
  },
];

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  index: number;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onQuickView?: (product: Product) => void;
}

function ProductCard({ product, index, onAddToCart, onQuickView }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <AnimatedElement delay={index * 100}>
      <article className="group relative flex h-full flex-col overflow-hidden bg-white">
        {product.discount_percent > 0 && (
          <span className="absolute end-2 top-2 z-10 rounded-md bg-[#7b2227] px-2 py-1 text-[10px] font-semibold text-white sm:end-3 sm:top-3 sm:text-xs">
            {product.discount_percent}%
          </span>
        )}
        <div
          onClick={() => onQuickView && onQuickView(product)}
          className="relative block aspect-square cursor-pointer overflow-hidden rounded-t-[20px] bg-[#f7f7f5]"
        >
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-grow flex-col px-1 pb-3 pt-4 text-center sm:px-2 sm:pb-5">
          <h5 className="mb-2 min-h-[2rem] text-xs font-semibold leading-5 text-[#2e2727] sm:min-h-[2.5rem] sm:text-[15px]">
            <button
              onClick={() => onQuickView && onQuickView(product)}
              className="w-full text-center transition-opacity hover:opacity-70"
            >
              {product.name}
            </button>
          </h5>
          <div className="mb-4 mt-auto flex items-center justify-center gap-2 text-[#2e2727]">
            {product.original_price > 0 && (
              <span className="text-[11px] text-[#8e8987] line-through sm:text-sm">
                {product.original_price.toFixed(2)}
              </span>
            )}
            <span className="text-sm font-semibold sm:text-base">
              {product.price.toFixed(2)} <span className="text-[10px] sm:text-xs">ر.س</span>
            </span>
          </div>
          <div className="flex overflow-hidden rounded-lg">
            <Button
              onClick={handleAdd}
              className="h-9 flex-1 rounded-none bg-[#2e2727] px-2 text-white hover:bg-[#433a3a] sm:h-10"
            >
              <span className="flex items-center justify-center gap-1.5 truncate text-[11px] font-semibold sm:text-sm">
                <ShoppingBag className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <span>{added ? "أُضيف للسلة" : "أضف للسلة"}</span>
              </span>
            </Button>
            <Button
              size="icon"
              onClick={() => onQuickView && onQuickView(product)}
              className="h-9 w-9 shrink-0 rounded-none border-r border-white/20 bg-[#2e2727] text-white hover:bg-[#433a3a] sm:h-10 sm:w-10"
              aria-label="نظرة سريعة"
            >
              <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </article>
    </AnimatedElement>
  );
}

function HeroSection() {
  return (
    <section className="relative w-full h-screen h-[100dvh] min-h-screen overflow-hidden bg-background">
      {/* Clean Full-Screen Hero Image Banner */}
      <a
        href="#london-collection"
        className="block relative w-full h-full group cursor-pointer"
        aria-label="تسوق مجموعة عطور لندن الفاخرة من دخوني الإمارات"
      >
        <picture className="w-full h-full block">
          <source
            media="(min-width: 768px)"
            srcSet="/hero-desktop.webp, https://media.zid.store/706d9094-6596-4a2d-a51c-684cae1ad600/d85467a2-5db2-4a2a-b139-7f1229a6581f.webp"
          />
          <img
            src="/d1be6bb4-93df-4d5f-a4e0-64f2c465942c.webp"
            srcSet="/d1be6bb4-93df-4d5f-a4e0-64f2c465942c.webp, https://media.zid.store/706d9094-6596-4a2d-a51c-684cae1ad600/d1be6bb4-93df-4d5f-a4e0-64f2c465942c.webp"
            alt="London Collection - مجموعة عطور لندن من دخوني الإمارات"
            className="w-full h-full block object-cover object-center select-none transition-transform duration-700 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
      </a>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  icon: React.ReactNode;
}

function SectionHeading({ eyebrow, title, icon }: SectionHeadingProps) {
  return (
    <AnimatedElement className="mb-9 text-center sm:mb-12">
      <div className="sr-only">{icon}</div>
      <h3 className="mb-2 text-lg font-semibold text-[#2e2727] sm:text-2xl">{eyebrow}</h3>
      <h2 className="text-2xl font-semibold leading-tight text-[#2e2727] sm:text-4xl">
        {title}
      </h2>
    </AnimatedElement>
  );
}

interface GridSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  items: Product[];
  category: string;
  cols?: number;
  icon: React.ReactNode;
  alternateBg?: boolean;
  onAddToCart?: (product: Product, quantity?: number) => void;
  onQuickView?: (product: Product) => void;
}

function GridSection({
  id,
  eyebrow,
  title,
  items,
  category,
  cols = 4,
  icon,
  alternateBg = false,
  onAddToCart,
  onQuickView,
}: GridSectionProps) {
  const list = items.filter((p) => p.category === category);

  return (
    <section
      id={id}
      className={`relative overflow-hidden py-10 sm:py-16 ${alternateBg ? "bg-[#faf9f7]" : "bg-white"}`}
    >
      <div className="relative z-10 mx-auto max-w-[1200px] px-4 sm:px-6">
        <SectionHeading eyebrow={eyebrow} title={title} icon={icon} />

        <div
          className={`grid grid-cols-2 ${
            cols === 4 ? "lg:grid-cols-4" : cols === 3 ? "md:grid-cols-3" : "lg:grid-cols-2"
          } gap-x-3 gap-y-8 sm:gap-x-5 lg:gap-x-7`}
        >
          {list.map((p, i) => (
            <ProductCard
              key={p.id || p.name + i}
              product={p}
              index={i}
              onAddToCart={onAddToCart}
              onQuickView={onQuickView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function NationalDayBanner() {
  return (
    <AnimatedElement>
      <section className="my-6 overflow-hidden bg-background sm:my-10">
        <div className="mx-auto w-full max-w-[769px]">
          <img
            src="/national-day-96.webp"
            alt="عروض اليوم الوطني 96 ر.س من دخوني الإمارات"
            className="block h-auto w-full"
            loading="lazy"
          />
        </div>
      </section>
    </AnimatedElement>
  );
}

function AppPromoSection() {
  return (
    <AnimatedElement>
      <section className="bg-foreground text-background py-14 sm:py-20 relative overflow-hidden rounded-t-[2.5rem] sm:rounded-t-[3rem] -mt-10 z-20">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.8%27 numOctaves=%273%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")',
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 sm:gap-10 text-center md:text-start">
          <div className="flex-1 max-w-xl">
            <h3 className="text-2xl sm:text-4xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              حمّل تطبيق دخوني الآن
            </h3>
            <p className="text-background/70 text-sm sm:text-lg leading-relaxed">
              اكتشف عالمًا من العطور الفاخرة والبخور الأصيل. تسوّق بسهولة، تتبع طلباتك،
              واستمتع بعروض حصرية عبر تطبيقنا.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
            <a
              href="https://apps.apple.com/app/1566163635"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3.5 sm:px-8 sm:py-4 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto active:scale-95"
            >
              <div className="text-start">
                <div className="text-[10px] sm:text-xs opacity-70">Download on the</div>
                <div className="text-base sm:text-lg font-bold">App Store</div>
              </div>
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=store.zid.dkhoonemirates.zstore"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3.5 sm:px-8 sm:py-4 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 w-full sm:w-auto active:scale-95"
            >
              <div className="text-start">
                <div className="text-[10px] sm:text-xs opacity-70">GET IT ON</div>
                <div className="text-base sm:text-lg font-bold">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </section>
    </AnimatedElement>
  );
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || params.get("admin") === "1" || window.location.hash === "#admin") {
      setAdminDashboardOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!adminDashboardOpen) {
      return startVisitorTracking();
    }
  }, [adminDashboardOpen]);

  useEffect(() => {
    ProductEntity.list()
      .then((data) => {
        if (data && data.length > 0) setProducts(data);
      })
      .catch((error) => {
        console.error("Unable to load products from Supabase:", error);
        setProducts(staticFallback);
      });
  }, []);

  const items = products;

  // Filter items if search query is active
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.notes?.top && p.notes.top.toLowerCase().includes(q)) ||
        (p.notes?.heart && p.notes.heart.toLowerCase().includes(q)) ||
        (p.notes?.base && p.notes.base.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => String(item.product.id) === String(product.id));
      if (existing) {
        return prev.map((item) =>
          String(item.product.id) === String(product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    setToastMessage(`تمت إضافة "${product.name}" إلى السلة 🛍️`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleUpdateQuantity = (productId: number | string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (String(item.product.id) === String(productId)) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (productId: number | string) => {
    setCartItems((prev) => prev.filter((item) => String(item.product.id) !== String(productId)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <div
      dir="rtl"
      className="bg-background min-h-screen font-sans selection:bg-primary/20 selection:text-primary relative pb-16 md:pb-0"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes floatA { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-30px) rotate(5deg); } }
        @keyframes floatB { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(-5deg); } }
        @keyframes floatC { 0%, 100% { transform: scale(1) translate(0,0); } 50% { transform: scale(1.05) translate(-10px, 15px); } }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `,
        }}
      />

      {/* Header Navigation */}
      <Header
        cartCount={totalCartCount}
        onOpenCart={() => setCartOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenDashboard={() => setAdminDashboardOpen(false)}
      />

      {/* Floating Dashboard Quick Access Button */}
      {!adminDashboardOpen && (
        <button
          onClick={() => setAdminDashboardOpen(true)}
          className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full bg-[#00a884] px-4 py-3 font-bold text-white shadow-xl border-2 border-white/40 backdrop-blur-md transition-all hover:bg-[#008f70] hover:scale-105 active:scale-95 text-xs sm:text-sm"
          title="فتح لوحة التحكم الحية المباشرة"
        >
          <LayoutDashboard className="h-5 w-5 text-white animate-pulse" />
          <span>لوحة التحكم المباشرة</span>
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-300 animate-ping" />
        </button>
      )}

      {/* Search results banner if search query is active */}
      {searchQuery && (
        <div className="pt-20 sm:pt-28 pb-8 px-4 bg-secondary/40 border-b border-border text-center animate-in fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                نتائج البحث عن: &ldquo;{searchQuery}&rdquo;
              </h2>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs bg-card px-2.5 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                مسح البحث ✕
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-6">
              تم العثور على {filteredItems.length} منتج
            </p>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-right">
                {filteredItems.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    onAddToCart={handleAddToCart}
                    onQuickView={setQuickViewProduct}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 bg-card rounded-2xl border border-border/60 max-w-md mx-auto">
                <p className="text-sm font-bold text-foreground">لا توجد منتجات مطابقة لهذا البحث</p>
                <p className="text-xs text-muted-foreground mt-1">
                  جرب البحث بكلمات مثل &ldquo;لندن&rdquo;، &ldquo;خيال&rdquo;، &ldquo;عود&rdquo;، أو &ldquo;بخور&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <HeroSection />

      {/* London Collection */}
      <GridSection
        id="london-collection"
        eyebrow="LONDON COLLECTION"
        title="لأن بعض المدن تُزار ، ولندن تُحس"
        items={filteredItems}
        category="london"
        cols={4}
        icon={<Sparkles className="w-4 h-4" />}
        alternateBg={false}
        onAddToCart={handleAddToCart}
        onQuickView={setQuickViewProduct}
      />

      {/* National Day Banner */}
      <NationalDayBanner />

      {/* National Day Offers */}
      <GridSection
        id="national-day"
        eyebrow="من طيبنا .. لوطننا"
        title="عروض اليوم الوطني 96"
        items={filteredItems}
        category="national_day"
        cols={4}
        icon={<Flame className="w-4 h-4" />}
        alternateBg={true}
        onAddToCart={handleAddToCart}
        onQuickView={setQuickViewProduct}
      />

      {/* Exclusives */}
      <GridSection
        id="exclusives"
        eyebrow="للوطن.. اخترنا الأطيب"
        title="حصريات اليوم الوطني"
        items={filteredItems}
        category="exclusive"
        cols={3}
        icon={<Sparkles className="w-4 h-4" />}
        alternateBg={false}
        onAddToCart={handleAddToCart}
        onQuickView={setQuickViewProduct}
      />

      {/* Luxury Gifts */}
      <GridSection
        id="gifts"
        eyebrow="أطقم وهدايا فاخرة"
        title="لان الطيب طبعك اهديها"
        items={filteredItems}
        category="gift"
        cols={2}
        icon={<Gift className="w-4 h-4" />}
        alternateBg={true}
        onAddToCart={handleAddToCart}
        onQuickView={setQuickViewProduct}
      />

      {/* Incense */}
      <GridSection
        id="incense"
        eyebrow="إلهام لا ينتهي"
        title="مجموعة البخور الأصلية حيث السُرُور الامنتهي"
        items={filteredItems}
        category="incense"
        cols={4}
        icon={<Flame className="w-4 h-4" />}
        alternateBg={false}
        onAddToCart={handleAddToCart}
        onQuickView={setQuickViewProduct}
      />

      {/* Oud */}
      <GridSection
        id="oud"
        eyebrow="لغة العظماء"
        title="العود لغة تعكس شخصيتك المُلهمة"
        items={filteredItems}
        category="oud"
        cols={3}
        icon={<Sparkles className="w-4 h-4" />}
        alternateBg={true}
        onAddToCart={handleAddToCart}
        onQuickView={setQuickViewProduct}
      />

      {/* App Promo Section */}
      <AppPromoSection />

      {/* Luxury Footer */}
      <Footer />

      {/* Cart Drawer Slide-over */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onStartCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {checkoutOpen && (
        <Checkout
          cartItems={cartItems}
          onClose={() => setCheckoutOpen(false)}
          onClearCart={handleClearCart}
        />
      )}

      {adminDashboardOpen && (
        <WhatsAppDashboard onClose={() => setAdminDashboardOpen(false)} />
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Floating Add to Cart Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 md:bottom-6 start-4 end-4 md:end-auto md:max-w-md z-50 bg-card/95 backdrop-blur-md border border-primary/30 shadow-2xl rounded-2xl p-3 sm:p-4 flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0">
            <Check className="w-4 h-4" />
          </div>
          <div className="text-xs font-bold text-foreground flex-1">
            {toastMessage}
          </div>
          <Button
            size="sm"
            onClick={() => {
              setToastMessage(null);
              setCartOpen(true);
            }}
            className="rounded-lg text-xs h-8 px-3 bg-primary text-primary-foreground font-bold hover:bg-primary/90 shrink-0"
          >
            عرض السلة
          </Button>
          <button
            onClick={() => setToastMessage(null)}
            className="text-muted-foreground hover:text-foreground text-xs p-1"
            aria-label="إغلاق"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
