// ============================================================
// AgriConnect – SPA Application Core
// ============================================================

// ---------- Static App Data & Constants ----------
const CATEGORIES = ["All", "Grain", "Cash Crop", "Fruit", "Vegetable"];

const CROP_IMAGES = {
  // Grains
  Wheat:
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80",
  Rice: "https://images.unsplash.com/photo-1586985289688-cacf32ca6e4e?w=500&q=80",
  Maize:
    "https://images.unsplash.com/photo-1535808066601-684b01f18b11?w=500&q=80",
  Corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&q=80",
  Barley:
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80",
  Sorghum:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&q=80",
  Millet:
    "https://images.unsplash.com/photo-1535808066601-684b01f18b11?w=500&q=80",
  // Cash Crops
  Sugarcane:
    "https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&q=80",
  Cotton:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80",
  Tobacco:
    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80",
  Sunflower:
    "https://images.unsplash.com/photo-1490750967868-88df5691a673?w=500&q=80",
  Canola:
    "https://images.unsplash.com/photo-1490750967868-88df5691a673?w=500&q=80",
  Mustard:
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80",
  // Fruits
  Mango:
    "https://images.unsplash.com/photo-1585518419759-7c67ffcf5e2f?w=500&q=80",
  Citrus:
    "https://images.unsplash.com/photo-1568702846629-a519a1b8e3d5?w=500&q=80",
  Orange:
    "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80",
  Lemon:
    "https://images.unsplash.com/photo-1570123942296-f1e5f50d57e8?w=500&q=80",
  Banana:
    "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80",
  Apple:
    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=80",
  Guava:
    "https://images.unsplash.com/photo-1536511132770-e5058c7e8c46?w=500&q=80",
  Watermelon:
    "https://images.unsplash.com/photo-1563114773-84221bd62daa?w=500&q=80",
  Grapes:
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80",
  Dates:
    "https://images.unsplash.com/photo-1514361726087-38371321b5cd?w=500&q=80",
  Peach:
    "https://images.unsplash.com/photo-1595475207225-428b62bda831?w=500&q=80",
  Pomegranate:
    "https://images.unsplash.com/photo-1615485291395-26f76bc3e92a?w=500&q=80",
  // Vegetables
  Tomato:
    "https://images.unsplash.com/photo-1609424842837-f08e85db2b34?w=500&q=80",
  Potato:
    "https://images.unsplash.com/photo-1535670711867-efb226f6d81e?w=500&q=80",
  Onion:
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80",
  Garlic:
    "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&q=80",
  Ginger:
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&q=80",
  Carrot:
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80",
  Cabbage:
    "https://images.unsplash.com/photo-1550575038-2be5f7ed5e4e?w=500&q=80",
  Spinach:
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80",
  Peas: "https://images.unsplash.com/photo-1587735243475-37a573cd1fcc?w=500&q=80",
  Chilli:
    "https://images.unsplash.com/photo-1559181567-c3190bbb5ef3?w=500&q=80",
  Pepper:
    "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80",
  Brinjal:
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&q=80",
  Eggplant:
    "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500&q=80",
  Cucumber:
    "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&q=80",
  Pumpkin:
    "https://images.unsplash.com/photo-1570586437263-ab629fccc818?w=500&q=80",
  Cauliflower:
    "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=500&q=80",
  Turnip:
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80",
  Radish:
    "https://images.unsplash.com/photo-1587735243615-c5f22fba81aa?w=500&q=80",
  Coriander:
    "https://images.unsplash.com/photo-1592424002053-21f369ad7fdb?w=500&q=80",
  // Pulses/Legumes
  Chickpea:
    "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80",
  Lentil:
    "https://images.unsplash.com/photo-1643143892786-87b7a4eff1de?w=500&q=80",
  Moong:
    "https://images.unsplash.com/photo-1643143892786-87b7a4eff1de?w=500&q=80",
  Masoor:
    "https://images.unsplash.com/photo-1643143892786-87b7a4eff1de?w=500&q=80",
  Mash: "https://images.unsplash.com/photo-1643143892786-87b7a4eff1de?w=500&q=80",
  Soybean:
    "https://images.unsplash.com/photo-1643143892786-87b7a4eff1de?w=500&q=80",
};

/**
 * Smart image lookup: tries exact match → keyword match → generic farm fallback.
 * Works for any crop name, including custom ones entered by farmers.
 * Also automatically fixes improper Unsplash webpage links if the user adds their own.
 * @param {string} name - Crop name
 * @returns {string} Image URL
 */
function getCropImageUrl(name) {
  if (!name)
    return "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400";

  let imgUrl = null;
  // Exact match (case-insensitive)
  const exactKey = Object.keys(CROP_IMAGES).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  if (exactKey) imgUrl = CROP_IMAGES[exactKey];

  // Keyword/partial match
  if (!imgUrl) {
    const lowerName = name.toLowerCase();
    const partialKey = Object.keys(CROP_IMAGES).find(
      (k) =>
        lowerName.includes(k.toLowerCase()) ||
        k.toLowerCase().includes(lowerName),
    );
    if (partialKey) imgUrl = CROP_IMAGES[partialKey];
  }

  if (imgUrl) {
    // Automatically fix improperly pasted Unsplash website links (unsplash.com/photos/...)
    if (imgUrl.includes("unsplash.com/photos/")) {
      const photoId = imgUrl
        .split("unsplash.com/photos/")[1]
        .split("/")[0]
        .split("?")[0];
      return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=400`;
    }
    // Also ensure source.unsplash.com is caught (deprecated)
    if (imgUrl.includes("source.unsplash.com")) {
      const query = encodeURIComponent(`${name} crop farm`);
      return `https://source.unsplash.com/featured/400x300/?${query}`;
    }
    return imgUrl;
  }

  // For unknown crops, still use a crop-specific Unsplash query.
  const query = encodeURIComponent(`${name} crop farm agriculture`);
  return `https://source.unsplash.com/featured/400x300/?${query}`;
}

const FEATURES = [
  {
    tag: "Direct",
    title: "Direct Farm-to-Buyer",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=900",
    desc: "Connect directly with local farmers and eliminate middleman costs for better pricing.",
  },
  {
    tag: "Fair",
    title: "Fair Price Negotiation",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=900",
    desc: "Transparent pricing with direct negotiation tools for both farmers and buyers.",
  },
  {
    tag: "Search",
    title: "Smart Search & Filter",
    image:
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=900",
    desc: "Find exactly what you need with powerful search, category filters, and location-based results.",
  },
  {
    tag: "Insights",
    title: "Market Analytics",
    image:
      "https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&q=80&w=900",
    desc: "Real-time insights into crop availability, demand patterns, and pricing trends.",
  },
  {
    tag: "Trusted",
    title: "Verified Profiles",
    image:
      "https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?auto=format&fit=crop&q=80&w=900",
    desc: "All farmers and buyers are verified to ensure trust and reliability on the platform.",
  },
  {
    tag: "Mobile",
    title: "Mobile Responsive",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=900",
    desc: "Access the marketplace from any device with a clean, responsive interface.",
  },
];

const TESTIMONIALS = [
  {
    text: "AgriConnect helped me sell my wheat directly to buyers in Islamabad. I earned 30% more compared to selling through middlemen!",
    name: "Azan Mehdi",
    role: "Farmer, Mianwali",
    initials: "AM",
  },
  {
    text: "Finding quality produce from verified farmers has never been easier. The negotiation feature is incredibly transparent.",
    name: "Usman Saif",
    role: "Buyer, Islamabad",
    initials: "US",
  },
  {
    text: "As a small-scale farmer, this platform gave me visibility I never had before. My crops now reach buyers across Punjab.",
    name: "Kashmala Fatimah",
    role: "Farmer, Isa Khel",
    initials: "KF",
  },
];

