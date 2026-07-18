/* ============================================
   CTU Support — Internationalization (i18n)
   Arabic/English translations & RTL switching
   ============================================ */

const translations = {
  en: {
    /* === Navbar === */
    "nav.home": "Home",
    "nav.report": "Report Problem",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.brand": "CTU Support",

    /* === Hero === */
    "hero.title": "CTU Support Team",
    "hero.subtitle": "Professional IT support for Children's Technological University. We keep your technology running smoothly so you can focus on learning.",
    "hero.cta": "Submit a Report",
    "hero.secondary": "Learn More",

    /* === About Team === */
    "team.title": "Meet Our Team",
    "team.subtitle": "Professional engineers and specialists dedicated to solving your technical challenges.",

    /* === About Universities === */
    "uni.title": "About Our Universities",
    "uni.subtitle": "Learn about the institutions that make CTU possible.",
    "uni.gallery": "Campus Gallery",

    /* === Faculties === */
    "fac.title": "Our Faculties",
    "fac.subtitle": "Explore the academic departments that drive innovation.",

    /* === How It Works === */
    "how.title": "How It Works",
    "how.subtitle": "Reporting a technical problem is simple and straightforward.",
    "how.step1.title": "Submit Report",
    "how.step1.desc": "Fill out the problem report form with details about your issue.",
    "how.step2.title": "Team Reviews",
    "how.step2.desc": "Our support team reviews and prioritizes your report.",
    "how.step3.title": "Engineer Assigned",
    "how.step3.desc": "A qualified engineer is assigned to resolve your problem.",
    "how.step4.title": "Problem Resolved",
    "how.step4.desc": "Your issue is fixed and confirmed. You'll be notified!",

    /* === CTA === */
    "cta.title": "Having a Technical Issue?",
    "cta.subtitle": "Don't let technical problems slow you down. Submit a report and our team will handle it.",
    "cta.btn": "Report Now",

    /* === Report Page === */
    "report.title": "Report a Problem",
    "report.subtitle": "Fill in the details below and our team will respond promptly.",
    "report.name": "Full Name",
    "report.phone": "Phone Number",
    "report.location": "Location",
    "report.location.placeholder": "Select location...",
    "report.problem": "Problem Description",
    "report.problem.placeholder": "Describe the technical issue in detail...",
    "report.submit": "Submit Report",
    "report.success.title": "Report Submitted!",
    "report.success.msg": "Your report has been received successfully. Our team will review it shortly.",
    "report.engineers.title": "Available Engineers",
    "report.engineers.subtitle": "Contact our support team directly if needed.",
    "report.copy": "Copy",
    "report.copied": "Copied!",

    /* === Auth Pages === */
    "login.title": "Welcome Back",
    "login.subtitle": "Sign in to access your dashboard",
    "login.email": "Email Address",
    "login.password": "Password",
    "login.btn": "Sign In",
    "login.signup": "Don't have an account?",
    "login.signup.link": "Sign Up",
    "signup.title": "Create Account",
    "signup.subtitle": "Join CTU Support to track your reports",
    "signup.name": "Full Name",
    "signup.email": "Email Address",
    "signup.password": "Password",
    "signup.btn": "Create Account",
    "signup.login": "Already have an account?",
    "signup.login.link": "Sign In",

    /* === Dashboard === */
    "dash.sidebar.dashboard": "Dashboard",
    "dash.sidebar.profile": "Profile",
    "dash.sidebar.attendance": "Attendance",
    "dash.sidebar.information": "Information",
    "dash.sidebar.students": "Students",
    "dash.sidebar.logout": "Logout",
    "dash.sidebar.menu": "Menu",
    "dash.sidebar.general": "General",
    "dash.sidebar.management": "Management",

    /* === Student Dashboard === */
    "sdash.title": "My Reports",
    "sdash.col.id": "#",
    "sdash.col.name": "Name",
    "sdash.col.phone": "Phone",
    "sdash.col.location": "Location",
    "sdash.col.problem": "Problem",
    "sdash.col.status": "Status",
    "sdash.col.actions": "Actions",
    "sdash.btn.done": "Mark Done",
    "sdash.btn.undone": "Undo",
    "sdash.status.pending": "Pending",
    "sdash.status.progress": "In Progress",
    "sdash.status.done": "Done",

    /* === Profile === */
    "profile.title": "My Profile",
    "profile.update": "Update Data",
    "profile.updated": "Profile Updated!",
    "profile.name": "Full Name",
    "profile.dept": "Department",
    "profile.year": "Academic Year",
    "profile.phone": "Phone Number",
    "profile.id": "Academic ID",
    "profile.email": "Email Address",

    /* === Attendance === */
    "att.title": "Attendance",
    "att.register": "Register Attendance",
    "att.registered": "Registered ✓",
    "att.waiting": "Waiting...",
    "att.days": "Days Attended",
    "att.streak": "Current Streak",
    "att.calendar": "Attendance Calendar",

    /* === Information === */
    "info.title": "Statistics & Analytics",
    "info.total.att": "Total Attendance",
    "info.completed": "Completed Tasks",
    "info.pending": "Pending Tasks",
    "info.rate": "Completion Rate",
    "info.chart.tasks": "Task Completion",
    "info.chart.attendance": "Weekly Attendance",
    "info.chart.activity": "Activity Timeline",

    /* === Admin Dashboard === */
    "admin.title": "All Reports",
    "admin.total": "Total Reports",
    "admin.pending": "Pending",
    "admin.resolved": "Resolved",
    "admin.today": "Today's Reports",
    "admin.col.confirmedBy": "Confirmed By",
    "admin.btn.edit": "Edit",
    "admin.btn.delete": "Delete",
    "admin.btn.confirm": "Confirm",
    "admin.confirmed": "Confirmed",
    "admin.search": "Search reports...",
    "admin.edit.title": "Edit Report",
    "admin.edit.save": "Save Changes",
    "admin.delete.title": "Delete Report",
    "admin.delete.msg": "Are you sure you want to delete this report?",
    "admin.delete.yes": "Delete",
    "admin.delete.no": "Cancel",

    /* === Admin Students === */
    "astudents.title": "Student Directory",
    "astudents.add": "Add Student",
    "astudents.search": "Search students...",
    "astudents.edit": "Edit",
    "astudents.delete": "Delete",
    "astudents.details": "View Details",

    /* === Admin Attendance === */
    "aatt.title": "Attendance Management",
    "aatt.start": "Start Day",
    "aatt.end": "End Day",
    "aatt.students": "Students Present",
    "aatt.avg": "Average Attendance",
    "aatt.active": "Most Active",

    /* === Admin Information === */
    "ainfo.title": "Global Analytics",
    "ainfo.resolution": "Resolution Rate",
    "ainfo.response": "Avg Response Time",
    "ainfo.satisfaction": "Satisfaction",
    "ainfo.chart.category": "Reports by Location",
    "ainfo.chart.engineer": "Reports per Engineer",
    "ainfo.chart.trend": "Reports Over Time",
    "ainfo.chart.health": "System Health",
    "ainfo.export": "Export Data",

    /* === Footer === */
    "footer.contact": "Contact Us",
    "footer.email": "support@ctu.batu.edu.eg",
    "footer.phone": "+20 3 459 0000",
    "footer.address": "New Borg El Arab City, Alexandria, Egypt",
    "footer.links": "Quick Links",
    "footer.copyright": "© 2026 CTU Support Team. All rights reserved.",
    "footer.powered": "Powered by Borg El Arab Technological University",

    /* === Common === */
    "common.close": "Close",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.loading": "Loading...",
    "common.nodata": "No data available"
  },

  ar: {
    /* === Navbar === */
    "nav.home": "الرئيسية",
    "nav.report": "إبلاغ عن مشكلة",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "إنشاء حساب",
    "nav.brand": "دعم CTU",

    /* === Hero === */
    "hero.title": "فريق دعم CTU",
    "hero.subtitle": "دعم تقني احترافي لجامعة الأطفال التكنولوجية. نحافظ على تشغيل تقنياتك بسلاسة حتى تتمكن من التركيز على التعلم.",
    "hero.cta": "إرسال تقرير",
    "hero.secondary": "اعرف المزيد",

    /* === About Team === */
    "team.title": "تعرف على فريقنا",
    "team.subtitle": "مهندسون ومتخصصون محترفون مخصصون لحل تحدياتك التقنية.",

    /* === About Universities === */
    "uni.title": "عن جامعاتنا",
    "uni.subtitle": "تعرف على المؤسسات التي تجعل CTU ممكنة.",
    "uni.gallery": "معرض الحرم الجامعي",

    /* === Faculties === */
    "fac.title": "كلياتنا",
    "fac.subtitle": "استكشف الأقسام الأكاديمية التي تدفع الابتكار.",

    /* === How It Works === */
    "how.title": "كيف يعمل النظام",
    "how.subtitle": "الإبلاغ عن مشكلة تقنية بسيط ومباشر.",
    "how.step1.title": "أرسل تقرير",
    "how.step1.desc": "املأ نموذج الإبلاغ بتفاصيل مشكلتك.",
    "how.step2.title": "مراجعة الفريق",
    "how.step2.desc": "يقوم فريق الدعم بمراجعة وترتيب أولوية تقريرك.",
    "how.step3.title": "تعيين مهندس",
    "how.step3.desc": "يتم تعيين مهندس مؤهل لحل مشكلتك.",
    "how.step4.title": "حل المشكلة",
    "how.step4.desc": "يتم إصلاح مشكلتك وتأكيدها. سيتم إخطارك!",

    /* === CTA === */
    "cta.title": "هل تواجه مشكلة تقنية؟",
    "cta.subtitle": "لا تدع المشاكل التقنية تبطئك. أرسل تقريرًا وسيتعامل فريقنا معه.",
    "cta.btn": "أبلغ الآن",

    /* === Report Page === */
    "report.title": "إبلاغ عن مشكلة",
    "report.subtitle": "املأ التفاصيل أدناه وسيستجيب فريقنا بسرعة.",
    "report.name": "الاسم الكامل",
    "report.phone": "رقم الهاتف",
    "report.location": "الموقع",
    "report.location.placeholder": "اختر الموقع...",
    "report.problem": "وصف المشكلة",
    "report.problem.placeholder": "صف المشكلة التقنية بالتفصيل...",
    "report.submit": "إرسال التقرير",
    "report.success.title": "تم إرسال التقرير!",
    "report.success.msg": "تم استلام تقريرك بنجاح. سيقوم فريقنا بمراجعته قريبًا.",
    "report.engineers.title": "المهندسون المتاحون",
    "report.engineers.subtitle": "تواصل مع فريق الدعم مباشرة إذا لزم الأمر.",
    "report.copy": "نسخ",
    "report.copied": "تم النسخ!",

    /* === Auth Pages === */
    "login.title": "مرحبًا بعودتك",
    "login.subtitle": "سجل الدخول للوصول إلى لوحة التحكم",
    "login.email": "البريد الإلكتروني",
    "login.password": "كلمة المرور",
    "login.btn": "تسجيل الدخول",
    "login.signup": "ليس لديك حساب؟",
    "login.signup.link": "إنشاء حساب",
    "signup.title": "إنشاء حساب",
    "signup.subtitle": "انضم إلى دعم CTU لتتبع تقاريرك",
    "signup.name": "الاسم الكامل",
    "signup.email": "البريد الإلكتروني",
    "signup.password": "كلمة المرور",
    "signup.btn": "إنشاء حساب",
    "signup.login": "لديك حساب بالفعل؟",
    "signup.login.link": "تسجيل الدخول",

    /* === Dashboard === */
    "dash.sidebar.dashboard": "لوحة التحكم",
    "dash.sidebar.profile": "الملف الشخصي",
    "dash.sidebar.attendance": "الحضور",
    "dash.sidebar.information": "المعلومات",
    "dash.sidebar.students": "الطلاب",
    "dash.sidebar.logout": "تسجيل الخروج",
    "dash.sidebar.menu": "القائمة",
    "dash.sidebar.general": "عام",
    "dash.sidebar.management": "إدارة",

    /* === Student Dashboard === */
    "sdash.title": "تقاريري",
    "sdash.col.id": "#",
    "sdash.col.name": "الاسم",
    "sdash.col.phone": "الهاتف",
    "sdash.col.location": "الموقع",
    "sdash.col.problem": "المشكلة",
    "sdash.col.status": "الحالة",
    "sdash.col.actions": "الإجراءات",
    "sdash.btn.done": "تم الإنجاز",
    "sdash.btn.undone": "تراجع",
    "sdash.status.pending": "قيد الانتظار",
    "sdash.status.progress": "قيد التنفيذ",
    "sdash.status.done": "مكتمل",

    /* === Profile === */
    "profile.title": "ملفي الشخصي",
    "profile.update": "تحديث البيانات",
    "profile.updated": "تم تحديث الملف!",
    "profile.name": "الاسم الكامل",
    "profile.dept": "القسم",
    "profile.year": "السنة الدراسية",
    "profile.phone": "رقم الهاتف",
    "profile.id": "الرقم الأكاديمي",
    "profile.email": "البريد الإلكتروني",

    /* === Attendance === */
    "att.title": "الحضور",
    "att.register": "تسجيل الحضور",
    "att.registered": "تم التسجيل ✓",
    "att.waiting": "جاري الانتظار...",
    "att.days": "أيام الحضور",
    "att.streak": "السلسلة الحالية",
    "att.calendar": "تقويم الحضور",

    /* === Information === */
    "info.title": "الإحصائيات والتحليلات",
    "info.total.att": "إجمالي الحضور",
    "info.completed": "المهام المكتملة",
    "info.pending": "المهام المعلقة",
    "info.rate": "نسبة الإنجاز",
    "info.chart.tasks": "إنجاز المهام",
    "info.chart.attendance": "الحضور الأسبوعي",
    "info.chart.activity": "الجدول الزمني للنشاط",

    /* === Admin Dashboard === */
    "admin.title": "جميع التقارير",
    "admin.total": "إجمالي التقارير",
    "admin.pending": "قيد الانتظار",
    "admin.resolved": "تم الحل",
    "admin.today": "تقارير اليوم",
    "admin.col.confirmedBy": "تأكيد بواسطة",
    "admin.btn.edit": "تعديل",
    "admin.btn.delete": "حذف",
    "admin.btn.confirm": "تأكيد",
    "admin.confirmed": "مؤكد",
    "admin.search": "بحث في التقارير...",
    "admin.edit.title": "تعديل التقرير",
    "admin.edit.save": "حفظ التغييرات",
    "admin.delete.title": "حذف التقرير",
    "admin.delete.msg": "هل أنت متأكد من حذف هذا التقرير؟",
    "admin.delete.yes": "حذف",
    "admin.delete.no": "إلغاء",

    /* === Admin Students === */
    "astudents.title": "دليل الطلاب",
    "astudents.add": "إضافة طالب",
    "astudents.search": "بحث عن طلاب...",
    "astudents.edit": "تعديل",
    "astudents.delete": "حذف",
    "astudents.details": "عرض التفاصيل",

    /* === Admin Attendance === */
    "aatt.title": "إدارة الحضور",
    "aatt.start": "بدء اليوم",
    "aatt.end": "إنهاء اليوم",
    "aatt.students": "الطلاب الحاضرون",
    "aatt.avg": "متوسط الحضور",
    "aatt.active": "الأكثر نشاطًا",

    /* === Admin Information === */
    "ainfo.title": "التحليلات الشاملة",
    "ainfo.resolution": "نسبة الحل",
    "ainfo.response": "متوسط وقت الاستجابة",
    "ainfo.satisfaction": "الرضا",
    "ainfo.chart.category": "التقارير حسب الموقع",
    "ainfo.chart.engineer": "التقارير لكل مهندس",
    "ainfo.chart.trend": "التقارير عبر الزمن",
    "ainfo.chart.health": "صحة النظام",
    "ainfo.export": "تصدير البيانات",

    /* === Footer === */
    "footer.contact": "تواصل معنا",
    "footer.email": "support@ctu.batu.edu.eg",
    "footer.phone": "+20 3 459 0000",
    "footer.address": "مدينة برج العرب الجديدة، الإسكندرية، مصر",
    "footer.links": "روابط سريعة",
    "footer.copyright": "© 2026 فريق دعم CTU. جميع الحقوق محفوظة.",
    "footer.powered": "بدعم من جامعة برج العرب التكنولوجية",

    /* === Common === */
    "common.close": "إغلاق",
    "common.cancel": "إلغاء",
    "common.save": "حفظ",
    "common.loading": "جاري التحميل...",
    "common.nodata": "لا توجد بيانات متاحة"
  }
};

