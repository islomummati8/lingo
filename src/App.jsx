import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

// ============================================================
// BARCHA TILLAR (60+ TIL)
// ============================================================
const ALL_LANGUAGES = [
  { code: 'ar', name: 'Arabic', native: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'uz', name: 'Uzbek', native: "O'zbekcha", flag: '🇺🇿', dir: 'ltr' },
  { code: 'ru', name: 'Russian', native: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'de', name: 'German', native: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'French', native: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Spanish', native: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', native: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'fa', name: 'Persian', native: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
  { code: 'he', name: 'Hebrew', native: 'עברית', flag: '🇮🇱', dir: 'rtl' },
  { code: 'it', name: 'Italian', native: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'kg', name: 'Kyrgyz', native: 'Кыргызча', flag: '🇰🇬', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', native: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', native: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', native: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺', dir: 'ltr' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴', dir: 'ltr' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬', dir: 'ltr' },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸', dir: 'ltr' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷', dir: 'ltr' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰', dir: 'ltr' },
  { code: 'sl', name: 'Slovenian', native: 'Slovenščina', flag: '🇸🇮', dir: 'ltr' },
  { code: 'lt', name: 'Lithuanian', native: 'Lietuvių', flag: '🇱🇹', dir: 'ltr' },
  { code: 'lv', name: 'Latvian', native: 'Latviešu', flag: '🇱🇻', dir: 'ltr' },
  { code: 'et', name: 'Estonian', native: 'Eesti', flag: '🇪🇪', dir: 'ltr' },
  { code: 'is', name: 'Icelandic', native: 'Íslenska', flag: '🇮🇸', dir: 'ltr' },
  { code: 'ga', name: 'Irish', native: 'Gaeilge', flag: '🇮🇪', dir: 'ltr' },
  { code: 'cy', name: 'Welsh', native: 'Cymraeg', flag: '🇬🇧', dir: 'ltr' },
  { code: 'af', name: 'Afrikaans', native: 'Afrikaans', flag: '🇿🇦', dir: 'ltr' },
  { code: 'sw', name: 'Swahili', native: 'Kiswahili', flag: '🇰🇪', dir: 'ltr' },
  { code: 'am', name: 'Amharic', native: 'አማርኛ', flag: '🇪🇹', dir: 'ltr' },
  { code: 'ne', name: 'Nepali', native: 'नेपाली', flag: '🇳🇵', dir: 'ltr' },
  { code: 'si', name: 'Sinhala', native: 'සිංහල', flag: '🇱🇰', dir: 'ltr' },
  { code: 'my', name: 'Burmese', native: 'မြန်မာစာ', flag: '🇲🇲', dir: 'ltr' },
  { code: 'km', name: 'Khmer', native: 'ភាសាខ្មែរ', flag: '🇰🇭', dir: 'ltr' },
  { code: 'lo', name: 'Lao', native: 'ພາສາລາວ', flag: '🇱🇦', dir: 'ltr' },
  { code: 'mn', name: 'Mongolian', native: 'Монгол', flag: '🇲🇳', dir: 'ltr' },
  { code: 'ka', name: 'Georgian', native: 'ქართული', flag: '🇬🇪', dir: 'ltr' },
  { code: 'hy', name: 'Armenian', native: 'Հայերեն', flag: '🇦🇲', dir: 'ltr' },
  { code: 'sq', name: 'Albanian', native: 'Shqip', flag: '🇦🇱', dir: 'ltr' },
  { code: 'mk', name: 'Macedonian', native: 'Македонски', flag: '🇲🇰', dir: 'ltr' },
  { code: 'bs', name: 'Bosnian', native: 'Bosanski', flag: '🇧🇦', dir: 'ltr' },
  { code: 'tl', name: 'Tagalog', native: 'Tagalog', flag: '🇵🇭', dir: 'ltr' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം', flag: '🇮🇳', dir: 'ltr' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી', flag: '🇮🇳', dir: 'ltr' },
  { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🇮🇳', dir: 'ltr' },
  { code: 'as', name: 'Assamese', native: 'অসমীয়া', flag: '🇮🇳', dir: 'ltr' },
];

// ============================================================
// INSTRUCTORS
// ============================================================
const INSTRUCTORS = [
  { name: 'Fida Abo Hassan', role: 'English & IELTS Instructor', flag: '🇬🇧', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face' },
  { name: 'Heidi', role: 'Spanish Instructor', flag: '🇪🇸', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face' },
  { name: 'Ibrahim Esawi', role: 'Italian Instructor', flag: '🇮🇹', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face' },
  { name: 'Halima', role: 'Uzbek & Kyrgyz Instructor', flag: '🇺🇿', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face' },
  { name: 'Shehab Saber', role: 'Hebrew & Arabic Instructor', flag: '🇮🇱', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face' },
  { name: 'Adrian', role: 'Polish Instructor', flag: '🇵🇱', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face' },
  { name: 'Dina', role: 'French Instructor', flag: '🇫🇷', img: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face' },
  { name: 'Yáng Xiāoyú', role: 'Chinese Instructor', flag: '🇨🇳', img: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=face' },
  { name: 'Mahmoud Elsheikh', role: 'German Instructor', flag: '🇩🇪', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face' },
];

// ============================================================
// SOCIAL LINKS
// ============================================================
const SOCIAL_LINKS = [
  { name: 'YouTube', url: 'https://www.youtube.com/@islamicummah571', icon: '▶️', color: 'bg-red-600', hover: 'hover:bg-red-700' },
  { name: 'Telegram', url: 'https://t.me/lingoplatform', icon: '✈️', color: 'bg-blue-600', hover: 'hover:bg-blue-700' },
  { name: 'Instagram', url: 'https://www.instagram.com/lingo_platform', icon: '📸', color: 'bg-pink-600', hover: 'hover:bg-pink-700' },
  { name: 'WhatsApp', url: 'https://wa.me/996553720108', icon: '💬', color: 'bg-green-600', hover: 'hover:bg-green-700' },
  { name: 'Email', url: 'mailto:islamrasmiy@gmail.com', icon: '✉️', color: 'bg-gray-600', hover: 'hover:bg-gray-700' },
];

// ============================================================
// TARJIMALAR
// ============================================================
const translations = {
  en: {
    brand: "Lingo",
    topContact: "Contact via WhatsApp",
    nav: { home: "Home", about: "About Us", services: "Services", courses: "Courses", contact: "Contact Us" },
    hero: {
      title1: "Learn Languages",
      title2: "Live Better",
      title3: "Speak Confidently",
      desc: "Lingo is a multilingual language academy offering structured learning with cultural understanding for students worldwide.",
      btnStart: "Start Today →",
      btnExplore: "Explore Languages →"
    },
    stats: {
      languages: "15+ Languages",
      instructors: "Top-Tier Instructors",
      classes: "Group & One-to-One Classes",
      schedule: "Flexible Schedule"
    },
    offers: {
      tag: "What we offer",
      title: "Unlock the World with Language Learning",
      list: [
        { title: "Live online courses", desc: "Study anywhere with our flexible online learning models." },
        { title: "Learn on Your Time", desc: "Set your own pace and schedule to fit your lifestyle." },
        { title: "One-to-one courses", desc: "Personalised sessions tailored to your level, goals, and pace." },
        { title: "Exam Preparation", desc: "Focused programs designed to help students understand exam formats." }
      ]
    },
    approach: {
      title: "Our Approach",
      desc: "Our methodology combines traditional academic rigour with modern immersion techniques, ensuring you not only speak but also understand the cultural context. Start with instructors who speak your language, progress to native speakers, using modern, continuously updated language-instructing methodologies.",
      btn: "Start Today",
      items: [
        { title: "Structured Curriculum", desc: "Step-by-step grammar and vocabulary mastery tailored to CEFR standards." },
        { title: "Cultural Immersion", desc: "Deep dives into history, art, and customs to understand the context behind words." },
        { title: "Affordability", desc: "Quality education as an investment in the future – not a financial burden." },
        { title: "Live Feedback", desc: "Real-time correction and guidance during every live session." }
      ],
      students: "200+ Happy Students",
      masterTitle: "Master Any Language, Anywhere",
      masterDesc: "We offer a range of language courses carefully curated to suit your needs."
    },
    pricing: {
      title: "Pricing Structure & Levels",
      beginner: { title: "Beginner Level", price: "From $25 /hour", features: ["Basic vocabulary foundations", "Simple conversations", "Guided pronunciation"] },
      intermediate: { title: "Intermediate Level", price: "From $30 /hour", features: ["Expanded vocabulary", "Discussion-based sessions", "Real-world content"] },
      advanced: { title: "Advanced Level", price: "From $35 /hour", features: ["Advanced fluency", "Debates & presentations", "Complex text analysis"] }
    },
    about: {
      title: "About Us",
      subtitle: "Learn & Practice with Professionals",
      desc: "We are more than a language platform — we are a learning experience. Our programs are carefully designed to develop the four essential language skills: listening, reading, writing, and speaking.",
      beliefs: ["Practical, not theoretical", "Flexible, not restrictive", "Affordable, not overwhelming"],
      trial: "That's why we offer a free trial to assess the level, needs, and the preferred instructing method that suits the learner",
      btn: "Explore Languages →"
    },
    vision: {
      title: "Our Vision",
      desc: "To build the most trusted language education ecosystem in the world, where success enables us to support underprivileged students striving to learn despite financial barriers."
    },
    mission: {
      title: "Our Mission",
      desc: "To make language learning accessible, affordable, and highly effective for learners worldwide by delivering accurate, learner-centered approaches and assisted learning with qualified instructors."
    },
    instructors: {
      title: "Our Instructors",
      desc: "At Lingo, our instructors are more than teachers — they are mentors who guide, support, and motivate. Each member of our team is carefully selected based on academic qualifications, real classroom experience, and the ability to connect with learners from different cultures and backgrounds."
    },
    contactPage: {
      title: "Start Your Language Journey with Us",
      desc: "Get in touch to discuss your learning goals today. Please give us a call, drop us an email, or fill out the form.",
      address: "Kyrgyzstan",
      phone: "+996 553 720 108",
      email: "islamrasmiy@gmail.com",
      formTitle: "Drop Us a Line",
      name: "Full Name",
      email: "Email Address",
      phoneLabel: "Phone / WhatsApp",
      course: "Language of Interest",
      message: "Message / Questions",
      btn: "Get in Touch →",
      educatorTitle: "Join Our Team of Expert Educators",
      educatorDesc: "We're looking for passionate language instructors to join Lingo. If you're qualified, experienced, and love instructing — we want to hear from you.",
      educatorBenefits: ["Flexible instructing hours", "Competitive pay", "International community"],
      applyName: "Name",
      applyPhone: "Phone",
      applyEmail: "Email",
      applyLanguage: "Language You Teach",
      applyExperience: "Years of Experience",
      applyCert: "Certifications",
      applyLocation: "Location",
      applyHours: "Preferred Hours",
      applyBtn: "Apply Now"
    },
    faq: {
      title: "Frequently Asked Questions",
      qs: [
        { q: "Are your classes online or in person?", a: "All our courses are 100% online, allowing you to learn from anywhere with flexible scheduling." },
        { q: "Who are the instructors?", a: "Our instructors are native speakers with professional teaching certifications and over 10 years of experience." },
        { q: "How long does it take to learn a language?", a: "With consistent practice, you can achieve conversational fluency in 3 to 6 months." },
        { q: "Are online courses effective?", a: "Yes, online courses offer flexibility and convenience while maintaining high-quality instruction." },
        { q: "How flexible are the schedules?", a: "We offer morning, evening, and weekend classes to fit your busy lifestyle." },
        { q: "Is there a trial class?", a: "Yes, we offer a free trial class so you can experience our teaching style before committing." },
        { q: "Do you offer certificates?", a: "Yes, we provide certificates of completion for all our courses." },
        { q: "What levels do you teach?", a: "We teach all levels from beginner to advanced, with courses tailored to your needs." },
        { q: "Can I switch between group and private classes?", a: "Yes, you can switch at any time based on your learning preferences." }
      ]
    },
    footer: {
      courses: "Courses",
      contacts: "Contacts",
      subscribe: "Subscribe",
      socials: "In Socials",
      copyright: "Copyright © 2026 Lingo Languages Institute. All Rights Reserved."
    }
  },
  ar: {
    brand: "لينجو",
    topContact: "تواصل معنا عبر الواتساب",
    nav: { home: "الرئيسية", about: "من نحن", services: "الخدمات", courses: "الدورات", contact: "تواصل معنا" },
    hero: {
      title1: "تعلم اللغات",
      title2: "عيش حياة أفضل",
      title3: "تحدث بثقة",
      desc: "لينجو هي أكاديمية لغات عالمية تقدم تعليماً مهيكلاً مع فهم ثقافي عميق للطلاب في جميع أنحاء العالم.",
      btnStart: "ابدأ اليوم ←",
      btnExplore: "استكشف اللغات ←"
    },
    stats: {
      languages: "١٥+ لغة",
      instructors: "مدربون من الدرجة الأولى",
      classes: "دروس جماعية وفردية",
      schedule: "جدول مرن"
    },
    offers: {
      tag: "ما نقدمه",
      title: "افتح العالم بتعلم اللغات",
      list: [
        { title: "دورات مباشرة عبر الإنترنت", desc: "ادرس في أي مكان مع نماذج التعلم عبر الإنترنت المرنة." },
        { title: "تعلم في وقتك", desc: "حدد وتيرتك وجدولك ليناسب نمط حياتك." },
        { title: "دورات فردية", desc: "جلسات مخصصة حسب مستواك وأهدافك." },
        { title: "التحضير للامتحانات", desc: "برامج مركزة لمساعدة الطلاب على فهم صيغ الامتحانات." }
      ]
    },
    approach: {
      title: "نهجنا",
      desc: "يجمع منهجنا بين الصرامة الأكاديمية التقليدية وتقنيات الانغماس الحديثة، مما يضمن لك ليس فقط التحدث ولكن أيضًا فهم السياق الثقافي.",
      btn: "ابدأ اليوم",
      items: [
        { title: "منهج منظم", desc: "إتقان القواعد والمفردات خطوة بخطوة وفقًا لمعايير CEFR." },
        { title: "الانغماس الثقافي", desc: "غوص عميق في التاريخ والفن والعادات لفهم السياق وراء الكلمات." },
        { title: "أسعار معقولة", desc: "تعليم عالي الجودة كاستثمار في المستقبل – وليس عبئًا ماليًا." },
        { title: "ملاحظات فورية", desc: "تصحيح وتوجيه فوري خلال كل جلسة مباشرة." }
      ],
      students: "٢٠٠+ طالب سعيد",
      masterTitle: "اتقن أي لغة في أي مكان",
      masterDesc: "نقدم مجموعة من دورات اللغة المصممة بعناية لتلبية احتياجاتك."
    },
    pricing: {
      title: "هيكل التسعير والمستويات",
      beginner: { title: "مستوى مبتدئ", price: "من ٢٥ دولار / ساعة", features: ["أساسيات المفردات", "محادثات بسيطة", "نطق موجه"] },
      intermediate: { title: "مستوى متوسط", price: "من ٣٠ دولار / ساعة", features: ["مفردات موسعة", "جلسات نقاش", "محتوى واقعي"] },
      advanced: { title: "مستوى متقدم", price: "من ٣٥ دولار / ساعة", features: ["طلاقة متقدمة", "مناظرات", "تحليل نصوص"] }
    },
    about: {
      title: "من نحن",
      subtitle: "تعلم وتمرن مع المحترفين",
      desc: "نحن أكثر من مجرد منصة لغوية — نحن تجربة تعليمية. تم تصميم برامجنا بعناية لتطوير المهارات اللغوية الأربع الأساسية.",
      beliefs: ["عملي، ليس نظريًا", "مرن، ليس مقيدًا", "بأسعار معقولة"],
      trial: "لهذا نقدم درسًا تجريبيًا مجانيًا لتقييم المستوى والاحتياجات",
      btn: "استكشف اللغات ←"
    },
    vision: {
      title: "رؤيتنا",
      desc: "بناء نظام بيئي موثوق لتعليم اللغات في العالم، حيث يمكننا من خلال الأرباح دعم الطلاب المحرومين."
    },
    mission: {
      title: "مهمتنا",
      desc: "جعل تعلم اللغات متاحًا وبأسعار معقولة وفعال للمتعلمين في جميع أنحاء العالم من خلال تقديم مناهج دقيقة تركز على المتعلم."
    },
    instructors: {
      title: "مدربونا",
      desc: "في لينجو، مدربونا هم أكثر من مجرد معلمين — إنهم مرشدون يوجهون ويدعمون ويحفزون. يتم اختيار كل عضو في فريقنا بعناية."
    },
    contactPage: {
      title: "ابدأ رحلتك اللغوية معنا",
      desc: "تواصل معنا اليوم لمناقشة أهدافك التعليمية.",
      address: "قيرغيزستان",
      phone: "+996 553 720 108",
      email: "islamrasmiy@gmail.com",
      formTitle: "أرسل لنا رسالة",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phoneLabel: "الهاتف / واتساب",
      course: "اللغة المطلوبة",
      message: "الرسالة / الأسئلة",
      btn: "تواصل معنا ←",
      educatorTitle: "انضم إلى فريق المدربين الخبراء لدينا",
      educatorDesc: "نحن نبحث عن مدربي لغات شغوفين للانضمام إلى لينجو.",
      educatorBenefits: ["ساعات مرنة", "أجور تنافسية", "مجتمع دولي"],
      applyName: "الاسم",
      applyPhone: "الهاتف",
      applyEmail: "البريد الإلكتروني",
      applyLanguage: "اللغة التي تدرسها",
      applyExperience: "سنوات الخبرة",
      applyCert: "الشهادات",
      applyLocation: "الموقع",
      applyHours: "الساعات المفضلة",
      applyBtn: "قدم الآن"
    },
    faq: {
      title: "الأسئلة الشائعة",
      qs: [
        { q: "هل دوراتكم عبر الإنترنت أم حضورية؟", a: "جميع دوراتنا ١٠٠٪ عبر الإنترنت، مما يتيح لك التعلم من أي مكان بجدول مرن." },
        { q: "من هم المدربون؟", a: "مدربونا هم متحدثون أصليون مع شهادات تدريس مهنية." },
        { q: "كم يستغرق تعلم اللغة؟", a: "مع الممارسة المستمرة، يمكنك تحقيق الطلاقة في غضون ٣ إلى ٦ أشهر." },
        { q: "هل الدورات عبر الإنترنت فعالة؟", a: "نعم، تقدم الدورات عبر الإنترنت المرونة والراحة مع الحفاظ على جودة عالية." },
        { q: "ما مدى مرونة الجداول؟", a: "نقدم دروسًا صباحية ومسائية وعطلة نهاية الأسبوع." },
        { q: "هل هناك درس تجريبي؟", a: "نعم، نقدم درسًا تجريبيًا مجانيًا." },
        { q: "هل تقدمون شهادات؟", a: "نعم، نقدم شهادات إتمام لجميع دوراتنا." },
        { q: "ما المستويات التي تدرسونها؟", a: "نحن ندرس جميع المستويات من المبتدئ إلى المتقدم." },
        { q: "هل يمكنني التبديل بين الدروس الجماعية والخاصة؟", a: "نعم، يمكنك التبديل في أي وقت." }
      ]
    },
    footer: {
      courses: "الدورات",
      contacts: "جهات الاتصال",
      subscribe: "اشترك",
      socials: "وسائل التواصل الاجتماعي",
      copyright: "جميع الحقوق محفوظة © ٢٠٢٦ معهد لينجو للغات"
    }
  }
};

// ============================================================
// ADMIN PANEL
// ============================================================
function AdminPanel({ onBack }) {
  const [arizalar, setArizalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "arizalar"), (snapshot) => {
      setArizalar(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateDoc(doc(db, "arizalar", id), { status });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Arizani o'chirmoqchimisiz?")) {
      await deleteDoc(doc(db, "arizalar", id));
    }
  };

  const filteredData = arizalar.filter(item => {
    const matchStatus = filter === 'all' || item.status === filter;
    const matchSearch = item.ism?.toLowerCase().includes(search.toLowerCase()) ||
                        item.telefon?.includes(search) ||
                        item.kurs?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const stats = {
    total: arizalar.length,
    new: arizalar.filter(a => a.status === 'Yangi').length,
    contacted: arizalar.filter(a => a.status === "Bog'lanildi").length,
    accepted: arizalar.filter(a => a.status === 'Qabul qilindi').length,
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-amber-500">Lingo Admin Panel</h1>
            <p className="text-xs text-slate-400">Real-Time Firebase Submissions</p>
          </div>
          <button onClick={onBack} className="mt-3 md:mt-0 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-700 transition">← Back to Site</button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700"><p className="text-xs text-slate-400">Total</p><p className="text-2xl font-bold text-white">{stats.total}</p></div>
          <div className="bg-slate-800 rounded-xl p-4 border border-red-500/30"><p className="text-xs text-slate-400">New</p><p className="text-2xl font-bold text-red-400">{stats.new}</p></div>
          <div className="bg-slate-800 rounded-xl p-4 border border-yellow-500/30"><p className="text-xs text-slate-400">Contacted</p><p className="text-2xl font-bold text-yellow-400">{stats.contacted}</p></div>
          <div className="bg-slate-800 rounded-xl p-4 border border-green-500/30"><p className="text-xs text-slate-400">Accepted</p><p className="text-2xl font-bold text-green-400">{stats.accepted}</p></div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 my-4">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
            <option value="all">All Status</option>
            <option value="Yangi">New</option>
            <option value="Bog'lanildi">Contacted</option>
            <option value="Qabul qilindi">Accepted</option>
          </select>
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1" />
        </div>

        <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
          {loading ? <div className="p-8 text-center text-slate-400">Loading...</div> : filteredData.length === 0 ? <div className="p-8 text-center text-slate-400">No applications found</div> : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-700">
                <tr><th className="p-4">#</th><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Course</th><th className="p-4">Status</th><th className="p-4 text-center">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-700/30 transition">
                    <td className="p-4 text-slate-500">{idx + 1}</td>
                    <td className="p-4 font-semibold text-white">{item.ism || '—'}</td>
                    <td className="p-4 text-slate-400">{item.email || '—'}</td>
                    <td className="p-4 text-amber-400 font-mono">{item.telefon || '—'}</td>
                    <td className="p-4">{item.kurs || '—'}</td>
                    <td className="p-4">
                      <select value={item.status || 'Yangi'} onChange={(e) => handleStatusChange(item.id, e.target.value)} className={`bg-slate-900 border rounded px-2 py-1 text-xs text-white focus:outline-none ${item.status === 'Yangi' ? 'border-red-500/50' : item.status === "Bog'lanildi" ? 'border-yellow-500/50' : 'border-green-500/50'}`}>
                        <option value="Yangi">🔴 New</option>
                        <option value="Bog'lanildi">🟡 Contacted</option>
                        <option value="Qabul qilindi">🟢 Accepted</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleDelete(item.id)} className="text-red-400 text-xs bg-red-500/10 px-3 py-1 rounded border border-red-500/20 hover:bg-red-500/20 transition">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [lang, setLang] = useState('en');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState('Arabic');
  const [selectedModel, setSelectedModel] = useState('Group Classes');
  const [submitting, setSubmitting] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [educatorForm, setEducatorForm] = useState({ name: '', email: '', phone: '', language: '', experience: '', cert: '', location: '', hours: '' });

  const t = translations[lang] || translations.en;

  useEffect(() => {
    const timer = setTimeout(() => setShowPromoModal(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const slide = (id, direction) => {
    const el = document.getElementById(id);
    if (el) el.scrollLeft += direction * 280;
  };

  const handleSelectLanguage = (langName) => {
    setSelectedCourse(langName);
    setCurrentPage('contact');
    setMobileMenuOpen(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return alert("Please enter your name and phone number!");

    setSubmitting(true);
    try {
      await addDoc(collection(db, "arizalar"), {
        ism: formData.name,
        email: formData.email,
        telefon: formData.phone,
        kurs: selectedCourse,
        model: selectedModel,
        message: formData.message,
        status: 'Yangi',
        sana: serverTimestamp()
      });
      alert("✅ Your application has been submitted successfully!");
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEducatorSubmit = async (e) => {
    e.preventDefault();
    if (!educatorForm.name || !educatorForm.email || !educatorForm.phone) return alert("Please fill in all required fields!");

    setSubmitting(true);
    try {
      await addDoc(collection(db, "educators"), {
        name: educatorForm.name,
        email: educatorForm.email,
        phone: educatorForm.phone,
        language: educatorForm.language,
        experience: educatorForm.experience,
        certifications: educatorForm.cert,
        location: educatorForm.location,
        hours: educatorForm.hours,
        status: 'New',
        sana: serverTimestamp()
      });
      alert("✅ Your application as an educator has been submitted!");
      setEducatorForm({ name: '', email: '', phone: '', language: '', experience: '', cert: '', location: '', hours: '' });
    } catch (err) {
      alert("❌ Error: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (currentPage === 'admin') return <AdminPanel onBack={() => setCurrentPage('home')} />;

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#1E293B] font-sans antialiased relative">

      {/* PROMO MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl flex flex-col md:flex-row items-center gap-6">
            <button onClick={() => setShowPromoModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-slate-200">×</button>
            <div className="w-full md:w-1/2 h-56 md:h-64 rounded-2xl overflow-hidden bg-slate-100 border">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800" alt="Offer" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">Exclusive Offer</span>
              <h3 className="text-xl font-extrabold text-[#0A1128] leading-tight">Get 50% OFF your first month</h3>
              <p className="text-xs text-slate-500">Limited to the FIRST 10 customers only!</p>
              <button onClick={() => { setShowPromoModal(false); setCurrentPage('contact'); }} className="w-full bg-[#0A1128] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-sm">Book Now →</button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER */}
      <header className="bg-[#FFF0E5] text-slate-700 text-xs py-2 px-4 md:px-8 flex flex-wrap justify-between items-center border-b border-orange-100 gap-2">
        <div className="flex flex-wrap items-center gap-3 md:gap-6 font-medium">
          <a href="mailto:islamrasmiy@gmail.com" className="hover:text-orange-600 transition flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            <span className="hidden sm:inline">islamrasmiy@gmail.com</span>
          </a>
          <a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="hover:text-green-600 transition flex items-center gap-1 font-bold text-green-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            <span className="hidden sm:inline">+996 553 720 108</span>
          </a>
        </div>
        <button onClick={() => setCurrentPage('admin')} className="text-slate-500 hover:text-orange-600 font-semibold text-xs transition flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 13c-2.33 0-4.31-1.46-5.11-3.5.1-.56 1.14-1.5 2.11-1.5.47 0 .89.19 1.22.52.32.33.74.52 1.22.52h1.12c.47 0 .89-.19 1.22-.52.32-.33.74-.52 1.22-.52.97 0 2.01.94 2.11 1.5C16.31 17.54 14.33 19 12 19z"/></svg>
          Admin
        </button>
      </header>

      {/* NAVBAR */}
      <nav className="bg-[#0A1128] text-white py-3 px-4 md:px-8 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <span className="text-2xl font-black tracking-widest text-white">{t.brand}</span>
          <span className="text-orange-500 font-bold text-2xl">.</span>
        </div>

        <div className="hidden md:flex space-x-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <button onClick={() => setCurrentPage('home')} className={`hover:text-orange-400 transition ${currentPage === 'home' ? 'text-orange-400 font-bold' : ''}`}>{t.nav.home}</button>
          <button onClick={() => setCurrentPage('about')} className={`hover:text-orange-400 transition ${currentPage === 'about' ? 'text-orange-400 font-bold' : ''}`}>{t.nav.about}</button>
          <button onClick={() => setCurrentPage('services')} className={`hover:text-orange-400 transition ${currentPage === 'services' ? 'text-orange-400 font-bold' : ''}`}>{t.nav.services}</button>
          <button onClick={() => setCurrentPage('courses')} className={`hover:text-orange-400 transition ${currentPage === 'courses' ? 'text-orange-400 font-bold' : ''}`}>{t.nav.courses}</button>
          <button onClick={() => setCurrentPage('contact')} className={`hover:text-orange-400 transition ${currentPage === 'contact' ? 'text-orange-400 font-bold' : ''}`}>{t.nav.contact}</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 shadow-inner">
            {['en', 'ar'].map((code) => {
              const item = ALL_LANGUAGES.find(l => l.code === code);
              return item ? (
                <button key={code} onClick={() => setLang(code)} className={`px-2 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${lang === code ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}>
                  <span>{item.flag}</span>
                  <span className="hidden sm:inline">{code.toUpperCase()}</span>
                </button>
              ) : null;
            })}
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden text-white text-xl p-1">☰</button>
          <button onClick={() => setCurrentPage('contact')} className="hidden md:block bg-[#E07A5F] hover:bg-[#d0694e] text-white font-bold px-5 py-2 rounded-full text-xs transition shadow-md">{t.nav.contact}</button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A1128] border-t border-slate-800 p-4 space-y-3 text-sm font-semibold">
          {['home', 'about', 'services', 'courses', 'contact'].map((page) => (
            <button key={page} onClick={() => { setCurrentPage(page); setMobileMenuOpen(false); }} className={`block w-full text-left hover:text-orange-400 transition ${currentPage === page ? 'text-orange-400' : 'text-slate-300'}`}>
              {t.nav[page] || page}
            </button>
          ))}
        </div>
      )}

      {/* PAGE ROUTING */}
      {currentPage === 'courses' ? (
        <CoursesPage t={t} handleSelectLanguage={handleSelectLanguage} ALL_LANGUAGES={ALL_LANGUAGES} />
      ) : currentPage === 'contact' ? (
        <ContactPage t={t} formData={formData} setFormData={setFormData} educatorForm={educatorForm} setEducatorForm={setEducatorForm} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} selectedModel={selectedModel} setSelectedModel={setSelectedModel} submitting={submitting} handleFormSubmit={handleFormSubmit} handleEducatorSubmit={handleEducatorSubmit} ALL_LANGUAGES={ALL_LANGUAGES} SOCIAL_LINKS={SOCIAL_LINKS} />
      ) : currentPage === 'about' ? (
        <AboutPage t={t} />
      ) : currentPage === 'services' ? (
        <ServicesPage t={t} />
      ) : (
        <HomePage t={t} slide={slide} handleSelectLanguage={handleSelectLanguage} ALL_LANGUAGES={ALL_LANGUAGES} INSTRUCTORS={INSTRUCTORS} SOCIAL_LINKS={SOCIAL_LINKS} />
      )}

      {/* FOOTER */}
      <Footer t={t} handleSelectLanguage={handleSelectLanguage} ALL_LANGUAGES={ALL_LANGUAGES} SOCIAL_LINKS={SOCIAL_LINKS} />
    </div>
  );
}

// ============================================================
// HOME PAGE
// ============================================================
function HomePage({ t, slide, handleSelectLanguage, ALL_LANGUAGES, INSTRUCTORS, SOCIAL_LINKS }) {
  return (
    <>
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-6 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="md:w-1/2 space-y-5">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#0A1128]">
            {t.hero.title1} <br />
            <span className="text-[#E07A5F]">{t.hero.title2}</span> <br />
            {t.hero.title3}
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-lg">{t.hero.desc}</p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#0A1128] hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg text-sm">{t.hero.btnStart}</button>
            <button onClick={() => { setCurrentPage('courses'); }} className="border border-slate-300 hover:bg-slate-100 text-[#0A1128] font-semibold px-6 py-3 rounded-full transition text-sm">{t.hero.btnExplore}</button>
          </div>

          <div className="flex flex-wrap gap-3 text-xs font-bold text-slate-700">
            <span className="bg-[#FFF0E5] px-4 py-2 rounded-full border border-orange-200">🌍 {t.stats.languages}</span>
            <span className="bg-[#FFF0E5] px-4 py-2 rounded-full border border-orange-200">👨‍🏫 {t.stats.instructors}</span>
            <span className="bg-[#FFF0E5] px-4 py-2 rounded-full border border-orange-200">📚 {t.stats.classes}</span>
            <span className="bg-[#FFF0E5] px-4 py-2 rounded-full border border-orange-200">⏰ {t.stats.schedule}</span>
          </div>

          <div className="pt-4">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Explore Languages</p>
              <div className="flex gap-2">
                <button onClick={() => slide('hero-slider', -1)} className="w-7 h-7 rounded-full bg-slate-200 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition">◀</button>
                <button onClick={() => slide('hero-slider', 1)} className="w-7 h-7 rounded-full bg-slate-200 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition">▶</button>
              </div>
            </div>
            <div id="hero-slider" className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar py-2">
              {ALL_LANGUAGES.slice(0, 30).map((item, idx) => (
                <div key={idx} onClick={() => handleSelectLanguage(item.name)} className="flex-none flex items-center gap-2 bg-[#FFF0E5] border border-orange-200 px-4 py-2 rounded-full shadow-sm text-xs font-bold text-slate-800 hover:scale-105 transition cursor-pointer">
                  <span className="text-base">{item.flag}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center w-full">
          <div className="relative w-full max-w-md h-[350px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800" alt="Lingo Academy" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section id="services" className="bg-[#FFFBF7] py-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto space-y-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">{t.offers.tag}</span>
            <h2 className="text-3xl font-extrabold text-[#0A1128] mt-1">{t.offers.title}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.offers.list.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between hover:shadow-md transition hover:-translate-y-1">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm mb-4">0{index + 1}</div>
                  <h3 className="font-bold text-[#0A1128] text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                <button onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} className="mt-6 w-8 h-8 rounded-full bg-[#0A1128] text-white flex items-center justify-center font-bold text-xs hover:bg-orange-500 transition">→</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <ApproachSection t={t} />

      {/* INSTRUCTORS */}
      <section className="bg-[#0A1128] text-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-4">{t.instructors.title}</h2>
          <p className="text-slate-400 text-sm text-center max-w-2xl mx-auto mb-10">{t.instructors.desc}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {INSTRUCTORS.map((inst, i) => (
              <div key={i} className="bg-slate-800 rounded-xl p-4 text-center hover:scale-105 transition hover:shadow-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 mx-auto flex items-center justify-center text-2xl font-bold text-white">{inst.name[0]}</div>
                <h4 className="font-bold text-sm mt-3">{inst.name}</h4>
                <p className="text-[10px] text-amber-400">{inst.role}</p>
                <span className="text-xl">{inst.flag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-[#0A1128] text-center mb-10">{t.pricing.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['beginner', 'intermediate', 'advanced'].map((key, idx) => {
            const level = t.pricing[key];
            const colors = ['border-blue-200 bg-blue-50', 'border-amber-200 bg-amber-50', 'border-green-200 bg-green-50'];
            return (
              <div key={idx} className={`bg-white p-6 rounded-2xl border-2 ${colors[idx]} shadow-md hover:shadow-xl transition`}>
                <h3 className="text-xl font-bold text-[#0A1128]">{level.title}</h3>
                <p className="text-sm font-bold text-orange-600 mt-1">{level.price}</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-600">
                  {level.features.map((f, i) => <li key={i} className="flex items-start gap-2">✓ {f}</li>)}
                </ul>
                <button onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} className="mt-6 w-full bg-[#0A1128] hover:bg-orange-600 text-white font-bold py-2 rounded-full transition text-sm">Choose Plan</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <h2 className="text-3xl font-extrabold text-[#0A1128] text-center mb-10">{t.faq.title}</h2>
        <div className="space-y-4 text-xs">
          {t.faq.qs.map((faq, i) => (
            <details key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer hover:border-orange-300 transition">
              <summary className="font-bold text-sm text-[#0A1128]">{faq.q}</summary>
              <p className="mt-3 text-slate-600 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

// ============================================================
// APPROACH SECTION
// ============================================================
function ApproachSection({ t }) {
  const icons = ['📚', '🌍', '💰', '💬'];
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
          <h2 className="text-3xl font-extrabold text-[#0A1128] mb-4">{t.approach.title}</h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-6">{t.approach.desc}</p>
          <button onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#0A1128] hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition shadow-lg text-sm">{t.approach.btn}</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {t.approach.items.map((item, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold mb-3">{icons[i]}</div>
              <h4 className="font-bold text-[#0A1128] text-sm mb-1">{item.title}</h4>
              <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 text-center">
        <span className="text-sm font-bold text-orange-600 bg-orange-100 px-8 py-3 rounded-full shadow-sm inline-flex items-center gap-2">⭐ {t.approach.students}</span>
      </div>
      <div className="mt-12 text-center bg-[#0A1128] text-white p-10 rounded-3xl">
        <h3 className="text-2xl md:text-3xl font-extrabold">{t.approach.masterTitle}</h3>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">{t.approach.masterDesc}</p>
        <button onClick={() => setCurrentPage('courses')} className="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold px-8 py-3 rounded-full transition text-sm shadow-lg">Start Your Journey →</button>
      </div>
    </section>
  );
}

// ============================================================
// ABOUT PAGE
// ============================================================
function AboutPage({ t }) {
  return (
    <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1128]">{t.about.title}</h1>
        <p className="text-orange-600 font-semibold text-sm mt-2">{t.about.subtitle}</p>
      </div>
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        <p className="text-slate-700 leading-relaxed">{t.about.desc}</p>
        <ul className="space-y-2 text-sm">
          {t.about.beliefs.map((b, i) => <li key={i} className="flex items-center gap-3">✅ <span>{b}</span></li>)}
        </ul>
        <p className="text-sm text-orange-600 bg-orange-50 p-4 rounded-xl italic">{t.about.trial}</p>
        <button onClick={() => setCurrentPage('courses')} className="bg-[#0A1128] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-full transition text-sm">{t.about.btn}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#0A1128] text-white p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-amber-400">{t.vision.title}</h3>
          <p className="text-sm text-slate-300 mt-2">{t.vision.desc}</p>
        </div>
        <div className="bg-[#0A1128] text-white p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-amber-400">{t.mission.title}</h3>
          <p className="text-sm text-slate-300 mt-2">{t.mission.desc}</p>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// SERVICES PAGE
// ============================================================
function ServicesPage({ t }) {
  const services = [
    { title: "Live Online Language Courses", desc: "Interactive, instructor-led sessions designed to build strong foundations." },
    { title: "Private One-to-One Coaching", desc: "Personalized learning tailored to your level, pace, and goals." },
    { title: "Small Group Interactive Classes", desc: "Learn with peers in an engaging, collaborative environment." },
    { title: "Conversation & Fluency Training", desc: "Practice real-world speaking skills with native-level interaction." },
    { title: "Professionally Designed Curricula", desc: "Structured programs that develop all language skills." },
    { title: "Placement & Level Assessment Tests", desc: "Know exactly where you stand from day one." },
    { title: "Exam Preparation", desc: "IELTS, TOEFL, and PTE preparation programs." },
    { title: "Corporate & Customized Training", desc: "Custom language solutions for businesses." },
    { title: "Free Group Sessions", desc: "Free group online meetings to practice and connect." }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 animate-fadeIn">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1128] text-center mb-4">{t.offers.title}</h1>
      <p className="text-slate-600 text-center max-w-2xl mx-auto text-sm mb-10">Our courses are designed to serve learners of all levels, from beginners to advanced speakers.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition hover:-translate-y-1">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm mb-3">{i + 1}</div>
            <h3 className="font-bold text-[#0A1128] text-base mb-2">{s.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// COURSES PAGE
// ============================================================
function CoursesPage({ t, handleSelectLanguage, ALL_LANGUAGES }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A1128] mb-3">Explore Our Languages</h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm">15+ languages. Expert instructors. Flexible schedules.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {ALL_LANGUAGES.map((item, idx) => (
          <div key={idx} onClick={() => handleSelectLanguage(item.name)} className="bg-white border border-slate-200 hover:border-orange-500 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1 group">
            <span className="text-4xl md:text-5xl mb-3 transform group-hover:scale-110 transition duration-200">{item.flag}</span>
            <h3 className="font-bold text-sm md:text-base text-[#0A1128]">{item.name}</h3>
            <span className="text-[10px] text-slate-400 mt-1">{item.native}</span>
            <button className="mt-3 bg-[#FFF0E5] text-orange-600 group-hover:bg-orange-600 group-hover:text-white text-xs font-bold px-3 py-1.5 rounded-full transition">Enroll →</button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// CONTACT PAGE
// ============================================================
function ContactPage({ t, formData, setFormData, educatorForm, setEducatorForm, selectedCourse, setSelectedCourse, selectedModel, setSelectedModel, submitting, handleFormSubmit, handleEducatorSubmit, ALL_LANGUAGES, SOCIAL_LINKS }) {
  const models = ['Group Classes', 'One-to-One', 'Corporate Program', 'Exam Preparation'];

  return (
    <section id="contact-section" className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A1128] mb-3">{t.contactPage.title}</h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm">{t.contactPage.desc}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div><p className="text-xs text-slate-400">📍 Address</p><p className="font-bold text-sm">{t.contactPage.address}</p></div>
        <div><p className="text-xs text-slate-400">📞 Phone</p><p className="font-bold text-sm">{t.contactPage.phone}</p></div>
        <div><p className="text-xs text-slate-400">💬 WhatsApp</p><a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="font-bold text-sm text-green-700 hover:underline flex items-center gap-1">Chat Now</a></div>
        <div><p className="text-xs text-slate-400">✉️ Email</p><a href="mailto:islamrasmiy@gmail.com" className="font-bold text-sm text-orange-600 hover:underline">{t.contactPage.email}</a></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-xl">
          <h3 className="text-xl font-bold text-[#0A1128] mb-5">{t.contactPage.formTitle}</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder={t.contactPage.name} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition" required />
            <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={t.contactPage.email} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition" />
            <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={t.contactPage.phoneLabel} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition" required />
            <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white transition">
              <option value="">{t.contactPage.course}</option>
              {ALL_LANGUAGES.map((item, idx) => <option key={idx} value={item.name}>{item.flag} {item.name}</option>)}
            </select>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white transition">
              <option value="">{t.contactPage.model}</option>
              {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
            </select>
            <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={t.contactPage.message} rows={3} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition resize-none"></textarea>
            <button type="submit" disabled={submitting} className="w-full bg-[#0A1128] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg text-sm disabled:opacity-50">{submitting ? "Sending..." : t.contactPage.btn}</button>
          </form>
        </div>

        <div className="bg-[#0A1128] text-white p-6 md:p-8 rounded-3xl shadow-xl flex flex-col justify-center">
          <h3 className="text-xl font-bold text-amber-400 mb-2">{t.contactPage.educatorTitle}</h3>
          <p className="text-sm text-slate-300 mb-4">{t.contactPage.educatorDesc}</p>
          <ul className="space-y-1 text-xs text-slate-300 mb-6">
            {t.contactPage.educatorBenefits.map((b, i) => <li key={i} className="flex items-start gap-2">✓ {b}</li>)}
          </ul>
          <form onSubmit={handleEducatorSubmit} className="space-y-3">
            <input type="text" value={educatorForm.name} onChange={(e) => setEducatorForm({ ...educatorForm, name: e.target.value })} placeholder={t.contactPage.applyName} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-white placeholder-slate-500 transition" required />
            <input type="email" value={educatorForm.email} onChange={(e) => setEducatorForm({ ...educatorForm, email: e.target.value })} placeholder={t.contactPage.applyEmail} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-white placeholder-slate-500 transition" required />
            <input type="tel" value={educatorForm.phone} onChange={(e) => setEducatorForm({ ...educatorForm, phone: e.target.value })} placeholder={t.contactPage.applyPhone} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-white placeholder-slate-500 transition" required />
            <input type="text" value={educatorForm.language} onChange={(e) => setEducatorForm({ ...educatorForm, language: e.target.value })} placeholder={t.contactPage.applyLanguage} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-white placeholder-slate-500 transition" />
            <input type="text" value={educatorForm.experience} onChange={(e) => setEducatorForm({ ...educatorForm, experience: e.target.value })} placeholder={t.contactPage.applyExperience} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-white placeholder-slate-500 transition" />
            <input type="text" value={educatorForm.cert} onChange={(e) => setEducatorForm({ ...educatorForm, cert: e.target.value })} placeholder={t.contactPage.applyCert} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-white placeholder-slate-500 transition" />
            <input type="text" value={educatorForm.location} onChange={(e) => setEducatorForm({ ...educatorForm, location: e.target.value })} placeholder={t.contactPage.applyLocation} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-white placeholder-slate-500 transition" />
            <input type="text" value={educatorForm.hours} onChange={(e) => setEducatorForm({ ...educatorForm, hours: e.target.value })} placeholder={t.contactPage.applyHours} className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm text-white placeholder-slate-500 transition" />
            <button type="submit" disabled={submitting} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition text-sm disabled:opacity-50">{submitting ? "Sending..." : t.contactPage.applyBtn}</button>
          </form>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-8 justify-center">
        {SOCIAL_LINKS.map((social, i) => (
          <a key={i} href={social.url} target="_blank" rel="noreferrer" className={`${social.color} ${social.hover} text-white px-5 py-2.5 rounded-full text-sm font-bold transition flex items-center gap-2 shadow-md`}>
            <span className="text-lg">{social.icon}</span> {social.name}
          </a>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ t, handleSelectLanguage, ALL_LANGUAGES, SOCIAL_LINKS }) {
  return (
    <footer className="bg-[#0A1128] text-white pt-12 pb-6 px-4 md:px-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 pb-8 border-b border-slate-800 text-xs">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t.footer.courses}</h4>
          <ul className="space-y-1 text-slate-400">
            {ALL_LANGUAGES.slice(0, 6).map((l, i) => (
              <li key={i}><button onClick={() => handleSelectLanguage(l.name)} className="hover:text-orange-400 transition">{l.flag} {l.name}</button></li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t.footer.contacts}</h4>
          <div className="space-y-1 text-slate-400">
            <p className="font-semibold text-amber-400">{t.brand} HQ</p>
            <p className="font-bold text-white text-sm">📞 +996 553 720 108</p>
            <p className="text-green-400 font-bold flex items-center gap-1">💬 <a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a></p>
            <p className="flex items-center gap-1">✉️ <a href="mailto:islamrasmiy@gmail.com" className="hover:text-orange-400 transition">islamrasmiy@gmail.com</a></p>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t.footer.subscribe}</h4>
          <p className="text-slate-400">Get news & updates</p>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <input type="email" placeholder="Your email..." className="bg-transparent px-3 py-2 text-xs text-white focus:outline-none w-full" />
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2 font-bold transition">→</button>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t.footer.socials}</h4>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noreferrer" className={`${social.color} hover:opacity-80 text-white px-3 py-1.5 rounded-full text-[10px] font-bold transition flex items-center gap-1`}>
                {social.icon} {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-4 text-center text-slate-500 text-[11px]">{t.footer.copyright}</div>
    </footer>
  );
}