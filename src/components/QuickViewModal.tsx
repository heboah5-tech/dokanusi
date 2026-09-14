import React, { useState } from "react";
import { X, ShoppingBag, Check, ShieldCheck, Truck, Droplets } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Product } from "@/src/types";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) return null;
  const productImages = [product.image_url, product.secondary_image_url].filter(
    (image): image is string => Boolean(image)
  );

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-card rounded-3xl shadow-2xl border border-border/80 overflow-hidden text-right flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-secondary/80 hover:bg-secondary text-foreground flex items-center justify-center transition-colors shadow-sm"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Section */}
        <div className="md:w-1/2 bg-secondary/20 p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden shrink-0">
          {product.discount_percent > 0 && (
            <span className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 bg-destructive text-white text-[11px] sm:text-xs font-black px-2.5 py-1 rounded-full shadow-md">
              وفر {product.discount_percent}%
            </span>
          )}
          <img
            src={productImages[selectedImageIndex] ?? product.image_url}
            alt={product.name}
            className="w-full h-48 sm:h-72 md:h-80 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          />
          {productImages.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2" aria-label="صور المنتج">
              {productImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImageIndex(index)}
                  className={`h-14 w-14 overflow-hidden rounded-lg border-2 bg-white p-1 transition ${
                    selectedImageIndex === index
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  aria-label={`عرض صورة المنتج ${index + 1}`}
                >
                  <img src={image} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
          {product.volume && (
            <span className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-background/85 backdrop-blur-sm text-foreground text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-border">
              الحجم: {product.volume}
            </span>
          )}
        </div>

        {/* Product Details Section */}
        <div className="md:w-1/2 p-4 sm:p-7 flex flex-col justify-between overflow-y-auto">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-accent uppercase tracking-wider mb-1 block">
              دخوني الإمارات | الفخامة الملكية
            </span>
            <h3 className="text-lg sm:text-2xl font-black text-foreground mb-2 sm:mb-3 leading-snug">
              {product.name}
            </h3>

            {/* Price section */}
            <div className="flex items-baseline gap-2.5 mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl font-black text-primary">
                {product.price.toFixed(0)}{" "}
                <span className="text-xs sm:text-sm font-bold text-muted-foreground">ر.س</span>
              </span>
              {product.original_price > product.price && (
                <span className="text-sm text-muted-foreground line-through opacity-70">
                  {product.original_price.toFixed(0)} ر.س
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-4">
              {product.description ||
                "تحفة عطرية استثنائية من أرقى المكونات والزيوت الأساسية لتدوم معك طوال اليوم وتعكس أناقتك الفائقة."}
            </p>

            {/* Fragrance pyramid if available */}
            {product.notes && (
              <div className="bg-secondary/40 rounded-2xl p-3 sm:p-4 mb-4 border border-border/50 text-[11px] sm:text-xs space-y-1.5">
                <div className="font-black flex items-center gap-1 text-primary">
                  <Droplets className="w-3.5 h-3.5 text-accent" />
                  <span>الهرم العطري والمكونات:</span>
                </div>
                {product.notes.top && (
                  <div className="text-foreground/90">
                    <span className="font-bold text-accent">القمة: </span>
                    {product.notes.top}
                  </div>
                )}
                {product.notes.heart && (
                  <div className="text-foreground/90">
                    <span className="font-bold text-accent">القلب: </span>
                    {product.notes.heart}
                  </div>
                )}
                {product.notes.base && (
                  <div className="text-foreground/90">
                    <span className="font-bold text-accent">القاعدة: </span>
                    {product.notes.base}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            {/* Quantity Selector */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-muted-foreground">الكمية:</span>
              <div className="flex items-center border border-border rounded-xl bg-secondary/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary transition-colors font-bold text-sm active:scale-95"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-secondary transition-colors font-bold text-sm active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAdd}
              disabled={added}
              className="w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 flex items-center justify-center gap-2 active:scale-95"
            >
              {added ? (
                <>
                  <Check className="w-5 h-5 text-accent" />
                  <span>تمت الإضافة للسلة بنجاح</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>أضف للسلة • {(product.price * quantity).toFixed(0)} ر.س</span>
                </>
              )}
            </Button>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-border/50 text-[10px] sm:text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>أصلي 100% ومضمون</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-accent shrink-0" />
                <span>شحن وتوصيل سريع بالسعودية</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