/**
 * Get the current language from localStorage or default to English
 */
function getCurrentLang() {
  return localStorage.getItem('ctu-lang') || 'en';
}

/**
 * Translate a key to the current language
 */
function t(key) {
  const lang = getCurrentLang();
  return translations[lang]?.[key] || translations['en']?.[key] || key;
}

/**
 * Apply translations to all elements with [data-i18n] attribute
 */
function applyTranslations() {
  const lang = getCurrentLang();
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const text = t(key);
    
    // Handle different element types
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      if (el.hasAttribute('placeholder')) {
        el.placeholder = text;
      } else {
        el.value = text;
      }
    } else if (el.tagName === 'OPTION' && el.value === '') {
      el.textContent = text;
    } else {
      el.textContent = text;
    }
  });

  // Also update [data-i18n-placeholder] attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });
}

/**
 * Set the language and apply all changes
 */
function setLanguage(lang) {
  localStorage.setItem('ctu-lang', lang);
  
  // Set document direction
  const dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lang);
  
  // Apply translations
  applyTranslations();
  
  // Update language toggle button text
  const langBtn = document.getElementById('lang-toggle');
  if (langBtn) {
    const langText = langBtn.querySelector('.lang-text');
    if (langText) {
      langText.textContent = lang === 'ar' ? 'EN' : 'عربي';
    }
  }

  // Dispatch custom event for page-specific handlers
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

/**
 * Toggle between Arabic and English
 */
function toggleLanguage() {
  const currentLang = getCurrentLang();
  setLanguage(currentLang === 'en' ? 'ar' : 'en');
}

/**
 * Get localized field from data object
 * Usage: getLocalized(item, 'name') returns item.name or item.nameAr based on lang
 */
function getLocalized(obj, field) {
  const lang = getCurrentLang();
  if (lang === 'ar' && obj[field + 'Ar']) {
    return obj[field + 'Ar'];
  }
  return obj[field] || '';
}
