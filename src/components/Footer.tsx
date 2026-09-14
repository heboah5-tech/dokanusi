import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1611] text-white pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Features / Value props bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-white/10 text-center">
          <div className="flex flex-col items-center space-y-2 p-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-white">
              جودة ملكية أصيلة
            </h4>
            <p className="text-xs text-white/60">
              أجود الزيوت والدهن الطبيعي 100%
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-white">
              توصيل سريع وآمن
            </h4>
            <p className="text-xs text-white/60">
              شحن سريع لكافة الإمارات والخليج
            </p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
              <RotateCcw className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-white">
              استبدال واسترجاع ميسر
            </h4>
            <p className="text-xs text-white/60">خدمة عملاء على مدار الساعة</p>
          </div>

          <div className="flex flex-col items-center space-y-2 p-3">
            <div className="w-12 h-12 rounded-2xl bg-accent/15 border border-accent/30 text-accent flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm sm:text-base text-white">
              دفع آمن ومريح
            </h4>
            <p className="text-xs text-white/60">
              تقسيط عبر تابي وتمارا والدفع عند الاستلام
            </p>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-12">
          {/* Brand info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="العودة إلى أعلى الصفحة"
                className="flex h-20 w-24 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
              >
                <img
                  src="/dkon.svg"
                  alt="دخوني الإمارات"
                  className="h-full w-full object-contain"
                />
              </a>
              <div>
                <h3 className="text-xl font-black font-serif text-white">
                  دخوني الإمارات
                </h3>
                <span className="text-[10px] tracking-[0.2em] text-accent uppercase">
                  DKHOON EMIRATES
                </span>
              </div>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              علامة إماراتية رائدة تجسد فخامة العطور الشرقية الأصيلة والعود
              المروكي الملكي، ممزوجة بأحدث اتجاهات صناعة العطور العالمية.
            </p>
            <div className="flex items-center gap-2 text-xs text-accent font-semibold pt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>#الطيب_يطبعك • عزنا بجودنا</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-accent uppercase tracking-wider">
              أقسام المتجر
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <a
                  href="#london-collection"
                  className="hover:text-accent transition-colors"
                >
                  مجموعة لندن (London Collection)
                </a>
              </li>
              <li>
                <a
                  href="#national-day"
                  className="hover:text-accent transition-colors"
                >
                  عروض اليوم الوطني 96
                </a>
              </li>
              <li>
                <a
                  href="#exclusives"
                  className="hover:text-accent transition-colors"
                >
                  حصريات دخوني الملكية
                </a>
              </li>
              <li>
                <a
                  href="#gifts"
                  className="hover:text-accent transition-colors"
                >
                  أطقم وباقات الإهداء VIP
                </a>
              </li>
              <li>
                <a
                  href="#incense"
                  className="hover:text-accent transition-colors"
                >
                  المعمول والبخور الإماراتي
                </a>
              </li>
              <li>
                <a href="#oud" className="hover:text-accent transition-colors">
                  أدهان العود ورقائق المروكي
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-accent uppercase tracking-wider">
              خدمة العملاء
            </h4>
            <ul className="space-y-2 text-xs text-white/75">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  سياسة الشحن والتوصيل
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  سياسة الاستبدال والاسترجاع
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  الأسئلة الشائعة (FAQ)
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  تتبع الشحنات والطلبات
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  دليل العناية بالبخور والعود
                </a>
              </li>
            </ul>
          </div>

          {/* Contact and newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-accent uppercase tracking-wider">
              تواصل معنا
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <span dir="ltr">+971 4 800 DKHONI</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <span>care@dkhoonemirates.ae</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span>دبي - الإمارات العربية المتحدة</span>
              </li>
            </ul>

            <div className="pt-2">
              <span className="text-[11px] text-white/60 block mb-2">
                اشترك ليصلك جديد العروض الحصرية:
              </span>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-accent flex-1"
                />
                <button
                  type="button"
                  className="bg-accent text-[#0b1611] font-bold text-xs px-4 rounded-xl hover:bg-accent/90 transition-colors"
                >
                  اشتراك
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar with payment badges */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} دخوني الإمارات |
            Dkhoon Emirates
          </div>

          {/* Payment badges / indicators */}
          <div
            className="flex flex-wrap items-center justify-center gap-2.5"
            aria-label="وسائل الدفع المتاحة"
          >
            <img
              src="/payment-methods/apple-pay.svg"
              alt="Apple Pay"
              className="h-9 w-14 object-contain"
            />
            <img
              src="/payment-methods/mada.png"
              alt="Mada"
              className="h-9 w-[72px] rounded-md bg-white object-contain px-1.5"
            />
            <img
              src="/payment-methods/visa.png"
              alt="Visa"
              className="h-9 w-9 rounded-full object-contain"
            />
            <img
              src="/payment-methods/mastercard.png"
              alt="Mastercard"
              className="h-9 w-9 rounded-full object-contain"
            />
            <img
              src="/payment-methods/tabby.svg"
              alt="Tabby"
              className="h-9 w-[91px] object-contain"
            />
            <span className="flex h-9 w-[104px] items-center justify-center rounded-md bg-white px-2">
              <img
                src="/payment-methods/tamara.svg"
                alt="Tamara"
                className="h-full w-full object-contain"
              />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
