import React, { useState, useEffect } from 'react';
import { db } from "./firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

// --- TILLAR VA BAYROQLAR RO'YXATI ---
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
  { code: 'ko', name: 'Korean', native: '한국어', flag: '🇰🇷', dir: 'ltr' }
];

// --- TARJIMALAR ---
const translations = {
  ar: {
    topContact: "تواصل معنا عبر الواتساب",
    nav: { home: "الرئيسية", about: "من نحن", services: "الخدمات", courses: "اللغات والأنماط", articles: "المقالات", contact: "تواصل معنا" },
    hero: {
      title1: "Learn Languages",
      title2: "Live Better",
      title3: "Speak Confidently",
      desc: "Lingo هي أكاديمية لغات عالمية تقدم تعليماً مهيكلاً مع فهم ثقافي عميق للطلاب في جميع أنحاء العالم.",
      btnStart: "Start Today →",
      btnExplore: "Explore Languages"
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
    langPageTitle: "Select a Language to Master",
    langPageSub: "Choose from our wide range of structured online language programs",
    contactPage: { title: "Start Your Language Journey With Us", formTitle: "Drop Us a Line", name: "Full Name", email: "Email Address", phone: "Phone / WhatsApp", course: "Language of Interest", btn: "Get in Touch →" }
  },
  uz: {
    topContact: "WhatsApp orqali bog'lanish",
    nav: { home: "Bosh sahifa", about: "Biz haqida", services: "Xizmatlar", courses: "Tillarni Tanlash", articles: "Maqolalar", contact: "Bog'lanish" },
    hero: {
      title1: "Learn Languages",
      title2: "Live Better",
      title3: "Speak Confidently",
      desc: "Lingo — bu butun dunyo bo'ylab talabalar uchun yuqori sifatli til o'rgatish va akademik bilim beruvchi xalqaro platforma.",
      btnStart: "Bugun Boshlang →",
      btnExplore: "Tillarni Tanlash"
    },
    offers: {
      tag: "Bizning Takliflar",
      title: "Til O'rganish Bilan Dunyoni Oching",
      list: [
        { title: "Jonli Onlayn Darslar", desc: "Istalgan joydan turib moslashuvchan formatda ta'lim oling." },
        { title: "O'zingizga Mos Vaqt", desc: "Jadvalni va o'rganish sur'atini o'zingiz belgilang." },
        { title: "Yakkama-yakka Darslar (1-on-1)", desc: "Sizning darajangiz va maqsadingizga moslashtirilgan darslar." },
        { title: "Imtihonlarga Tayyorgarlik", desc: "Xalqaro sertifikat imtihonlariga maxsus tayyorgarlik." }
      ]
    },
    langPageTitle: "O'rganmoqchi bo'lgan tilingizni tanlang",
    langPageSub: "Lingo akademiyasida mavjud barcha tillar ro'yxati",
    contactPage: { title: "Lingo Bilan Til Sayohatini Boshlang", formTitle: "Xabar Qoldiring", name: "To'liq Ismingiz", email: "Email Pochtangiz", phone: "Telefon / WhatsApp", course: "Qaysi Tilni O'rganmoqchisiz?", btn: "Arizani Yuborish →" }
  },
  en: {
    topContact: "Contact via WhatsApp",
    nav: { home: "Home", about: "About Us", services: "Services", courses: "Courses", articles: "Articles", contact: "Contact Us" },
    hero: {
      title1: "Learn Languages",
      title2: "Live Better",
      title3: "Speak Confidently",
      desc: "Lingo is a multilingual language academy offering structured learning with cultural understanding for students worldwide.",
      btnStart: "Start Today →",
      btnExplore: "Explore Languages"
    },
    offers: {
      tag: "What We Offer",
      title: "Unlock the World with Language Learning",
      list: [
        { title: "Live online courses", desc: "Study anywhere with our flexible online learning models." },
        { title: "Learn on Your Time", desc: "Set your own pace and schedule to fit your lifestyle." },
        { title: "One-to-one courses", desc: "Personalised sessions tailored to your level, goals, and pace." },
        { title: "Exam Preparation", desc: "Focused programs designed to help students understand exam formats." }
      ]
    },
    langPageTitle: "Select a Language to Master",
    langPageSub: "Choose from our wide range of structured online language programs",
    contactPage: { title: "Start Your Language Journey With Us", formTitle: "Drop Us a Line", name: "Full Name", email: "Email Address", phone: "Phone / WhatsApp", course: "Language of Interest", btn: "Get in Touch →" }
  }
};

// --- ADMIN PANEL ---
function AdminPanel({ onBack }) {
  const [arizalar, setArizalar] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-amber-500">Lingo Admin Control Panel</h1>
          <p className="text-xs text-slate-400">Real-Time Firebase Submissions</p>
        </div>
        <button onClick={onBack} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-sm border border-slate-700">
          ← Saytga qaytish
        </button>
      </div>

      <div className="max-w-7xl mx-auto my-6 overflow-x-auto bg-slate-800 rounded-xl border border-slate-700">
        {loading ? <div className="p-8 text-center text-slate-400">Yuklanmoqda...</div> : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-4">Ism</th>
                <th className="p-4">Email</th>
                <th className="p-4">Telefon</th>
                <th className="p-4">Tanlangan Kurs</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Amal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {arizalar.map((item) => (
                <tr key={item.id} className="hover:bg-slate-700/30">
                  <td className="p-4 font-semibold text-white">{item.ism}</td>
                  <td className="p-4 text-slate-400">{item.email || '—'}</td>
                  <td className="p-4 text-amber-400 font-mono">{item.telefon}</td>
                  <td className="p-4">{item.kurs}</td>
                  <td className="p-4">
                    <select value={item.status || 'Yangi'} onChange={(e) => handleStatusChange(item.id, e.target.value)} className="bg-slate-900 border border-slate-600 text-xs rounded px-2 py-1 text-white">
                      <option value="Yangi">🔴 Yangi</option>
                      <option value="Bog'lanildi">🟡 Bog'lanildi</option>
                      <option value="Qabul qilindi">🟢 Qabul qilindi</option>
                    </select>
                  </td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-red-400 text-xs bg-red-500/10 px-3 py-1 rounded border border-red-500/20 hover:bg-red-500/20">O'chirish</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --- MAIN APPLICATION ---
export default function App() {
  const [lang, setLang] = useState('en');
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'courses', 'contact', 'admin'
  const [selectedCourse, setSelectedCourse] = useState('Arabic');
  const [submitting, setSubmitting] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const t = translations[lang] || translations.en;

  // POPUP BANNER TIMER (VIDEODAGI KABI OFFERS MODAL)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPromoModal(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // SLIDER CONTROLS (CHAPGA / O'NGGA SURISH)
  const slideLeft = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollLeft -= 300;
  };

  const slideRight = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollLeft += 300;
  };

  const handleSelectLanguage = (langName) => {
    setSelectedCourse(langName);
    setCurrentPage('contact');
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
      alert("Arizangiz Lingo bazasiga muvaffaqiyatli qabul qilindi!");
      setFormData({ name: '', email: '', phone: '' });
    } catch (err) {
      alert("Xatolik: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (currentPage === 'admin') return <AdminPanel onBack={() => setCurrentPage('home')} />;

  return (
    <div className="min-h-screen bg-[#FFFBF7] text-[#1E293B] font-sans antialiased relative">

      {/* POPUP PROMO MODAL (VIDEODAGI 50% OFF OFFER BANNER) */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 relative shadow-2xl flex flex-col md:flex-row items-center gap-6 animate-fadeIn">
            <button onClick={() => setShowPromoModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-xl font-bold bg-slate-100 w-8 h-8 rounded-full flex items-center justify-center">×</button>
            <div className="w-full md:w-1/2 h-56 md:h-64 rounded-2xl overflow-hidden bg-slate-100 border">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800" alt="Lingo Offer" className="w-full h-full object-cover" />
            </div>
            <div className="w-full md:w-1/2 space-y-3">
              <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full uppercase tracking-wider">Exclusive Launch Offer</span>
              <h3 className="text-xl font-extrabold text-[#0A1128] leading-tight">Get 50% OFF your monthly subscription</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Be among the first to start your language journey with Lingo Academy Institute.</p>
              <button onClick={() => { setShowPromoModal(false); setCurrentPage('contact'); }} className="w-full bg-[#0A1128] hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition text-xs shadow-md">
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER / CONTACT BAR */}
      <header className="bg-[#FFF0E5] text-slate-700 text-xs py-2 px-6 md:px-12 flex justify-between items-center border-b border-orange-100">
        <div className="flex items-center space-x-6 font-medium">
          <a href="mailto:islamrasmiy@gmail.com" className="hover:text-orange-600 transition flex items-center space-x-1">
            <span>✉️</span> <span>islamrasmiy@gmail.com</span>
          </a>
          <a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="hover:text-green-600 transition flex items-center space-x-1 font-bold text-green-700">
            <span>💬</span> <span>+996 553 720 108 (WhatsApp Direct)</span>
          </a>
        </div>

        <button onClick={() => setCurrentPage('admin')} className="text-slate-500 hover:text-orange-600 font-semibold text-xs transition">
          🔑 Admin
        </button>
      </header>

      {/* NAVBAR WITH LINGO LOGO */}
      <nav className="bg-[#0A1128] text-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <span className="text-2xl font-black tracking-widest text-white">Lingo</span>
          <span className="text-orange-500 font-bold text-2xl">.</span>
        </div>

        {/* MENU LINKS */}
        <div className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <button onClick={() => setCurrentPage('home')} className={`hover:text-orange-400 transition ${currentPage === 'home' ? 'text-orange-400 font-bold' : ''}`}>{t.nav.home}</button>
          <a href="#about" onClick={() => setCurrentPage('home')} className="hover:text-orange-400 transition">{t.nav.about}</a>
          <a href="#services" onClick={() => setCurrentPage('home')} className="hover:text-orange-400 transition">{t.nav.services}</a>
          <button onClick={() => setCurrentPage('courses')} className={`hover:text-orange-400 transition ${currentPage === 'courses' ? 'text-orange-400 font-bold' : ''}`}>{t.nav.courses}</button>
          <button onClick={() => setCurrentPage('contact')} className={`hover:text-orange-400 transition ${currentPage === 'contact' ? 'text-orange-400 font-bold' : ''}`}>{t.nav.contact}</button>
        </div>

        {/* TOP RIGHT LANGUAGE SELECTOR & CONTACT */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-full p-1 shadow-inner">
            {ALL_LANGUAGES.slice(0, 3).map((item) => (
              <button 
                key={item.code} 
                onClick={() => setLang(item.code)} 
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition flex items-center space-x-1 ${lang === item.code ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
              >
                <span>{item.flag}</span>
                <span>{item.code.toUpperCase()}</span>
              </button>
            ))}
          </div>

          <button onClick={() => setCurrentPage('contact')} className="bg-[#E07A5F] hover:bg-[#d0694e] text-white font-bold px-6 py-2.5 rounded-full text-xs transition shadow-md hidden sm:block">
            {t.nav.contact}
          </button>
        </div>
      </nav>

      {/* --- PAGE ROUTING --- */}
      {currentPage === 'courses' ? (
        /* ALOHIDA TILLARNI TANLASH SAHIFASI (COURSES & LANGUAGES PAGE) */
        <section className="max-w-7xl mx-auto px-6 py-16 animate-fadeIn">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">Lingo Academic Catalog</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1128] mt-2 mb-4">{t.langPageTitle}</h1>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">{t.langPageSub}</p>
          </div>

          {/* ALL LANGUAGES GRID WITH FLAGS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {ALL_LANGUAGES.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSelectLanguage(item.name)}
                className="bg-white border border-slate-200 hover:border-orange-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl transition cursor-pointer transform hover:-translate-y-1 group"
              >
                <span className="text-5xl mb-4 transform group-hover:scale-110 transition duration-200">{item.flag}</span>
                <h3 className="font-bold text-lg text-[#0A1128]">{item.name}</h3>
                <span className="text-xs text-slate-400 mt-1">{item.native}</span>
                <button className="mt-4 bg-[#FFF0E5] text-orange-600 group-hover:bg-orange-600 group-hover:text-white text-xs font-bold px-4 py-1.5 rounded-full transition">
                  Enroll Course →
                </button>
              </div>
            ))}
          </div>
        </section>
      ) : currentPage === 'contact' ? (
        /* BOG'LANISH SAHIFASI */
        <section className="max-w-6xl mx-auto px-6 py-16 animate-fadeIn">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A1128] mb-4">{t.contactPage.title}</h1>
            <p className="text-slate-600 max-w-xl mx-auto text-sm">Get in touch to discuss your learning goals or fill out the request form.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl">
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-[#0A1128] mb-4">Lingo Languages Institute</h3>
                <p className="text-xs text-slate-500 leading-relaxed">International language academy offering structured learning with cultural understanding.</p>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">✉️</span>
                  <div>
                    <p className="text-xs text-slate-400">Official Email</p>
                    <a href="mailto:islamrasmiy@gmail.com" className="font-bold text-[#0A1128] hover:text-orange-600">islamrasmiy@gmail.com</a>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">💬</span>
                  <div>
                    <p className="text-xs text-slate-400">WhatsApp Direct Line</p>
                    <a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="font-bold text-green-700 hover:underline">+996 553 720 108</a>
                  </div>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div>
              <h3 className="text-xl font-bold text-[#0A1128] mb-6">{t.contactPage.formTitle}</h3>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.contactPage.name}</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Your full name" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" required />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.contactPage.email}</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="your@email.com" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.contactPage.phone}</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+996 553 720 108" className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" required />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">{t.contactPage.course}</label>
                  <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm bg-white">
                    {ALL_LANGUAGES.map((item, idx) => (
                      <option key={idx} value={item.name}>{item.flag} {item.name}</option>
                    ))}
                  </select>
                </div>

                <button type="submit" disabled={submitting} className="w-full bg-[#0A1128] hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition shadow-lg text-sm mt-2">
                  {submitting ? "Yuborilmoqda..." : t.contactPage.btn}
                </button>
              </form>
            </div>
          </div>
        </section>
      ) : (
        /* HOME LANDING PAGE */
        <>
          {/* HERO SECTION */}
          <section id="home" className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-12 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-[#0A1128]">
                {t.hero.title1} <br />
                <span className="text-[#E07A5F]">{t.hero.title2}</span> <br />
                {t.hero.title3}
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-lg">
                {t.hero.desc}
              </p>
              
              <div className="flex items-center space-x-4 pt-2">
                <button onClick={() => setCurrentPage('contact')} className="bg-[#0A1128] hover:bg-slate-800 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg text-xs">
                  {t.hero.btnStart}
                </button>
                <button onClick={() => setCurrentPage('courses')} className="border border-slate-300 hover:bg-slate-100 text-[#0A1128] font-semibold px-6 py-3 rounded-full transition text-xs">
                  {t.hero.btnExplore} →
                </button>
              </div>

              {/* TILLARNING INTERAKTIV SHTORA/SLAYDERI (FLAG ICONS BILAN O'NG-CHAPGA SURILADIGAN) */}
              <div className="pt-8">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Explore Languages</p>
                  <div className="flex space-x-2">
                    <button onClick={() => slideLeft('hero-slider')} className="w-7 h-7 rounded-full bg-slate-200 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition">◀</button>
                    <button onClick={() => slideRight('hero-slider')} className="w-7 h-7 rounded-full bg-slate-200 hover:bg-orange-500 hover:text-white flex items-center justify-center text-xs transition">▶</button>
                  </div>
                </div>

                <div id="hero-slider" className="flex space-x-3 overflow-x-auto scroll-smooth no-scrollbar py-2">
                  {ALL_LANGUAGES.map((item, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSelectLanguage(item.name)}
                      className="flex-none flex items-center space-x-2 bg-[#FFF0E5] border border-orange-200 px-4 py-2 rounded-full shadow-sm text-xs font-bold text-slate-800 hover:scale-105 transition cursor-pointer"
                    >
                      <span className="text-base">{item.flag}</span>
                      <span>{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="md:w-1/2 flex justify-center w-full">
              <div className="relative w-full max-w-md h-[380px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800" 
                  alt="Lingo Academy Students" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          {/* WHAT WE OFFER */}
          <section id="services" className="bg-[#FFFBF7] py-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto space-y-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600">{t.offers.tag}</span>
                <h2 className="text-3xl font-extrabold text-[#0A1128] mt-1">{t.offers.title}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.offers.list.map((item, index) => (
                  <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between hover:shadow-md transition">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-sm mb-6">
                        0{index + 1}
                      </div>
                      <h3 className="font-bold text-[#0A1128] text-base mb-3">{item.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                    <button onClick={() => setCurrentPage('contact')} className="mt-8 w-8 h-8 rounded-full bg-[#0A1128] text-white flex items-center justify-center font-bold text-xs hover:bg-orange-500 transition">
                      →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CHEKSIZ DAVLAR BAYROQLARI LENTASI (INFINITE MARQUEE TILLAR SHTORASI) */}
          <section className="py-8 bg-[#0A1128] text-white overflow-hidden border-y border-slate-800">
            <div className="flex animate-marquee space-x-6">
              {[...ALL_LANGUAGES, ...ALL_LANGUAGES, ...ALL_LANGUAGES].map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelectLanguage(item.name)}
                  className="flex items-center space-x-2 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-full shadow-sm text-xs font-semibold text-slate-200 whitespace-nowrap hover:border-amber-500 cursor-pointer transition"
                >
                  <span className="text-lg">{item.flag}</span>
                  <span className="font-bold text-white">{item.name}</span>
                  <span className="text-[10px] text-slate-500">({item.native})</span>
                </div>
              ))}
            </div>
          </section>

          {/* FREQUENTLY ASKED QUESTIONS (VIDEODAGI FAQ QISMI) */}
          <section className="py-20 px-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#0A1128] text-center mb-10">Frequently Asked Questions</h2>
            <div className="space-y-4 text-xs">
              <details className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer">
                <summary className="font-bold text-sm text-[#0A1128]">Are your classes online or in person?</summary>
                <p className="mt-3 text-slate-600 leading-relaxed">All our courses are 100% online, allowing you to learn from anywhere with flexible scheduling.</p>
              </details>
              <details className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer">
                <summary className="font-bold text-sm text-[#0A1128]">Who are the instructors?</summary>
                <p className="mt-3 text-slate-600 leading-relaxed">We begin with instructors who speak your native language, then transition to native speakers for advanced levels.</p>
              </details>
              <details className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm cursor-pointer">
                <summary className="font-bold text-sm text-[#0A1128]">How long does it take to learn a language?</summary>
                <p className="mt-3 text-slate-600 leading-relaxed">It depends on your current level and chosen program intensity. On average, students achieve conversational fluency in 3 to 6 months.</p>
              </details>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer className="bg-[#0A1128] text-white pt-16 pb-8 px-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800 text-xs">
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Courses</h4>
            <ul className="space-y-2 text-slate-400">
              {ALL_LANGUAGES.slice(0, 5).map((l, i) => (
                <li key={i}><button onClick={() => handleSelectLanguage(l.name)} className="hover:text-orange-400 transition">{l.flag} {l.name} Course</button></li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Contacts</h4>
            <div className="space-y-2 text-slate-400">
              <p className="font-semibold text-amber-400">Lingo Academy HQ</p>
              <p className="font-bold text-white text-sm">📞 +996 553 720 108</p>
              <p className="text-green-400 font-bold">
                💬 <a href="https://wa.me/996553720108" target="_blank" rel="noreferrer" className="hover:underline">WhatsApp Direct Chat</a>
              </p>
              <p>✉️ islamrasmiy@gmail.com</p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Subscribe</h4>
            <p className="text-slate-400">Subscribe to our newsletter for updates & trends.</p>
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <input type="email" placeholder="Your email..." className="bg-transparent px-3 py-2 text-xs text-white focus:outline-none w-full" />
              <button className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-2 font-bold">→</button>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">In Socials</h4>
            <div className="flex space-x-3 text-slate-400">
              <span className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-orange-400 cursor-pointer">f</span>
              <span className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-orange-400 cursor-pointer">X</span>
              <span className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-orange-400 cursor-pointer">ig</span>
              <span className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-orange-400 cursor-pointer">in</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto pt-6 text-center text-slate-500 text-[11px]">
          Copyright © {new Date().getFullYear()} Lingo Languages Institute. All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}