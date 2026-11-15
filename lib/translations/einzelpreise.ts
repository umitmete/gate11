export interface EinzelpreisItem {
    name: string;
    unit: string;
    price: string;
}

export interface EinzelpreisCategory {
    title: string;
    items: EinzelpreisItem[];
}

export interface EinzelpreiseTranslation {
    btn_text: string;
    btn_law: string;
    modal_title: string;
    modal_subtitle: string;
    legal_badge: string;
    th_service: string;
    th_price: string;
    download_pdf: string;
    close: string;
    vat_included: string;
    price_notes_title: string;
    price_notes_content: string;
    categories: EinzelpreisCategory[];
}

export const einzelpreiseTranslations: Record<string, EinzelpreiseTranslation> = {
    de: {
        btn_text: 'Einzelpreise & Zusatzgebühren einsehen',
        btn_law: 'Gesetzliche Preisauszeichnung (§ 111 KFG)',
        modal_title: 'Einzelpreise & Zusatzgebühren',
        modal_subtitle: 'Übersicht der einzeln verrechneten Ausbildungsleistungen, Prüfungsgebühren und zusätzlichen Kosten.',
        legal_badge: 'Gesetzliche Preisauszeichnung (§ 111 KFG / PrAG)',
        th_service: 'Einzelleistung',
        th_price: 'Einzelpreis',
        download_pdf: 'Offizielles PDF herunterladen',
        close: 'Schließen',
        vat_included: 'Alle Preise verstehen sich inklusive der gesetzlichen Umsatzsteuer (Bruttopreise).',
        price_notes_title: 'Hinweise zu den Preisen',
        price_notes_content: 'Die angegebenen Beträge gelten für die jeweils bezeichnete Einzelleistung. Zuschläge sind mit einem Pluszeichen (+) gekennzeichnet und werden bei entsprechender Inanspruchnahme zusätzlich verrechnet. Informationen zu Ausbildungspaketen und externen Gebühren finden Sie im Bereich Fahrakademie.',
        categories: [
            {
                title: 'Allgemeine Gebühren',
                items: [
                    { name: 'Verwaltungsaufwand', unit: 'je Vorgang', price: '75,00 €' },
                    { name: 'Versicherungspauschale', unit: 'je Vorgang', price: '25,00 €' },
                    { name: 'Lernmaterial', unit: 'je Ausgabe', price: '48,00 €' },
                    { name: 'L-Tafel', unit: 'je Stück', price: '20,00 €' },
                    { name: 'Vertragsverlängerung', unit: 'je Verlängerung', price: '100,00 €' },
                ]
            },
            {
                title: 'Theorieunterricht',
                items: [
                    { name: 'Grundwissen (GW 01–10)', unit: 'je Theoriemodul', price: '20,00 €' },
                    { name: 'Klasse B (B 1–6)', unit: 'je Theoriemodul', price: '20,00 €' },
                    { name: 'Theorie-Einzelunterricht', unit: 'je Einheit', price: '40,00 €' },
                ]
            },
            {
                title: 'Praktische Ausbildung',
                items: [
                    { name: 'Fahrlektion Klasse B', unit: 'je Fahrlektion (50 Min.)', price: '65,00 €' },
                    { name: 'Fahrlektion Klasse A', unit: 'je Fahrlektion (50 Min.)', price: '69,00 €' },
                    { name: 'Nachtfahrt', unit: 'je Fahrt', price: '79,00 €' },
                    { name: 'Beobachtungsfahrt', unit: 'je Fahrt', price: '65,00 €' },
                    { name: 'Vorbereitung Klasse A', unit: 'je Einheit', price: '50,00 €' },
                ]
            },
            {
                title: 'Begleitetes Fahren / Einweisungen',
                items: [
                    { name: '1. Begleiterschulung', unit: 'je Schulung', price: '65,00 €' },
                    { name: '2. Begleiterschulung', unit: 'je Schulung', price: '65,00 €' },
                    { name: 'B-L17: 1. Begleiterschulung', unit: 'je Schulung', price: '130,00 €' },
                    { name: 'B-L17: 2. Begleiterschulung', unit: 'je Schulung', price: '130,00 €' },
                    { name: 'Dual/L17: Theoretische Einweisung', unit: 'je Einheit', price: '50,00 €' },
                    { name: 'Theoretische Einweisung', unit: 'je Einheit', price: '50,00 €' },
                ]
            },
            {
                title: 'Prüfungsgebühren',
                items: [
                    { name: 'Theorieprüfung (alle Klassen)', unit: 'je Prüfungsantritt', price: '120,00 €' },
                    { name: 'Praktische Prüfung (alle Klassen)', unit: 'je Prüfungsantritt', price: '150,00 €' },
                ]
            },
            {
                title: 'Wiederholungen & Nichtantritt',
                items: [
                    { name: 'Wiederholungsgebühr Theorie', unit: 'je Wiederholung', price: '120,00 €' },
                    { name: 'Wiederholungsgebühr Praxis', unit: 'je Wiederholung', price: '150,00 €' },
                    { name: 'Nichtantrittsgebühr Theorie', unit: 'je Nichtantritt', price: '120,00 €' },
                    { name: 'Nichtantrittsgebühr Praxis', unit: 'je Nichtantritt', price: '150,00 €' },
                ]
            },
            {
                title: 'Mehrphasenausbildung',
                items: [
                    { name: '1. Perfektionsfahrt', unit: 'je Fahrt', price: '120,00 €' },
                    { name: '2. Perfektionsfahrt', unit: 'je Fahrt', price: '120,00 €' },
                    { name: 'Perfektionsfahrt Klasse A', unit: 'je Fahrt', price: '130,00 €' },
                ]
            },
            {
                title: 'Zuschläge',
                items: [
                    { name: 'Zuschlag ab 17:00 Uhr oder samstags', unit: 'zusätzlich', price: '+10,00 €' },
                    { name: 'Zuschlag ab 20:00 Uhr', unit: 'zusätzlich', price: '+20,00 €' },
                    { name: 'Nachtfahrtzuschlag', unit: 'zusätzlich', price: '+20,00 €' },
                ]
            }
        ]
    },
    en: {
        btn_text: 'View Individual Prices & Additional Fees',
        btn_law: 'Statutory Price Specification (§ 111 KFG)',
        modal_title: 'Individual Prices & Additional Fees',
        modal_subtitle: 'Overview of separately invoiced training services, examination fees, and additional costs.',
        legal_badge: 'Statutory Price Specification (§ 111 KFG / PrAG)',
        th_service: 'Individual Service',
        th_price: 'Unit Price',
        download_pdf: 'Download Official PDF',
        close: 'Close',
        vat_included: 'All prices are inclusive of statutory VAT (gross prices).',
        price_notes_title: 'Notes on Prices',
        price_notes_content: 'The stated amounts apply to each individual service indicated. Surcharges are marked with a plus sign (+) and are charged additionally when incurred. Information on training packages and external fees can be found in the Driving Academy section.',
        categories: [
            {
                title: 'General Fees',
                items: [
                    { name: 'Administration fee', unit: 'per process', price: '75.00 €' },
                    { name: 'Insurance flat rate', unit: 'per process', price: '25.00 €' },
                    { name: 'Learning materials', unit: 'per set', price: '48.00 €' },
                    { name: 'L-Plate', unit: 'per piece', price: '20.00 €' },
                    { name: 'Contract extension', unit: 'per extension', price: '100.00 €' },
                ]
            },
            {
                title: 'Theory Lessons',
                items: [
                    { name: 'Basic Knowledge (GW 01–10)', unit: 'per theory module', price: '20.00 €' },
                    { name: 'Class B (B 1–6)', unit: 'per theory module', price: '20.00 €' },
                    { name: 'Individual Theory Lesson', unit: 'per unit', price: '40.00 €' },
                ]
            },
            {
                title: 'Practical Driving Training',
                items: [
                    { name: 'Driving Lesson Class B', unit: 'per lesson (50 min.)', price: '65.00 €' },
                    { name: 'Driving Lesson Class A', unit: 'per lesson (50 min.)', price: '69.00 €' },
                    { name: 'Night Drive', unit: 'per drive', price: '79.00 €' },
                    { name: 'Observation Drive', unit: 'per drive', price: '65.00 €' },
                    { name: 'Preparation Class A', unit: 'per unit', price: '50.00 €' },
                ]
            },
            {
                title: 'Accompanied Driving / Briefings',
                items: [
                    { name: '1st Companion Training', unit: 'per training', price: '65.00 €' },
                    { name: '2nd Companion Training', unit: 'per training', price: '65.00 €' },
                    { name: 'B-L17: 1st Companion Training', unit: 'per training', price: '130.00 €' },
                    { name: 'B-L17: 2nd Companion Training', unit: 'per training', price: '130.00 €' },
                    { name: 'Dual/L17: Theoretical Briefing', unit: 'per unit', price: '50.00 €' },
                    { name: 'Theoretical Briefing', unit: 'per unit', price: '50.00 €' },
                ]
            },
            {
                title: 'Examination Fees',
                items: [
                    { name: 'Theory Exam (all classes)', unit: 'per exam attempt', price: '120.00 €' },
                    { name: 'Practical Exam (all classes)', unit: 'per exam attempt', price: '150.00 €' },
                ]
            },
            {
                title: 'Retakes & Non-Attendance',
                items: [
                    { name: 'Theory Retake Fee', unit: 'per repetition', price: '120.00 €' },
                    { name: 'Practical Retake Fee', unit: 'per repetition', price: '150.00 €' },
                    { name: 'Theory Non-Attendance Fee', unit: 'per missed exam', price: '120.00 €' },
                    { name: 'Practical Non-Attendance Fee', unit: 'per missed exam', price: '150.00 €' },
                ]
            },
            {
                title: 'Multi-Phase Training',
                items: [
                    { name: '1st Perfection Drive', unit: 'per drive', price: '120.00 €' },
                    { name: '2nd Perfection Drive', unit: 'per drive', price: '120.00 €' },
                    { name: 'Perfection Drive Class A', unit: 'per drive', price: '130.00 €' },
                ]
            },
            {
                title: 'Surcharges',
                items: [
                    { name: 'Surcharge after 17:00 or Saturdays', unit: 'additional', price: '+10.00 €' },
                    { name: 'Surcharge after 20:00', unit: 'additional', price: '+20.00 €' },
                    { name: 'Night driving surcharge', unit: 'additional', price: '+20.00 €' },
                ]
            }
        ]
    },
    tr: {
        btn_text: 'Tekil Fiyatlar & Ek Ücretler Tarifesini İncele',
        btn_law: 'Avusturya Yasal Fiyat Tarifesi (§ 111 KFG)',
        modal_title: 'Tekil Fiyatlar & Ek Ücretler',
        modal_subtitle: 'Ayrı olarak faturalandırılan eğitim hizmetleri, sınav ücretleri ve ek maliyetlerin dökümü.',
        legal_badge: 'Yasal Fiyat Bildirimi (§ 111 KFG / PrAG)',
        th_service: 'Hizmet Kalemi',
        th_price: 'Birim Fiyat',
        download_pdf: 'Resmi PDF İndir / Aç',
        close: 'Kapat',
        vat_included: 'Tüm fiyatlara yasal KDV dahildir (Brüt fiyatlar).',
        price_notes_title: 'Fiyatlandırma Notları',
        price_notes_content: 'Belirtilen tutarlar ilgili tekil hizmet kalemi için geçerlidir. Artı (+) işareti ile belirtilen ek ücretler, ilgili hizmetin kullanılması halinde ayrıca fatura edilir. Kurs paketleri ve harici resmi harçlar hakkında detaylı bilgi Fahrakademie sayfasında yer almaktadır.',
        categories: [
            {
                title: 'Genel İdari Ücretler',
                items: [
                    { name: 'Dosya ve Yönetim Masrafı', unit: 'işlem başına', price: '75,00 €' },
                    { name: 'Sigorta Sabit Ücreti', unit: 'işlem başına', price: '25,00 €' },
                    { name: 'Eğitim / Ders Materyali', unit: 'set başına', price: '48,00 €' },
                    { name: 'L-Levhası (L-Tafel)', unit: 'adet', price: '20,00 €' },
                    { name: 'Sözleşme Süresi Uzatma', unit: 'uzatma başına', price: '100,00 €' },
                ]
            },
            {
                title: 'Teori Eğitimi',
                items: [
                    { name: 'Temel Bilgi (GW 01–10)', unit: 'teori modülü başına', price: '20,00 €' },
                    { name: 'B Sınıfı Özel (B 1–6)', unit: 'teori modülü başına', price: '20,00 €' },
                    { name: 'Birebir Teori Özel Dersi', unit: 'ders saati başına', price: '40,00 €' },
                ]
            },
            {
                title: 'Pratik Direksiyon Eğitimi',
                items: [
                    { name: 'B Sınıfı Direksiyon Dersi', unit: 'ders başına (50 Dk.)', price: '65,00 €' },
                    { name: 'A Sınıfı Direksiyon Dersi', unit: 'ders başına (50 Dk.)', price: '69,00 €' },
                    { name: 'Gece Sürüş Dersi', unit: 'sürüş başına', price: '79,00 €' },
                    { name: 'Gözlem Sürüşü', unit: 'sürüş başına', price: '65,00 €' },
                    { name: 'A Sınıfı Hazırlık Dersi', unit: 'ders saati başına', price: '50,00 €' },
                ]
            },
            {
                title: 'Refakatçi Eğitimi & L17',
                items: [
                    { name: '1. Refakatçi Eğitimi', unit: 'eğitim başına', price: '65,00 €' },
                    { name: '2. Refakatçi Eğitimi', unit: 'eğitim başına', price: '65,00 €' },
                    { name: 'B-L17: 1. Refakatçi Eğitimi', unit: 'eğitim başına', price: '130,00 €' },
                    { name: 'B-L17: 2. Refakatçi Eğitimi', unit: 'eğitim başına', price: '130,00 €' },
                    { name: 'Dual/L17: Teorik Bilgilendirme', unit: 'ders saati başına', price: '50,00 €' },
                    { name: 'Teorik Bilgilendirme', unit: 'ders saati başına', price: '50,00 €' },
                ]
            },
            {
                title: 'Sınav Ücretleri (Kurs)',
                items: [
                    { name: 'Teori Sınavı (Tüm Sınıflar)', unit: 'sınav girişi başına', price: '120,00 €' },
                    { name: 'Direksiyon Sınavı (Tüm Sınıflar)', unit: 'sınav girişi başına', price: '150,00 €' },
                ]
            },
            {
                title: 'Sınav Tekrarları & Katılmama',
                items: [
                    { name: 'Teori Sınav Tekrarı', unit: 'tekrar başına', price: '120,00 €' },
                    { name: 'Direksiyon Sınav Tekrarı', unit: 'tekrar başına', price: '150,00 €' },
                    { name: 'Teori Sınavına Gelmeme Cezası', unit: 'katılmama başına', price: '120,00 €' },
                    { name: 'Direksiyon Sınavına Gelmeme Cezası', unit: 'katılmama başına', price: '150,00 €' },
                ]
            },
            {
                title: 'Çok Aşamalı Eğitim (Mehrphasen)',
                items: [
                    { name: '1. Geliştirme Sürüşü (Perfektionsfahrt)', unit: 'sürüş başına', price: '120,00 €' },
                    { name: '2. Geliştirme Sürüşü (Perfektionsfahrt)', unit: 'sürüş başına', price: '120,00 €' },
                    { name: 'A Sınıfı Geliştirme Sürüşü', unit: 'sürüş başına', price: '130,00 €' },
                ]
            },
            {
                title: 'Zaman & Gece Farkı Ücretleri',
                items: [
                    { name: 'Saat 17:00 Sonrası veya Cumartesi Farkı', unit: 'ek ücret', price: '+10,00 €' },
                    { name: 'Saat 20:00 Sonrası Farkı', unit: 'ek ücret', price: '+20,00 €' },
                    { name: 'Gece Sürüş Farkı', unit: 'ek ücret', price: '+20,00 €' },
                ]
            }
        ]
    },
    ar: {
        btn_text: 'عرض الأسعار الفردية والرسوم الإضافية',
        btn_law: 'بيان الأسعار القانوني (§ 111 KFG)',
        modal_title: 'الأسعار الفردية والرسوم الإضافية',
        modal_subtitle: 'نظرة عامة على خدمات التدريب ورسوم الامتحانات والتكاليف الإضافية المفردة.',
        legal_badge: 'بيان الأسعار القانوني (§ 111 KFG / PrAG)',
        th_service: 'الخدمة الفردية',
        th_price: 'السعر الفردي',
        download_pdf: 'تحميل ملف PDF الرسمي',
        close: 'إغلاق',
        vat_included: 'جميع الأسعار تشمل ضريبة القيمة المضافة القانونية (أسعار إجمالية).',
        price_notes_title: 'ملاحظات حول الأسعار',
        price_notes_content: 'المبالغ المذكورة تنطبق على كل خدمة فردية محددة. الرسوم الإضافية مميزة بعلامة زائد (+) ويتم احتسابها بشكل إضافي عند الاستفادة منها. لمزيد من المعلومات حول باقات التدريب والرسوم الخارجية، يرجى مراجعة قسم أكاديمية القيادة.',
        categories: [
            {
                title: 'الرسوم العامة والإدارية',
                items: [
                    { name: 'المصاريف الإدارية', unit: 'لكل معاملة', price: '75,00 €' },
                    { name: 'رسوم التأمين الثابتة', unit: 'لكل معاملة', price: '25,00 €' },
                    { name: 'المواد التعليمية', unit: 'لكل مجموعة', price: '48,00 €' },
                    { name: 'لوحة التدريب L-Tafel', unit: 'لكل قطعة', price: '20,00 €' },
                    { name: 'تمديد العقد', unit: 'لكل تمديد', price: '100,00 €' },
                ]
            },
            {
                title: 'الدروس النظرية',
                items: [
                    { name: 'المعرفة الأساسية (GW 01–10)', unit: 'لكل وحدة نظرية', price: '20,00 €' },
                    { name: 'الفئة B (B 1–6)', unit: 'لكل وحدة نظرية', price: '20,00 €' },
                    { name: 'درس نظري فردي خاص', unit: 'لكل حصة', price: '40,00 €' },
                ]
            },
            {
                title: 'التدريب العملي على القيادة',
                items: [
                    { name: 'درس قيادة فئة B', unit: 'لكل درس (50 دقيقة)', price: '65,00 €' },
                    { name: 'درس قيادة فئة A', unit: 'لكل درس (50 دقيقة)', price: '69,00 €' },
                    { name: 'القيادة الليلية', unit: 'لكل جولة', price: '79,00 €' },
                    { name: 'جولة المراقبة', unit: 'لكل جولة', price: '65,00 €' },
                    { name: 'التحضير لفئة A', unit: 'لكل حصة', price: '50,00 €' },
                ]
            },
            {
                title: 'القيادة المرافقة وتدريب L17',
                items: [
                    { name: 'تدريب المرافق الأول', unit: 'لكل تدريب', price: '65,00 €' },
                    { name: 'تدريب المرافق الثاني', unit: 'لكل تدريب', price: '65,00 €' },
                    { name: 'B-L17: تدريب المرافق الأول', unit: 'لكل تدريب', price: '130,00 €' },
                    { name: 'B-L17: تدريب المرافق الثاني', unit: 'لكل تدريب', price: '130,00 €' },
                    { name: 'Dual/L17: إرشادات نظرية', unit: 'لكل حصة', price: '50,00 €' },
                    { name: 'إرشادات نظرية عامة', unit: 'لكل حصة', price: '50,00 €' },
                ]
            },
            {
                title: 'رسوم الامتحانات',
                items: [
                    { name: 'امتحان النظري (جميع الفئات)', unit: 'لكل دخول للامتحان', price: '120,00 €' },
                    { name: 'امتحان العملي (جميع الفئات)', unit: 'لكل دخول للامتحان', price: '150,00 €' },
                ]
            },
            {
                title: 'الإعادة وعدم الحضور',
                items: [
                    { name: 'رسوم إعادة الامتحان النظري', unit: 'لكل إعادة', price: '120,00 €' },
                    { name: 'رسوم إعادة الامتحان العملي', unit: 'لكل إعادة', price: '150,00 €' },
                    { name: 'رسوم التغيب عن الامتحان النظري', unit: 'لكل تغيب', price: '120,00 €' },
                    { name: 'رسوم التغيب عن الامتحان العملي', unit: 'لكل تغيب', price: '150,00 €' },
                ]
            },
            {
                title: 'التدريب متعدد المراحل (Mehrphasen)',
                items: [
                    { name: 'جولة القيادة التكميلية الأولى', unit: 'لكل جولة', price: '120,00 €' },
                    { name: 'جولة القيادة التكميلية الثانية', unit: 'لكل جولة', price: '120,00 €' },
                    { name: 'جولة القيادة التكميلية فئة A', unit: 'لكل جولة', price: '130,00 €' },
                ]
            },
            {
                title: 'الرسوم الإضافية للأوقات الخاصة',
                items: [
                    { name: 'رسوم بعد الساعة 17:00 أو أيام السبت', unit: 'إضافي', price: '+10,00 €' },
                    { name: 'رسوم بعد الساعة 20:00', unit: 'إضافي', price: '+20,00 €' },
                    { name: 'رسوم القيادة الليلية الإضافية', unit: 'إضافي', price: '+20,00 €' },
                ]
            }
        ]
    },
    fa: {
        btn_text: 'مشاهده قیمت‌های تکی و هزینه‌های جانبی',
        btn_law: 'تعرفه قانونی قیمت‌ها (§ 111 KFG)',
        modal_title: 'قیمت‌های تکی و هزینه‌های جانبی',
        modal_subtitle: 'بررسی هزینه‌های آموزش جداگانه، امتحانات و مخارج جانبی.',
        legal_badge: 'تعرفه قانونی شفاف‌سازی قیمت (§ 111 KFG / PrAG)',
        th_service: 'عنوان خدمت',
        th_price: 'قیمت واحد',
        download_pdf: 'دانلود فایل رسمی PDF',
        close: 'بستن',
        vat_included: 'تمامی قیمت‌ها شامل مالیات بر ارزش افزوده قانونی می‌باشد (قیمت‌های ناخالص).',
        price_notes_title: 'یادداشت‌های قیمت‌گذاری',
        price_notes_content: 'مبالغ درج شده برای هر خدمت مشخص شده معتبر است. هزینه‌های اضافه با علامت بعلاوه (+) مشخص شده‌اند و در صورت استفاده محاسبه می‌گردند. اطلاعات بسته‌های آموزشی و هزینه‌های دولتی در بخش آکادمی رانندگی موجود است.',
        categories: [
            {
                title: 'هزینه‌های عمومی و اداری',
                items: [
                    { name: 'هزینه امور اداری و پرونده', unit: 'به ازای هر فرایند', price: '75,00 €' },
                    { name: 'تعرفه ثابت بیمه', unit: 'به ازای هر فرایند', price: '25,00 €' },
                    { name: 'کتاب و بسته آموزشی', unit: 'به ازای هر بسته', price: '48,00 €' },
                    { name: 'تابلوی آموزشی L', unit: 'هر عدد', price: '20,00 €' },
                    { name: 'تمدید قرارداد', unit: 'به ازای هر تمدید', price: '100,00 €' },
                ]
            },
            {
                title: 'آموزش تئوری',
                items: [
                    { name: 'دانش پایه (GW 01–10)', unit: 'هر ماژول تئوری', price: '20,00 €' },
                    { name: 'پایه B اختصاصی (B 1–6)', unit: 'هر ماژول تئوری', price: '20,00 €' },
                    { name: 'تدریس خصوصی تئوری', unit: 'هر جلسه', price: '40,00 €' },
                ]
            },
            {
                title: 'آموزش عملی رانندگی',
                items: [
                    { name: 'جلسه رانندگی پایه B', unit: 'هر جلسه (۵۰ دقیقه)', price: '65,00 €' },
                    { name: 'جلسه رانندگی پایه A', unit: 'هر جلسه (۵۰ دقیقه)', price: '69,00 €' },
                    { name: 'رانندگی در شب', unit: 'هر نوبت', price: '79,00 €' },
                    { name: 'رانندگی نظارتی', unit: 'هر نوبت', price: '65,00 €' },
                    { name: 'آمادگی پایه A', unit: 'هر جلسه', price: '50,00 €' },
                ]
            },
            {
                title: 'رانندگی با همراه و دوره L17',
                items: [
                    { name: 'آموزش همراه اول', unit: 'هر دوره', price: '65,00 €' },
                    { name: 'آموزش همراه دوم', unit: 'هر دوره', price: '65,00 €' },
                    { name: 'B-L17: آموزش همراه اول', unit: 'هر دوره', price: '130,00 €' },
                    { name: 'B-L17: آموزش همراه دوم', unit: 'هر دوره', price: '130,00 €' },
                    { name: 'Dual/L17: راهنمایی تئوری', unit: 'هر جلسه', price: '50,00 €' },
                    { name: 'راهنمایی تئوری عمومی', unit: 'هر جلسه', price: '50,00 €' },
                ]
            },
            {
                title: 'هزینه‌های آزمون',
                items: [
                    { name: 'آزمون تئوری (همه پایه‌ها)', unit: 'هر بار شرکت در آزمون', price: '120,00 €' },
                    { name: 'آزمون عملی (همه پایه‌ها)', unit: 'هر بار شرکت در آزمون', price: '150,00 €' },
                ]
            },
            {
                title: 'تکرار آزمون و عدم حضور',
                items: [
                    { name: 'هزینه تکرار آزمون تئوری', unit: 'هر بار تکرار', price: '120,00 €' },
                    { name: 'هزینه تکرار آزمون عملی', unit: 'هر بار تکرار', price: '150,00 €' },
                    { name: 'جریمه عدم حضور در آزمون تئوری', unit: 'هر بار غیبت', price: '120,00 €' },
                    { name: 'جریمه عدم حضور در آزمون عملی', unit: 'هر بار غیبت', price: '150,00 €' },
                ]
            },
            {
                title: 'آموزش چند مرحله‌ای (Mehrphasen)',
                items: [
                    { name: 'نوبت اول رانندگی تکمیلی', unit: 'هر نوبت', price: '120,00 €' },
                    { name: 'نوبت دوم رانندگی تکمیلی', unit: 'هر نوبت', price: '120,00 €' },
                    { name: 'رانندگی تکمیلی پایه A', unit: 'هر نوبت', price: '130,00 €' },
                ]
            },
            {
                title: 'هزینه‌های ساعات خاص و شب',
                items: [
                    { name: 'هزینه بعد از ساعت ۱۷:۰۰ یا شنبه‌ها', unit: 'اضافه', price: '+10,00 €' },
                    { name: 'هزینه بعد از ساعت ۲۰:۰۰', unit: 'اضافه', price: '+20,00 €' },
                    { name: 'هزینه اضافی رانندگی در شب', unit: 'اضافه', price: '+20,00 €' },
                ]
            }
        ]
    }
};