// ---------- State Management ----------
let state = {
  currentPage: "home",
  user: null,
  crops: [],
  offers: [],
  selectedCrop: null,
  filterCategory: "All",
  searchQuery: "",
  sidebarTab: "overview",
  toasts: [],
  sidebarTab: "overview",
  toasts: [],
  regional_stats: [],
  govt_schemes: [],
  lang: localStorage.getItem("agri_lang") || "en",
  theme: localStorage.getItem("agri_theme") || "dark",
  watchlist: JSON.parse(localStorage.getItem("agri_watchlist") || "[]"),
  diseases: [
    {
      id: 1,
      name: "Rice Blast",
      ur_name: "دھان کا بلاسٹ",
      crop: "Rice",
      type: "Fungal",
      symptoms:
        "Diamond-shaped spots on leaves, drying of leaves, poor grain production.",
      ur_symptoms:
        "پتوں پر ہیرے کی شکل کے دھبے، پتوں کا خشک ہونا، اناج کی کم پیداوار۔",
      treatment:
        "Use resistant rice varieties, avoid excess nitrogen fertilizer, spray fungicides on time.",
      ur_treatment:
        "مزاحم اقسام استعمال کریں، نائٹروجن کھاد کی زیادتی سے بچیں، فنگسائڈز کا بروقت سپرے کریں۔",
      severity: "Very High",
      image:
        "https://images.unsplash.com/photo-1586985289688-cacf32ca6e4e?w=500&q=80",
    },
    {
      id: 2,
      name: "Wheat Rust",
      ur_name: "گندم کی کنگی",
      crop: "Wheat",
      type: "Fungal",
      symptoms:
        "Orange or brown powder on leaves, weak plants, reduced grain quality.",
      ur_symptoms:
        "پتوں پر نارنجی یا بھورا سفوف، پودوں کی کمزوری، اناج کی کوالٹی میں کمی۔",
      treatment:
        "Grow resistant wheat varieties, remove infected crop remains, use fungicide sprays.",
      ur_treatment:
        "مزاحم اقسام اگائیں، متاثرہ فصلوں کی باقیات ختم کریں، فنگسائڈز کا سپرے کریں۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80",
    },
    {
      id: 3,
      name: "Cotton Leaf Curl",
      ur_name: "کپاس کا پتہ مروڑ",
      crop: "Cotton",
      type: "Viral",
      symptoms: "Curled leaves, thick veins, stunted plant growth.",
      ur_symptoms:
        "پتوں کا مڑنا، رگوں کا موٹا ہونا، پودوں کی نشوونما کا رک جانا۔",
      treatment:
        "Control whiteflies, use healthy seeds, destroy infected plants.",
      ur_treatment:
        "سفید مکھی پر قابو پائیں، صحت مند بیج استعمال کریں، بیمار پودوں کو تلف کریں۔",
      severity: "Very High",
      image:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80",
    },
    {
      id: 4,
      name: "Early Blight",
      ur_name: "جھلساؤ (قبل از وقت)",
      crop: "Tomato, Potato",
      type: "Fungal",
      symptoms: "Brown rings on leaves, yellowing, fruit rot.",
      ur_symptoms: "پتوں پر بھورے چھلے، پیلا پن، پھلوں کا سڑنا۔",
      treatment: "Rotate crops, avoid overhead watering, apply fungicides.",
      ur_treatment:
        "فصلوں کا ہیر پھیر کریں، اوپر سے پانی دینے سے گریز کریں، فنگسائڈز لگائیں۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1609424842837-f08e85db2b34?w=500&q=80",
    },
    {
      id: 5,
      name: "Downy Mildew",
      ur_name: "ڈاونی ملڈیو",
      crop: "Grapes, Onion, Cucumbers",
      type: "Fungal",
      symptoms: "Yellow patches on leaves, gray mold under leaves.",
      ur_symptoms: "پتوں پر پیلے دھبے، پتوں کے نیچے سرمئی الی۔",
      treatment:
        "Improve air circulation, avoid wet leaves, use disease-resistant seeds.",
      ur_treatment:
        "ہوا کی آمد و رفت بہتر بنائیں، گیلے پتوں سے بچیں، مزاحم بیج استعمال کریں۔",
      severity: "Medium",
      image:
        "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&q=80",
    },
    {
      id: 6,
      name: "Bacterial Blight",
      ur_name: "بیکٹیریل بلائٹ",
      crop: "Rice, Cotton",
      type: "Bacterial",
      symptoms: "Water-soaked leaf lesions, wilting, dry leaves.",
      ur_symptoms: "پتوں پر پانی بھرے زخم، مرجھانا، پتوں کا خشک ہونا۔",
      treatment:
        "Use clean seeds, avoid flooding fields unnecessarily, remove infected plants.",
      ur_treatment:
        "صاف بیج استعمال کریں، غیر ضروری پانی کھڑا نہ کریں، متاثرہ پودے نکال دیں۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1550575038-2be5f7ed5e4e?w=500&q=80",
    },
    {
      id: 7,
      name: "Anthracnose",
      ur_name: "انتھراکنوز",
      crop: "Mango, Chili, Beans",
      type: "Fungal",
      symptoms: "Dark sunken spots on fruits, leaf drop, fruit decay.",
      ur_symptoms:
        "پھلوں پر گہرے دھنسے ہوئے دھبے، پتوں کا گرنا، پھلوں کا سڑنا۔",
      treatment:
        "Prune infected branches, keep fields clean, spray fungicides.",
      ur_treatment:
        "متاثرہ شاخوں کی کٹائی کریں، کھیت صاف رکھیں، فنگسائڈز سپرے کریں۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1585518419759-7c67ffcf5e2f?w=500&q=80",
    },
    {
      id: 8,
      name: "Black Rot",
      ur_name: "کالا سڑاؤ",
      crop: "Cabbage, Cauliflower",
      type: "Bacterial",
      symptoms: "Yellow V-shaped leaf spots, black veins, rotting leaves.",
      ur_symptoms: "پتوں پر پیلے وی نما دھبے، کالی رگیں، پتوں کا سڑنا۔",
      treatment:
        "Use certified seeds, avoid overhead irrigation, rotate crops.",
      ur_treatment:
        "تصدیق شدہ بیج استعمال کریں، چھڑکاؤ والے پانی سے بچیں، فصل بدلیں۔",
      severity: "Medium",
      image:
        "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=500&q=80",
    },
    {
      id: 9,
      name: "Root Rot",
      ur_name: "جڑوں کا سڑنا",
      crop: "Vegetables, Fruits",
      type: "Fungal",
      symptoms: "Rotten roots, wilting plants, slow growth.",
      ur_symptoms: "جڑوں کا سڑنا، پودوں کا مرجھانا، سست نشوونما۔",
      treatment:
        "Ensure proper drainage, avoid overwatering, treat soil before planting.",
      ur_treatment:
        "نکاسی آب یقینی بنائیں، ضرورت سے زیادہ پانی نہ دیں، زمین کا علاج کریں۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80",
    },
    {
      id: 10,
      name: "Mosaic Disease",
      ur_name: "موزیک بیماری",
      crop: "Tobacco, Tomato, Cucumber",
      type: "Viral",
      symptoms: "Mosaic-like yellow-green leaf patterns, deformed leaves.",
      ur_symptoms: "پتوں پر زرد سبز نمونے، پتے کی شکل بدلنا۔",
      treatment:
        "Control insects, remove infected plants, use resistant varieties.",
      ur_treatment:
        "کیڑوں پر قابو پائیں، بیمار پودے نکالیں، مزاحم اقسام استعمال کریں۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=500&q=80",
    },
    {
      id: 11,
      name: "Smut Disease",
      ur_name: "سٹی کی کنگی",
      crop: "Corn, Wheat, Barley",
      type: "Fungal",
      symptoms: "Black powdery masses, damaged grains, poor crop quality.",
      ur_symptoms: "کالا سفوف، اناج کا نقصان، فصل کی خراب کوالٹی۔",
      treatment:
        "Treat seeds before sowing, use resistant varieties, remove infected plants.",
      ur_treatment:
        "بیج کا علاج کریں، مزاحم اقسام استعمال کریں، بیمار پودے نکال دیں۔",
      severity: "Medium",
      image:
        "https://images.unsplash.com/photo-1535808066601-684b01f18b11?w=500&q=80",
    },
    {
      id: 12,
      name: "Wilt Disease",
      ur_name: "مرجھاؤ",
      crop: "Tomato, Banana, Cotton",
      type: "Fungal/Bacterial",
      symptoms: "Sudden wilting, yellow leaves, browning inside stem.",
      ur_symptoms: "اچانک مرجھانا، پیلے پتے، تنے کے اندر بھورا ہونا۔",
      treatment: "Crop rotation, disease-free seedlings, proper soil drainage.",
      ur_treatment: "فصلوں کا ہیر پھیر، صحت مند پنیری، نکاسی آب کی بہتری۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80",
    },
    {
      id: 13,
      name: "Leaf Spot",
      ur_name: "پتوں کے دھبے",
      crop: "Groundnut, Tomato, Chili",
      type: "Fungal",
      symptoms: "Brown or black spots on leaves, early leaf fall, weak plants.",
      ur_symptoms:
        "پتوں پر بھورے یا سیاہ دھبے، پتوں کا جلد گرنا، پودوں کی کمزوری۔",
      treatment:
        "Avoid overcrowding, remove infected leaves, apply fungicides.",
      ur_treatment:
        "گھنی کاشت سے بچیں، متاثرہ پتے اتاریں، فنگسائڈز کا استعمال۔",
      severity: "Medium",
      image:
        "https://images.unsplash.com/photo-1559181567-c3190bbb5ef3?w=500&q=80",
    },
    {
      id: 14,
      name: "Stem Rot",
      ur_name: "تنے کا سڑنا",
      crop: "Rice, Groundnut, Soybean",
      type: "Fungal",
      symptoms: "Rotting stems, plant collapse, white fungal growth.",
      ur_symptoms: "تنے کا سڑنا، پودے کا گرنا، سفید الی کی نشوونما۔",
      treatment:
        "Use clean seeds, improve soil drainage, destroy infected plants.",
      ur_treatment: "صاف بیج، نکاسی آب میں بہتری، بیمار پودوں کی تلفی۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1643143892786-87b7a4eff1de?w=500&q=80",
    },
    {
      id: 15,
      name: "Canker Disease",
      ur_name: "کینکر بیماری",
      crop: "Citrus, Apple, Tomato",
      type: "Bacterial/Fungal",
      symptoms: "Sunken lesions on stem or fruit, cracked bark, dry branches.",
      ur_symptoms: "تنے یا پھل پر گہرے زخم، چھال کا پھٹنا، خشک شاخیں۔",
      treatment:
        "Prune infected branches, use clean tools, spray suitable chemicals.",
      ur_treatment:
        "متاثرہ شاخیں کاٹیں، صاف اوزار استعمال کریں، مناسب کیمیکلز کا سپرے۔",
      severity: "Medium",
      image:
        "https://images.unsplash.com/photo-1568702846629-a519a1b8e3d5?w=500&q=80",
    },
    {
      id: 16,
      name: "Damping Off",
      ur_name: "پودوں کا گرنا",
      crop: "Vegetables, Nursery",
      type: "Fungal",
      symptoms: "Seedlings fall over, rotting stems near soil.",
      ur_symptoms: "پنیری کا گرنا، مٹی کے قریب تنے کا سڑنا۔",
      treatment:
        "Avoid excess moisture, use treated soil, ensure air circulation.",
      ur_treatment: "زیادہ نمی سے بچیں، علاج شدہ مٹی، ہوا کی آمد و رفت۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1592424002053-21f369ad7fdb?w=500&q=80",
    },
    {
      id: 17,
      name: "Scab Disease",
      ur_name: "سکاب بیماری",
      crop: "Potato, Apple",
      type: "Fungal/Bacterial",
      symptoms: "Rough brown patches, cracked fruit or tubers.",
      ur_symptoms: "کھردرے بھورے دھبے، پھل یا آلو کا پھٹنا۔",
      treatment:
        "Maintain soil moisture, use disease-free seeds, rotate crops.",
      ur_treatment: "نمی برقرار رکھیں، صاف بیج، فصلوں کا ہیر پھیر۔",
      severity: "Low",
      image:
        "https://images.unsplash.com/photo-1535670711867-efb226f6d81e?w=500&q=80",
    },
    {
      id: 18,
      name: "Fire Blight",
      ur_name: "فائر بلائٹ",
      crop: "Pear, Apple",
      type: "Bacterial",
      symptoms: "Burned-looking branches, black flowers and shoots.",
      ur_symptoms: "جلی ہوئی شاخیں، سیاہ پھول اور شگوفے۔",
      treatment:
        "Cut infected branches, sterilize tools, avoid excess nitrogen.",
      ur_treatment:
        "متاثرہ شاخیں کاٹیں، اوزار صاف کریں، نائٹروجن کی زیادتی سے بچیں۔",
      severity: "Very High",
      image:
        "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=80",
    },
    {
      id: 19,
      name: "Clubroot",
      ur_name: "کلب روٹ",
      crop: "Cabbage, Turnip, Cauliflower",
      type: "Fungal",
      symptoms: "Swollen roots, yellow leaves, stunted growth.",
      ur_symptoms: "جڑوں کا سوجنا، پیلے پتے، رکی ہوئی نشوونما۔",
      treatment:
        "Improve soil pH with lime, rotate crops, use resistant varieties.",
      ur_treatment: "چونے سے پی ایچ بہتر کریں، فصل بدلیں، مزاحم اقسام۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&q=80",
    },
    {
      id: 20,
      name: "Red Rot",
      ur_name: "سرخ سڑاؤ",
      crop: "Sugarcane",
      type: "Fungal",
      symptoms: "Red discoloration inside stem, dry leaves, bad smell.",
      ur_symptoms: "تنے کے اندر سرخی، خشک پتے، گندی بو۔",
      treatment:
        "Use healthy cane setts, remove infected plants, field sanitation.",
      ur_treatment: "صحت مند بیج، بیمار پودوں کی تلفی، کھیت کی صفائی۔",
      severity: "High",
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&q=80",
    },
  ],
};

