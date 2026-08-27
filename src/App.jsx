import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

// --- BARCHA TILLAR VA BAYROQLAR (TO'LIQ RO'YXAT) ---
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
  { code: 'bn', name: 'Bengali', native: 'বাংলা', flag: '🇧🇩', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', native: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { code: 'id', name: 'Indonesian', native: 'Bahasa Indonesia', flag: '🇮🇩', dir: 'ltr' },
  { code: 'ms', name: 'Malay', native: 'Bahasa Melayu', flag: '🇲🇾', dir: 'ltr' },
  { code: 'th', name: 'Thai', native: 'ไทย', flag: '🇹🇭', dir: 'ltr' },
  { code: 'vi', name: 'Vietnamese', native: 'Tiếng Việt', flag: '🇻🇳', dir: 'ltr' },
  { code: 'pl', name: 'Polish', native: 'Polski', flag: '🇵🇱', dir: 'ltr' },
  { code: 'uk', name: 'Ukrainian', native: 'Українська', flag: '🇺🇦', dir: 'ltr' },
  { code: 'nl', name: 'Dutch', native: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'el', name: 'Greek', native: 'Ελληνικά', flag: '🇬🇷', dir: 'ltr' },
  { code: 'cs', name: 'Czech', native: 'Čeština', flag: '🇨🇿', dir: 'ltr' },
  { code: 'sv', name: 'Swedish', native: 'Svenska', flag: '🇸🇪', dir: 'ltr' },
  { code: 'no', name: 'Norwegian', native: 'Norsk', flag: '🇳🇴', dir: 'ltr' },
  { code: 'fi', name: 'Finnish', native: 'Suomi', flag: '🇫🇮', dir: 'ltr' },
  { code: 'da', name: 'Danish', native: 'Dansk', flag: '🇩🇰', dir: 'ltr' },
  { code: 'ro', name: 'Romanian', native: 'Română', flag: '🇷🇴', dir: 'ltr' },
  { code: 'hu', name: 'Hungarian', native: 'Magyar', flag: '🇭🇺', dir: 'ltr' },
  { code: 'sk', name: 'Slovak', native: 'Slovenčina', flag: '🇸🇰', dir: 'ltr' },
  { code: 'bg', name: 'Bulgarian', native: 'Български', flag: '🇧🇬', dir: 'ltr' },
  { code: 'sr', name: 'Serbian', native: 'Српски', flag: '🇷🇸', dir: 'ltr' },
  { code: 'hr', name: 'Croatian', native: 'Hrvatski', flag: '🇭🇷', dir: 'ltr' },
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

// --- TARJIMALAR (faqat asosiy tillar uchun) ---
const translations = {
  ar: {
    topContact: "تواصل معنا عبر الواتساب",
    nav: { home: "الرئيسية", about: "من نحن", services: "الخدمات", courses: "اللغات والدورات", articles: "المقالات", contact: "تواصل معنا" },
    hero: {
      title1: "تعلم اللغات",
      title2: "عيش حياة أفضل",
      title3: "تحدث بثقة",
      desc: "Lingo هي أكاديمية لغات عالمية تقدم تعليماً مهيكلاً مع فهم ثقافي عميق للطلاب في جميع أنحاء العالم.",
      btnStart: "ابدأ اليوم ←",
      btnExplore: "استكشف اللغات"
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
    langPageTitle: "اختر لغة لإتقانها",
    langPageSub: "اختر من مجموعة واسعة من برامجنا اللغوية المنظمة عبر الإنترنت",
    contactPage: { title: "ابدأ رحلتك اللغوية معنا", formTitle: "أرسل لنا رسالة", name: "الاسم الكامل", email: "البريد الإلكتروني", phone: "الهاتف / واتساب", course: "اللغة المطلوبة", btn: "تواصل معنا ←" }
  },
  uz: {
    topContact: "WhatsApp orqali bog'lanish",
    nav: { home: "Bosh sahifa", about: "Biz haqida", services: "Xizmatlar", courses: "Tillar va kurslar", articles: "Maqolalar", contact: "Bog'lanish" },
    hero: {
      title1: "Til O'rganing",
      title2: "Yaxshiroq Yashang",
      title3: "Ishonch bilan Gapiring",
      desc: "Lingo — butun dunyo bo'ylab talabalar uchun yuqori sifatli til o'rgatish va akademik bilim beruvchi xalqaro platforma.",
      btnStart: "Bugun Boshlang ←",
      btnExplore: "Tillarni Tanlash"
    },
    offers: {
      tag: "Bizning Takliflar",
      title: "Til O'rganish Bilan Dunyoni Oching",
      list: [
        { title: "Jonli Onlayn Darslar", desc: "Istalgan joydan turib moslashuvchan formatda ta'lim oling." },
        { title: "O'zingizga Mos Vaqt", desc: "Jadvalni va o'rganish sur'atini o'zingiz belgilang." },
        { title: "Yakkama-yakka Darslar", desc: "Sizning darajangiz va maqsadingizga moslashtirilgan darslar." },
        { title: "Imtihonlarga Tayyorgarlik", desc: "Xalqaro sertifikat imtihonlariga maxsus tayyorgarlik." }
      ]
    },
    langPageTitle: "O'rganmoqchi bo'lgan tilingizni tanlang",
    langPageSub: "Lingo akademiyasida mavjud barcha tillar ro'yxati",
    contactPage: { title: "Lingo Bilan Til Sayohatini Boshlang", formTitle: "Xabar Qoldiring", name: "To'liq Ismingiz", email: "Email Pochtangiz", phone: "Telefon / WhatsApp", course: "Qaysi Tilni O'rganmoqchisiz?", btn: "Arizani Yuborish ←" }
  },
  en: {
    topContact: "Contact via WhatsApp",
    nav: { home: "Home", about: "About Us", services: "Services", courses: "Languages & Courses", articles: "Articles", contact: "Contact Us" },
    hero: {
      title1: "Learn Languages",
      title2: "Live Better",
      title3: "Speak Confidently",
      desc: "Lingo is a multilingual language academy offering structured learning with cultural understanding for students worldwide.",
      btnStart: "Start Today ←",
      btnExplore: "Explore Languages"
    },
    offers: {
      tag: "What We Offer",
      title: "Unlock the World with Language Learning",
      list: [
        { title: "Live Online Courses", desc: "Study anywhere with our flexible online learning models." },
        { title: "Learn on Your Time", desc: "Set your own pace and schedule to fit your lifestyle." },
        { title: "One-to-One Courses", desc: "Personalised sessions tailored to your level, goals, and pace." },
        { title: "Exam Preparation", desc: "Focused programs designed to help students understand exam formats." }
      ]
    },
    langPageTitle: "Select a Language to Master",
    langPageSub: "Choose from our wide range of structured online language programs",
    contactPage: { title: "Start Your Language Journey With Us", formTitle: "Drop Us a Line", name: "Full Name", email: "Email Address", phone: "Phone / WhatsApp", course: "Language of Interest", btn: "Get in Touch ←" }
  },
  ru: {
    topContact: "Свяжитесь через WhatsApp",
    nav: { home: "Главная", about: "О нас", services: "Услуги", courses: "Языки и курсы", articles: "Статьи", contact: "Контакты" },
    hero: {
      title1: "Изучайте языки",
      title2: "Живите лучше",
      title3: "Говорите уверенно",
      desc: "Lingo — это международная языковая академия, предлагающая структурированное обучение с культурным пониманием для студентов по всему миру.",
      btnStart: "Начните сегодня ←",
      btnExplore: "Изучить языки"
    },
    offers: {
      tag: "Что мы предлагаем",
      title: "Откройте мир через изучение языков",
      list: [
        { title: "Онлайн-курсы в реальном времени", desc: "Занимайтесь где угодно с нашими гибкими онлайн-моделями." },
        { title: "Учитесь в своём ритме", desc: "Устанавливайте свой темп и график." },
        { title: "Индивидуальные курсы", desc: "Персонализированные занятия под ваш уровень и цели." },
        { title: "Подготовка к экзаменам", desc: "Специализированные программы для понимания форматов экзаменов." }
      ]
    },
    langPageTitle: "Выберите язык для изучения",
    langPageSub: "Выберите из широкого спектра наших структурированных онлайн-программ",
    contactPage: { title: "Начните своё языковое путешествие с нами", formTitle: "Напишите нам", name: "Полное имя", email: "Электронная почта", phone: "Телефон / WhatsApp", course: "Интересующий язык", btn: "Связаться ←" }
  }
};

// ============================================================
// ADMIN PANEL (TAKOMILLASHTIRILGAN)
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-amber-500">Lingo Admin Panel</h1>
            <p className="text-xs text-slate-400">Real-Time Firebase Submissions</p>
          </div>
          <button onClick={onBack} className="mt-3 md:mt-0 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-700 transition">
            ← Saytga qaytish
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <p className="text-xs text-slate-400">Jami</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-red-500/30">
            <p className="text-xs text-slate-400">Yangi</p>
            <p className="text-2xl font-bold text-red-400">{stats.new}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-yellow-500/30">
            <p className="text-xs text-slate-400">Bog'lanildi</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.contacted}</p>
          </div>
          <div className="bg-slate-800 rounded-xl p-4 border border-green-500/30">
            <p className="text-xs text-slate-400">Qabul qilindi</p>
            <p className="text-2xl font-bold text-green-400">{stats.accepted}</p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="flex flex-col md:flex-row gap-4 my-4">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">Barcha statuslar</option>
            <option value="Yangi">Yangi</option>
            <option value="Bog'lanildi">Bog'lanildi</option>
            <option value="Qabul qilindi">Qabul qilindi</option>
          </select>
          <input 
            type="text" 
            placeholder="Qidirish (ism, telefon, kurs)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Yuklanmoqda...</div>
          ) : filteredData.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Hech qanday ariza topilmadi</div>
          ) : (
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Ism</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Telefon</th>
                  <th className="p-4">Kurs</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Amal</th>
                </tr>
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
                      <select 
                        value={item.status || 'Yangi'} 
                        onChange={(e) => handleStatusChange(item.id, e.target.value)} 
                        className={`bg-slate-900 border rounded px-2 py-1 text-xs text-white focus:outline-none ${
                          item.status === 'Yangi' ? 'border-red-500/50' :
                          item.status === "Bog'lanildi" ? 'border-yellow-500/50' :
                          'border-green-500/50'
                        }`}
                      >
                        <option value="Yangi">🔴 Yangi</option>
                        <option value="Bog'lanildi">🟡 Bog'lanildi</option>
                        <option value="Qabul qilindi">🟢 Qabul qilindi</option>
                      </select>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-red-400 text-xs bg-red-500/10 px-3 py-1 rounded border border-red-500/20 hover:bg-red-500/20 transition"
                      >
                        O'chirish
                      </button>
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
// MAIN APPLICATION
// ============================================================
export default function App() {
  const [lang, setLang] = useState('en');
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedCourse, setSelectedCourse] = useState('Arabic');
  const [submitting, setSubmitting] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[lang] || translations.en;

  // POPUP BANNER
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromoModal(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // SLIDER
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
    if (!formData.name || !formData.phone) return alert("Iltimos, ism va telefon raqamingizni kiriting!");

    setSubmitting(true);
    try {
      await addDoc(collection(db, "arizalar"), {
        ism: formData.name,
        email: formData.email,
        telefon: formData.phone,
        kurs: selectedCourse,
        status: 'Yangi',
        sana: serverTimestamp()
      });
      alert("✅ Arizangiz muvaffaqiyatli qabul qilindi!");
      setFormData({ name: '', email: '', phone: '' });
    } catch (err) {
      alert("❌ Xatolik: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (currentPage === 'admin') return <AdminPanel onBack={() => setCurrentPage('home')} />;

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#1E293B] font-sans antialiased relative">

      {/* ===== PROMO MODAL ===== */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl flex flex-col md:flex-row items-center gap-6">
            <button 
              onClick={() => setShowPromoModal(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center transition hover:bg-slate-200"
            >
              ×
            </button>
            <div className="w-full md:w-1/2 h-56 md:h-64 rounded-2xl overflow-hidden bg-slate-100 border">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800" 
                alt="Lingo Offer" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Exclusive Launch Offer
              </span>
              <h3 className="text-xl font-extrabold text-[#0A1128] leading-tight">Get 50% OFF your first month</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Start your language journey with Lingo Academy today.</p>
              <button 
                onClick={() => { setShowPromoModal(false); setCurrentPage('contact'); }} 
                className="w-full bg-[#0A1128] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-sm shadow-md"
              >
                Book Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOP HEADER ===== */}
      <header className="bg-[#FFF0E5] text-slate-700 text-xs py-2 px-4 md:px-8 flex flex-wrap justify-between items-center border-b border-orange-100 gap-2">
        <div className="flex flex-wrap items-center gap-3 md:gap-6 font-medium">
          <a href="mailto:islamrasmiy@gmail.com" className="hover:text-orange-600 transition flex items-center gap-1">
            ✉️ <span className="hidden sm:inline">islamrasmiy@gmail.com</span>
          </a>
          <a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="hover:text-green-600 transition flex items-center gap-1 font-bold text-green-700">
            💬 <span className="hidden sm:inline">+996 553 720 108</span>
          </a>
        </div>
        <button onClick={() => setCurrentPage('admin')} className="text-slate-500 hover:text-orange-600 font-semibold text-xs transition">
          🔑 Admin
        </button>
      </header>

      {/* ===== NAVBAR ===== */}
      <nav className="bg-[#0A1128] text-white py-3 px-4 md:px-8 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <span className="text-2xl font-black tracking-widest text-white">Lingo</span>
          <span className="text-orange-500 font-bold text-2xl">.</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          {['home', 'courses', 'contact'].map((page) => (
            <button 
              key={page}
              onClick={() => setCurrentPage(page)} 
              className={`hover:text-orange-400 transition ${currentPage === page ? 'text-orange-400 font-bold' : ''}`}
            >
              {page === 'home' ? t.nav.home : page === 'courses' ? t.nav.courses : t.nav.contact}
            </button>
          ))}
          <a href="#services" onClick={() => setCurrentPage('home')} className="hover:text-orange-400 transition">{t.nav.services}</a>
          <a href="#about" onClick={() => setCurrentPage('home')} className="hover:text-orange-400 transition">{t.nav.about}</a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 shadow-inner">
            {['en', 'uz', 'ar', 'ru'].map((code) => {
              const item = ALL_LANGUAGES.find(l => l.code === code);
              return item ? (
                <button 
                  key={code} 
                  onClick={() => setLang(code)} 
                  className={`px-2 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                    lang === code ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{item.flag}</span>
                  <span className="hidden sm:inline">{code.toUpperCase()}</span>
                </button>
              ) : null;
            })}
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-white text-xl p-1"
          >
            ☰
          </button>

          <button 
            onClick={() => setCurrentPage('contact')} 
            className="hidden md:block bg-[#E07A5F] hover:bg-[#d0694e] text-white font-bold px-5 py-2 rounded-full text-xs transition shadow-md"
          >
            {t.nav.contact}
          </button>
        </div>
      </nav>

      {/* ===== MOBILE MENU ===== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A1128] border-t border-slate-800 p-4 space-y-3 text-sm font-semibold">
          {['home', 'courses', 'contact'].map((page) => (
            <button 
              key={page}
              onClick={() => { setCurrentPage(page); setMobileMenuOpen(false); }} 
              className={`block w-full text-left hover:text-orange-400 transition ${currentPage === page ? 'text-orange-400' : 'text-slate-300'}`}
            >
              {page === 'home' ? t.nav.home : page === 'courses' ? t.nav.courses : t.nav.contact}
            </button>
          ))}
          <a href="#services" onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block text-slate-300 hover:text-orange-400">Services</a>
          <a href="#about" onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block text-slate-300 hover:text-orange-400">About</a>
        </div>
      )}

      {/* ===== PAGE ROUTING ===== */}
      {currentPage === 'courses' ? (
        <CoursesPage t={t} handleSelectLanguage={handleSelectLanguage} />
      ) : currentPage === 'contact' ? (
        <ContactPage 
          t={t} 
          formData={formData} 
          setFormData={setFormData} 
          selectedCourse={selectedCourse} 
          setSelectedCourse={setSelectedCourse} 
          submitting={submitting} 
          handleFormSubmit={handleFormSubmit} 
        />
      ) : (
        <HomePage t={t} slide={slide} handleSelectLanguage={handleSelectLanguage} />
      )}

      {/* ===== FOOTER ===== */}
      <Footer t={t} handleSelectLanguage={handleSelectLanguage} />
    </div>
  );
}

// ============================================================
// HOME PAGE COMPONENT
// ============================================================
function HomePage({ t, slide, handleSelectLanguage }) {
  return (
    <>
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="md:w-1/2 space-y-5">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#0A1128]">
            {t.hero.title1} <br />
            <span className="text-[#E07A5F]">{t.hero.title2}</span> <br />
            {t.hero.title3}
          </h1>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-lg">
            {t.hero.desc}
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button 
              onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} 
              className="bg-[#0A1128] hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg text-sm"
            >
              {t.hero.btnStart}
            </button>
            <button 
              onClick={() => { window.location.hash = 'courses'; }} 
              className="border border-slate-300 hover:bg-slate-100 text-[#0A1128] font-semibold px-6 py-3 rounded-full transition text-sm"
            >
              {t.hero.btnExplore}
            </button>
          </div>

          {/* Language slider */}
          <div className="pt-6">
            <div className="flex justify-between items-center mb-3">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Explore Languages</p>
              <div className="flex gap-2">
                <button onClick={() => slide('hero-slider', -1)} className="w-7 h-7 rounded-full bg-slate-200 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition">◀</button>
                <button onClick={() => slide('hero-slider', 1)} className="w-7 h-7 rounded-full bg-slate-200 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition">▶</button>
              </div>
            </div>
            <div id="hero-slider" className="flex gap-3 overflow-x-auto scroll-smooth no-scrollbar py-2">
              {ALL_LANGUAGES.slice(0, 30).map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelectLanguage(item.name)}
                  className="flex-none flex items-center gap-2 bg-[#FFF0E5] border border-orange-200 px-4 py-2 rounded-full shadow-sm text-xs font-bold text-slate-800 hover:scale-105 transition cursor-pointer"
                >
                  <span className="text-base">{item.flag}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center w-full">
          <div className="relative w-full max-w-md h-[350px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800" 
              alt="Lingo Academy Students" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* SERVICES */}
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
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm mb-4">
                    0{index + 1}
                  </div>
                  <h3 className="font-bold text-[#0A1128] text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
                <button 
                  onClick={() => document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' })} 
                  className="mt-6 w-8 h-8 rounded-full bg-[#0A1128] text-white flex items-center justify-center font-bold text-xs hover:bg-orange-500 transition"
                >
                  →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Infinite Marquee */}
      <section className="py-6 bg-[#0A1128] text-white overflow-hidden border-y border-slate-800">
        <div className="flex animate-marquee gap-6">
          {[...ALL_LANGUAGES, ...ALL_LANGUAGES, ...ALL_LANGUAGES].map((item, idx) => (
            <div 
              key={idx} 
              onClick={() => handleSelectLanguage(item.name)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-2 rounded-full shadow-sm text-xs font-semibold text-slate-200 whitespace-nowrap hover:border-amber-500 cursor-pointer transition"
            >
              <span className="text-lg">{item.flag}</span>
              <span className="font-bold text-white">{item.name}</span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">({item.native})</span>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-[#0A1128] text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4 text-xs">
          {[
            { q: "Are your classes online or in person?", a: "All our courses are 100% online, allowing you to learn from anywhere with flexible scheduling." },
            { q: "Who are the instructors?", a: "We begin with instructors who speak your native language, then transition to native speakers for advanced levels." },
            { q: "How long does it take to learn a language?", a: "It depends on your current level and chosen program intensity. On average, students achieve conversational fluency in 3 to 6 months." },
            { q: "Do you offer certificates?", a: "Yes, we provide certificates of completion for all our courses." },
          ].map((faq, i) => (
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
// COURSES PAGE
// ============================================================
function CoursesPage({ t, handleSelectLanguage }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fadeIn">
      <div className="text-center mb-10">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Lingo Academic Catalog</span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A1128] mt-2 mb-3">{t.langPageTitle}</h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm">{t.langPageSub}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {ALL_LANGUAGES.map((item, idx) => (
          <div 
            key={idx} 
            onClick={() => handleSelectLanguage(item.name)}
            className="bg-white border border-slate-200 hover:border-orange-500 rounded-2xl p-4 md:p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1 group"
          >
            <span className="text-4xl md:text-5xl mb-3 transform group-hover:scale-110 transition duration-200">{item.flag}</span>
            <h3 className="font-bold text-sm md:text-base text-[#0A1128]">{item.name}</h3>
            <span className="text-[10px] text-slate-400 mt-1">{item.native}</span>
            <button className="mt-3 bg-[#FFF0E5] text-orange-600 group-hover:bg-orange-600 group-hover:text-white text-xs font-bold px-3 py-1.5 rounded-full transition">
              Enroll →
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// CONTACT PAGE
// ============================================================
function ContactPage({ t, formData, setFormData, selectedCourse, setSelectedCourse, submitting, handleFormSubmit }) {
  return (
    <section id="contact-section" className="max-w-6xl mx-auto px-4 md:px-8 py-12 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A1128] mb-3">{t.contactPage.title}</h1>
        <p className="text-slate-600 max-w-xl mx-auto text-sm">Get in touch to discuss your learning goals or fill out the request form.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 md:p-10 rounded-3xl border border-slate-200 shadow-xl">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-[#0A1128] mb-3">Lingo Languages Institute</h3>
            <p className="text-xs text-slate-500 leading-relaxed">International language academy offering structured learning with cultural understanding.</p>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">✉️</span>
              <div>
                <p className="text-xs text-slate-400">Official Email</p>
                <a href="mailto:islamrasmiy@gmail.com" className="font-bold text-[#0A1128] hover:text-orange-600">islamrasmiy@gmail.com</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">💬</span>
              <div>
                <p className="text-xs text-slate-400">WhatsApp Direct</p>
                <a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="font-bold text-green-700 hover:underline">+996 553 720 108</a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[#0A1128] mb-5">{t.contactPage.formTitle}</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.contactPage.name}</label>
              <input 
                type="text" 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="Your full name" 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.contactPage.email}</label>
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                placeholder="your@email.com" 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition" 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.contactPage.phone}</label>
              <input 
                type="tel" 
                value={formData.phone} 
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                placeholder="+996 553 720 108" 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm transition" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.contactPage.course}</label>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)} 
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white transition"
              >
                {ALL_LANGUAGES.map((item, idx) => (
                  <option key={idx} value={item.name}>{item.flag} {item.name}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              disabled={submitting} 
              className="w-full bg-[#0A1128] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg text-sm mt-2 disabled:opacity-50"
            >
              {submitting ? "Yuborilmoqda..." : t.contactPage.btn}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

// ============================================================
// FOOTER
// ============================================================
function Footer({ t, handleSelectLanguage }) {
  return (
    <footer className="bg-[#0A1128] text-white pt-12 pb-6 px-4 md:px-8 border-t border-slate-800">
      <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 pb-8 border-b border-slate-800 text-xs">
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Languages</h4>
          <ul className="space-y-1 text-slate-400">
            {ALL_LANGUAGES.slice(0, 6).map((l, i) => (
              <li key={i}>
                <button onClick={() => handleSelectLanguage(l.name)} className="hover:text-orange-400 transition">
                  {l.flag} {l.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Contacts</h4>
          <div className="space-y-1 text-slate-400">
            <p className="font-semibold text-amber-400">Lingo Academy HQ</p>
            <p className="font-bold text-white text-sm">📞 +996 553 720 108</p>
            <p className="text-green-400 font-bold">
              💬 <a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="hover:underline">WhatsApp</a>
            </p>
            <p>✉️ islamrasmiy@gmail.com</p>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Subscribe</h4>
          <p className="text-slate-400">Newsletter for updates</p>
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
            <input type="email" placeholder="Your email..." className="bg-transparent px-3 py-2 text-xs text-white focus:outline-none w-full" />
            <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2 font-bold transition">→</button>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-bold text-white text-sm uppercase tracking-wider">Social</h4>
          <div className="flex gap-3 text-slate-400">
            {['f', 'X', 'ig', 'in'].map((s, i) => (
              <span key={i} className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-orange-400 cursor-pointer transition">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto pt-4 text-center text-slate-500 text-[11px]">
        Copyright © {new Date().getFullYear()} Lingo Languages Institute. All Rights Reserved.
      </div>
    </footer>
  );
}