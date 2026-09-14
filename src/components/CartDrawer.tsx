import React, { useState } from "react";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { CartItem } from "@/src/types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number | string, delta: number) => void;
  onRemoveItem: (productId: number | string) => void;
  onClearCart: () => void;
  onStartCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onStartCheckout,
}) => {
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const freeShippingThreshold = 200;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 25;

  const discountAmount = appliedDiscount > 0 ? (subtotal * appliedDiscount) / 100 : 0;
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (couponCode.trim().toUpperCase() === "EID96") {
      setAppliedDiscount(15);
      setCouponSuccess(true);
      setCouponError("");
    } else {
      setCouponError("كود الخصم غير صالح. جرب كود EID96");
      setCouponSuccess(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 start-0 max-w-full flex">
        <div className="w-screen max-w-full sm:max-w-md bg-card shadow-2xl flex flex-col justify-between border-e border-border text-right h-full">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border/70 flex items-center justify-between bg-secondary/30 shrink-0">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-base sm:text-lg text-foreground">سلة المشتريات</h3>
                <span className="text-[11px] sm:text-xs text-muted-foreground">
                  ({cartItems.reduce((acc, i) => acc + i.quantity, 0)} منتجات)
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl text-foreground/70 hover:bg-secondary hover:text-foreground flex items-center justify-center transition-colors active:scale-95"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping banner */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-primary/5 border-b border-border/50 shrink-0">
            {remainingForFreeShipping === 0 ? (
              <div className="text-xs text-primary font-bold flex items-center justify-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>تهانينا! لقد حصلت على شحن مجاني سريع 🚚</span>
              </div>
            ) : (
              <div>
                <div className="text-xs text-foreground/80 font-medium mb-1.5 flex justify-between">
                  <span>أضف بقيمة <strong className="text-primary font-bold">{remainingForFreeShipping.toFixed(0)} ر.س</strong> للحصول على شحن مجاني</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-accent h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {checkoutComplete ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-black text-foreground">تم استلام طلبك بنجاح!</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                  شكراً لاختيارك دخوني الإمارات. سيتم إرسال تفاصيل التتبع والطلب إلى رقم هاتفك مباشرة.
                </p>
                <Button
                  onClick={() => {
                    setCheckoutComplete(false);
                    onClose();
                  }}
                  className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold"
                >
                  متابعة التسوق
                </Button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary/80 flex items-center justify-center mx-auto text-muted-foreground">
                  <ShoppingBag className="w-8 h-8 opacity-40" />
                </div>
                <h4 className="text-base font-bold text-foreground">سلتك فارغة حالياً</h4>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                  تصفح تشكيلة عطور وبخور دخوني الفاخرة وأضف روائحك المفضلة إلى السلة.
                </p>
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="rounded-full px-6 text-xs font-bold border-primary/30 text-primary hover:bg-primary hover:text-white"
                >
                  استكشاف العطور
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-secondary/20 border border-border/60 hover:border-border transition-all"
                >
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-contain bg-card p-1 border border-border/40 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-foreground truncate">
                      {item.product.name}
                    </h5>
                    <div className="text-xs text-primary font-black mt-1">
                      {item.product.price.toFixed(0)} ر.س
                    </div>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-border rounded-lg bg-card overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-secondary text-xs text-muted-foreground hover:text-foreground"
                          aria-label="إنقاص"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center hover:bg-secondary text-xs text-muted-foreground hover:text-foreground"
                          aria-label="زيادة"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveItem(item.product.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label="حذف المنتج"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cartItems.length > 0 && !checkoutComplete && (
            <div className="p-6 border-t border-border bg-secondary/20 space-y-4">
              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="كود الخصم (جرب EID96)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 h-10 px-3 text-xs bg-card rounded-xl border border-border focus:border-primary focus:outline-none"
                />
                <Button
                  type="submit"
                  variant="outline"
                  className="h-10 px-4 rounded-xl text-xs font-bold border-primary/30 text-primary hover:bg-primary/5"
                >
                  تطبيق
                </Button>
              </form>

              {couponSuccess && (
                <div className="text-[11px] text-green-600 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>تم تطبيق كود EID96 وخصم 15% إضافي!</span>
                </div>
              )}
              {couponError && (
                <div className="text-[11px] text-destructive font-medium">
                  {couponError}
                </div>
              )}

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-foreground/80 pt-2 border-t border-border/50">
                <div className="flex justify-between">
                  <span>المجموع الفرعي:</span>
                  <span className="font-bold">{subtotal.toFixed(0)} ر.س</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-accent font-bold">
                    <span>خصم الكوبون ({appliedDiscount}%):</span>
                    <span>-{discountAmount.toFixed(0)} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>الشحن والتوصيل:</span>
                  <span className="font-bold">
                    {shippingCost === 0 ? "مجاني 🚚" : `${shippingCost} ر.س`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-foreground pt-2 border-t border-border">
                  <span>الإجمالي النهائي:</span>
                  <span className="text-primary font-black">{total.toFixed(0)} ر.س</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                onClick={onStartCheckout}
                disabled={isCheckingOut}
                className="w-full h-11 sm:h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
              >
                {isCheckingOut ? (
                  <span>جاري إتمام الطلب...</span>
                ) : (
                  <>
                    <span>إتمام الطلب السريع</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                <span>دفع آمن 100% • الدفع عند الاستلام متاح بالسعودية</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