window.USERS_DATA = [];
const API_URL = "php/api.php";

const TRANSLATIONS = {
  en: {
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_marketplace: "Marketplace",
    nav_regional: "Regional Analysis",
    nav_schemes: "Govt Schemes",
    nav_login: "Log In",
    nav_signup: "Sign Up",
    nav_logout: "Logout",
    hero_badge: "Serving Mianwali Region",
    hero_title: 'Buy & Sell Crops <span class="highlight">Directly</span>',
    hero_subtitle:
      "AgriConnect empowers local farmers and buyers to trade directly, ensuring fair prices and full transparency in every transaction.",
    hero_cta_start: "Get Started Free",
    hero_cta_browse: "Browse Crops",
    stat_farmers: "Verified Farmers",
    stat_listings: "Active Listings",
    stat_profit: "Increased Profit",
    feature_label: "Why AgriConnect",
    feature_title: "Everything You Need to Trade Smarter",
    feature_desc:
      "Our platform is built to serve the agricultural community with powerful tools and simple workflows.",
    how_label: "How It Works",
    how_title: "Start Trading in 4 Simple Steps",
    how_step1: "Create Account",
    how_step1_desc: "Sign up as a Farmer or Buyer with your details.",
    how_step2: "List or Browse",
    how_step2_desc: "Farmers list crops; buyers search and filter.",
    how_step3: "Negotiate",
    how_step3_desc: "Send offers and negotiate prices directly.",
    how_step4: "Finalize Deal",
    how_step4_desc: "Agree on price and arrange pickup offline.",
    testimonial_label: "Testimonials",
    testimonial_title: "Trusted by Real People",
    cta_title: "Ready to Transform Your Trade?",
    cta_desc:
      "Join hundreds of farmers and buyers already using AgriConnect for fairer, transparent agricultural commerce.",
    cta_btn: "Create Free Account",
    footer_desc:
      "A localized digital marketplace connecting farmers and buyers in Mianwali, eliminating middlemen and promoting fair agricultural trade.",
    footer_bottom: "© 2026 AgriConnect. All Rights Reserved.",
    footer_resources: "Resources",
    res_help: "Help Center",
    res_pricing: "Pricing Guide",
    res_calendar: "Crop Calendar",
    search_placeholder: "Search crops by name or location...",
    filter_all: "All Categories",
    btn_details: "View Details",
    btn_negotiate: "Negotiate Now",
    dash_welcome: "Welcome back",
    region_title: "Regional Insights & Analysis",
    region_subtitle:
      "Explore top-performing crops and market valuations by region",
    scheme_title: "Government Schemes for Farmers",
    scheme_subtitle:
      "Latest agricultural subsidies and support programs (2025–26)",
    nav_diseases: "Crop Diseases",
    disease_title: "Crop Protection & Disease Hub",
    disease_subtitle: "Identify and treat common crop diseases in your region",
    dash_overview: "Dashboard Overview",
    dash_listings: "My Listings",
    dash_offers: "My Offers",
    dash_add: "Add Crop",
    dash_stats_active: "Active Listings",
    dash_stats_offers: "Total Offers",
    dash_stats_value: "Total Value",
    dash_stats_deals: "Accepted Deals",
  },
  ur: {
    nav_home: "ہوم",
    nav_dashboard: "ڈیش بورڈ",
    nav_marketplace: "مارکیٹ پلیس",
    nav_regional: "علاقائی تجزیہ",
    nav_schemes: "سرکاری سکیمیں",
    nav_login: "لاگ ان",
    nav_signup: "سائن اپ",
    nav_logout: "لاگ آؤٹ",
    hero_badge: "میانوالی کے علاقے کے لیے بہترین سروس",
    hero_title: "براہ راست فصلیں خریدیں اور بیچیں",
    hero_subtitle:
      "ایگری کنیکٹ مقامی کسانوں اور خریداروں کو براہ راست تجارت کرنے کے قابل بناتا ہے، ہر لین دین میں منصفانہ قیمتوں اور مکمل شفافیت کو یقینی بناتا ہے۔",
    hero_cta_start: "مفت شروع کریں",
    hero_cta_browse: "فصلیں دیکھیں",
    stat_farmers: "تصدیق شدہ کسان",
    stat_listings: "فعال لسٹنگز",
    stat_profit: "بڑھا ہوا منافع",
    feature_label: "ایگری کنیکٹ کیوں؟",
    feature_title: "تجارت کو بہتر بنانے کے لیے تمام ضروری ٹولز",
    feature_desc:
      "ہمارا پلیٹ فارم کسانوں کے لیے طاقتور ٹولز اور سادہ طریقے کے ساتھ بنایا گیا ہے۔",
    how_label: "یہ کیسے کام کرتا ہے؟",
    how_title: "صرف 4 سادہ مراحل میں تجارت شروع کریں",
    how_step1: "اکاؤنٹ بنائیں",
    how_step1_desc:
      "کسان یا خریدار کے طور پر اپنی تفصیلات کے ساتھ سائن اپ کریں۔",
    how_step2: "لسٹ یا تلاش کریں",
    how_step2_desc: "کسان فصلیں لسٹ کرتے ہیں؛ خریدار تلاش اور فلٹر کرتے ہیں۔",
    how_step3: "بات چیت کریں",
    how_step3_desc: "آفرز بھیجیں اور قیمتوں پر براہ راست بات چیت کریں۔",
    how_step4: "سودا مکمل کریں",
    how_step4_desc: "قیمت پر اتفاق کریں اور فصل لینے کا انتظام کریں۔",
    testimonial_label: "لوگوں کی رائے",
    testimonial_title: "ہمارا بھروسہ",
    cta_title: "کیا آپ اپنی تجارت کو تبدیل کرنے کے لیے تیار ہیں؟",
    cta_desc:
      "سینکڑوں کسانوں اور خریداروں میں شامل ہوں جو پہلے ہی منصفانہ اور شفاف زراعت کے لیے ایگری کنیکٹ استعمال کر رہے ہیں۔",
    cta_btn: "مفت اکاؤنٹ بنائیں",
    footer_desc:
      "میانوالی میں کسانوں اور خریداروں کو جوڑنے والی ایک مقامی ڈیجیٹل مارکیٹ، جو درمیانی مداخلت کو ختم کرتی ہے اور منصفانہ تجارت کو فروغ دیتی ہے۔",
    footer_bottom: "© 2026 ایگری کنیکٹ۔ تمام حقوق محفوظ ہیں۔",
    footer_resources: "وسائل",
    res_help: "ہیلپ سینٹر",
    res_pricing: "قیمتوں کی معلومات",
    res_calendar: "فصلوں کا کیلنڈر",
    search_placeholder: "نام یا مقام کے لحاظ سے فصلیں تلاش کریں...",
    filter_all: "تمام اقسام",
    btn_details: "تفصیلات دیکھیں",
    btn_negotiate: "ابھی بات کریں",
    dash_welcome: "خوش آمدید",
    region_title: "علاقائی معلومات اور تجزیہ",
    region_subtitle:
      "علاقے کے لحاظ سے بہترین کارکردگی والی فصلوں اور مارکیٹ کی قیمتوں کا جائزہ لیں",
    scheme_title: "کسانوں کے لیے سرکاری سکیمیں",
    scheme_subtitle: "جدید زرعی سبسڈیز اور سپورٹ پروگرام (2025–26)",
    nav_diseases: "فصلوں کی بیماریاں",
    disease_title: "فصلوں کے تحفظ اور بیماریوں کا مرکز",
    disease_subtitle:
      "اپنے علاقے میں فصلوں کی عام بیماریوں کی شناخت اور علاج کریں",
    dash_overview: "ڈیش بورڈ کا جائزہ",
    dash_listings: "میری لسٹنگز",
    dash_offers: "میری آفرز",
    dash_add: "فصل شامل کریں",
    dash_stats_active: "فعال لسٹنگز",
    dash_stats_offers: "کل آفرز",
    dash_stats_value: "کل مالیت",
    dash_stats_deals: "منظور شدہ سودے",
  },
};

