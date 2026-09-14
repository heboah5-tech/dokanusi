import React, { useEffect, useState } from "react";
import { Globe2, LayoutDashboard, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenDashboard?: () => void;
}

const navLinks = [
  { name: "مجموعة لندن", href: "#london-collection" },
  { name: "عروض اليوم الوطني", href: "#national-day", badge: "96 ر.س" },
  { name: "الحصريات", href: "#exclusives" },
  { name: "أطقم الهدايا", href: "#gifts" },
  { name: "البخور الأصيل", href: "#incense" },
  { name: "العود الملكي", href: "#oud" },
];

const iconButtonClass =
  "relative flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 active:scale-95";

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  onOpenDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerTone = isScrolled
    ? "bg-[#241d1e]/85 backdrop-blur-md shadow-lg"
    : "bg-gradient-to-b from-black/25 to-transparent";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-24 w-full text-white transition-all duration-300 ${headerTone}`}
    >
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        {/* Left controls in the reference image: cart, account, search */}
        <div className="flex items-center gap-1 sm:gap-2" dir="ltr">
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className={iconButtonClass}
            aria-label={`السلة${cartCount ? `، ${cartCount} منتجات` : ""}`}
          >
            <ShoppingBag className="h-[27px] w-[27px] stroke-[1.7]" />
            {cartCount > 0 && (
              <span className="absolute left-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#eee2cf] px-1 text-[11px] font-bold text-[#45352f] shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <a
            href="https://wa.me/966500000000"
            target="_blank"
            rel="noopener noreferrer"
            className={iconButtonClass}
            aria-label="خدمة العملاء"
          >
            <UserRound className="h-[27px] w-[27px] stroke-[1.7]" />
          </a>

          {onOpenDashboard && (
            <button
              onClick={onOpenDashboard}
              className={`${iconButtonClass} bg-[#00a884]/20 hover:bg-[#00a884]/40 border border-[#00a884]/40`}
              aria-label="لوحة التحكم"
              title="لوحة التحكم المباشرة"
            >
              <LayoutDashboard className="h-[24px] w-[24px] text-[#25d366]" />
            </button>
          )}

          <button
            id="header-search-btn"
            onClick={() => setShowSearch((open) => !open)}
            className={iconButtonClass}
            aria-label="بحث"
            aria-expanded={showSearch}
          >
            <Search className="h-[29px] w-[29px] stroke-[1.7]" />
          </button>
        </div>

        {/* Centered brand mark */}
        <a
          href="#"
          className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-transform hover:scale-105"
          aria-label="دخوني الإمارات"
        >
          <img
            src="/dkon.svg"
            alt="دخوني الإمارات"
            className="h-[72px] w-[100px] object-contain drop-shadow-md sm:h-[80px] sm:w-[112px]"
          />
        </a>

        {/* Right controls in the reference image: country, language, menu */}
        <div className="flex items-center gap-1 sm:gap-2" dir="rtl">
          <button
            className={`${iconButtonClass} h-10 w-10 bg-[#168448] shadow-sm hover:bg-[#168448]/90`}
            aria-label="السعودية"
            title="ريال سعودي"
          >
            <span className="text-[17px] leading-none">🇸🇦</span>
          </button>

          <button
            className={iconButtonClass}
            aria-label="اللغة"
            title="اللغة"
          >
            <Globe2 className="h-[28px] w-[28px] stroke-[1.6]" />
          </button>

          <button
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className={iconButtonClass}
            aria-label="القائمة"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="h-[30px] w-[30px] stroke-[1.6]" />
            ) : (
              <Menu className="h-[31px] w-[31px] stroke-[1.5]" />
            )}
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="absolute inset-x-0 top-24 border-t border-white/15 bg-[#241d1e]/95 p-3 shadow-xl backdrop-blur-xl animate-in slide-in-from-top-2">
          <div className="relative mx-auto max-w-xl">
            <input
              type="text"
              autoFocus
              placeholder="ابحث في المتجر بالاسم أو النوتات..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-11 w-full rounded-xl border border-white/20 bg-white/10 px-10 text-sm text-white outline-none placeholder:text-white/65 focus:border-white/50"
            />
            <Search className="absolute right-3 top-3.5 h-4 w-4 text-white/70" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-3 text-sm text-white/70 hover:text-white"
                aria-label="مسح البحث"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <nav className="absolute inset-x-0 top-24 border-t border-white/15 bg-[#241d1e]/95 p-4 shadow-2xl backdrop-blur-xl animate-in slide-in-from-top-3">
          <div className="mx-auto grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-3 text-center text-sm font-bold text-white/90 transition-colors hover:bg-white/10"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="mr-1 inline-flex rounded-full bg-destructive px-1.5 py-0.5 text-[10px] text-white">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};