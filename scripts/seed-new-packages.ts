import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database package re-seeding...");

  // 1. Delete all existing course packages
  const deletedCount = await prisma.coursePackage.deleteMany();
  console.log(`Deleted ${deletedCount.count} old packages.`);

  // 2. Fetch categories dynamically to avoid hardcoding IDs if possible
  const categories = await prisma.packageCategory.findMany();
  console.log("Current Categories:", categories);

  const bCategory = categories.find(c => c.name === "B-PAKET") || categories[0];
  const aCategory = categories.find(c => c.name === "A-PAKET") || categories[1];

  if (!bCategory || !aCategory) {
    throw new Error("Required categories (B-PAKET or A-PAKET) not found in the database. Please create them first.");
  }

  console.log(`Using Category B: ${bCategory.name} (${bCategory.id})`);
  console.log(`Using Category A: ${aCategory.name} (${aCategory.id})`);

  // 3. Define the 7 new packages exactly as requested
  const newPackages = [
    // 1. B-PAKET
    {
      title: "B-PAKET",
      tag: "KLASSIKER",
      price: "€ 1.490",
      courseType: "DAY",
      features: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "32 UE Theoriekurs (GW+B)",
        "18 Fahrlektionen",
        "Nachtfahrtzuschlag",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      titleDe: "B-PAKET",
      titleTr: "B-PAKET",
      titleEn: "B-PACKAGE",
      titleAr: "باقة فئة B",
      titleFa: "پکیج B",
      tagDe: "KLASSIKER",
      tagTr: "KLASİK",
      tagEn: "CLASSIC",
      tagAr: "كلاسيكي",
      tagFa: "کلاسیک",
      featuresDe: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "32 UE Theoriekurs (GW+B)",
        "18 Fahrlektionen",
        "Nachtfahrtzuschlag",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      featuresTr: JSON.stringify([
        "İdari giderler",
        "Sigorta",
        "32 UE teorisi kursu (GW+B)",
        "18 sürüş dersi",
        "Gece seyahati ek ücreti",
        "1. Teori sınavı",
        "1. Uygulama sınavı",
        "Çevrimiçi kod"
      ]),
      featuresEn: JSON.stringify([
        "Administrative fee",
        "Insurance",
        "32 UE theory course (GW+B)",
        "18 driving lessons",
        "Night driving surcharge",
        "1st Theory exam",
        "1st Practical exam",
        "Online code"
      ]),
      featuresAr: JSON.stringify([
        "الرسوم الإدارية",
        "التأمين",
        "دورة نظرية 32 وحدة (GW+B)",
        "18 درس قيادة",
        "رسوم إضافية للقيادة الليلية",
        "الامتحان النظري الأول",
        "الامتحان العملي الأول",
        "كود عبر الإنترنت"
      ]),
      featuresFa: JSON.stringify([
        "هزینه های اداری",
        "بیمه",
        "دوره تئوری 32 ساعته (GW+B)",
        "18 جلسه رانندگی",
        "هزینه اضافی رانندگی در شب",
        "اولین امتحان تئوری",
        "اولین امتحان عملی",
        "کد آنلاین"
      ]),
      isVisible: true,
      showDate: true,
      showPrice: true,
      order: 1,
      categoryId: bCategory.id,
      categoryIds: JSON.stringify([bCategory.id])
    },
    // 2. B-DUAL
    {
      title: "B-DUAL",
      tag: "DUALE AUSBILDUNG",
      price: "€ 1.249",
      courseType: "DAY",
      features: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "32 UE Theoriekurs (GW+B)",
        "12 Fahrlektionen",
        "1 UE theoretische Einweisung",
        "2X L-Tafel",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      titleDe: "B-DUAL",
      titleTr: "B-DUAL",
      titleEn: "B-DUAL",
      titleAr: "باقة B المزدوجة DUAL",
      titleFa: "پکیج B دونفره DUAL",
      tagDe: "DUALE AUSBILDUNG",
      tagTr: "İKİLİ EĞİTİM",
      tagEn: "DUAL TRAINING",
      tagAr: "تدريب مزدوج",
      tagFa: "آموزش دوگانه",
      featuresDe: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "32 UE Theoriekurs (GW+B)",
        "12 Fahrlektionen",
        "1 UE theoretische Einweisung",
        "2X L-Tafel",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      featuresTr: JSON.stringify([
        "İdari giderler",
        "Sigorta",
        "32 UE teorisi kursu (GW+B)",
        "12 sürüş dersi",
        "1 UE teorik tanıtımı",
        "2X L yazı tahtası",
        "1. Teori sınavı",
        "1. Uygulama sınavı",
        "Çevrimiçi kod"
      ]),
      featuresEn: JSON.stringify([
        "Administrative fee",
        "Insurance",
        "32 UE theory course (GW+B)",
        "12 driving lessons",
        "1 UE theoretical instruction",
        "2X L-Plate",
        "1st Theory exam",
        "1st Practical exam",
        "Online code"
      ]),
      featuresAr: JSON.stringify([
        "الرسوم الإدارية",
        "التأمين",
        "دورة نظرية 32 وحدة (GW+B)",
        "12 درس قيادة",
        "إرشادات نظرية 1 وحدة",
        "2X لوحة L",
        "الامتحان النظري الأول",
        "الامتحان العملي الأول",
        "كود عبر الإنترنت"
      ]),
      featuresFa: JSON.stringify([
        "هزینه های اداری",
        "بیمه",
        "دوره تئوری 32 ساعته (GW+B)",
        "12 جلسه رانندگی",
        "آموزش تئوری 1 ساعته",
        "2 عدد تابلوی L",
        "اولین امتحان تئوری",
        "اولین امتحان عملی",
        "کد آنلاین"
      ]),
      isVisible: true,
      showDate: true,
      showPrice: true,
      order: 2,
      categoryId: bCategory.id,
      categoryIds: JSON.stringify([bCategory.id])
    },
    // 3. B-L17
    {
      title: "B-L17",
      tag: "L17 AUSBILDUNG",
      price: "€ 1.649",
      courseType: "DAY",
      features: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "32 UE Theoriekurs (GW+B)",
        "17 Fahrlektionen",
        "1 UE Vorbesprechung",
        "2 UE Einweisung",
        "2X L17-Tafel",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      titleDe: "B-L17",
      titleTr: "B-L17",
      titleEn: "B-L17",
      titleAr: "باقة B L17",
      titleFa: "پکیج B L17",
      tagDe: "L17 AUSBILDUNG",
      tagTr: "GELİŞMİŞ SÜRÜŞ YETKİLENDİRMESİ",
      tagEn: "L17 TRAINING",
      tagAr: "تدريب L17 المتقدم",
      tagFa: "آموزش پیشرفته L17",
      featuresDe: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "32 UE Theoriekurs (GW+B)",
        "17 Fahrlektionen",
        "1 UE Vorbesprechung",
        "2 UE Einweisung",
        "2X L17-Tafel",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      featuresTr: JSON.stringify([
        "İdari giderler",
        "Sigorta",
        "32 UE teorisi kursu (GW+B)",
        "17 sürüş dersi",
        "1 UE ön tartışması",
        "2 UE bilgilendirmesi",
        "2X L17 kartı",
        "1. Teori sınavı",
        "1. Uygulama sınavı",
        "Çevrimiçi kod"
      ]),
      featuresEn: JSON.stringify([
        "Administrative fee",
        "Insurance",
        "32 UE theory course (GW+B)",
        "17 driving lessons",
        "1 UE preliminary discussion",
        "2 UE instruction",
        "2X L17-Plate",
        "1st Theory exam",
        "1st Practical exam",
        "Online code"
      ]),
      featuresAr: JSON.stringify([
        "الرسوم الإدارية",
        "التأمين",
        "دورة نظرية 32 وحدة (GW+B)",
        "17 درس قيادة",
        "مناقشة تمهيدية 1 وحدة",
        "إرشادات 2 وحدة",
        "2X لوحة L17",
        "الامتحان النظري الأول",
        "الامتحان العملي الأول",
        "كود عبر الإنترنت"
      ]),
      featuresFa: JSON.stringify([
        "هزینه های اداری",
        "بیمه",
        "دوره تئوری 32 ساعته (GW+B)",
        "17 جلسه رانندگی",
        "بحث مقدماتی 1 ساعته",
        "آموزش 2 ساعته",
        "2 عدد تابلوی L17",
        "اولین امتحان تئوری",
        "اولین امتحان عملی",
        "کد آنلاین"
      ]),
      isVisible: true,
      showDate: true,
      showPrice: true,
      order: 3,
      categoryId: bCategory.id,
      categoryIds: JSON.stringify([bCategory.id])
    },
    // 4. A1-PAKET
    {
      title: "A1-PAKET",
      tag: "MOTORRAD EINSTIEG",
      price: "€ 1.349",
      courseType: "DAY",
      features: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "26 UE Theoriekurs (GW+A)",
        "14 Fahrlektionen",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      titleDe: "A1-PAKET",
      titleTr: "A1-PAKET",
      titleEn: "A1-PACKAGE",
      titleAr: "باقة فئة A1",
      titleFa: "پکیج A1",
      tagDe: "MOTORRAD EINSTIEG",
      tagTr: "MOTOSİKLET GİRİŞİ",
      tagEn: "MOTORCYCLE ENTRY",
      tagAr: "مدخل الدراجات النارية A1",
      tagFa: "ورود به موتورسیکلت A1",
      featuresDe: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "26 UE Theoriekurs (GW+A)",
        "14 Fahrlektionen",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      featuresTr: JSON.stringify([
        "İdari giderler",
        "Sigorta",
        "26 UE teorisi kursu (GW+A)",
        "14 sürüş dersi",
        "1. Teori sınavı",
        "1. Uygulama sınavı",
        "Çevrimiçi kod"
      ]),
      featuresEn: JSON.stringify([
        "Administrative fee",
        "Insurance",
        "26 UE theory course (GW+A)",
        "14 driving lessons",
        "1st Theory exam",
        "1st Practical exam",
        "Online code"
      ]),
      featuresAr: JSON.stringify([
        "الرسوم الإدارية",
        "التأمين",
        "دورة نظرية 26 وحدة (GW+A)",
        "14 درس قيادة",
        "الامتحان النظري الأول",
        "الامتحان العملي الأول",
        "كود عبر الإنترنت"
      ]),
      featuresFa: JSON.stringify([
        "هزینه های اداری",
        "بیمه",
        "دوره تئوری 26 ساعته (GW+A)",
        "14 جلسه رانندگی",
        "اولین امتحان تئوری",
        "اولین امتحان عملی",
        "کد آنلاین"
      ]),
      isVisible: true,
      showDate: true,
      showPrice: true,
      order: 4,
      categoryId: aCategory.id,
      categoryIds: JSON.stringify([aCategory.id])
    },
    // 5. A2-PAKET
    {
      title: "A2-PAKET",
      tag: "MOTORRAD AUFSTIEG",
      price: "€ 1.249",
      courseType: "DAY",
      features: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "6 UE Theoriekurs (A)",
        "14 Fahrlektionen",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      titleDe: "A2-PAKET",
      titleTr: "A2-PAKET",
      titleEn: "A2-PACKAGE",
      titleAr: "باقة فئة A2",
      titleFa: "پکیج A2",
      tagDe: "MOTORRAD AUFSTIEG",
      tagTr: "MOTOSİKLET TIRMANIŞI",
      tagEn: "MOTORCYCLE ASCENT",
      tagAr: "ترقية الدراجات النارية A2",
      tagFa: "ارتقاء موتورسیکلت A2",
      featuresDe: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "6 UE Theoriekurs (A)",
        "14 Fahrlektionen",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      featuresTr: JSON.stringify([
        "İdari giderler",
        "Sigorta",
        "6UE teori kursu (A)",
        "14 sürüş dersi",
        "1. Teori sınavı",
        "1. Uygulama sınavı",
        "Çevrimiçi kod"
      ]),
      featuresEn: JSON.stringify([
        "Administrative fee",
        "Insurance",
        "6 UE theory course (A)",
        "14 driving lessons",
        "1st Theory exam",
        "1st Practical exam",
        "Online code"
      ]),
      featuresAr: JSON.stringify([
        "الرسوم الإدارية",
        "التأمين",
        "دورة نظرية 6 وحدات (A)",
        "14 درس قيادة",
        "الامتحان النظري الأول",
        "الامتحان العملي الأول",
        "كود عبر الإنترنت"
      ]),
      featuresFa: JSON.stringify([
        "هزینه های اداری",
        "بیمه",
        "دوره تئوری 6 ساعته (A)",
        "14 جلسه رانندگی",
        "اولین امتحان تئوری",
        "اولین امتحان عملی",
        "کد آنلاین"
      ]),
      isVisible: true,
      showDate: true,
      showPrice: true,
      order: 5,
      categoryId: aCategory.id,
      categoryIds: JSON.stringify([aCategory.id])
    },
    // 6. A-PAKET
    {
      title: "A-PAKET",
      tag: "MOTORRAD VOLLEINSTIEG",
      price: "€ 1.249",
      courseType: "DAY",
      features: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "6 UE Theoriekurs (A)",
        "14 Fahrlektionen",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      titleDe: "A-PAKET",
      titleTr: "A-PAKET",
      titleEn: "A-PACKAGE",
      titleAr: "باقة فئة A الكاملة",
      titleFa: "پکیج A کامل",
      tagDe: "MOTORRAD VOLLEINSTIEG",
      tagTr: "MOTOSİKLET TAM GENİŞLEME",
      tagEn: "MOTORCYCLE FULL ENTRY",
      tagAr: "المدخل الكامل للدراجات النارية A",
      tagFa: "ورود کامل به موتورسیکلت A",
      featuresDe: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "6 UE Theoriekurs (A)",
        "14 Fahrlektionen",
        "1. Theorie-Prüfung",
        "1. Praxis-Prüfung",
        "Online Code"
      ]),
      featuresTr: JSON.stringify([
        "İdari giderler",
        "Sigorta",
        "6 UE teorisi kursu (A)",
        "14 sürüş dersi",
        "1. Teori sınavı",
        "1. Uygulama sınavı",
        "Çevrimiçi kod"
      ]),
      featuresEn: JSON.stringify([
        "Administrative fee",
        "Insurance",
        "6 UE theory course (A)",
        "14 driving lessons",
        "1st Theory exam",
        "1st Practical exam",
        "Online code"
      ]),
      featuresAr: JSON.stringify([
        "الرسوم الإدارية",
        "التأمين",
        "دورة نظرية 6 وحدات (A)",
        "14 درس قيادة",
        "الامتحان النظري الأول",
        "الامتحان العملي الأول",
        "كود عبر الإنترنت"
      ]),
      featuresFa: JSON.stringify([
        "هزینه های اداری",
        "بیمه",
        "دوره تئوری 6 ساعته (A)",
        "14 جلسه رانندگی",
        "اولین امتحان تئوری",
        "اولین امتحان عملی",
        "کد آنلاین"
      ]),
      isVisible: true,
      showDate: true,
      showPrice: true,
      order: 6,
      categoryId: aCategory.id,
      categoryIds: JSON.stringify([aCategory.id])
    },
    // 7. A-B PAKET (Kombi-Paket)
    {
      title: "A-B PAKET",
      tag: "KOMBI PAKET",
      price: "€ 2.550",
      courseType: "DAY",
      features: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "32 UE Theoriekurs (GW+B)",
        "6 UE Theorikurs (A)",
        "18 Fahrlektionen (B)",
        "14 Fahrlektionen (A)",
        "Nachtfahrtzuschlag",
        "1. Theorie-Prüfung (A&B)",
        "1. Praxis-Prüfung (A&B)",
        "Online Code"
      ]),
      titleDe: "A-B PAKET",
      titleTr: "A-B PAKET",
      titleEn: "A-B PACKAGE",
      titleAr: "باقة A-B المشتركة",
      titleFa: "پکیج ترکیبی A-B",
      tagDe: "KOMBI PAKET",
      tagTr: "KOMBİ PAKET",
      tagEn: "COMBO PACKAGE",
      tagAr: "باقة كومبي المشتركة",
      tagFa: "پکیج ترکیبی",
      featuresDe: JSON.stringify([
        "Verwaltungsaufwand",
        "Versicherung",
        "32 UE Theoriekurs (GW+B)",
        "6 UE Theorikurs (A)",
        "18 Fahrlektionen (B)",
        "14 Fahrlektionen (A)",
        "Nachtfahrtzuschlag",
        "1. Theorie-Prüfung (A&B)",
        "1. Praxis-Prüfung (A&B)",
        "Online Code"
      ]),
      featuresTr: JSON.stringify([
        "İdari giderler",
        "Sigorta",
        "32 UE teorisi kursu (GW+B)",
        "6 UE teorisi kursu (A)",
        "18 sürüş dersi (B)",
        "14 sürüş dersi (A)",
        "Gece seyahati ek ücreti",
        "1. Teori sınavı (A&B)",
        "1. Uygulama sınavı (A&B)",
        "Çevrimiçi kod"
      ]),
      featuresEn: JSON.stringify([
        "Administrative fee",
        "Insurance",
        "32 UE theory course (GW+B)",
        "6 UE theory course (A)",
        "18 driving lessons (B)",
        "14 driving lessons (A)",
        "Night driving surcharge",
        "1st Theory exam (A&B)",
        "1st Practical exam (A&B)",
        "Online code"
      ]),
      featuresAr: JSON.stringify([
        "الرسوم الإدارية",
        "التأمين",
        "دورة نظرية 32 وحدة (GW+B)",
        "دورة نظرية 6 وحدات (A)",
        "18 درس قيادة (B)",
        "14 درس قيادة (A)",
        "رسوم إضافية للقيادة الليلية",
        "الامتحان النظري الأول (A&B)",
        "الامتحان العملي الأول (A&B)",
        "كود عبر الإنترنت"
      ]),
      featuresFa: JSON.stringify([
        "هزینه های اداری",
        "بیمه",
        "دوره تئوری 32 ساعته (GW+B)",
        "دوره تئوری 6 ساعته (A)",
        "18 جلسه رانندگی (B)",
        "14 جلسه رانندگی (A)",
        "هزینه اضافی رانندگی در شب",
        "اولین امتحان تئوری (A&B)",
        "اولین امتحان عملی (A&B)",
        "کد آنلاین"
      ]),
      isVisible: true,
      showDate: true,
      showPrice: true,
      order: 7,
      categoryId: bCategory.id,
      // Render under BOTH B-PAKET and A-PAKET filters
      categoryIds: JSON.stringify([bCategory.id, aCategory.id])
    }
  ];

  // 4. Create all new packages
  for (const pkg of newPackages) {
    const created = await prisma.coursePackage.create({
      data: pkg
    });
    console.log(`Created course package: ${created.title} (${created.id}) under order ${created.order}`);
  }

  console.log("Successfully database re-seeding completed!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