window.t = (key) => {
  const lang = state.lang || "en";
  return TRANSLATIONS[lang][key] || key;
};

function toggleLang() {
  state.lang = state.lang === "en" ? "ur" : "en";
  localStorage.setItem("agri_lang", state.lang);
  render();
}

/**
 * Initializes the application by fetching necessary data from the backend API.
 * Sets up user session if one exists in local storage.
 */
async function initApp() {
  try {
    const res = await fetch(`${API_URL}?action=getData`);
    if (res.ok) {
      const data = await res.json();
      window.USERS_DATA = data.users || [];
      state.crops = data.crops || [];
      state.offers = data.offers || [];
      state.regional_stats = data.regional_stats || [];
      state.govt_schemes = data.govt_schemes || [];
      if (data.diseases && data.diseases.length > 0) {
        state.diseases = data.diseases;
      }
    } else {
      throw new Error("API returned an error state");
    }
  } catch (error) {
    console.error("Database connection failed.", error);
    window.USERS_DATA = [];
    state.crops = [];
    state.offers = [];
    showToast(
      "Failed to connect to backend. Please ensure the server is running.",
      "error",
    );
  }

  // Load session from local storage
  const savedUser = localStorage.getItem("agri_user");
  if (savedUser) state.user = JSON.parse(savedUser);

  applyTheme();

  // Hide loading screen after small delay
  setTimeout(() => {
    const loader = document.getElementById("initial-loader");
    if (loader) {
      loader.style.opacity = "0";
      setTimeout(() => loader.remove(), 500);
    }
  }, 1000);

  // Initial render execution
  render();
}

function applyTheme() {
  document.documentElement.setAttribute("data-theme", state.theme);
}

function toggleTheme() {
  state.theme = state.theme === "light" ? "dark" : "light";
  localStorage.setItem("agri_theme", state.theme);
  applyTheme();
  render();
}

// ---------- DOM & Utility Helpers ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const app = () => $("#app");

// Retrieves farmer information from the global users list
const getFarmer = (id) => window.USERS_DATA.find((u) => u.id === id);

// Constructs standard headers including authentication token when logged in
function getAuthHeaders() {
  const headers = { "Content-Type": "application/json" };
  if (state.user && state.user.token) {
    headers["Authorization"] = "Bearer " + state.user.token;
  }
  return headers;
}

