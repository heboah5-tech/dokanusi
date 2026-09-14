export interface Product {
  id: number | string;
  name: string;
  image_url: string;
  secondary_image_url?: string;
  price: number;
  original_price: number;
  discount_percent: number;
  category: "london" | "national_day" | "exclusive" | "gift" | "incense" | "oud" | string;
  product_url: string;
  description?: string;
  notes?: {
    top?: string;
    heart?: string;
    base?: string;
  };
  volume?: string;
}

export const initialProducts: Product[] = [
  // London Collection
  {
    id: 1,
    name: "باقة لندن الملكية المتكاملة",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 395,
    original_price: 890,
    discount_percent: 55,
    category: "london",
    product_url: "#",
    volume: "مجموعة 3 قطع",
    description: "باقة حصرية مستوحاة من رقي العاصمة البريطانية لندن بنفحات شرقية أوروبية استثنائية تأسر الحواس.",
    notes: { top: "البرغموت الإيطالي والزعفران", heart: "الورد الدمشقي والياسمين", base: "خشب الصندل والعنبر والمسك الأبيض" }
  },
  {
    id: 2,
    name: "MISS DKHONI 150 ml",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 195,
    original_price: 495,
    discount_percent: 61,
    category: "london",
    product_url: "#",
    volume: "150 ml",
    description: "عطر ميس دخوني الأيقوني، تركيبة أنثوية جذابة تجمع بين الفواكه المخملية ونفحات الفانيليا والزهور النادرة.",
    notes: { top: "الكشمش الأسود والتوت البري", heart: "أوركيد الفانيليا والغاردينيا", base: "المسك الوردي وخشب الأرز" }
  },
  {
    id: 3,
    name: "LADY DKHONI 75 ml",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 150,
    original_price: 350,
    discount_percent: 57,
    category: "london",
    product_url: "#",
    volume: "75 ml",
    description: "ليدي دخوني يفيض بالأناقة الكلاسيكية والتميز، عطر المساء للمناسبات الراقية بتركيز Eau de Parfum مكثف.",
    notes: { top: "زهر البرتقال والكمثرى", heart: "زهرة السوسن والياسمين الملكي", base: "الباتشولي والعنبر الدافئ" }
  },
  {
    id: 4,
    name: "LONDON NIGHT Eau De Parfum 100 ml",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 245,
    original_price: 520,
    discount_percent: 53,
    category: "london",
    product_url: "#",
    volume: "100 ml",
    description: "ليالي لندن الساحرة مجسدة في زجاجة عطر، مزيج غامض من التوابل الدافئة والأخشاب الثمينة والجلد الفاخر.",
    notes: { top: "الهيل والجلد الإنجليزي", heart: "القرفة وجوزة الطيب وخشب الغاياك", base: "العود الخفيف وفول التونكا" }
  },

  // National Day Offers
  {
    id: 5,
    name: "عطر خيال - إصدار اليوم الوطني 96",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 96,
    original_price: 290,
    discount_percent: 67,
    category: "national_day",
    product_url: "#",
    volume: "100 ml",
    description: "عرض خاص بسعر 96 ر.س بمناسبة اليوم الوطني. عطر خيال ينسج مشاعر الفخر والأصالة مع الفوحان الأخّاذ.",
    notes: { top: "الزعفران وخلاصة المندرين", heart: "حبوب الهيل واللافندر النبيل", base: "المسك الأصيل وخشب الأرز" }
  },
  {
    id: 6,
    name: "عطر فخر الوطن 96",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 96,
    original_price: 310,
    discount_percent: 69,
    category: "national_day",
    product_url: "#",
    volume: "100 ml",
    description: "عطر تجسد قطراته حب الوطن وعزته، عطر متفرد يدوم أكثر من 24 ساعة برائحة منعشة وقوية.",
    notes: { top: "اليوسفي والنعناع البري", heart: "الخزامى والقرنفل", base: "العنبر الملكي والجاوي" }
  },
  {
    id: 7,
    name: "عطر مجد 96 الإصدار التذكاري",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 96,
    original_price: 280,
    discount_percent: 66,
    category: "national_day",
    product_url: "#",
    volume: "100 ml",
    description: "عطر المجد والهمة، إشراقة عطرة تبدأ برائحة الحمضيات الشرقية وتنتهي بقاعدة خشبية راسخة كالجبال.",
    notes: { top: "البرغموت والجريب فروت", heart: "الفلفل الوردي وإبرة الراعي", base: "نجيل الهند والباتشولي" }
  },
  {
    id: 8,
    name: "باقة اليوم الوطني الكبرى (3 عطور)",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 288,
    original_price: 680,
    discount_percent: 58,
    category: "national_day",
    product_url: "#",
    volume: "3 × 100 ml",
    description: "الباقة الثلاثية الأكثر طلباً تشمل (خيال + فخر الوطن + مجد) مع تغليف هدايا اليوم الوطني المجاني.",
    notes: { top: "توليفة الزعفران والحمضيات", heart: "الزهور النادرة والهيل", base: "العود والعنبر والمسك الأبيض" }
  },

  // Exclusives
  {
    id: 9,
    name: "حصري دخوني 96 الملكي",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 340,
    original_price: 650,
    discount_percent: 48,
    category: "exclusive",
    product_url: "#",
    volume: "100 ml",
    description: "إصدار مرقم محدود تم إنتاجه خصيصاً للاحتفال بمناسبة اليوم الوطني بنفحات عود كلمنتان نقي مع الورد الجبلي.",
    notes: { top: "الزعفران الإيراني الممتاز", heart: "الورد الطائفي النقي", base: "دهن عود كلمنتان واللبان الحوجري" }
  },
  {
    id: 10,
    name: "مخلط العز التراثي الفاخر",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 290,
    original_price: 580,
    discount_percent: 50,
    category: "exclusive",
    product_url: "#",
    volume: "تولة ونصف",
    description: "خلطة ملوك وأمراء، مخلط دهني مركز يجمع بين دهن العود الكمبودي المعتق والعنبر الأشهب.",
    notes: { top: "العنبر البحري والمسك الغزال", heart: "العود الكمبودي القديم", base: "خشب الصندل الهندي المايسور" }
  },
  {
    id: 11,
    name: "عطر دار زايد الحصري",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 380,
    original_price: 720,
    discount_percent: 47,
    category: "exclusive",
    product_url: "#",
    volume: "125 ml",
    description: "تحفة عطرية حصرية تجسد كرم وأصالة الدار بنفحات الياسمين الملكي مع العود المعتق الفواح.",
    notes: { top: "الزعفران وحب الهال", heart: "ياسمين السامباك وزهر البرتقال", base: "العود الأسامي والمسك الأسود" }
  },

  // Luxury Gifts
  {
    id: 12,
    name: "صندوق الإهداء الملكي الفاخر (VIP Gift Box)",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 580,
    original_price: 1250,
    discount_percent: 54,
    category: "gift",
    product_url: "#",
    volume: "صندوق متكامل 5 قطع",
    description: "صندوق مخملي فاخر باللون الأخضر والذهبي يحتوي على عطرين ملكيين + ربع تولة دهن عود معتق + أوقية بخور مروكي + مبخرة كريستال.",
    notes: { top: "العنبر والورد", heart: "العود والمروكي", base: "المسك الملكي والصندل" }
  },
  {
    id: 13,
    name: "طقم ضيافة اليوم الوطني المتكامل",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 450,
    original_price: 950,
    discount_percent: 53,
    category: "gift",
    product_url: "#",
    volume: "طقم الضيافة",
    description: "الهدية المثالية لمجالس الكرم والضيافة، تشمل 3 أصناف من أرقى معمول ومبثوث دخوني مع ملقط ذهبي ومبخرة تراثية.",
    notes: { top: "اللبان المعطر", heart: "المعمول الملكي", base: "العنبر والعود الفاخر" }
  },

  // Incense (البخور)
  {
    id: 14,
    name: "بخور مروكي ملكي فاخر (أوقية)",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 180,
    original_price: 360,
    discount_percent: 50,
    category: "incense",
    product_url: "#",
    volume: "30 جرام (أوقية)",
    description: "كسر مروكي مسقى بزيوت عطرية نقية يزبد على الجمر ويملأ المكان بعبق الضيافة الإماراتية العريقة.",
    notes: { top: "الدهن المروكي النقي", heart: "العنبر الدافئ", base: "خشب العود الطبيعي" }
  },
  {
    id: 15,
    name: "معمول دخوني الإماراتي الأصيل",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 110,
    original_price: 220,
    discount_percent: 50,
    category: "incense",
    product_url: "#",
    volume: "120 جرام",
    description: "حبات معمول معجونة بأجود أنواع دهن العود والمسك والعنبر، تمنح المجالس والمنازل رائحة هادئة مستمرة.",
    notes: { top: "الورد والزعفران", heart: "المسك الأبيض", base: "العود والصندل" }
  },
  {
    id: 16,
    name: "مبثوث الشيوخ الخاص الفاخر",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 140,
    original_price: 290,
    discount_percent: 52,
    category: "incense",
    product_url: "#",
    volume: "75 جرام",
    description: "مبثوث محضر من دقة العود الطبيعي المشبع بأغلى الزيوت العطرية الشرقية.",
    notes: { top: "الزعفران وحب الهال", heart: "العود الهندي", base: "المسك والعنبر الحار" }
  },
  {
    id: 17,
    name: "لبان حوجري معطر ملكي",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 85,
    original_price: 170,
    discount_percent: 50,
    category: "incense",
    product_url: "#",
    volume: "100 جرام",
    description: "لبان حوجري عماني منقى ممزوج بروائح الورد والمسك لتعقيم الأجواء ونشر البهجة والانتعاش.",
    notes: { top: "اللبان الأخضر المنعش", heart: "ماء الورد والمسك", base: "المسك الأبيض الخفيف" }
  },

  // Oud (العود والادهان)
  {
    id: 18,
    name: "دهن عود تراد كلاسيك معتق سوبر",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 260,
    original_price: 590,
    discount_percent: 56,
    category: "oud",
    product_url: "#",
    volume: "ربع تولة (3 مل)",
    description: "دهن عود تراد تايلاندي أصلي مقطر على الحطب ومعتق لأكثر من 8 سنوات برائحة سويتية بخورية ساحرة.",
    notes: { top: "نوتة عسلية بخورية", heart: "أخشاب الغابات الاستوائية", base: "العود الصافي العميق" }
  },
  {
    id: 19,
    name: "دهن عود كلمنتان دبل سوبر مالينو",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/16c3146e3_media_zid_store_95385708-d587-4311-a479-61c85e1694b8-thumbnail-1000x1000-70_484c560c.webp",
    price: 320,
    original_price: 680,
    discount_percent: 53,
    category: "oud",
    product_url: "#",
    volume: "ربع تولة (3 مل)",
    description: "من أندر أنواع دهن العود الإندونيسي بنكهة ترابية زكية وثبات استثنائي يستمر لأيام على الثياب.",
    notes: { top: "النكهة البخورية الباردة", heart: "خشب الصندل المعتق", base: "الكلمنتان الأسطوري" }
  },
  {
    id: 20,
    name: "رقائق عود مروكي طبيعي آصام (سوبر)",
    image_url: "https://media.base44.com/images/public/6aa6a68e6e6750edf33a8148/88053ef2f_media_zid_store_688d04ed-8e33-49c2-b9c9-d12729c9c71e-thumbnail-1000x1000-70_233317c0.webp",
    price: 210,
    original_price: 440,
    discount_percent: 52,
    category: "oud",
    product_url: "#",
    volume: "أوقية (30 جرام)",
    description: "رقائق عود مروكي طبيعية 100% مستخرجة من أقدم غابات بابوا، نكهة مروكية كلاسيكية لا تتغير حتى نهاية الجمرة.",
    notes: { top: "البخور النقي المركز", heart: "الراتنج الخشبي الطبيعي", base: "العود العتيق" }
  }
];

export const base44 = {
  entities: {
    Product: {
      list: async (): Promise<Product[]> => {
        try {
          const response = await fetch("/api/products", { cache: "no-store" });
          if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
              return data as Product[];
            }
          }
        } catch {
          // Fall back silently to initial products
        }
        return initialProducts;
      },
      getById: async (id: number | string): Promise<Product | undefined> => {
        return initialProducts.find((p) => String(p.id) === String(id));
      }
    }
  }
};
