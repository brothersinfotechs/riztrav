export type Testimonial = {
  id: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
  category: "hajj" | "umrah";
  recent?: boolean;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Mohammad Emran H.",
    location: "Dhaka, Bangladesh",
    rating: 5,
    text: "বরকতময় এই সফরের সঙ্গী হতে পেরে খুব আনন্দিত আমি ও আমার আব্বা-আম্মা। পুরো সফর শেষে এই কাফেলায় আসার জন্য যেই চেষ্টা করেছিলাম সেটা সার্থক মনে হচ্ছে, সব দিকে সময়মত সমস্ত সুযোগ সুবিধা পেয়েছি। পাশাপাশি ছিল দায়িত্বশীল সকলের আন্তরিকতা। মহান আল্লাহ আপনাদের এই প্রচেষ্টায় আরো বারাকাহ দিন, আমিন।",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    category: "umrah",
    recent: true,
  },
  {
    id: "2",
    name: "Mahmudur Rahman",
    location: "Dhaka, Bangladesh",
    rating: 5,
    text: "দলের সবাইকে তিনি সমঅধিকার দেননি, বরং যাকে যতটুকু সাপোর্ট দেয়ার দরকার, ততটুকু দেয়ার চেষ্টা তিনি ছিলেন শতভাগ আন্তরিক। দলের সবচেয়ে বয়স্ক এবং একা একা চলতে না পারা লোকটিকে আগলে রেখেছেন পুরো সফরকালে। এরকম নির্ভরশীল অনাদায় দায়িত্ব বুঝিয়ে দিয়েছেন কাউকে না কাউকে। রিজওয়ান ভাই কখনও মেষ পালন করেছেন বলে মনে হয় না, তবে বিভিন্ন বয়সের এবং ভিন্ন মানসিকতার এতোজনকে যেভাবে ম্যানেজ করেছেন।",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
    category: "hajj",
    recent: true,
  },
  {
    id: "3",
    name: "Raahma",
    location: "Dhaka, Bangladesh",
    rating: 5,
    text: "উত্তম কাফেলা আল্লাহর অনেক বড় একটা নিয়ামত আর রিজদীন দিয়ে এই পর্যন্ত আল্লাহর ঘরের মেহমান হিসেবে ৩ বার কবুল করিয়েছেন সুবহানাল্লাহ। প্রতিবারই আলাদা আলাদা ভাবে উনাদের থেকে নতুন কিছু পেয়েছি যা অনেক দিন মনে রাখার মত। দু'আ!! কোন বিনিময় প্রথা নাম নয়, খুব জোরসোরে ভাবে বিশ্বাস করি আল্লাহ খুব দ্রুতকে রিজকীন।",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    category: "umrah",
  },
  {
    id: "4",
    name: "Mufti Yousuf Sultan",
    location: "Dhaka, Bangladesh",
    rating: 5,
    text: "Alhamdulillah. We are very happy with the service alhamdulillah. Jazakallah.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    category: "hajj",
  },
  {
    id: "5",
    name: "Saleh Aiman",
    location: "Gazipur, Bangladesh",
    rating: 5,
    text: "আল্লাহ তাআলার দরবারে লাখো কোটি শুকরিয়া RIZDEEN TRAVELS এর স্বত্বাধিকারী Rizwanul Kabir ভাইয়ের মাধ্যমে জীবনের প্রথম আল্লাহর ঘর ও নবীজির রওজা জিয়ারত করার তৌফিক হয়েছে। অকল্পনীয়ভাবে অল্প সময়ের মধ্যে অল্প মূল্যে ওমরাহ করার ব্যবস্থা করেছেন। মক্কা ও মদিনায় অল্প হাটা দূরত্বে উত্তমানের হোটেল ও তিন বেলা সময় মত উন্নতমানের খাবার ব্যবস্থা। প্রতিদিন কয়েকবার খোঁজখবর নিয়েছেন, কোন অসুবিধা হচ্ছে কিনা, খাওয়া ঠিক মত হচ্ছে কিনা — এক কথায় অসাধারণ।",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
    category: "umrah",
    recent: true,
  },
  {
    id: "6",
    name: "Fouzia Rahman",
    location: "Khulna, Bangladesh",
    rating: 5,
    text: "পুরো সফর জুড়ে RIZDEEN TRAVELS এর উজ্জ্বল আমাদের সফরটা আল্লাহ আরো সহজ করে দিয়েছেন। তাদের প্রতি আমরা এতটাই কৃতজ্ঞ — নিখুঁত বসলে কয়েক পেইজ লিখতে হবে।",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop",
    category: "hajj",
  },
];
