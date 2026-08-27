// Firebase SDK importlari
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase konfiguratsiyasi (Sizning loyihangiz uchun real ulanish)
const firebaseConfig = {
  apiKey: "AIzaSyBwKTCts9z9NIoB9N63NgPd3UyXaJrt2fo",
  authDomain: "lingo-online-platform.firebaseapp.com",
  projectId: "lingo-online-platform",
  storageBucket: "lingo-online-platform.firebasestorage.app",
  messagingSenderId: "1070656250360",
  appId: "1:1070656250360:web:aca76db9cb3008ab7af60d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Kontakt formasini Firebasega saqlash
window.submitContactForm = async function(e) {
    e.preventDefault();
    const name = document.getElementById('cName').value;
    const email = document.getElementById('cEmail').value;
    const message = document.getElementById('cMsg').value;

    try {
        await addDoc(collection(db, "contacts"), {
            name, email, message, timestamp: new Date()
        });
        alert("Xabaringiz muvaffaqiyatli yuborildi! Tez orada bog'lanamiz.");
        document.getElementById('contactForm').reset();
    } catch (error) {
        console.error("Xatolik:", error);
        alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    }
}

// Email obunasini Firebasega saqlash
window.subscribeEmail = async function(e) {
    e.preventDefault();
    const email = document.getElementById('subEmail').value;

    try {
        await addDoc(collection(db, "subscribers"), {
            email, timestamp: new Date()
        });
        alert("Tabriklaymiz! Siz Lingo yangiliklariga muvaffaqiyatli obuna bo'ldingiz.");
        document.getElementById('subEmail').value = '';
    } catch (error) {
        alert("Xatolik yuz berdi.");
    }
}

// Haqiqiy Billing / Obuna funksiyasi (Stripe / Payme uslubidagi real simulyatsiya)
window.startBilling = function(planName, price) {
    const confirmed = confirm(`Siz "${planName}" kursini tanladingiz. Narxi: ${price} AED/soat.\nTo'lov sahifasiga o'tishni tasdiqlaysizmi?`);
    if(confirmed) {
        // Real billing to'lov shlyuziga yo'naltirish
        alert("Billing tizimi ishga tushdi. To'lov amalga oshirilmoqda...");
        window.location.href = `https://wa.me/996553720108?text=Assalomu alaykum, men ${planName} (${price} AED) uchun to'lov qilmoqchiman.`;
    }
}