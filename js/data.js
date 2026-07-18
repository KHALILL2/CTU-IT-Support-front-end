/* ============================================
   CTU Support — Dummy Data
   All mock JSON data for populating tables, charts, profiles
   ============================================ */

const CTU_DATA = {
  /* === Team Members === */
  teamMembers: [
    {
      id: 1,
      name: "Ahmed Hassan",
      nameAr: "أحمد حسن",
      role: "Network Engineer",
      roleAr: "مهندس شبكات",
      department: "IT Department",
      departmentAr: "قسم تكنولوجيا المعلومات",
      phone: "01012345678",
      image: "https://ui-avatars.com/api/?name=Ahmed+Hassan&size=200&background=4F46E5&color=fff&bold=true"
    },
    {
      id: 2,
      name: "Mohamed Ali",
      nameAr: "محمد علي",
      role: "Systems Administrator",
      roleAr: "مسؤول أنظمة",
      department: "IT Department",
      departmentAr: "قسم تكنولوجيا المعلومات",
      phone: "01098765432",
      image: "https://ui-avatars.com/api/?name=Mohamed+Ali&size=200&background=7C3AED&color=fff&bold=true"
    },
    {
      id: 3,
      name: "Sara Ibrahim",
      nameAr: "سارة إبراهيم",
      role: "Software Developer",
      roleAr: "مطورة برمجيات",
      department: "IT Department",
      departmentAr: "قسم تكنولوجيا المعلومات",
      phone: "01112233445",
      image: "https://ui-avatars.com/api/?name=Sara+Ibrahim&size=200&background=14B8A6&color=fff&bold=true"
    },
    {
      id: 4,
      name: "Khalil Muhammad",
      nameAr: "خليل محمد",
      role: "Full Stack Developer",
      roleAr: "مطور متكامل",
      department: "IT Department",
      departmentAr: "قسم تكنولوجيا المعلومات",
      phone: "01234567890",
      image: "https://ui-avatars.com/api/?name=Khalil+Muhammad&size=200&background=6366F1&color=fff&bold=true"
    },
    {
      id: 5,
      name: "Youssef Nabil",
      nameAr: "يوسف نبيل",
      role: "Hardware Technician",
      roleAr: "فني أجهزة",
      department: "Faculty of Industry",
      departmentAr: "كلية الصناعة",
      phone: "01555666777",
      image: "https://ui-avatars.com/api/?name=Youssef+Nabil&size=200&background=8B5CF6&color=fff&bold=true"
    },
    {
      id: 6,
      name: "Nour El-Din",
      nameAr: "نور الدين",
      role: "Technical Support Lead",
      roleAr: "قائد الدعم الفني",
      department: "IT Department",
      departmentAr: "قسم تكنولوجيا المعلومات",
      phone: "01099887766",
      image: "https://ui-avatars.com/api/?name=Nour+ElDin&size=200&background=0D9488&color=fff&bold=true"
    }
  ],

  /* === Reports === */
  reports: [
    { id: 1, name: "Ali Mostafa", nameAr: "علي مصطفى", phone: "01011111111", location: "Lab A - Building 1", locationAr: "معمل أ - مبنى 1", problem: "Computer won't start, black screen on boot", problemAr: "الكمبيوتر لا يعمل، شاشة سوداء عند التشغيل", status: "pending", date: "2026-07-15", confirmedBy: null },
    { id: 2, name: "Fatma Khaled", nameAr: "فاطمة خالد", phone: "01022222222", location: "Lab B - Building 2", locationAr: "معمل ب - مبنى 2", problem: "Projector not displaying, HDMI issue", problemAr: "جهاز العرض لا يعمل، مشكلة في HDMI", status: "done", date: "2026-07-14", confirmedBy: "Ahmed Hassan" },
    { id: 3, name: "Omar Saeed", nameAr: "عمر سعيد", phone: "01033333333", location: "Server Room", locationAr: "غرفة السيرفرات", problem: "Network switch down, no connectivity in wing B", problemAr: "سويتش الشبكة معطل، لا يوجد اتصال في الجناح ب", status: "in-progress", date: "2026-07-16", confirmedBy: null },
    { id: 4, name: "Mona Adel", nameAr: "منى عادل", phone: "01044444444", location: "Office 201", locationAr: "مكتب 201", problem: "Printer paper jam, repeated error E-04", problemAr: "انحشار الورق في الطابعة، خطأ متكرر E-04", status: "done", date: "2026-07-13", confirmedBy: "Mohamed Ali" },
    { id: 5, name: "Hassan Mahmoud", nameAr: "حسن محمود", phone: "01055555555", location: "Lab C - Building 1", locationAr: "معمل ج - مبنى 1", problem: "Software installation failure, admin rights needed", problemAr: "فشل تثبيت البرنامج، يحتاج صلاحيات المسؤول", status: "pending", date: "2026-07-17", confirmedBy: null },
    { id: 6, name: "Layla Ahmed", nameAr: "ليلى أحمد", phone: "01066666666", location: "Library", locationAr: "المكتبة", problem: "WiFi disconnecting repeatedly on floor 2", problemAr: "الواي فاي ينقطع باستمرار في الطابق 2", status: "done", date: "2026-07-12", confirmedBy: "Sara Ibrahim" },
    { id: 7, name: "Tamer Fouad", nameAr: "تامر فؤاد", phone: "01077777777", location: "Lab A - Building 2", locationAr: "معمل أ - مبنى 2", problem: "Monitor flickering, possible GPU failure", problemAr: "الشاشة تومض، احتمال تلف كارت الشاشة", status: "pending", date: "2026-07-18", confirmedBy: null },
    { id: 8, name: "Rania Mohamed", nameAr: "رانيا محمد", phone: "01088888888", location: "Admin Office", locationAr: "المكتب الإداري", problem: "Email client not syncing, Outlook error", problemAr: "البريد لا يتزامن، خطأ في Outlook", status: "in-progress", date: "2026-07-16", confirmedBy: null },
    { id: 9, name: "Yasser Ali", nameAr: "ياسر علي", phone: "01099999999", location: "Lab D - Building 3", locationAr: "معمل د - مبنى 3", problem: "USB ports not working on workstations 5-8", problemAr: "منافذ USB لا تعمل في الأجهزة 5-8", status: "done", date: "2026-07-11", confirmedBy: "Khalil Muhammad" },
    { id: 10, name: "Dina Hossam", nameAr: "دينا حسام", phone: "01011122233", location: "Conference Room", locationAr: "قاعة الاجتماعات", problem: "Video conference system audio issues", problemAr: "مشكلة صوت في نظام الاجتماعات المرئية", status: "pending", date: "2026-07-18", confirmedBy: null },
    { id: 11, name: "Karim Ossama", nameAr: "كريم أسامة", phone: "01022233344", location: "Lab B - Building 1", locationAr: "معمل ب - مبنى 1", problem: "Antivirus update failure across multiple PCs", problemAr: "فشل تحديث برنامج الحماية على عدة أجهزة", status: "in-progress", date: "2026-07-17", confirmedBy: null },
    { id: 12, name: "Nada Sherif", nameAr: "ندى شريف", phone: "01033344455", location: "Office 105", locationAr: "مكتب 105", problem: "Desktop freezing during AutoCAD sessions", problemAr: "الجهاز يتجمد أثناء استخدام AutoCAD", status: "done", date: "2026-07-10", confirmedBy: "Youssef Nabil" },
    { id: 13, name: "Amira Tarek", nameAr: "أميرة طارق", phone: "01044455566", location: "Lab A - Building 1", locationAr: "معمل أ - مبنى 1", problem: "Blue screen error on startup, BSOD code 0x7E", problemAr: "شاشة زرقاء عند التشغيل، كود 0x7E", status: "pending", date: "2026-07-18", confirmedBy: null },
    { id: 14, name: "Mahmoud Reda", nameAr: "محمود رضا", phone: "01055566677", location: "Lab C - Building 2", locationAr: "معمل ج - مبنى 2", problem: "Slow internet speed, bandwidth throttling suspected", problemAr: "سرعة الإنترنت بطيئة، يشتبه في تقييد النطاق", status: "done", date: "2026-07-09", confirmedBy: "Nour El-Din" },
    { id: 15, name: "Salma Gamal", nameAr: "سلمى جمال", phone: "01066677788", location: "Faculty Office", locationAr: "مكتب الكلية", problem: "Scanner not detected, driver missing", problemAr: "الماسح الضوئي غير معرّف، تعريف مفقود", status: "pending", date: "2026-07-18", confirmedBy: null }
  ],

  /* === Students === */
  students: [
    { id: 1, name: "Ali Mostafa", nameAr: "علي مصطفى", department: "Information Technology", departmentAr: "تكنولوجيا المعلومات", year: "3rd Year", yearAr: "السنة الثالثة", phone: "01011111111", academicId: "CTU-2024-001", email: "ali.mostafa@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Ali+Mostafa&size=200&background=6366F1&color=fff", attendance: 18, tasks: 12 },
    { id: 2, name: "Fatma Khaled", nameAr: "فاطمة خالد", department: "Information Technology", departmentAr: "تكنولوجيا المعلومات", year: "2nd Year", yearAr: "السنة الثانية", phone: "01022222222", academicId: "CTU-2024-002", email: "fatma.k@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Fatma+Khaled&size=200&background=7C3AED&color=fff", attendance: 22, tasks: 15 },
    { id: 3, name: "Omar Saeed", nameAr: "عمر سعيد", department: "Industry and Energy", departmentAr: "الصناعة والطاقة", year: "1st Year", yearAr: "السنة الأولى", phone: "01033333333", academicId: "CTU-2024-003", email: "omar.s@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Omar+Saeed&size=200&background=14B8A6&color=fff", attendance: 15, tasks: 8 },
    { id: 4, name: "Mona Adel", nameAr: "منى عادل", department: "Information Technology", departmentAr: "تكنولوجيا المعلومات", year: "3rd Year", yearAr: "السنة الثالثة", phone: "01044444444", academicId: "CTU-2024-004", email: "mona.a@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Mona+Adel&size=200&background=8B5CF6&color=fff", attendance: 20, tasks: 14 },
    { id: 5, name: "Hassan Mahmoud", nameAr: "حسن محمود", department: "Industry and Energy", departmentAr: "الصناعة والطاقة", year: "2nd Year", yearAr: "السنة الثانية", phone: "01055555555", academicId: "CTU-2024-005", email: "hassan.m@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Hassan+Mahmoud&size=200&background=0D9488&color=fff", attendance: 10, tasks: 6 },
    { id: 6, name: "Layla Ahmed", nameAr: "ليلى أحمد", department: "Information Technology", departmentAr: "تكنولوجيا المعلومات", year: "1st Year", yearAr: "السنة الأولى", phone: "01066666666", academicId: "CTU-2024-006", email: "layla.a@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Layla+Ahmed&size=200&background=4F46E5&color=fff", attendance: 24, tasks: 18 },
    { id: 7, name: "Tamer Fouad", nameAr: "تامر فؤاد", department: "Industry and Energy", departmentAr: "الصناعة والطاقة", year: "3rd Year", yearAr: "السنة الثالثة", phone: "01077777777", academicId: "CTU-2024-007", email: "tamer.f@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Tamer+Fouad&size=200&background=6D28D9&color=fff", attendance: 17, tasks: 11 },
    { id: 8, name: "Rania Mohamed", nameAr: "رانيا محمد", department: "Information Technology", departmentAr: "تكنولوجيا المعلومات", year: "2nd Year", yearAr: "السنة الثانية", phone: "01088888888", academicId: "CTU-2024-008", email: "rania.m@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Rania+Mohamed&size=200&background=A78BFA&color=fff", attendance: 21, tasks: 16 },
    { id: 9, name: "Yasser Ali", nameAr: "ياسر علي", department: "Industry and Energy", departmentAr: "الصناعة والطاقة", year: "1st Year", yearAr: "السنة الأولى", phone: "01099999999", academicId: "CTU-2024-009", email: "yasser.a@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Yasser+Ali&size=200&background=2DD4BF&color=fff", attendance: 13, tasks: 7 },
    { id: 10, name: "Dina Hossam", nameAr: "دينا حسام", department: "Information Technology", departmentAr: "تكنولوجيا المعلومات", year: "3rd Year", yearAr: "السنة الثالثة", phone: "01011122233", academicId: "CTU-2024-010", email: "dina.h@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Dina+Hossam&size=200&background=818CF8&color=fff", attendance: 19, tasks: 13 },
    { id: 11, name: "Karim Ossama", nameAr: "كريم أسامة", department: "Industry and Energy", departmentAr: "الصناعة والطاقة", year: "2nd Year", yearAr: "السنة الثانية", phone: "01022233344", academicId: "CTU-2024-011", email: "karim.o@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Karim+Ossama&size=200&background=4338CA&color=fff", attendance: 16, tasks: 9 },
    { id: 12, name: "Nada Sherif", nameAr: "ندى شريف", department: "Information Technology", departmentAr: "تكنولوجيا المعلومات", year: "1st Year", yearAr: "السنة الأولى", phone: "01033344455", academicId: "CTU-2024-012", email: "nada.s@ctu.edu.eg", image: "https://ui-avatars.com/api/?name=Nada+Sherif&size=200&background=C7D2FE&color=3730A3", attendance: 23, tasks: 17 }
  ],

  /* === Attendance Records === */
  attendanceRecords: [
    { date: "2026-07-01", studentIds: [1, 2, 3, 4, 6, 7, 8, 10, 12], isActive: false },
    { date: "2026-07-02", studentIds: [1, 2, 4, 5, 6, 8, 9, 10, 11], isActive: false },
    { date: "2026-07-03", studentIds: [2, 3, 4, 6, 7, 8, 10, 11, 12], isActive: false },
    { date: "2026-07-06", studentIds: [1, 2, 3, 5, 6, 7, 9, 10, 12], isActive: false },
    { date: "2026-07-07", studentIds: [1, 3, 4, 5, 6, 8, 10, 11, 12], isActive: false },
    { date: "2026-07-08", studentIds: [1, 2, 4, 6, 7, 8, 9, 10, 11], isActive: false },
    { date: "2026-07-09", studentIds: [2, 3, 5, 6, 7, 8, 10, 11, 12], isActive: false },
    { date: "2026-07-10", studentIds: [1, 2, 3, 4, 5, 7, 8, 9, 12], isActive: false },
    { date: "2026-07-13", studentIds: [1, 2, 4, 5, 6, 7, 8, 10, 11], isActive: false },
    { date: "2026-07-14", studentIds: [1, 3, 4, 6, 7, 9, 10, 11, 12], isActive: false },
    { date: "2026-07-15", studentIds: [2, 3, 4, 5, 6, 8, 9, 10, 12], isActive: false },
    { date: "2026-07-16", studentIds: [1, 2, 3, 5, 7, 8, 9, 11, 12], isActive: false },
    { date: "2026-07-17", studentIds: [1, 2, 4, 5, 6, 7, 8, 10, 11, 12], isActive: false },
    { date: "2026-07-18", studentIds: [1, 3, 4, 6, 8, 10, 12], isActive: true }
  ],

  /* === Locations for Report Form === */
  locations: [
    { value: "lab-a-b1", label: "Lab A - Building 1", labelAr: "معمل أ - مبنى 1" },
    { value: "lab-b-b1", label: "Lab B - Building 1", labelAr: "معمل ب - مبنى 1" },
    { value: "lab-c-b1", label: "Lab C - Building 1", labelAr: "معمل ج - مبنى 1" },
    { value: "lab-a-b2", label: "Lab A - Building 2", labelAr: "معمل أ - مبنى 2" },
    { value: "lab-b-b2", label: "Lab B - Building 2", labelAr: "معمل ب - مبنى 2" },
    { value: "lab-c-b2", label: "Lab C - Building 2", labelAr: "معمل ج - مبنى 2" },
    { value: "lab-d-b3", label: "Lab D - Building 3", labelAr: "معمل د - مبنى 3" },
    { value: "server-room", label: "Server Room", labelAr: "غرفة السيرفرات" },
    { value: "library", label: "Library", labelAr: "المكتبة" },
    { value: "conference", label: "Conference Room", labelAr: "قاعة الاجتماعات" },
    { value: "admin-office", label: "Admin Office", labelAr: "المكتب الإداري" },
    { value: "faculty-office", label: "Faculty Office", labelAr: "مكتب الكلية" },
    { value: "other", label: "Other", labelAr: "أخرى" }
  ],

  /* === University Content === */
  universities: {
    ctu: {
      name: "Children's Technological University",
      nameAr: "جامعة الأطفال التكنولوجية",
      description: "Children's Technological University (CTU) is an innovative educational initiative designed to introduce young students to the world of technology, engineering, and computer science. Through hands-on workshops, lab experiences, and project-based learning, CTU nurtures the next generation of tech leaders. The program operates within the framework of Borg El Arab Technological University, leveraging its state-of-the-art facilities and expert faculty.",
      descriptionAr: "جامعة الأطفال التكنولوجية هي مبادرة تعليمية مبتكرة مصممة لتعريف الطلاب الصغار بعالم التكنولوجيا والهندسة وعلوم الحاسب. من خلال ورش العمل العملية وتجارب المعامل والتعلم القائم على المشاريع، تعمل الجامعة على رعاية الجيل القادم من القادة في مجال التكنولوجيا. يعمل البرنامج ضمن إطار جامعة برج العرب التكنولوجية، مستفيدًا من مرافقها المتطورة وأعضاء هيئة التدريس الخبراء."
    },
    batu: {
      name: "Borg El Arab Technological University",
      nameAr: "جامعة برج العرب التكنولوجية",
      description: "Borg El Arab Technological University (BATU) is one of Egypt's premier technological universities, located in the New Borg El Arab City, Alexandria. Established with a vision to bridge the gap between academic knowledge and industry needs, BATU offers cutting-edge programs in engineering, information technology, and applied sciences. The university is equipped with modern laboratories, smart classrooms, and research centers that foster innovation and practical skill development.",
      descriptionAr: "جامعة برج العرب التكنولوجية هي واحدة من أبرز الجامعات التكنولوجية في مصر، تقع في مدينة برج العرب الجديدة بالإسكندرية. تأسست برؤية لسد الفجوة بين المعرفة الأكاديمية واحتياجات الصناعة، وتقدم الجامعة برامج متطورة في الهندسة وتكنولوجيا المعلومات والعلوم التطبيقية. الجامعة مجهزة بمعامل حديثة وفصول ذكية ومراكز بحثية تعزز الابتكار وتنمية المهارات العملية."
    }
  },

  /* === Faculties === */
  faculties: [
    {
      name: "Faculty of Industry and Energy",
      nameAr: "كلية الصناعة والطاقة",
      icon: "fas fa-bolt",
      description: "The Faculty of Industry and Energy focuses on preparing students for careers in industrial automation, renewable energy systems, electrical engineering, and manufacturing technology. With state-of-the-art workshops and simulation labs, students gain practical experience in modern industrial processes.",
      descriptionAr: "تركز كلية الصناعة والطاقة على إعداد الطلاب لمسيرتهم المهنية في الأتمتة الصناعية وأنظمة الطاقة المتجددة والهندسة الكهربائية وتكنولوجيا التصنيع. من خلال ورش العمل المتطورة ومعامل المحاكاة، يكتسب الطلاب خبرة عملية في العمليات الصناعية الحديثة."
    },
    {
      name: "Information Technology Department",
      nameAr: "قسم تكنولوجيا المعلومات",
      icon: "fas fa-laptop-code",
      description: "The Information Technology Department equips students with comprehensive knowledge in software development, network administration, cybersecurity, database management, and cloud computing. The curriculum combines theoretical foundations with intensive hands-on lab work and real-world projects.",
      descriptionAr: "يزود قسم تكنولوجيا المعلومات الطلاب بمعرفة شاملة في تطوير البرمجيات وإدارة الشبكات والأمن السيبراني وإدارة قواعد البيانات والحوسبة السحابية. يجمع المنهج بين الأسس النظرية والعمل المعملي المكثف والمشاريع الواقعية."
    }
  ],

  /* === Current User (for student dashboard mock) === */
  currentUser: {
    id: 1,
    name: "Ali Mostafa",
    nameAr: "علي مصطفى",
    department: "Information Technology",
    departmentAr: "تكنولوجيا المعلومات",
    year: "3rd Year",
    yearAr: "السنة الثالثة",
    phone: "01011111111",
    academicId: "CTU-2024-001",
    email: "ali.mostafa@ctu.edu.eg",
    image: "https://ui-avatars.com/api/?name=Ali+Mostafa&size=200&background=6366F1&color=fff",
    role: "student"
  },

  /* === Current Admin === */
  currentAdmin: {
    id: 1,
    name: "Ahmed Hassan",
    nameAr: "أحمد حسن",
    role: "Network Engineer",
    roleAr: "مهندس شبكات",
    image: "https://ui-avatars.com/api/?name=Ahmed+Hassan&size=200&background=4F46E5&color=fff&bold=true"
  }
};