// Retrieves the visual asset for a crop — uses smart image lookup with fallback icon
const CROP_ICONS = {
  Wheat: "🌾",
  Rice: "🍚",
  Sugarcane: "🎋",
  Cotton: "☁️",
  Maize: "🌽",
  Corn: "🌽",
  Mango: "🥭",
  Citrus: "🍊",
  Orange: "🍊",
  Lemon: "🍋",
  Banana: "🍌",
  Apple: "🍎",
  Guava: "🍏",
  Watermelon: "🍉",
  Grapes: "🍇",
  Dates: "🫘",
  Peach: "🍑",
  Pomegranate: "🫒",
  Tomato: "🍅",
  Potato: "🥔",
  Onion: "🧅",
  Garlic: "🧄",
  Ginger: "🫚",
  Carrot: "🥕",
  Cabbage: "🥬",
  Spinach: "🥬",
  Peas: "🫛",
  Chilli: "🌶️",
  Pepper: "🫑",
  Brinjal: "🍆",
  Eggplant: "🍆",
  Cucumber: "🥒",
  Pumpkin: "🎃",
  Cauliflower: "🥦",
  Turnip: "🥕",
  Radish: "🥬",
  Coriander: "🌿",
  Chickpea: "🥜",
  Lentil: "🫘",
  Moong: "🫘",
  Masoor: "🫘",
  Mash: "🫘",
  Soybean: "🫘",
  Barley: "🌾",
  Sorghum: "🌾",
  Millet: "🌾",
  Tobacco: "🌿",
  Sunflower: "🌻",
  Canola: "🌾",
  Mustard: "🌿",
  Gram: "🥜",
  Bajra: "🌾",
  Jowar: "🌾",
};

const getCropEmoji = (name = "") => {
  if (!name) return "📦";
  const n = name.toLowerCase();
  for (const [key, emoji] of Object.entries(CROP_ICONS)) {
    if (n.includes(key.toLowerCase())) return emoji;
  }
  return "📦";
};

function handleCropImageError(img, name) {
  const fallbackUrl =
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400";
  if (!img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = "true";
    img.src = fallbackUrl;
    return;
  }

  img.outerHTML = `<div class="crop-icon-shell"><span class="crop-icon-fallback crop-icon-text">${getCropEmoji(name)}</span></div>`;
}

const getIcon = (name, type = "card") => {
  const emoji = getCropEmoji(name);

  if (type === "card") {
    return `<div class="crop-card-emoji-container">
                <span class="crop-emoji">${emoji}</span>
            </div>`;
  }

  if (type === "icon-only") {
    return `<div style="height: 100%; width: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"><span class="crop-icon-fallback" style="font-size: 5rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1))">${emoji}</span></div>`;
  }

  return `<span class="crop-emoji" style="font-size: 3rem">${emoji}</span>`;
};

// Determines if a date string is older than a specified number of days
const isOld = (dateStr, days) =>
  (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24) > days;

/**
 * Displays a non-blocking toast notification to the user.
 *
 * @param {string} message - Text to display
 * @param {string} type - 'success', 'error', or 'info'
 */
function showToast(message, type = "success") {
  const id = Date.now();
  state.toasts.push({ id, message, type });
  renderToasts();

  // Auto-remove toast after 3.5 seconds
  setTimeout(() => {
    state.toasts = state.toasts.filter((t) => t.id !== id);
    renderToasts();
  }, 3500);
}

/**
 * Renders the toast container and active toast elements to the DOM.
 */
function renderToasts() {
  let c = document.getElementById("toast-container");
  if (!c) {
    c = document.createElement("div");
    c.id = "toast-container";
    c.className = "toast-container";
    document.body.appendChild(c);
  }

  c.innerHTML = state.toasts
    .map((t) => {
      let iconText =
        t.type === "success"
          ? "[Success]"
          : t.type === "error"
            ? "[Error]"
            : "[Info]";
      return `
    <div class="toast ${t.type}">
      <span class="toast-icon"><b>${iconText}</b></span>
      <span>${t.message}</span>
      <span class="toast-close" onclick="this.parentElement.remove()">X</span>
    </div>`;
    })
    .join("");
}

/**
 * Renders a standardized, modern marquee ticker
 * @param {Array} alerts - Array of localized alert objects {en, ur}
 */
function renderMarquee(alerts) {
  if (!alerts || alerts.length === 0) return "";
  const lang = state.lang;
  return `
    <div class="disease-marquee-wrapper">
        <div class="marquee-container">
            <div class="marquee-content">
                ${alerts
                  .concat(alerts)
                  .map(
                    (a) => `
                    <span class="marquee-item">${lang === "en" ? a.en : a.ur}</span>
                `,
                  )
                  .join("")}
            </div>
        </div>
    </div>`;
}

/**
 * Central routing function. Updates the state and re-renders the DOM.
 *
 * @param {string} page - The target page id to navigate to
 * @param {object} data - Optional state context (like active tabs or selected crops)
 */
function navigate(page, data) {
  if (data) {
    if (data.crop) state.selectedCrop = data.crop;
    if (data.tab) state.sidebarTab = data.tab;
  }
  state.currentPage = page;
  window.scrollTo(0, 0); // Scroll to top on navigation change
  render();
}

/**
 * Toggles a crop ID in the user's watchlist and persists to local storage.
 * @param {number} id - Crop ID
 */
function toggleWatchlist(id) {
  if (state.watchlist.includes(id)) {
    state.watchlist = state.watchlist.filter((item) => item !== id);
    showToast("Removed from watchlist");
  } else {
    state.watchlist.push(id);
    showToast("Added to watchlist", "success");
  }
  localStorage.setItem("agri_watchlist", JSON.stringify(state.watchlist));
  render();
}

// ---------- Navigation Bar UI ----------
/**
 * Renders the top navigation bar dynamically based on authentication state
 */
function renderNavbar() {
  const links = state.user
    ? [
        { label: t("nav_dashboard"), page: "dashboard" },
        { label: t("nav_schemes"), page: "schemes" },
        { label: t("nav_regional"), page: "regional" },
        { label: t("nav_diseases"), page: "diseases" },
        { label: t("nav_marketplace"), page: "marketplace" },
      ]
    : [
        { label: t("nav_home"), page: "home" },
        { label: t("nav_schemes"), page: "schemes" },
        { label: t("nav_regional"), page: "regional" },
        { label: t("nav_diseases"), page: "diseases" },
        { label: t("nav_marketplace"), page: "marketplace" },
      ];

  const authBtns = state.user
    ? `<div class="user-profile-nav">
         <div class="theme-switch" onclick="toggleTheme()">${state.theme === "light" ? "🌙" : "☀️"}</div>
         <div class="lang-switch" onclick="toggleLang()">${state.lang === "en" ? "اردو" : "EN"}</div>
         <div class="user-info">
           <span class="user-name">${state.user.name}</span>
           <span class="user-role">${state.user.role}</span>
         </div>
         <button class="btn btn-ghost btn-sm" onclick="logout()">${t("nav_logout")}</button>
       </div>`
    : `<div class="nav-auth-btns">
         <div class="theme-switch" onclick="toggleTheme()">${state.theme === "light" ? "🌙" : "☀️"}</div>
         <div class="lang-switch" onclick="toggleLang()">${state.lang === "en" ? "اردو" : "EN"}</div>
         <button class="btn btn-secondary btn-sm" onclick="navigate('login')">${t("nav_login")}</button>
         <button class="btn btn-primary btn-sm" onclick="navigate('register')">${t("nav_signup")}</button>
       </div>`;

  return `
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <div class="logo" onclick="navigate(state.user ? 'dashboard' : 'home')">
        <img src="assets/logo.png" class="logo-img" alt="AgriConnect Logo">
        <span>AgriConnect</span>
      </div>
      <ul class="nav-links">
        ${links.map((l) => `<a class="${state.currentPage === l.page ? "active" : ""}" onclick="navigate('${l.page}')">${l.label}</a>`).join("")}
      </ul>
      <div class="nav-cta">${authBtns}</div>
      <div class="hamburger" onclick="toggleMobileNav()"><span></span><span></span><span></span></div>
    </div>
  </nav>
  
  <div class="mobile-nav-overlay" id="mobileOverlay" onclick="toggleMobileNav()"></div>
  <div class="mobile-nav-panel" id="mobilePanel">
    <div class="close-mobile" onclick="toggleMobileNav()">&times;</div>
    <div class="mobile-nav-content">
      <ul class="mobile-links">
        <div class="lang-switch-mobile" onclick="toggleLang()">${state.lang === "en" ? "اردو زبان منتخب کریں" : "Switch to English"}</div>
        ${links.map((l) => `<a onclick="navigate('${l.page}');toggleMobileNav()">${l.label}</a>`).join("")}
        ${
          !state.user
            ? `<a onclick="navigate('login');toggleMobileNav()">${t("nav_login")}</a><a onclick="navigate('register');toggleMobileNav()">${t("nav_signup")}</a>`
            : `<a onclick="logout();toggleMobileNav()">${t("nav_logout")}</a>`
        }
      </ul>
    </div>
  </div>`;
}

