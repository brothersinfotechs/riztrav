export type PackageType = "HAJJ" | "UMRAH";

export type Package = {
  slug: string;
  name: string;
  type: PackageType;
  price: string;
  duration: string;
  image: string;
  highlights: string[];
  featured?: boolean;
  description: string;
  itinerary: { day: string; title: string; desc: string }[];
  includes: string[];
  excludes: string[];
  faqs: { q: string; a: string }[];
};

export const PACKAGES: Package[] = [
  {
    slug: "economy-umrah",
    name: "ইকোনমি উমরাহ",
    type: "UMRAH",
    price: "৳1,45,000",
    duration: "10 দিন",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200",
    highlights: ["3-star hotel", "Group transport", "Visa & ticket", "Ziyarah tour"],
    description:
      "A complete, budget-friendly Umrah package covering visa, ticket, accommodation and group transport in Makkah and Madinah.",
    itinerary: [
      { day: "Day 1", title: "Dhaka → Jeddah", desc: "Departure from Dhaka, arrival at Jeddah, transfer to Makkah hotel." },
      { day: "Day 2-5", title: "Umrah in Makkah", desc: "Perform Umrah with group guidance, daily Salah at Haram." },
      { day: "Day 6", title: "Travel to Madinah", desc: "Bus transfer to Madinah, hotel check-in." },
      { day: "Day 7-9", title: "Madinah Ziyarah", desc: "Salah at Masjid an-Nabawi, Ziyarah of historical sites." },
      { day: "Day 10", title: "Return", desc: "Transfer to Madinah airport, return flight to Dhaka." },
    ],
    includes: ["Umrah visa", "Return air ticket", "3-star hotel (Makkah & Madinah)", "Group transport", "Ziyarah tour", "Bangla-speaking guide"],
    excludes: ["Personal expenses", "Laundry", "Extra meals", "Travel insurance"],
    faqs: [
      { q: "When can I travel?", a: "We arrange Umrah departures throughout the year, except during Hajj season." },
      { q: "What documents are required?", a: "Valid passport (6+ months), 4 photos, vaccination certificate, and NID." },
    ],
  },
  {
    slug: "standard-umrah",
    name: "স্ট্যান্ডার্ড উমরাহ",
    type: "UMRAH",
    price: "৳1,85,000",
    duration: "12 দিন",
    image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=1200",
    highlights: ["4-star hotel", "AC transport", "Visa & ticket", "Madinah stay", "Ziyarah tour"],
    description:
      "A balanced Umrah experience with 4-star accommodation, AC transport, and extended Madinah stay.",
    itinerary: [
      { day: "Day 1", title: "Dhaka → Jeddah", desc: "Departure and transfer to Makkah." },
      { day: "Day 2-6", title: "Makkah", desc: "Umrah and daily Haram Salah." },
      { day: "Day 7", title: "Travel to Madinah", desc: "AC bus transfer to Madinah." },
      { day: "Day 8-11", title: "Madinah Ziyarah", desc: "Masjid an-Nabawi and historical Ziyarah." },
      { day: "Day 12", title: "Return", desc: "Flight back to Dhaka." },
    ],
    includes: ["Umrah visa", "Return air ticket", "4-star hotel", "AC transport", "Ziyarah tour", "Bangla-speaking guide"],
    excludes: ["Personal expenses", "Laundry", "Extra meals", "Travel insurance"],
    faqs: [
      { q: "Is breakfast included?", a: "Yes, daily breakfast is included at both hotels." },
      { q: "How far are the hotels from Haram?", a: "Within 400m walking distance in both cities." },
    ],
  },
  {
    slug: "premium-umrah",
    name: "প্রিমিয়াম উমরাহ",
    type: "UMRAH",
    price: "৳2,25,000",
    duration: "14 দিন",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200",
    highlights: ["5-star Haram view", "Private guide", "Full meals", "Madinah stay"],
    featured: true,
    description:
      "Our most popular Umrah package — 5-star Haram-view accommodation, private guide, and full meals throughout.",
    itinerary: [
      { day: "Day 1", title: "Dhaka → Jeddah", desc: "VIP transfer to 5-star Makkah hotel." },
      { day: "Day 2-7", title: "Makkah", desc: "Umrah with private guide; daily Haram Salah." },
      { day: "Day 8", title: "Travel to Madinah", desc: "Private AC transfer to Madinah." },
      { day: "Day 9-13", title: "Madinah Ziyarah", desc: "Extended Ziyarah and personal time." },
      { day: "Day 14", title: "Return", desc: "Flight back to Dhaka." },
    ],
    includes: ["Umrah visa", "Return air ticket", "5-star Haram-view hotel", "Private AC transport", "Full meals (B/L/D)", "Private guide"],
    excludes: ["Personal shopping", "Laundry", "Travel insurance"],
    faqs: [
      { q: "Are meals halal?", a: "All meals are 100% halal, served buffet-style at the hotel." },
      { q: "Can the package be customized?", a: "Yes — contact us for date and route customizations." },
    ],
  },
  {
    slug: "short-umrah",
    name: "শর্ট উমরাহ",
    type: "UMRAH",
    price: "৳1,10,000",
    duration: "7 দিন",
    image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1200",
    highlights: ["3-star hotel", "Group transport", "Visa & ticket", "Express service"],
    description: "A compact 7-day Umrah for those with limited time — express visa processing and group logistics.",
    itinerary: [
      { day: "Day 1", title: "Dhaka → Jeddah", desc: "Transfer to Makkah hotel." },
      { day: "Day 2-4", title: "Makkah Umrah", desc: "Perform Umrah, daily Haram Salah." },
      { day: "Day 5", title: "Travel to Madinah", desc: "Bus to Madinah." },
      { day: "Day 6", title: "Madinah Ziyarah", desc: "Masjid an-Nabawi and Ziyarah." },
      { day: "Day 7", title: "Return", desc: "Flight back to Dhaka." },
    ],
    includes: ["Umrah visa (express)", "Return air ticket", "3-star hotel", "Group transport", "Bangla-speaking guide"],
    excludes: ["Personal expenses", "Laundry", "Extra meals"],
    faqs: [
      { q: "How fast is the visa?", a: "Express processing within 5-7 working days." },
    ],
  },
  {
    slug: "hajj-economy",
    name: "হজ্জ ইকোনমি",
    type: "HAJJ",
    price: "৳6,50,000",
    duration: "40 দিন",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200",
    highlights: ["Govt. approved", "Mina tents", "Group muallim", "Visa & ticket"],
    description: "A government-approved Hajj package with all essentials — Mina tents, group muallim, and full logistics.",
    itinerary: [
      { day: "Day 1-5", title: "Arrival & Makkah", desc: "Arrival in Jeddah, transfer to Makkah, hotel check-in." },
      { day: "Day 6-25", title: "Pre-Hajj period", desc: "Daily Haram Salah, training sessions, Umrah." },
      { day: "Day 26-30", title: "Hajj rituals", desc: "Mina, Arafat, Muzdalifah, Jamarat — full Hajj rites." },
      { day: "Day 31-39", title: "Madinah", desc: "Travel to Madinah for 8 days of Ziyarah." },
      { day: "Day 40", title: "Return", desc: "Flight back to Dhaka." },
    ],
    includes: ["Hajj visa", "Return air ticket", "Makkah & Madinah hotel", "Mina tents", "Group muallim", "Full transport"],
    excludes: ["Qurbani", "Personal expenses", "Extra meals"],
    faqs: [
      { q: "Is the package government-approved?", a: "Yes — fully licensed under the Ministry of Religious Affairs." },
    ],
  },
  {
    slug: "hajj-standard",
    name: "হজ্জ স্ট্যান্ডার্ড",
    type: "HAJJ",
    price: "৳7,20,000",
    duration: "40 দিন",
    image: "https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=1200",
    highlights: ["Govt. approved", "AC Mina tents", "Experienced muallim", "4-star hotel"],
    description: "Standard Hajj package with AC Mina tents and 4-star accommodation in both holy cities.",
    itinerary: [
      { day: "Day 1-5", title: "Arrival & Makkah", desc: "Arrival, transfer to 4-star Makkah hotel." },
      { day: "Day 6-25", title: "Pre-Hajj", desc: "Daily Salah, Umrah, training." },
      { day: "Day 26-30", title: "Hajj rituals", desc: "AC Mina tents, full Hajj rites." },
      { day: "Day 31-39", title: "Madinah", desc: "Madinah Ziyarah in 4-star hotel." },
      { day: "Day 40", title: "Return", desc: "Return to Dhaka." },
    ],
    includes: ["Hajj visa", "Return air ticket", "4-star hotel", "AC Mina tents", "Experienced muallim", "Full transport"],
    excludes: ["Qurbani", "Personal expenses"],
    faqs: [
      { q: "Are Mina tents AC?", a: "Yes — fully air-conditioned tents in Mina and Arafat." },
    ],
  },
  {
    slug: "hajj-premium",
    name: "হজ্জ প্রিমিয়াম",
    type: "HAJJ",
    price: "৳7,99,000",
    duration: "40 দিন",
    image: "https://images.unsplash.com/photo-1564769625905-50e93615e769?w=1200",
    highlights: ["Govt. approved", "VIP Mina tents", "Private muallim", "5-star hotel", "Full meals"],
    description: "Our premium Hajj experience — 5-star hotels, VIP Mina tents, private muallim, and full meals.",
    itinerary: [
      { day: "Day 1-5", title: "Arrival & Makkah", desc: "VIP transfer to 5-star Makkah hotel." },
      { day: "Day 6-25", title: "Pre-Hajj", desc: "Daily Salah, private training, Umrah." },
      { day: "Day 26-30", title: "Hajj rituals", desc: "VIP Mina tents, full premium rites." },
      { day: "Day 31-39", title: "Madinah", desc: "5-star Madinah stay with extended Ziyarah." },
      { day: "Day 40", title: "Return", desc: "Return to Dhaka." },
    ],
    includes: ["Hajj visa", "Return air ticket", "5-star hotel", "VIP Mina tents", "Private muallim", "Full meals (B/L/D)", "Premium transport"],
    excludes: ["Qurbani", "Personal shopping"],
    faqs: [
      { q: "What makes it premium?", a: "VIP Mina tents, 5-star Haram-view hotels, private guide, and full meals." },
    ],
  },
];

export const getPackage = (slug: string) => PACKAGES.find((p) => p.slug === slug);
