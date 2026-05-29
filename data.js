// ============================================================
// AgriConnect – Core Application Data & Constants
// ============================================================

// Categories for crop filtering
export const CATEGORIES = ['All', 'Grain', 'Cash Crop', 'Fruit', 'Vegetable'];

// Image paths for crops
export const CROP_IMAGES = {
    'Wheat':    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=500&q=80',
    'Rice':     'https://images.unsplash.com/photo-1586985289688-cacf32ca6e4e?w=500&q=80',
    'Sugarcane':'https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=500&q=80',
    'Cotton':   'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
    'Maize':    'https://images.unsplash.com/photo-1535808066601-684b01f18b11?w=500&q=80',
    'Mango':    'https://images.unsplash.com/photo-1585518419759-7c67ffcf5e2f?w=500&q=80',
    'Citrus':   'https://images.unsplash.com/photo-1568702846629-a519a1b8e3d5?w=500&q=80',
    'Tomato':   'https://images.unsplash.com/photo-1609424842837-f08e85db2b34?w=500&q=80',
    'Potato':   'https://images.unsplash.com/photo-1535670711867-efb226f6d81e?w=500&q=80',
    'Onion':    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&q=80',
    'Chickpea': 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80'
};

// Text-based icons for crops
export const CROP_ICONS = {
    'Wheat': '🌾',
    'Rice': '🍚',
    'Sugarcane': '🎋',
    'Cotton': '☁️',
    'Maize': '🌽',
    'Mango': '🥭',
    'Citrus': '🍊',
    'Tomato': '🍅',
    'Potato': '🥔',
    'Onion': '🧅',
    'Chickpea': '🥜'
};

// Platform features highlighted on the homepage
export const FEATURES = [
    { image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400', title: 'Direct Farm-to-Buyer', desc: 'Connect directly with local farmers and eliminate middleman costs for better pricing.', color: 'green' },
    { image: 'https://images.unsplash.com/photo-1521791136064-7986c2959210?auto=format&fit=crop&q=80&w=400', title: 'Fair Price Negotiation', desc: 'Transparent pricing with direct negotiation tools for both farmers and buyers.', color: 'amber' },
    { image: 'https://images.unsplash.com/photo-1454165833767-027eeaf196ce?auto=format&fit=crop&q=80&w=400', title: 'Smart Search & Filter', desc: 'Find exactly what you need with powerful search, category filters, and location-based results.', color: 'blue' },
    { image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400', title: 'Market Analytics', desc: 'Real-time insights into crop availability, demand patterns, and pricing trends.', color: 'purple' },
    { image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400', title: 'Verified Profiles', desc: 'All farmers and buyers are verified to ensure trust and reliability on the platform.', color: 'red' },
    { image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400', title: 'Mobile Responsive', desc: 'Access the marketplace from any device — desktop, tablet, or smartphone.', color: 'teal' },
];

// User testimonials
export const TESTIMONIALS = [
    { text: 'AgriConnect helped me sell my wheat directly to buyers in Islamabad. I earned 30% more compared to selling through middlemen!', name: 'azan mehdi', role: 'Farmer, Mianwali', initials: 'AM' },
    { text: 'Finding quality produce from verified farmers has never been easier. The negotiation feature is incredibly transparent.', name: 'usman saif', role: 'Buyer, Islamabad', initials: 'US' },
    { text: 'As a small-scale farmer, this platform gave me visibility I never had before. My crops now reach buyers across Punjab.', name: 'kashmala fatimah', role: 'Farmer, Isa Khel', initials: 'KF' },
];