// Toggles visibility of the mobile side navigation
function toggleMobileNav() {
  document.getElementById("mobileOverlay")?.classList.toggle("open");
  document.getElementById("mobilePanel")?.classList.toggle("open");
}

// Clears user session and logs the user out
function logout() {
  state.user = null;
  localStorage.removeItem("agri_user");
  navigate("home");
  showToast("Logged out successfully");
}

// ---------- Main Pages ----------
/**
 * Renders the marketing homepage
 */
function renderHome() {
  return `
  ${renderNavbar()}
  <section class="hero">
    <div class="hero-mesh"></div>
    <div class="container">
      <div class="hero-top-area">
        ${renderMarquee([
          {
            en: "Official market reports confirm fresh wheat arrivals in Mianwali Mandi today.",
            ur: "سرکاری مارکیٹ رپورٹس آج میانوالی منڈی میں گندم کی تازہ آمد کی تصدیق کرتی ہیں۔",
          },
          {
            en: "The latest market data indicates that rice prices have increased by 5% this week.",
            ur: "تازہ ترین مارکیٹ ڈیٹا بتاتا ہے کہ اس ہفتے چاول کی قیمتوں میں 5 فیصد اضافہ ہوا ہے۔",
          },
          {
            en: "A new government subsidy scheme has been launched to support the purchase of Green Tractors.",
            ur: "گرین ٹریکٹرز کی خریداری میں مدد کے لیے حکومت کی جانب سے ایک نئی سبسڈی اسکیم شروع کی گئی ہے۔",
          },
        ])}
      </div>
      <div class="hero-main-grid">
      <div class="hero-content animate-fade-in-up">
        <div class="hero-badge"><span class="badge-dot"></span> ${t("hero_badge")}</div>
        <h1>${t("hero_title")}</h1>
        <p>${t("hero_subtitle")}</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" onclick="navigate('register')">${t("hero_cta_start")}</button>
          <button class="btn btn-secondary btn-lg" onclick="navigate('marketplace')">${t("hero_cta_browse")}</button>
        </div>

        <div class="hero-stats">
          <div class="stat"><div class="stat-value">500+</div><div class="stat-label">${t("stat_farmers")}</div></div>
          <div class="stat"><div class="stat-value">1,200+</div><div class="stat-label">${t("stat_listings")}</div></div>
          <div class="stat"><div class="stat-value">30%</div><div class="stat-label">${t("stat_profit")}</div></div>
        </div>
      </div>
      
      <div class="hero-visual animate-fade-in-up delay-2">
        <div class="hero-main-img-wrapper hero-visual-shell">
          <div class="hero-visual-panel">
            <div class="hero-panel-kicker">Eco-first marketplace</div>
            <h3>Designed for transparent farm trade</h3>
            <p>Natural tones, cleaner cards, and fast access to listings, offers, and pricing across every screen size.</p>
            <div class="hero-panel-metrics">
              <div><strong>24/7</strong><span>Access</span></div>
              <div><strong>100%</strong><span>Responsive</span></div>
              <div><strong>Local</strong><span>Focused</span></div>
            </div>
          </div>
          <div class="glass-card hero-floating-info">
            <div class="flex items-center gap-sm">
              <div class="status-indicator online"></div>
              <span>Live Market Data</span>
            </div>
          </div>
        </div>
        <div class="hero-float-cards">
          <div class="hero-float-card card-1 animate-float">
            <div class="card-header">
              <div class="card-icon green">${getIcon("Wheat", "card")}</div>
              <div><div class="card-title">Premium Wheat</div><div class="card-subtitle">by Azan Mehdi</div></div>
            </div>
            <div class="card-body">500 kg available</div><div class="price-tag">Rs. 95/kg</div>
          </div>
          <div class="hero-float-card card-2 animate-float-delayed">
            <div class="card-header">
              <div class="card-icon amber">${getIcon("Citrus", "card")}</div>
              <div><div class="card-title">New Offer!</div><div class="card-subtitle">from Usman Saif</div></div>
            </div>
            <div class="card-body">Bid: Rs. 88/kg<br><span class="negotiation-active">Negotiation Active</span></div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>

  <section class="section features-section">
    <div class="container">
      <div class="section-header">
        <div class="section-label">${t("feature_label")}</div>
        <h2 class="section-title">${t("feature_title")}</h2>
        <p class="section-desc">${t("feature_desc")}</p>
      </div>
      <div class="features-grid">
        ${FEATURES.map(
          (f, i) => `
        <div class="feature-card animate-fade-in-up delay-${i + 1}">
          <div class="feature-img-wrapper feature-badge-wrap">
            <img src="${f.image}" alt="${f.title}" class="feature-img" loading="lazy">
            <div class="feature-badge">${f.tag}</div>
          </div>
          <h3>${f.title}</h3>
          <p>${f.desc}</p>
        </div>`,
        ).join("")}
      </div>
    </div>
  </section>

  <section class="section how-it-works">
    <div class="container">
      <div class="section-header"><div class="section-label">${t("how_label")}</div><h2 class="section-title">${t("how_title")}</h2></div>
      <div class="steps-timeline">
        ${[
          { n: "1", t: t("how_step1"), d: t("how_step1_desc") },
          { n: "2", t: t("how_step2"), d: t("how_step2_desc") },
          { n: "3", t: t("how_step3"), d: t("how_step3_desc") },
          { n: "4", t: t("how_step4"), d: t("how_step4_desc") },
        ]
          .map(
            (s) => `
        <div class="step-item"><div class="step-number">${s.n}</div><h4>${s.t}</h4><p>${s.d}</p></div>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section class="section testimonials">
    <div class="container">
      <div class="section-header"><div class="section-label">${t("testimonial_label")}</div><h2 class="section-title">${t("testimonial_title")}</h2></div>
      <div class="testimonials-grid">
        ${TESTIMONIALS.map(
          (t) => `
        <div class="testimonial-card">
          <p class="testimonial-text">"${t.text}"</p>
          <div class="testimonial-author"><div class="testimonial-avatar">${t.initials}</div><div><div class="testimonial-name">${t.name}</div><div class="testimonial-role">${t.role}</div></div></div>
        </div>`,
        ).join("")}
      </div>
    </div>
  </section>

  <section class="cta-section">
    <div class="container">
      <div class="cta-box">
        <h2>${t("cta_title")}</h2>
        <p>${t("cta_desc")}</p>
        <button class="btn btn-accent btn-lg" onclick="navigate('register')">${t("cta_btn")}</button>
      </div>
    </div>
  </section>
  ${renderFooter()}`;
}

/**
 * Standard semantic footer for the page
 */
function renderFooter() {
  return `
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand"><div class="logo"><img src="assets/logo.png" class="logo-img" alt="Logo"> AgriConnect</div><p>${t("footer_desc")}</p></div>
        <div class="footer-col"><h4>Platform</h4><ul><li><a onclick="navigate('marketplace')">${t("nav_marketplace")}</a></li><li><a onclick="navigate('register')">${t("nav_signup")}</a></li><li><a onclick="navigate('login')">${t("nav_login")}</a></li></ul></div>
        <div class="footer-col"><h4>${t("footer_resources")}</h4><ul><li><a onclick="navigate('help')">${t("res_help")}</a></li><li><a onclick="navigate('pricing')">${t("res_pricing")}</a></li><li><a onclick="navigate('calendar')">${t("res_calendar")}</a></li></ul></div>
        <div class="footer-col"><h4>Contact</h4><ul><li><a href="mailto:azanmehdim14umw@gmail.com">azanmehdim14umw@gmail.com</a><li/><a href="tel:+923340274382">+92 334-0274382</a></li><li><a>Islamabad, Punjab, PK</a></li></ul></div>
      </div>
      <div class="footer-bottom"><span>${t("footer_bottom")}</span><span>Develope By : Azan Mehdi, M talha,Zia Ullah</span></div>
    </div>
  </footer>`;
}

// ---------- Authentication Pages ----------
/**
 * Renders the login form
 */
function renderLogin() {
  return `
  ${renderNavbar()}
  <div class="auth-page">
    <div class="auth-card animate-scale-in">
      <h2>Welcome Back</h2>
      <p class="auth-subtitle">Log in to your AgriConnect account</p>
      
      <form onsubmit="handleLogin(event)">
        <div class="form-group"><label>Email Address</label><input class="form-input" type="email" id="loginEmail" placeholder="you@example.com" required></div>
        <div class="form-group"><label>Password</label><input class="form-input" type="password" id="loginPass" placeholder="Enter your password" required></div>
        <button class="btn btn-primary" type="submit">Log In</button>
      </form>
      
      <div class="auth-footer">Don't have an account? <a onclick="navigate('register')">Sign up</a></div>
    </div>
  </div>`;
}

/**
 * Renders the account registration form
 */
function renderRegister() {
  return `
  ${renderNavbar()}
  <div class="auth-page">
    <div class="auth-card animate-scale-in">
      <h2>Create Account</h2>
      <p class="auth-subtitle">Join AgriConnect and start trading today</p>
      
      <form onsubmit="handleRegister(event)">
        <div class="form-group"><label>Full Name</label><input class="form-input" id="regName" placeholder="Your full name" required></div>
        <div class="form-group"><label>Email Address</label><input class="form-input" type="email" id="regEmail" placeholder="you@example.com" required></div>
        <div class="form-group"><label>Phone Number</label><input class="form-input" id="regPhone" placeholder="03XX-XXXXXXX" required></div>
        <div class="form-group">
          <label>I am a</label>
          <select class="form-select" id="regRole" required>
            <option value="">Select role...</option>
            <option value="farmer">Farmer</option>
            <option value="buyer">Buyer</option>
          </select>
        </div>
        <div class="form-group"><label>Location</label><input class="form-input" id="regLocation" placeholder="City / Village" required></div>
        <div class="form-group"><label>Password</label><input class="form-input" type="password" id="regPass" placeholder="Min 6 characters" required minlength="6"></div>
        <button class="btn btn-primary" type="submit">Create Account</button>
      </form>
      <div class="auth-footer">Already have an account? <a onclick="navigate('login')">Log in</a></div>
    </div>
  </div>`;
}

/**
 * Process the login submit action, calls API, updates local session state.
 */
async function handleLogin(e) {
  e.preventDefault();
  const email = $("#loginEmail").value;
  const pass = $("#loginPass").value;

  try {
    const payload = { email, password: pass };
    const res = await fetch(`${API_URL}?action=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        // Update user state and persist in local storage
        state.user = data.user;
        localStorage.setItem("agri_user", JSON.stringify(data.user));
        navigate("dashboard");
        showToast(`Welcome back, ${data.user.name}!`);
      } else {
        showToast(data.message || "Invalid email or password", "error");
      }
    } else {
      showToast("Database Error - Please try again", "error");
    }
  } catch (e) {
    console.error(e);
    showToast("Network connection failed", "error");
  }
}

/**
 * Process new account registration, logs user in upon success.
 */
async function handleRegister(e) {
  e.preventDefault();
  const newUser = {
    name: $("#regName").value,
    email: $("#regEmail").value,
    phone: $("#regPhone").value,
    role: $("#regRole").value,
    location: $("#regLocation").value,
    password: $("#regPass").value,
  };

  try {
    const res = await fetch(`${API_URL}?action=register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        state.user = data.user;
        localStorage.setItem("agri_user", JSON.stringify(data.user));
        window.USERS_DATA.push(data.user);
        navigate("dashboard");
        showToast("Account created successfully!");
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } else {
      showToast("Database Error - Please try again", "error");
    }
  } catch (e) {
    console.error(e);
    showToast("Network connection failed", "error");
  }
}

// ---------- Marketplace Browsing ----------
/**
 * Renders the marketplace grid where buyers search and filter active crops.
 */
function renderMarketplace() {
  const filtered = state.crops.filter((c) => {
    const catMatch =
      state.filterCategory === "All" || c.category === state.filterCategory;
    const searchMatch =
      !state.searchQuery ||
      c.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(state.searchQuery.toLowerCase());

    return catMatch && searchMatch && c.status === "available";
  });

  return `
  ${renderNavbar()}
  <div class="marketplace-page">
    <div class="container page-transition-enter">
      <div style="width: 100%; margin-bottom: 24px;">
        ${renderMarquee([
          {
            en: "Direct trade volume hit 500 tons this month.",
            ur: "اس ماہ براہ راست تجارت کا حجم 500 ٹن تک پہنچ گیا۔",
          },
          {
            en: 'Trusted Buyer "Usman" seeking 50 tons of Maize.',
            ur: 'بھروسہ مند خریدار "عثمان" کو 50 ٹن مکئی کی ضرورت ہے۔',
          },
          {
            en: "Verified Seller badge now available for premium members.",
            ur: "پریمیئم ممبران کے لیے تصدیق شدہ سیلر بیج اب دستیاب ہے۔",
          },
        ])}
      </div>
      <div class="marketplace-header">
        <h1>Crop Marketplace</h1>
        <p>Browse fresh crops directly from verified farmers in the Mianwali region</p>
      </div>
      
      <div class="marketplace-search-wrapper">
        <div class="marketplace-search">
          <input class="form-input" placeholder="Search crops, locations..." value="${state.searchQuery}" oninput="state.searchQuery=this.value;render()">
          <button class="btn btn-primary" onclick="render()">Search</button>
        </div>
      </div>
      
      <div class="marketplace-filters">
        ${CATEGORIES.map((c) => `<button class="filter-chip ${state.filterCategory === c ? "active" : ""}" onclick="state.filterCategory='${c}';render()">${c}</button>`).join("")}
      </div>
      
      <div class="crops-grid">
        ${
          filtered.length
            ? filtered
                .map((c) => {
                  const farmer = getFarmer(c.farmerId);
                  const farmerName = c.farmer_name || farmer?.name || "Farmer";
                  return `
              <div class="crop-card" onclick="openCropDetail(${c.id})">
                <div class="crop-card-image">
                  ${getIcon(c.name, "card")}
                  <div class="crop-badge-overlay">
                    <span class="status-badge available">Available</span>
                  </div>
                </div>
                <div class="crop-card-body">
                  <div class="crop-category-tag">${c.category}</div>
                  <h3>${c.name}</h3>
                  <p class="crop-farmer">
                    <span class="farmer-name">by <a href="javascript:void(0)" class="farmer-link" onclick="showFarmerDetails(${c.id}, event)">${farmerName}</a></span>
                    <span class="crop-location">• ${c.location}</span>
                  </p>
                  ${
                    state.user?.role === "buyer"
                      ? `<button class="watchlist-btn ${state.watchlist.includes(c.id) ? "active" : ""}" onclick="event.stopPropagation(); toggleWatchlist(${c.id})">
                         ${state.watchlist.includes(c.id) ? "🔖 Saved" : "🔖 Save"}
                       </button>`
                      : ""
                  }
                  <div class="crop-card-footer">
                    <div class="crop-price">Rs. ${c.price}<span>/${c.unit}</span></div>
                    <div class="crop-qty">${c.quantity} ${c.unit}</div>
                  </div>
                </div>
              </div>`;
                })
                .join("")
            : '<div class="empty-state"><h3>No crops found</h3><p>Try adjusting your search or filters to find what you looking for.</p></div>'
        }
      </div>
    </div>
  </div>
  ${renderFooter()}`;
}

/**
 * Triggers modal view for a specific crop ID.
 */
function openCropDetail(id) {
  state.selectedCrop = state.crops.find((c) => c.id === id);
  if (state.selectedCrop) {
    state.selectedCrop.clicks = (state.selectedCrop.clicks || 0) + 1;
    // Send click in background
    fetch(`${API_URL}?action=trackClick`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ id }),
    }).catch((e) => console.error("Could not track click", e));
  }
  renderModal();
}

/**
 * Renders the modal view allowing interaction with a selected crop
 */
function renderModal() {
  const c = state.selectedCrop;
  if (!c) {
    document.getElementById("modal-root")?.remove();
    return;
  }

  const farmer = getFarmer(c.farmerId);
  const farmerName = c.farmer_name || farmer?.name || "Farmer";
  let el = document.getElementById("modal-root");

  if (!el) {
    el = document.createElement("div");
    el.id = "modal-root";
    document.body.appendChild(el);
  }

  el.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
      <div class="modal-card">
        <button class="modal-close" onclick="closeModal()">X</button>
        <div class="modal-crop-image">${getIcon(c.name, "card")}</div>
        <h2>${c.name}</h2>
        <div class="modal-crop-meta">
          <span>Loc: ${c.location}</span>
          <span>Farmer: <a href="javascript:void(0)" class="farmer-link" onclick="showFarmerDetails(${c.id}, event)">${farmerName}</a></span>
          <span>Listed: ${c.listedDate}</span>
          <span>Views: ${c.clicks || 0}</span>
        </div>
        <p class="modal-crop-desc">${c.description}</p>
        
        <div class="modal-price-row">
          <div><div class="mp-label">Expected Price</div><div class="mp-value">Rs. ${c.price}/${c.unit}</div></div>
          <div><div class="mp-label">Available</div><div class="mp-value">${c.quantity} ${c.unit}</div></div>
        </div>
        
        <div class="bill-estimator-box" style="margin-top:20px; background:var(--bg-surface-alt); border:1.5px solid var(--border-color); border-radius:var(--radius-md); padding:16px;">
          <h3 style="font-size:1.05rem; margin-bottom:12px; color:var(--text-primary); display:flex; align-items:center; gap:8px;">
            🧮 Purchase Bill Estimator
          </h3>
          <div class="form-group" style="margin-bottom:8px">
            <label style="color:var(--text-secondary); font-weight:600; font-size:0.85rem">Quantity to Buy (${c.unit})</label>
            <input class="form-input" type="number" id="buyQty" placeholder="Enter quantity" value="1" min="1" max="${c.quantity}" oninput="updateEstimatedBill(${c.price})" style="border-color:var(--border-color); background:var(--bg-surface);">
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:12px; border-top:1px dashed var(--border-color);">
            <span style="font-weight:600; color:var(--text-secondary); font-size:0.9rem">Estimated Total Bill:</span>
            <span style="font-size:1.25rem; font-weight:800; color:var(--primary-500)">Rs. <span id="estBill">${c.price.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span></span>
          </div>
        </div>
        
        ${
          state.user?.role === "buyer"
            ? `<div class="offer-form">
               <h3 style="margin-bottom:16px">Send an Offer</h3>
               <div class="form-group"><label>Your Offer (Rs. per ${c.unit})</label><input class="form-input" type="number" id="offerPrice" placeholder="Enter price" value="${Math.round(c.price * 0.9)}"></div>
               <div class="form-group"><label>Message</label><textarea class="form-input" id="offerMsg" rows="3" placeholder="Tell the farmer about your requirements..."></textarea></div>
               <button class="btn btn-primary" onclick="submitOffer(${c.id})">Submit Offer</button>
             </div>`
            : !state.user
              ? `<p style="text-align:center;color:var(--gray-500);font-size:.9rem;margin-top:16px"><a style="color:var(--primary-600);cursor:pointer;font-weight:600" onclick="closeModal();navigate('login')">Log in as a buyer</a> to send offers</p>`
              : ""
        }
      </div>
    </div>`;
}

/**
 * Removes the detailed modal overlay
 */
function closeModal() {
  state.selectedCrop = null;
  document.getElementById("modal-root")?.remove();
}

/**
 * Sends a buyer offer to the backend system for a specific crop
 * @param {number} cropId - The database ID corresponding to the target crop
 */
async function submitOffer(cropId) {
  const price = parseFloat($("#offerPrice")?.value);
  const msg = $("#offerMsg")?.value || "";

  if (!price || price <= 0) {
    showToast("Please enter a valid price", "error");
    return;
  }

  const newOffer = {
    cropId,
    buyerId: state.user.id,
    offeredPrice: price,
    message: msg,
  };

  try {
    const res = await fetch(`${API_URL}?action=submitOffer`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(newOffer),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        state.offers.push(data.offer);
        closeModal();
        showToast("Offer sent successfully!");
      } else {
        showToast(data.message || "Error sending offer", "error");
      }
    } else {
      showToast("Database Error", "error");
    }
  } catch (e) {
    console.error(e);
    showToast("Network connection failed", "error");
  }
}

/**
 * Calculates estimated bill based on input quantity and crop price per unit.
 */
function updateEstimatedBill(price) {
  const qtyInput = document.getElementById("buyQty");
  if (!qtyInput) return;
  const qty = parseFloat(qtyInput.value) || 0;
  const total = qty * price;
  const estBillSpan = document.getElementById("estBill");
  if (estBillSpan) {
    estBillSpan.textContent = total.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

/**
 * Displays a popup card with the farmer's listing-specific contact details.
 */
function showFarmerDetails(cropId, event) {
  if (event) event.stopPropagation();
  const c = state.crops.find((crop) => crop.id === cropId);
  if (!c) return;

  const farmer = getFarmer(c.farmerId);
  const farmerName = c.farmer_name || farmer?.name || "Farmer";
  const farmerCity = c.farmer_city || c.location || "Unknown";
  const farmerPhone = c.farmer_phone || farmer?.phone || "Not Provided";

  let el = document.getElementById("farmer-modal-root");
  if (!el) {
    el = document.createElement("div");
    el.id = "farmer-modal-root";
    document.body.appendChild(el);
  }

  el.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeFarmerModal()" style="z-index: 10000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px;">
      <div class="modal-card animate-scale-in" style="max-width: 400px; padding: 32px; text-align: center; border-top: 8px solid var(--primary-500); background: var(--bg-surface); border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); position: relative; width: 100%;">
        <button class="modal-close" onclick="closeFarmerModal()" style="position: absolute; top: 16px; right: 16px; font-weight: bold; color: var(--text-muted); cursor: pointer;">X</button>
        <div style="width: 72px; height: 72px; background: var(--primary-100); color: var(--primary-600); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 800; margin: 8px auto 20px;">
          ${farmerName.charAt(0).toUpperCase()}
        </div>
        <h2 style="font-size: 1.5rem; margin-bottom: 8px; color: var(--text-primary); font-weight: 800;">${farmerName}</h2>
        <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 24px; font-weight: 500;">Listed Farmer Contact Details</p>
        
        <div style="background: var(--bg-surface-alt); border-radius: var(--radius-md); padding: 20px; margin-bottom: 24px; text-align: left; border: 1.5px solid var(--border-color);">
          <div style="margin-bottom: 16px;">
            <span style="font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 4px; letter-spacing: 0.5px;">City / Village</span>
            <span style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary);">${farmerCity}</span>
          </div>
          <div>
            <span style="font-size: 0.75rem; font-weight: 900; color: var(--text-muted); text-transform: uppercase; display: block; margin-bottom: 4px; letter-spacing: 0.5px;">Phone Number</span>
            <span style="font-size: 1.1rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
              ${farmerPhone}
              <a href="tel:${farmerPhone}" style="background: var(--primary-600); color: white; padding: 6px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; text-decoration: none; font-weight: bold; margin-left: auto; transition: background var(--transition-fast);" onmouseover="this.style.background='var(--primary-700)'" onmouseout="this.style.background='var(--primary-600)'">Call</a>
            </span>
          </div>
        </div>
        
        <button class="btn btn-secondary" onclick="closeFarmerModal()" style="width: 100%; border: 1.5px solid var(--border-color); padding: 12px; border-radius: var(--radius-sm); font-weight: 600; cursor: pointer; transition: background var(--transition-fast);">Close Profile</button>
      </div>
    </div>`;
}

/**
 * Closes the farmer contact details popup.
 */
function closeFarmerModal() {
  document.getElementById("farmer-modal-root")?.remove();
}
