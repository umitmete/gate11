export type Language = 'de' | 'en' | 'tr' | 'ar' | 'fa';

export const translations = {
    de: {
        nav: {
            start: 'Start',
            about: 'Über uns',
            courses: 'Fahrakademie',
            pricing: 'Preise',
            vehicles: 'Fahrzeuge',
            team: 'Team',
            plan: 'Jahresplan',
            register: 'Voranmeldung',
            contact: 'Kontakt',
            kurstermine: 'Kurse',
            courses_day: 'Tageskurse',
            courses_night: 'Abendkurse'
        },
        hero: {
            title: 'GATE',
            subtitle: 'Die Verbindung von Luxus und Kompetenz.',
            description: 'Schule auf den neuesten Modellen von Volkswagen, BMW und Kawasaki Z650. Erlebe moderne Systeme ab Tag eins.',
            cta_journey: 'REISE STARTEN',
            cta_courses: 'KURSE ENTDECKEN',
            establishment: 'SEIT 2019 • WIEN'
        },
        about: {
            hero_title: 'Exzellenz am',
            hero_italic: 'Steuer',
            hero_desc: 'Willkommen bei Wiens exklusivster Adresse für moderne Fahrausbildung. Wir begleiten Sie mit Stil, Präzision und Verstand.',
            phil_title: 'Unsere Philosophie',
            phil_h2: 'Fahren ist eine Kunst, die wir zur Meisterschaft führen.',
            phil_p1: 'Seit 2019 verfolgt GATE 11 eine Vision: Fahrausbildung als Erlebnis von Qualität und Prestige zu etablieren.',
            phil_p2: 'Jeder Schüler ist ein Individuum. Unsere Mentoren vermitteln ein tiefes Verständnis für Fahrzeug und Straße.',
            values_title: 'Die GATE 11 Standards',
            values: [
                { title: 'Premium Flotte', desc: 'Schulung auf modernsten Modellen von Volkswagen, BMW und Kawasaki Z650.' },
                { title: 'Exklusive Mentoren', desc: 'Hochqualifizierte Mentoren, die Ruhe und Kompetenz ausstrahlen.' },
                { title: 'Digitale Avantgarde', desc: 'Effizientes Lernen durch modernste digitale Plattformen.' }
            ],
            team_title: 'Das Team',
            team_h2: 'Erfahrung trifft auf Engagement.',
            team_p1: 'Ein handverlesenes Team aus Experten, die Leidenschaft für erstklassigen Service teilen.',
            team_p2: 'Vertrauen ist das Foundation jeder sicheren Fahrt. Wir freuen uns auf Sie.',
            team_cta: 'Lernen Sie uns kennen',
            cta_title: 'Ihre Startbahn zum Erfolg.',
            cta_desc: 'Bereit für den ersten Schritt? Wir freuen uns auf Sie.',
            cta_button: 'Besuchen Sie uns',
            quality_badge: 'Gate11 Qualität',
            quality_quote: '"Exzellenz ist kein Ziel, sondern ein Standard."'
        },
        courses: {
            badge: 'ERSTKLASSIGE AUSBILDUNG',
            title: 'Fahrakademie',
            subtitle: 'Flexible Ausbildungspakete für Ihren Erfolg.',
            loading: 'Wird geladen...',
            cta: 'JETZT ANMELDEN',
            next_course: 'Nächster Kurs',
            soon: 'Bald verfügbar',
            no_packages: 'Derzeit sind keine Kurspakete verfügbar.',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'Der Klassiker',
                    price: '€ 1.490',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "32 UE Theoriekurs (GW+B)",
                        "18 Fahrlektionen",
                        "Nachtfahrtzuschlag",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'Duale Ausbildung',
                    price: '€ 1.249',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "32 UE Theoriekurs (GW+B)",
                        "12 Fahrlektionen",
                        "1 UE Theoretische Einweisung",
                        "2X L Tafel",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: 'Vorgezogene Lenkerberechtigung',
                    price: '€ 1.649',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "32 UE Theoriekurs (GW+B)",
                        "17 Fahrlektionen",
                        "1 UE Vorbesprechung",
                        "2 UE Nachbesprechung",
                        "2X L17 Tafel",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'Motorrad Einstieg',
                    price: '€ 1.349',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "26 UE Theoriekurs (GW+A)",
                        "14 Fahrlektionen",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'Motorrad Aufstieg',
                    price: '€ 1.249',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "6UE Theoriekurs (A)",
                        "14 Fahrlektionen",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'Motorrad Vollausbau',
                    price: '€ 1.249',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "6 UE Theoriekurs (A)",
                        "14 Fahrlektionen",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                }
            ]
        },
        nightCourses: {
            badge: 'ERSTKLASSIGE AUSBILDUNG',
            title: 'Fahrakademie (Abend)',
            subtitle: 'Flexible Ausbildungspakete für Ihren Erfolg.',
            loading: 'Wird geladen...',
            cta: 'JETZT ANMELDEN',
            next_course: 'Nächster Kurs',
            soon: 'Bald verfügbar',
            no_packages: 'Derzeit sind keine Kurspakete verfügbar.',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'Der Klassiker',
                    price: '€ 1.490',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "32 UE Theoriekurs (GW+B)",
                        "18 Fahrlektionen",
                        "Nachtfahrtzuschlag",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'Duale Ausbildung',
                    price: '€ 1.249',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "32 UE Theoriekurs (GW+B)",
                        "12 Fahrlektionen",
                        "1 UE Theoretische Einweisung",
                        "2X L Tafel",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: 'Vorgezogene Lenkerberechtigung',
                    price: '€ 1.649',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "32 UE Theoriekurs (GW+B)",
                        "17 Fahrlektionen",
                        "1 UE Vorbesprechung",
                        "2 UE Nachbesprechung",
                        "2X L17 Tafel",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'Einstieg Motorrad',
                    price: '€ 1.349',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "26 UE Theoriekurs (GW+A)",
                        "14 Fahrlektionen",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'Aufstieg Motorrad',
                    price: '€ 1.249',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "6 UE Theoriekurs (A)",
                        "14 Fahrlektionen",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                        "Online Code"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'Voll Motorrad',
                    price: '€ 1.249',
                    features: [
                        "Verwaltungsaufwand",
                        "Versicherung",
                        "6 UE Theoriekurs (A)",
                        "14 Fahrlektionen",
                        "1. Theorie-Prüfung",
                        "1. Praxis-Prüfung",
                    ]
                }
            ]
        },
        kurstermine: {
            title: 'Kurs',
            titleOutline: 'termine',
            subtitle: 'Unsere aktuellen Theoriekurse auf einen Blick. Planen Sie Ihren Erfolg mit GATE 11.',
            intensive: 'Intensivkurs',
            evening: 'Abendkurs',
            columns: {
                date: 'Datum',
                time: 'Uhrzeit',
                abk: 'Abk.',
                topics: 'Themen'
            },
            noData: 'Keine Termine verfügbar.',
            loading: 'Wird geladen...'
        },
        pricing: {
            title: 'Preise',
            subtitle: 'Transparente Preise für erstklassige Ausbildung.',
            action: 'AKTION',
            request: 'Anfrage',
            cta_secure: 'JETZT SICHERN',
            cta_request: 'ANFRAGEN',
            note: 'Hinweis: Behördengebühren und ärztliche Gutachten sind nicht enthalten.'
        },
        vehicles: {
            badge: 'Ingenieurskunst Exzellenz',
            title: 'Unsere Flotte',
            subtitle: 'Meistere die Straße in Fahrzeugen, die technische Exzellenz definieren.',
            cta: 'VORANMELDUNG',
            reveal: {
                title: 'DAS BIEST',
                model: 'BMW M2 CS 2025',
                badge: 'Österreich Premiere',
                subtitle: 'Der Erste und Einzige.',
                description: 'Exklusiv bei GATE 11. Erleben Sie die rohe Kraft von 530 PS in seiner elegantesten Form. Ein Statement in Schwarz.',
                features: ['530 PS', '3.5s 0-100', 'M Race Track']
            }
        },
        plans: {
            title: 'Jahresplan',
            subtitle: 'Ihre Übersicht für das gesamte Ausbildungsjahr.',
            h2: 'Strukturierte Ausbildung',
            desc: 'Wir planen vorausschauend, damit Sie Ihren Führerschein perfekt integrierekn önnen.',
            status: 'Aktueller Status',
            active: 'AKTIV',
            download: 'PLAN DOWNLOADEN (PDF)'
        },
        team: {
            badge: 'Gate11 Kollektiv',
            title: 'Das Team',
            subtitle: 'Profis mit Herz und Verstand. Wir begleiten Sie mit Expertise und Geduld.',
            license: 'Klassen',
            noMembers: 'Keine Teammitglieder gefunden.'
        },
        stats: {
            students: 'Schüler Zertifiziert',
            vehicles: 'Premium Fahrzeuge',
            instructors: 'Experten Lehrer',
            success: 'Erfolgsquote'
        },
        features: {
            title: 'Warum GATE11?',
            subtitle: 'Wir folgen keinen Standards. Wir setzen sie.',
            philosophy: 'UNSERE PHILOSOPHIE LESEN',
            fleet_title: 'Premium Flotte',
            fleet_desc: 'Schule auf den neuesten Modellen von Volkswagen, BMW und Kawasaki Z650. Erlebe moderne Systeme ab Tag eins.',
            digital_title: 'Digital Zuerst',
            digital_desc: 'Von der Online-Anmeldung bis zum digitalen Fortschritt. Wir schätzen Ihre Zeit und Effizienz.',
            mentorship_title: 'Exklusives Mentoring',
            mentorship_desc: 'Unsere Lehrer sind Mentoren, die ruhige, selbstbewusste und professionelle Fahrer formen.'
        },
        cta: {
            title: 'Bereit für das Steuer?',
            description: 'Dein Führerschein wartet auf dich. Starte deine Reise heute bei Wiens exklusivster Fahrschule.',
            button: 'STUDENT WERDEN'
        },
        contact: {
            station: 'Station',
            distance: '260 METER'
        },
        footer: {
            description: 'Deine Startbahn zum Führerschein in Wien-Simmering. Premium Ausbildung für maximale Sicherheit.',
            contact: 'Kontakt',
            address: 'Adresse',
            phone: 'Telefon',
            email: 'E-Mail',
            hours: 'Öffnungszeiten',
            slogan: 'Die Verbindung von Luxus und Kompetenz.',
            addressLine: 'Simmeringer Hauptstraße 179',
            cityLine: '1110 Wien, Österreich',
            rights: 'Alle Rechte vorbehalten.',
            standards: {
                title: 'Standards & Sprache',
                certified: 'Staatlich geprüfte Fahrlehrer',
                austrian: 'Ausbildung nach österreichischen Richtlinien'
            },
            schedule: {
                monThu: 'Mo - Do',
                fri: 'Fr',
                satSun: 'Sa - So',
                closed: 'Geschlossen'
            },
            legal: {
                impressum: 'Impressum',
                privacy: 'Datenschutz',
                agb: 'AGB',
                cookies: 'Cookies'
            }
        },
        preRegistration: {
            title: 'Voranmeldung',
            subtitle: 'Online',
            portal: 'Gate11 Portal',
            steps: {
                personal: 'Persönlich',
                address: 'Adresse',
                course: 'Kurswahl',
                documents: 'Dokumente'
            },
            fields: {
                firstName: 'Vorname',
                lastName: 'Nachname',
                birthDate: 'Geburtsdatum',
                email: 'E-Mail',
                phone: 'Telefon',
                street: 'Straße & Hausnummer',
                zipCode: 'PLZ',
                city: 'Stadt',
                courseSelection: 'Kurs auswählen'
            },
            docs: {
                info: 'DIGITALE EINREICHUNG: LADE DEINE DOKUMENTE JETZT HOCH, UM DEN PROZESS IM BÜRO ZU BESCHLEUNIGEN.',
                idCard: 'PERSONALAUSWEIS',
                passport: 'REISEPASS',
                firstAid: 'ERSTE-HILFE-ZERTIFIKAT',
                residence: 'MELDEZETTEL',
                optional: 'OPTIONAL',
                bringLater: 'Ich bringe es zur Anmeldung mit',
                uploaded: 'HOCHGELADEN',
                select: 'DATEI AUSWÄHLEN',
                front: 'Vorderseite',
                back: 'Rückseite'
            },
            nav: {
                back: 'ZURÜCK',
                next: 'WEITER',
                submit: 'ABSENDEN'
            },
            success: {
                title: 'Voranmeldung erhalten!',
                desc: 'Vielen Dank, {name}. Deine Daten wurden erfolgreich übermittelt.',
                deadline: 'Bitte kommen Sie innerhalb von 3 Tagen in unser Büro, um Ihre Anmeldung abzuschließen.',
                download: 'BESTÄTIGUNG ALS PDF',
                home: 'ZURÜCK ZUR STARTSEITE'
            }
        },
        privacy: {
            title: 'Datenschutzerklärung',
            sections: [
                {
                    title: '1. Allgemeine Hinweise',
                    content: 'Der Schutz Ihrer personenbezogenen Daten ist uns ein besonderes Anliegen. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO), dem österreichischen Datenschutzgesetz (DSG) sowie dem Telekommunikationsgesetz (TKG 2021). Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Verarbeitung personenbezogener Daten im Rahmen unseres Internetauftritts.'
                },
                {
                    title: '2. Verantwortlicher im Sinne der DSGVO',
                    content: 'Fahrschule Gate 11\nInhaber: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Wien\nÖsterreich\n\nTelefon: +43 1 767 32 87\nE-Mail: drive@fahrschulegate11.at'
                },
                {
                    title: '3. Personenbezogene Daten',
                    content: 'Personenbezogene Daten sind alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen, z. B.: Name, Adresse, Telefonnummer, E-Mail-Adresse, IP-Adresse, Nutzungsdaten.'
                },
                {
                    title: '4. Verarbeitung personenbezogener Daten',
                    content: 'Wir verarbeiten personenbezogene Daten ausschließlich dann, wenn mindestens eine der folgenden Voraussetzungen erfüllt ist:\n- Sie haben Ihre ausdrückliche Einwilligung erteilt (Art. 6 Abs. 1 lit. a DSGVO)\n- die Verarbeitung ist zur Vertragserfüllung oder vorvertraglicher Maßnahmen erforderlich (Art. 6 Abs. 1 lit. b DSGVO)\n- die Verarbeitung erfolgt zur Erfüllung einer rechtlichen Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO)\n- die Verarbeitung ist zur Wahrung berechtigter Interessen erforderlich (Art. 6 Abs. 1 lit. f DSGVO).'
                },
                {
                    title: '5. Zugriffsdaten / Server-Logfiles',
                    content: 'Beim Besuch unserer Website werden automatisch folgende Daten erfasst: IP-Adresse (anonymisiert), Datum und Uhrzeit des Zugriffs, aufgerufene Seiten, Browsertyp und Browserversion, verwendetes Betriebssystem, Referrer-URL. Diese Daten dienen ausschließlich der Sicherstellung eines störungsfreien Betriebs, Systemsicherheit und technischen Optimierung. Eine Zusammenführung dieser Daten mit anderen Datenquellen erfolgt nicht.'
                },
                {
                    title: '6. Cookies',
                    content: 'Unsere Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden. Arten von Cookies: Notwendige Cookies (technisch erforderlich), Statistik-Cookies, Marketing-Cookies. Nicht notwendige Cookies werden nur mit Ihrer ausdrücklichen Einwilligung gesetzt.\nRechtsgrundlage:\n- Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)\n- Art. 6 Abs. 1 lit. f DSGVO (technisch notwendige Cookies)\nSie können Ihre Cookie-Einstellungen jederzeit ändern oder widerrufen.'
                },
                {
                    title: '7. Kontaktformular und E-Mail-Kontakt',
                    content: 'Wenn Sie uns per Kontaktformular oder E-Mail kontaktieren, werden Ihre Angaben inklusive der angegebenen Kontaktdaten zur Bearbeitung Ihrer Anfrage gespeichert. Zweck: Bearbeitung Ihrer Anfrage. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Diese Daten werden nicht ohne Ihre Einwilligung weitergegeben.'
                },
                {
                    title: '8. WhatsApp-Kontakt',
                    content: 'Wenn Sie uns über WhatsApp kontaktieren, erfolgt die Kommunikation über WhatsApp Ireland Ltd. Bitte beachten Sie, dass WhatsApp personenbezogene Daten eigenständig verarbeitet. Die Nutzung von WhatsApp erfolgt freiwillig.'
                },
                {
                    title: '9. Google Analytics',
                    content: 'Diese Website nutzt Google Analytics, einen Webanalysedienst der Google Ireland Limited. IP-Anonymisierung ist aktiviert. Datenverarbeitung nur nach Einwilligung. Datenübertragung in Drittländer möglich (Standardvertragsklauseln). Sie können Ihre Einwilligung jederzeit widerrufen.'
                },
                {
                    title: '10. Meta Pixel (Facebook & Instagram)',
                    content: 'Sofern Sie eingewilligt haben, verwenden wir das Meta Pixel der Meta Platforms Ireland Ltd. Zweck: Reichweitenmessung, Conversion-Tracking, personalisierte Werbung. Die erhobenen Daten sind für uns anonym. Meta kann diese Daten mit Ihrem Nutzerprofil verknüpfen.'
                },
                {
                    title: '11. Social Media Links',
                    content: 'Unsere Website enthält Links zu sozialen Netzwerken (z. B. Facebook, Instagram). Es handelt sich um reine Verlinkungen. Für die Datenverarbeitung auf den jeweiligen Plattformen ist ausschließlich der jeweilige Anbieter verantwortlich.'
                },
                {
                    title: '12. Speicherdauer',
                    content: 'Personenbezogene Daten werden nur so lange gespeichert, wie dies für den jeweiligen Zweck erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.'
                },
                {
                    title: '13. Ihre Rechte gemäß DSGVO',
                    content: 'Sie haben jederzeit das Recht auf:\n- Auskunft (Art. 15 DSGVO)\n- Berichtigung (Art. 16 DSGVO)\n- Löschung (Art. 17 DSGVO)\n- Einschränkung der Verarbeitung (Art. 18 DSGVO)\n- Datenübertragbarkeit (Art. 20 DSGVO)\n- Widerruf Ihrer Einwilligung (Art. 7 DSGVO)\n- Beschwerde bei der Datenschutzbehörde'
                },
                {
                    title: '14. Datenschutzbehörde',
                    content: 'Österreichische Datenschutzbehörde: https://www.dsb.gv.at'
                },
                {
                    title: '15. Datensicherheit',
                    content: 'Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen Verlust, Manipulation, unbefugten Zugriff oder Offenlegung zu schützen.'
                },
                {
                    title: '16. Änderungen dieser Datenschutzerklärung',
                    content: 'Diese Datenschutzerklärung ist aktuell gültig und wird bei rechtlichen oder technischen Änderungen angepasst.'
                }
            ]
        },
        impressum: {
            title: 'Impressum',
            sections: [
                {
                    title: 'Angaben gemäß § 5 ECG, § 14 UGB und § 63 GewO',
                    content: 'Fahrschule Gate 11\nInhaber: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Wien\nÖsterreich'
                },
                {
                    title: 'Kontakt',
                    content: 'Telefon: +43 1 767 32 87\nE-Mail: drive@fahrschulegate11.at'
                },
                {
                    title: 'Unternehmensgegenstand',
                    content: 'Betrieb einer Fahrschule sowie Ausbildung von Kraftfahrzeuglenkern gemäß den geltenden gesetzlichen Bestimmungen.'
                },
                {
                    title: 'Aufsichtsbehörde',
                    content: 'Magistrat der Stadt Wien'
                },
                {
                    title: 'Berufsrechtliche Vorschriften',
                    content: 'Kraftfahrgesetz (KFG)\nFahrschulgesetz\nDSGVO, DSG, TKG 2021'
                },
                {
                    title: 'Verbraucherstreitbeilegung',
                    content: 'Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.'
                },
                {
                    title: 'Haftung für Inhalte',
                    content: 'Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.'
                },
                {
                    title: 'Haftung für Links',
                    content: 'Unsere Website enthält Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen Einfluss und übernehmen dafür keine Haftung.'
                },
                {
                    title: 'Urheberrecht',
                    content: 'Die durch die Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem österreichischen Urheberrecht.'
                }
            ]
        },
        agb: {
            title: 'Allgemeine Geschäftsbedingungen (AGB)',
            sections: [
                {
                    title: '1. Geltungsbereich',
                    content: 'Diese AGB gelten für alle Verträge, Leistungen und Angebote der Fahrschule Gate 11 gegenüber ihren Kunden. Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, ihrer Geltung wurde ausdrücklich schriftlich zugestimmt.'
                },
                {
                    title: '2. Leistungen',
                    content: 'Die Fahrschule bietet insbesondere an:\n- theoretische und praktische Fahrausbildung\n- Prüfungsvorbereitung\n- gesetzlich vorgeschriebene Schulungen\n- Beratungsleistungen\nDer genaue Leistungsumfang ergibt sich aus dem individuellen Ausbildungsvertrag.'
                },
                {
                    title: '3. Vertragsabschluss',
                    content: 'Der Vertrag kommt durch Anmeldung des Kunden und Annahme durch die Fahrschule zustande. Die Anmeldung ist verbindlich.'
                },
                {
                    title: '4. Preise und Zahlung',
                    content: 'Alle Preise verstehen sich in Euro (€) inkl. gesetzlicher Umsatzsteuer. Zahlungen sind fristgerecht zu leisten. Bei Zahlungsverzug ist die Fahrschule berechtigt, Leistungen auszusetzen.'
                },
                {
                    title: '5. Terminvereinbarung und Stornierung',
                    content: 'Fahrstunden sind verbindlich vereinbart. Eine kostenfreie Stornierung ist nur möglich, wenn diese mindestens 24 Stunden vor dem Termin erfolgt. Bei Nichterscheinen oder verspäteter Absage wird die Fahrstunde voll verrechnet.'
                },
                {
                    title: '6. Pflichten des Kunden',
                    content: 'Der Kunde verpflichtet sich:\n- richtige Angaben zu machen\n- den Anweisungen der Fahrlehrer Folge zu leisten\n- gesundheitliche Einschränkungen mitzuteilen\n- gesetzliche Voraussetzungen zu erfüllen'
                },
                {
                    title: '7. Haftung',
                    content: 'Die Fahrschule haftet nur bei Vorsatz oder grober Fahrlässigkeit. Bei leichter Fahrlässigkeit haftet sie nur bei Verletzung wesentlicher Vertragspflichten und begrenzt auf den vorhersehbaren Schaden. Eine Haftung für Nichtbestehen von Prüfungen, Terminverschiebungen oder höhere Gewalt ist ausgeschlossen.'
                },
                {
                    title: '8. Datenschutz',
                    content: 'Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutzerklärung auf der Website.'
                },
                {
                    title: '9. Kündigung / Rücktritt',
                    content: 'Ein Rücktritt vom Vertrag ist nur aus wichtigem Grund möglich. Bereits erbrachte Leistungen sind zu bezahlen.'
                },
                {
                    title: '10. Gerichtsstand und Recht',
                    content: 'Es gilt österreichisches Recht. Gerichtsstand ist Wien, sofern gesetzlich zulässig.'
                },
                {
                    title: '11. Salvatorische Klausel',
                    content: 'Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen unberührt.'
                }
            ]
        },
        cookies: {
            title: 'Cookie-Richtlinie',
            sections: [
                {
                    title: '1. Allgemeines',
                    content: 'Diese Website verwendet Cookies und ähnliche Technologien, um den Betrieb der Website sicherzustellen, statistische Auswertungen zu ermöglichen und Marketingmaßnahmen durchzuführen.'
                },
                {
                    title: '2. Was sind Cookies?',
                    content: 'Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden und Informationen enthalten können.'
                },
                {
                    title: '3. Arten von Cookies',
                    content: 'a) Notwendige Cookies: Technisch erforderlich, Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.\nb) Statistik-Cookies: Helfen uns die Website zu verbessern, Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).\nc) Marketing-Cookies: Personalisierte Werbung, Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO.'
                },
                {
                    title: '4. Cookie-Einwilligung',
                    content: 'Beim ersten Besuch unserer Website können Sie alle Cookies akzeptieren, nur notwendige zulassen oder individuelle Einstellungen vornehmen. Ihre Einwilligung können Sie jederzeit widerrufen.'
                },
                {
                    title: '5. Drittanbieter',
                    content: 'Cookies können von Google Ireland Limited und Meta Platforms Ireland Ltd gesetzt werden. Eine Datenübertragung in Drittländer ist möglich (Standardvertragsklauseln).'
                },
                {
                    title: '6. Speicherdauer',
                    content: 'Cookies werden entweder nach Ende der Sitzung gelöscht oder für eine definierte Dauer gespeichert.'
                },
                {
                    title: '7. Verwaltung von Cookies',
                    content: 'Sie können Cookies jederzeit über Browser-Einstellungen oder das Cookie-Banner verwalten oder löschen.'
                },
                {
                    title: '8. Aktualität',
                    content: 'Diese Cookie-Richtlinie wird bei technischen oder rechtlichen Änderungen angepasst.'
                }
            ]
        }
    },
    en: {
        nav: {
            start: 'Home',
            about: 'About Us',
            courses: 'Academy',
            pricing: 'Pricing',
            vehicles: 'Vehicles',
            team: 'Team',
            plan: 'Annual Plan',
            register: 'Pre-Register',
            contact: 'Contact',
            kurstermine: 'Courses',
            courses_day: 'Day Courses',
            courses_night: 'Night Courses'
        },
        hero: {
            title: 'GATE',
            subtitle: 'The intersection of luxury and competence.',
            description: 'Train on the latest models from Volkswagen, BMW and Kawasaki Z650. Experience modern systems from day one.',
            cta_journey: 'START JOURNEY',
            cta_courses: 'EXPLORE COURSES',
            establishment: 'EST. 2019 • VIENNA'
        },
        about: {
            hero_title: 'Excellence at the',
            hero_italic: 'Wheel',
            hero_desc: 'Welcome to Vienna’s most exclusive address for modern driving education. We guide you with style, precision, and wisdom.',
            phil_title: 'Our Philosophy',
            phil_h2: 'Driving is an art that we lead to mastery.',
            phil_p1: 'Since 2019, GATE 11 has pursued a vision: to establish driving education as an experience of quality and prestige.',
            phil_p2: 'Every student is an individual. Our mentors convey a deep understanding of the vehicle and the road.',
            values_title: 'The GATE 11 Standards',
            values: [
                { title: 'Premium Fleet', desc: 'Training on the latest models from Volkswagen, BMW and Kawasaki Z650.' },
                { title: 'Exclusive Mentors', desc: 'Highly qualified mentors who radiate calm and competence.' },
                { title: 'Digital Avant-Garde', desc: 'Efficient learning through state-of-the-art digital platforms.' }
            ],
            team_title: 'The Team',
            team_h2: 'Experience meets commitment.',
            team_p1: 'A hand-picked team of experts sharing a passion for first-class service.',
            team_p2: 'Trust is the foundation of every safe drive. We look forward to meeting you.',
            team_cta: 'Get to know us',
            cta_title: 'Your runway to success.',
            cta_desc: 'Ready for the first step? We look forward to meeting you.',
            cta_button: 'Visit us'
        },
        nightCourses: {
            badge: 'EDUCATION ELITE',
            title: 'Driving Academy (Night)',
            subtitle: 'Flexible training packages for your success.',
            loading: 'Loading...',
            cta: 'REGISTER NOW',
            next_course: 'Next Course',
            soon: 'Coming Soon',
            no_packages: 'Currently no course packages available.',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'The Classic',
                    price: '€ 1.490',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "32 units theory course (Basic+B)",
                        "18 driving lessons",
                        "Night driving surcharge",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'Dual Education',
                    price: '€ 1.249',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "32 units theory course (Basic+B)",
                        "12 driving lessons",
                        "1 unit theory briefing",
                        "2X L plate",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: 'Early License at 17',
                    price: '€ 1.649',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "32 units theory course (Basic+B)",
                        "17 driving lessons",
                        "1 unit pre-briefing",
                        "2 units post-briefing",
                        "2X L17 plate",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'Motorcycle Entry',
                    price: '€ 1.349',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "26 units theory course (Basic+A)",
                        "14 driving lessons",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'Motorcycle Upgrade',
                    price: '€ 1.249',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "6 units theory course (A)",
                        "14 driving lessons",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'Full Motorcycle',
                    price: '€ 1.249',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "6 units theory course (A)",
                        "14 driving lessons",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                }
            ]
        },
        courses: {
            badge: 'EDUCATION ELITE',
            title: 'Driving Academy',
            subtitle: 'Flexible training packages for your success.',
            loading: 'Loading...',
            cta: 'REGISTER NOW',
            next_course: 'Next Course',
            soon: 'Coming Soon',
            no_packages: 'Currently no course packages available.',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'The Classic',
                    price: '€ 1.490',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "32 units theory course (Basic+B)",
                        "18 driving lessons",
                        "Night driving surcharge",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'Dual Education',
                    price: '€ 1.249',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "32 units theory course (Basic+B)",
                        "12 driving lessons",
                        "1 unit theoretical briefing",
                        "2X L sign",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: 'Pre-License at 17',
                    price: '€ 1.649',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "32 units theory course (Basic+B)",
                        "17 driving lessons",
                        "1 unit pre-briefing",
                        "2 units post-briefing",
                        "2X L17 sign",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'Motorcycle Entry',
                    price: '€ 1.349',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "26 units theory course (Basic+A)",
                        "14 driving lessons",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'Motorcycle Upgrade',
                    price: '€ 1.249',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "6 units theory course (A)",
                        "14 driving lessons",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'Motorcycle Full',
                    price: '€ 1.249',
                    features: [
                        "Administrative fee",
                        "Insurance",
                        "6 units theory course (A)",
                        "14 driving lessons",
                        "1st Theory exam",
                        "1st Practical exam",
                        "Online code"
                    ]
                }
            ]
        },
        kurstermine: {
            title: 'Course',
            titleOutline: 'dates',
            subtitle: 'Our current theory courses at a glance. Plan your success with GATE 11.',
            intensive: 'Intensive Course',
            evening: 'Evening Course',
            columns: {
                date: 'Date',
                time: 'Time',
                abk: 'Course Code',
                topics: 'Topics'
            },
            noData: 'No dates available.',
            loading: 'Loading...'
        },
        pricing: {
            title: 'Pricing',
            subtitle: 'Transparent prices for first-class education.',
            action: 'ACTION',
            request: 'On Request',
            cta_secure: 'SECURE NOW',
            cta_request: 'INQUIRE',
            note: 'Note: Administrative fees and medical reports are not included.'
        },
        vehicles: {
            badge: 'Engineering Excellence',
            title: 'Our Fleet',
            subtitle: 'Master the road in vehicles that define engineering excellence.',
            cta: 'PRE-REGISTRATION',
            reveal: {
                title: 'THE BEAST',
                model: 'BMW M2 CS 2025',
                badge: 'Austria Premiere',
                subtitle: 'The First and Only.',
                description: 'Exclusive to GATE 11. Experience the raw power of 460 HP in its most elegant form. A statement in Black.',
                features: ['460 HP', '3.8s 0-100', 'M Driver\'s Package']
            }
        },
        plans: {
            title: 'Annual Plan',
            subtitle: 'Your overview for the entire training year.',
            h2: 'Structured Education',
            desc: 'We plan ahead so you can perfectly integrate your license into your life.',
            status: 'Current Status',
            active: 'ACTIVE',
            download: 'DOWNLOAD PLAN (PDF)'
        },
        team: {
            badge: 'Gate11 Collective',
            title: 'The Team',
            subtitle: 'Professionals with heart and mind. We guide you with expertise and patience.',
            license: 'Classes',
            noMembers: 'No team members found.'
        },
        stats: {
            students: 'Students Certified',
            vehicles: 'Premium Vehicles',
            instructors: 'Expert Instructors',
            success: 'Success Rate'
        },
        features: {
            title: 'Why GATE11?',
            subtitle: "We don't just follow standards. We set them.",
            philosophy: 'READ OUR PHILOSOPHY',
            fleet_title: 'Premium Fleet',
            fleet_desc: 'Train in the latest models from Volkswagen, BMW and Kawasaki Z650. Experience modern systems from day one.',
            digital_title: 'Digital First',
            digital_desc: 'From online registration to digital progress tracking. We value your time and efficiency.',
            mentorship_title: 'Exclusive Mentorship',
            mentorship_desc: 'Our instructors are mentors crafting calm, confident, and professional drivers.'
        },
        cta: {
            title: 'Ready to take the wheel?',
            description: 'Your license is waiting. Start your journey with Vienna’s most prestigious driving academy today.',
            button: 'BECOME A STUDENT'
        },
        contact: {
            station: 'Station',
            distance: '260 METERS'
        },
        footer: {
            description: 'Your runway to a driving license in Vienna-Simmering. Premium training for maximum safety.',
            contact: 'Contact',
            address: 'Address',
            phone: 'Phone',
            email: 'Email',
            hours: 'Opening Hours',
            slogan: 'Where luxury meets competence.',
            addressLine: 'Simmeringer Hauptstraße 179',
            cityLine: '1110 Vienna, Austria',
            rights: 'All rights reserved.',
            standards: {
                title: 'Standards & Languages',
                certified: 'State-certified driving instructors',
                austrian: 'Training according to Austrian guidelines'
            },
            schedule: {
                monThu: 'Mon - Thu',
                fri: 'Fri',
                satSun: 'Sat - Sun',
                closed: 'Closed'
            },
            legal: {
                impressum: 'Legal Notice',
                privacy: 'Privacy Policy',
                agb: 'T&C',
                cookies: 'Cookies'
            }
        },
        preRegistration: {
            title: 'Pre-Registration',
            subtitle: 'Online',
            portal: 'Gate11 Portal',
            steps: {
                personal: 'Personal',
                address: 'Address',
                course: 'Course',
                documents: 'Documents'
            },
            fields: {
                firstName: 'First Name',
                lastName: 'Last Name',
                birthDate: 'Birth Date',
                email: 'E-Mail',
                phone: 'Phone',
                street: 'Street & No.',
                zipCode: 'Zip Code',
                city: 'City',
                courseSelection: 'Select Course'
            },
            docs: {
                info: 'DIGITAL SUBMISSION: UPLOAD YOUR DOCUMENTS NOW TO SPEED UP THE PROCESS IN THE OFFICE.',
                idCard: 'ID CARD',
                passport: 'PASSPORT',
                firstAid: 'FIRST AID CERTIFICATE',
                residence: 'RESIDENCE CERTIFICATE',
                optional: 'OPTIONAL',
                bringLater: 'I will bring it with me during registration',
                uploaded: 'UPLOADED',
                select: 'SELECT FILE',
                front: 'Front',
                back: 'Back'
            },
            nav: {
                back: 'BACK',
                next: 'NEXT',
                submit: 'SUBMIT'
            },
            success: {
                title: 'Registration Received!',
                desc: 'Thank you, {name}. Your data has been successfully transmitted.',
                deadline: 'Please come to our office within 3 days to complete your registration.',
                download: 'DOWNLOAD PDF',
                home: 'BACK TO HOME'
            }
        },
        privacy: {
            title: 'Privacy Policy',
            sections: [
                {
                    title: '1. General Information',
                    content: 'The protection of your personal data is a special concern of ours. We treat your personal data confidentially and in accordance with statutory data protection regulations, in particular the General Data Protection Regulation (GDPR), the Austrian Data Protection Act (DSG) and the Telecommunications Act (TKG 2021). This privacy policy informs you about the type, scope and purpose of the processing of personal data within the framework of our website.'
                },
                {
                    title: '2. Controller in the sense of the GDPR',
                    content: 'Fahrschule Gate 11\nOwner: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Vienna\nAustria\n\nPhone: +43 1 767 32 87\nE-mail: drive@fahrschulegate11.at'
                },
                {
                    title: '3. Personal Data',
                    content: 'Personal data is all information that relates to an identified or identifiable natural person, e.g.: Name, address, phone number, e-mail address, IP address, usage data.'
                },
                {
                    title: '4. Processing of Personal Data',
                    content: 'We process personal data only if at least one of the following conditions is met:\n- You have given your express consent (Art. 6 para. 1 lit. a GDPR)\n- processing is necessary for the performance of a contract or pre-contractual measures (Art. 6 para. 1 lit. b GDPR)\n- processing is necessary to fulfill a legal obligation (Art. 6 para. 1 lit. c GDPR)\n- processing is necessary to protect legitimate interests (Art. 6 para. 1 lit. f GDPR).'
                },
                {
                    title: '5. Access Data / Server Logfiles',
                    content: 'When you visit our website, the following data is automatically collected: IP address (anonymized), date and time of access, pages accessed, browser type and browser version, operating system used, referrer URL. This data serves exclusively to ensure trouble-free operation, system security and technical optimization. This data is not merged with other data sources.'
                },
                {
                    title: '6. Cookies',
                    content: 'Our website uses cookies. Cookies are small text files that are stored on your end device. Types of cookies: Necessary cookies (technically required), statistics cookies, marketing cookies. Non-essential cookies are only set with your express consent.\nLegal basis:\n- Art. 6 para. 1 lit. a GDPR (consent)\n- Art. 6 para. 1 lit. f GDPR (technically necessary cookies)\nYou can change or revoke your cookie settings at any time.'
                },
                {
                    title: '7. Contact Form and E-Mail Contact',
                    content: 'If you contact us via the contact form or e-mail, your details including the contact data provided will be stored for the purpose of processing your request. Purpose: Processing your request. Legal basis: Art. 6 para. 1 lit. b GDPR. This data will not be passed on without your consent.'
                },
                {
                    title: '8. WhatsApp Contact',
                    content: 'If you contact us via WhatsApp, communication takes place via WhatsApp Ireland Ltd. Please note that WhatsApp processes personal data independently. The use of WhatsApp is voluntary.'
                },
                {
                    title: '9. Google Analytics',
                    content: 'This website uses Google Analytics, a web analysis service of Google Ireland Limited. IP anonymization is active. Data processing only after consent. Data transfer to third countries possible (standard contractual clauses). You can revoke your consent at any time.'
                },
                {
                    title: '10. Meta Pixel (Facebook & Instagram)',
                    content: 'Provided you have given your consent, we use the Meta Pixel from Meta Platforms Ireland Ltd. Purpose: Reach measurement, conversion tracking, personalized advertising. The data collected is anonymous to us. Meta can link this data to your user profile.'
                },
                {
                    title: '11. Social Media Links',
                    content: 'Our website contains links to social networks (e.g. Facebook, Instagram). These are pure links. For data processing on the respective platforms, the respective provider is exclusively responsible.'
                },
                {
                    title: '12. Storage Duration',
                    content: 'Personal data is only stored for as long as is necessary for the respective purpose or as required by statutory storage obligations.'
                },
                {
                    title: '13. Your Rights under the GDPR',
                    content: 'You have the right at any time to:\n- Information (Art. 15 GDPR)\n- Rectification (Art. 16 GDPR)\n- Erasure (Art. 17 GDPR)\n- Restriction of processing (Art. 18 GDPR)\n- Data portability (Art. 20 GDPR)\n- Withdrawal of your consent (Art. 7 GDPR)\n- Complaint to the data protection authority'
                },
                {
                    title: '14. Data Protection Authority',
                    content: 'Austrian Data Protection Authority: https://www.dsb.gv.at'
                },
                {
                    title: '15. Data Security',
                    content: 'We use technical and organizational security measures to protect your data against loss, manipulation, unauthorized access or disclosure.'
                },
                {
                    title: '16. Changes to this Privacy Policy',
                    content: 'This privacy policy is currently valid and will be adjusted in the event of legal or technical changes.'
                }
            ]
        },
        impressum: {
            title: 'Legal Notice',
            sections: [
                {
                    title: 'Details according to § 5 ECG, § 14 UGB and § 63 GewO',
                    content: 'Driving School Gate 11\nOwner: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Vienna\nAustria'
                },
                {
                    title: 'Contact',
                    content: 'Phone: +43 1 767 32 87\nE-mail: drive@fahrschulegate11.at'
                },
                {
                    title: 'Nature of Business',
                    content: 'Operation of a driving school and training of motor vehicle drivers in accordance with applicable legal regulations.'
                },
                {
                    title: 'Supervisory Authority',
                    content: 'Municipal Department of the City of Vienna'
                },
                {
                    title: 'Professional Regulations',
                    content: 'Motor Vehicle Act (KFG)\nDriving School Act\nGDPR, DSG, TKG 2021'
                },
                {
                    title: 'Consumer Dispute Resolution',
                    content: 'We are not obligated and not prepared to participate in dispute resolution proceedings before a consumer arbitration board.'
                },
                {
                    title: 'Liability for Content',
                    content: 'The content of our pages was created with great care. However, we cannot guarantee the correctness, completeness and up-to-dateness of the content.'
                },
                {
                    title: 'Liability for Links',
                    content: 'Our website contains links to external websites of third parties. We have no influence on their content and assume no liability for it.'
                },
                {
                    title: 'Copyright',
                    content: 'The content and works created by the page operators on this website are subject to Austrian copyright law.'
                }
            ]
        },
        agb: {
            title: 'General Terms and Conditions (GTC)',
            sections: [
                {
                    title: '1. Scope',
                    content: 'These GTC apply to all contracts, services and offers of Driving School Gate 11 to its customers. Deviating conditions of the customer are not recognized unless their validity has been expressly agreed in writing.'
                },
                {
                    title: '2. Services',
                    content: 'The driving school specifically offers:\n- theoretical and practical driving training\n- examination preparation\n- legally required courses\n- consulting services\nThe exact scope of services results from the individual training contract.'
                },
                {
                    title: '3. Conclusion of Contract',
                    content: 'The contract is concluded by the registration of the customer and acceptance by the driving school. Registration is binding.'
                },
                {
                    title: '4. Prices and Payment',
                    content: 'All prices are in Euro (€) incl. statutory VAT. Payments must be made on time. In the event of late payment, the driving school is entitled to suspend services.'
                },
                {
                    title: '5. Appointment and Cancellation',
                    content: 'Driving lessons are bindingly agreed. Free cancellation is only possible if it takes place at least 24 hours before the appointment. In the event of non-appearance or late cancellation, the driving lesson will be charged in full.'
                },
                {
                    title: '6. Duties of the Customer',
                    content: 'The customer commits to:\n- provide correct information\n- follow the instructions of the driving instructors\n- disclose health restrictions\n- fulfill legal requirements'
                },
                {
                    title: '7. Liability',
                    content: 'The driving school is only liable for intent or gross negligence. In the case of light negligence, it is only liable for the violation of essential contractual obligations and limited to the foreseeable damage. Liability for failure in exams, delays, or force majeure is excluded.'
                },
                {
                    title: '8. Data Protection',
                    content: 'Processing of personal data according to the privacy policy on the website.'
                },
                {
                    title: '9. Termination / Withdrawal',
                    content: 'Withdrawal from the contract is only possible for good cause. Services already provided must be paid for.'
                },
                {
                    title: '10. Jurisdiction and Law',
                    content: 'Austrian law applies. Place of jurisdiction is Vienna, as far as legally permissible.'
                },
                {
                    title: '11. Severability Clause',
                    content: 'Should individual provisions be ineffective, the effectiveness of the remaining provisions remains unaffected.'
                }
            ]
        },
        cookies: {
            title: 'Cookie Policy',
            sections: [
                {
                    title: '1. General',
                    content: 'This website uses cookies and similar technologies to ensure the operation of the website, enable statistical evaluation and carry out marketing measures.'
                },
                {
                    title: '2. What are Cookies?',
                    content: 'Cookies are small text files that are stored on your device and can contain information.'
                },
                {
                    title: '3. Types of Cookies',
                    content: 'a) Necessary Cookies: Technically required, legal basis: Art. 6 para. 1 lit. f GDPR.\nb) Statistics Cookies: Help us improve the website, legal basis: Art. 6 para. 1 lit. a GDPR (consent).\nc) Marketing Cookies: Personalized ads, legal basis: Art. 6 para. 1 lit. a GDPR.'
                },
                {
                    title: '4. Cookie Consent',
                    content: 'When you first visit our website, you can accept all cookies, allow only necessary ones, or make individual settings. You can revoke your consent at any time.'
                },
                {
                    title: '5. Third Parties',
                    content: 'Cookies can be set by Google Ireland Limited and Meta Platforms Ireland Ltd. Data transfer to third countries is possible (standard contractual clauses).'
                },
                {
                    title: '6. Storage Duration',
                    content: 'Cookies are either deleted at the end of the session or stored for a defined duration.'
                },
                {
                    title: '7. Cookie Management',
                    content: 'You can manage or delete cookies at any time via browser settings or the cookie banner.'
                },
                {
                    title: '8. Currency',
                    content: 'This cookie policy is adjusted in the event of technical or legal changes.'
                }
            ]
        }
    },
    tr: {
        nav: {
            start: 'Ana Sayfa',
            about: 'Hakkımızda',
            courses: 'Akademi',
            pricing: 'Fiyatlar',
            vehicles: 'Araçlar',
            team: 'Ekip',
            plan: 'Yıllık Plan',
            register: 'Ön Kayıt',
            contact: 'İletişim',
            kurstermine: 'Kurslar',
            courses_day: 'Gündüz Kursları',
            courses_night: 'Akşam Kursları'
        },
        hero: {
            title: 'GATE',
            subtitle: 'Lüks ve yetkinliğin kesişme noktası.',
            description: 'Volkswagen, BMW ve Kawasaki Z650\'nin en yeni modellerinde eğitim alın. İlk günden itibaren modern sistemleri deneyimleyin.',
            cta_journey: 'YOLCULUĞA BAŞLA',
            cta_courses: 'KURSLARI KEŞFET',
            establishment: '2019’DAN BERİ • VİYANA'
        },
        about: {
            hero_title: 'Direksiyonda',
            hero_italic: 'Mükemmeliyet',
            hero_desc: 'Modern sürücü eğitimi için Viyana\'nın en seçkin adresine hoş geldiniz. Size stil, hassasiyet ve bilgiyle rehberlik ediyoruz.',
            phil_title: 'Felsefemiz',
            phil_h2: 'Sürüş, ustalığa ulaştırdığımız bir sanattır.',
            phil_p1: '2019\'dan beri GATE 11 bir vizyonun peşinde: Sürücü eğitimini bir kalite ve prestij deneyimi olarak sunmak.',
            phil_p2: 'Her öğrenci bir bireydir. Mentorlarımız araç ve yol hakkında derin bir anlayış kazandırır.',
            values_title: 'GATE 11 Standartları',
            values: [
                { title: 'Premium Filo', desc: 'Volkswagen, BMW ve Kawasaki Z650\'nin en modern modellerinde eğitim.' },
                { title: 'Özel Mentorlar', desc: 'Sakinlik ve yetkinlik yayan yüksek nitelikli mentorlar.' },
                { title: 'Dijital Öncü', desc: 'En modern dijital platformlar üzerinden verimli öğrenme.' }
            ],
            team_title: 'Ekip',
            team_h2: 'Deneyim bağlılıkla buluşuyor.',
            team_p1: 'Birinci sınıf hizmet tutkusunu paylaşan, özenle seçilmiş uzmanlardan oluşan bir ekip.',
            team_p2: 'Güven, her güvenli sürüşün temelidir. Sizinle tanışmayı dört gözle bekliyoruz.',
            team_cta: 'Bizi tanıyın',
            cta_title: 'Başarıya giden pistiniz.',
            cta_desc: 'İlk adım için hazır mısınız? Sizi bekliyoruz.',
            cta_button: 'Bizi ziyaret edin',
            quality_badge: 'Gate11 Kalite',
            quality_quote: '"Mükemmellik bir hedef değil, bir standarttır."'
        },
        courses: {
            badge: 'ÜSTÜN EĞİTİM',
            title: 'Sürüş Akademisi',
            subtitle: 'Başarınız için esnek eğitim paketleri.',
            loading: 'Yükleniyor...',
            cta: 'ŞİMDİ KAYDOL',
            next_course: 'Sıradaki Kurs',
            soon: 'Yakında',
            no_packages: 'Şu anda görüntülenecek kurs paketi bulunmamaktadır.',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'Klasik Paket',
                    price: '€ 1.490',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "32 ders teorik kurs (Temel+B)",
                        "18 direksiyon dersi",
                        "Gece sürüşü farkı",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'Dual Eğitim',
                    price: '€ 1.249',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "32 ders teorik kurs (Temel+B)",
                        "12 direksiyon dersi",
                        "1 ders teorik bilgilendirme",
                        "2X L tabelası",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: '17 Yaşında Ehliyet',
                    price: '€ 1.649',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "32 ders teorik kurs (Temel+B)",
                        "17 direksiyon dersi",
                        "1 ders ön görüşme",
                        "2 ders son değerlendirme",
                        "2X L17 tabelası",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'Motosiklet Giriş',
                    price: '€ 1.349',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "26 ders teorik kurs (Temel+A)",
                        "14 direksiyon dersi",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'Motosiklet Yükseltme',
                    price: '€ 1.249',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "6 ders teorik kurs (A)",
                        "14 direksiyon dersi",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'Motosiklet Tam',
                    price: '€ 1.249',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "6 ders teorik kurs (A)",
                        "14 direksiyon dersi",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                }
            ]
        },
        nightCourses: {
            badge: 'ÜSTÜN EĞİTİM',
            title: 'Sürüş Akademisi (Akşam)',
            subtitle: 'Başarınız için esnek eğitim paketleri.',
            loading: 'Yükleniyor...',
            cta: 'ŞİMDİ KAYDOL',
            next_course: 'Sıradaki Kurs',
            soon: 'Yakında',
            no_packages: 'Şu anda görüntülenecek kurs paketi bulunmamaktadır.',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'Klasik Paket',
                    price: '€ 1.490',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "32 ders teorik kurs (Temel+B)",
                        "18 direksiyon dersi",
                        "Akşam sürüşü farkı",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'Dual Eğitim',
                    price: '€ 1.249',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "32 ders teorik kurs (Temel+B)",
                        "12 direksiyon dersi",
                        "1 ders teorik bilgilendirme",
                        "2X L tabelası",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: '17 Yaşında Ehliyet',
                    price: '€ 1.649',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "32 ders teorik kurs (Temel+B)",
                        "17 direksiyon dersi",
                        "1 ders ön görüşme",
                        "2 ders son değerlendirme",
                        "2X L17 tabelası",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'Motosiklet Giriş',
                    price: '€ 1.349',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "26 ders teorik kurs (Temel+A)",
                        "14 direksiyon dersi",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'Motosiklet Yükseltme',
                    price: '€ 1.249',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "6 ders teorik kurs (A)",
                        "14 direksiyon dersi",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'Motosiklet Tam',
                    price: '€ 1.249',
                    features: [
                        "Yönetim masrafı",
                        "Sigorta",
                        "6 ders teorik kurs (A)",
                        "14 direksiyon dersi",
                        "1. Teorik sınav",
                        "1. Uygulamalı sınav",
                        "Online kod"
                    ]
                }
            ]
        },
        kurstermine: {
            title: 'Kurs',
            titleOutline: 'tarihleri',
            subtitle: 'Güncel teori kurslarımıza genel bakış. Başarınızı GATE 11 ile planlayın.',
            intensive: 'Yoğunlaştırılmış Kurs',
            evening: 'Akşam Kursu',
            columns: {
                date: 'Tarih',
                time: 'Saat',
                abk: 'Ders Kodu',
                topics: 'Konular'
            },
            noData: 'Kurs bulunmamaktadır.',
            loading: 'Yükleniyor...'
        },
        pricing: {
            title: 'Fiyatlar',
            subtitle: 'Birinci sınıf eğitim için şeffaf fiyatlandırma.',
            action: 'KAMPANYA',
            request: 'Sorunuz',
            cta_secure: 'YERİNİZİ AYIRTIN',
            cta_request: 'BİLGİ ALIN',
            note: 'Not: Resmi harçlar ve sağlık raporları fiyata dahil değildir.'
        },
        vehicles: {
            badge: 'Mühendislik Mükemmelliği',
            title: 'Filomuz',
            subtitle: 'Mühendislik mükemmelliğini tanımlayan araçlarla yollara hakim olun.',
            cta: 'ÖN KAYIT',
            reveal: {
                title: 'CANAVAR',
                model: 'BMW M2 CS 2025',
                badge: 'Avusturya Prömiyeri',
                subtitle: 'İlk ve Tek.',
                description: 'Sadece GATE 11\'de. 530 beygir gücünün ham gücünü en zarif formunda deneyimleyin. Siyahtan bir manifesto.',
                features: ['530 HP', '3.5sn 0-100', 'M Yarış Paketi']
            }
        },
        plans: {
            title: 'Yıllık Plan',
            subtitle: 'Tüm eğitim yılı için genel bakışınız.',
            h2: 'Yapılandırılmış Eğitim',
            desc: 'Ehliyetinizi hayatınıza mükemmel şekilde entegre edebilmeniz için önceden planlıyoruz.',
            status: 'Güncel Durum',
            active: 'AKTİF',
            download: 'PLANI İNDİR (PDF)'
        },
        team: {
            badge: 'Gate11 Kollektif',
            title: 'Ekip',
            subtitle: 'Kalbi ve aklıyla uzmanlar. Size tecrübe ve sabırla rehberlik ediyoruz.',
            license: 'Ehliyet Sınıfları',
            noMembers: 'Ekip üyesi bulunamadı.'
        },
        stats: {
            students: 'Sertifikalı Öğrenci',
            vehicles: 'Premium Araç',
            instructors: 'Uzman Eğitmen',
            success: 'Başarı Oranı'
        },
        features: {
            title: 'Neden GATE11?',
            subtitle: 'Standartları takip etmiyoruz. Onları biz belirliyoruz.',
            philosophy: 'FELSEFEMİZİ OKUYUN',
            fleet_title: 'Premium Filo',
            fleet_desc: 'Volkswagen, BMW ve Kawasaki Z650\'nin en yeni modellerinde eğitim alın. İlk günden itibaren modern sistemleri deneyimleyin.',
            digital_title: 'Önce Dijital',
            digital_desc: 'Online ön kayıttan dijital ilerleme takibine kadar. Zamanınıza ve verimliliğinize değer veriyoruz.',
            mentorship_title: 'Özel Mentorluk',
            mentorship_desc: 'Eğitmenlerimiz, sakin, özgüvenli ve profesyonel sürücüler yetiştiren mentorlardır.'
        },
        cta: {
            title: 'Direksiyona geçmeye hazır mısınız?',
            description: 'Ehliyetiniz sizi bekliyor. Yolculuğunuza bugün Viyana’nın en prestijli sürücü akademisinde başlayın.',
            button: 'ÖĞRENCİ OLUN'
        },
        contact: {
            station: 'İstasyon',
            distance: '260 METRE'
        },
        footer: {
            description: 'Viyana-Simmering\'de ehliyete giden pistiniz. Maksimum güvenlik için premium eğitim.',
            contact: 'İletişim',
            address: 'Adres',
            phone: 'Telefon',
            email: 'E-Posta',
            hours: 'Açılış Saatleri',
            slogan: 'Lüks ve yetkinliğin kesişim noktası.',
            addressLine: 'Simmeringer Hauptstraße 179',
            cityLine: '1110 Viyana, Avusturya',
            rights: 'Tüm hakları saklıdır.',
            standards: {
                title: 'Standartlar & Diller',
                certified: 'Devlet onaylı sürüş eğitmenleri',
                austrian: 'Avusturya yönergelerine göre eğitim'
            },
            schedule: {
                monThu: 'Pzt - Per',
                fri: 'Cum',
                satSun: 'Cmt - Paz',
                closed: 'Kapalı'
            },
            legal: {
                impressum: 'Künye',
                privacy: 'Gizlilik Politikası',
                agb: 'Şartlar',
                cookies: 'Çerezler'
            }
        },
        preRegistration: {
            title: 'Ön Kayıt',
            subtitle: 'Online',
            portal: 'Gate11 Portalı',
            steps: {
                personal: 'Kişisel',
                address: 'Adres',
                course: 'Kurs Seçimi',
                documents: 'Belgeler'
            },
            fields: {
                firstName: 'Ad',
                lastName: 'Soyad',
                birthDate: 'Doğum Tarihi',
                email: 'E-Posta',
                phone: 'Telefon',
                street: 'Sokak ve No',
                zipCode: 'Posta Kodu',
                city: 'Şehir',
                courseSelection: 'Kurs Seçin'
            },
            docs: {
                info: 'DİJİTAL TESLİMAT: BELGELERİNİZİ ŞİMDİ YÜKLEYEREK OFİSTEKİ SÜRECİ HIZLANDIRIN.',
                idCard: 'KİMLİK KARTI',
                passport: 'PASAPORT',
                firstAid: 'İLK YARDIM SERTİFİKASI',
                residence: 'İKAMETGAH BELGESİ',
                optional: 'İSTEĞE BAĞLI',
                bringLater: 'Kayıtta yanımda getireceğim',
                uploaded: 'YÜKLENDİ',
                select: 'DOSYA SEÇİN',
                front: 'Ön Yüz',
                back: 'Arka Yüz'
            },
            nav: {
                back: 'GERİ',
                next: 'İLERİ',
                submit: 'GÖNDER'
            },
            success: {
                title: 'Ön Kayıt Alındı!',
                desc: 'Teşekkürler {name}. Verileriniz başarıyla iletildi.',
                deadline: 'Lütfen 3 gün içerisinde ofisimize gelip kaydınızı tamamlayınız.',
                download: 'PDF OLARAK İNDİR',
                home: 'ANA SAYFAYA DÖN'
            }
        },
        privacy: {
            title: 'Gizlilik Politikası',
            sections: [
                {
                    title: '1. Genel Bilgiler',
                    content: 'Kişisel verilerinizin korunması bizim için özel bir önem taşımaktadır. Kişisel verilerinizi gizli tutuyor ve yasal veri koruma düzenlemelerine, özellikle Genel Veri Koruma Yönetmeliği\'ne (GDPR/DSGVO), Avusturya Veri Koruma Yasası\'na (DSG) ve Telekomünikasyon Yasası\'na (TKG 2021) uygun olarak işliyoruz. Bu gizlilik politikası, web sitemiz kapsamında kişisel verilerin işlenmesinin türü, kapsamı ve amacı hakkında sizi bilgilendirmektedir.'
                },
                {
                    title: '2. GDPR Anlamında Sorumlu',
                    content: 'Fahrschule Gate 11\nSahibi: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Viyana\nAvusturya\n\nTelefon: +43 1 767 32 87\nE-Posta: drive@fahrschulegate11.at'
                },
                {
                    title: '3. Kişisel Veriler',
                    content: 'Kişisel veriler, kimliği belirli veya belirlenebilir bir gerçek kişiyle ilgili tüm bilgilerdir; örneğin: İsim, adres, telefon numarası, e-posta adresi, IP adresi, kullanım verileri.'
                },
                {
                    title: '4. Kişisel Verilerin İşlenmesi',
                    content: 'Kişisel verileri yalnızca aşağıdaki koşullardan en az biri karşılandığında işliyoruz:\n- Açık rızanızı verdiyseniz (GDPR Madde 6 fıkra 1 bent a)\n- İşleme, bir sözleşmenin ifası veya sözleşme öncesi önlemler için gerekliyse (GDPR Madde 6 fıkra 1 bent b)\n- İşleme, yasal bir yükümlülüğün yerine getirilmesi için gerekliyse (GDPR Madde 6 fıkra 1 bent c)\n- İşleme, meşru menfaatlerin korunması için gerekliyse (GDPR Madde 6 fıkra 1 bent f).'
                },
                {
                    title: '5. Erişim Verileri / Sunucu Log Dosyaları',
                    content: 'Web sitemizi ziyaret ettiğinizde aşağıdaki veriler otomatik olarak kaydedilir: IP adresi (anonimleştirilmiş), erişim tarihi ve saati, erişilen sayfalar, tarayıcı türü ve sürümü, kullanılan işletim sistemi, yönlendirici URL. Bu veriler yalnızca sorunsuz bir işletim, sistem güvenliği ve teknik optimizasyon sağlamak amacıyla kullanılır. Bu verilerin diğer veri kaynaklarıyla birleştirilmesi yapılmaz.'
                },
                {
                    title: '6. Çerezler',
                    content: 'Web sitemiz çerezler kullanmaktadır. Çerezler, cihazınızda saklanan küçük metin dosyalarıdır. Çerez türleri: Gerekli çerezler (teknik olarak zorunlu), istatistik çerezleri, pazarlama çerezleri. Zorunlu olmayan çerezler yalnızca açık rızanızla yerleştirilir.\nYasal dayanak:\n- GDPR Madde 6 fıkra 1 bent a (Rıza)\n- GDPR Madde 6 fıkra 1 bent f (Teknik olarak gerekli çerezler)\nÇerez ayarlarınızı istediğiniz zaman değiştirebilir veya geri çekebilirsiniz.'
                },
                {
                    title: '7. İletişim Formu ve E-Posta İletişimi',
                    content: 'Bize iletişim formu veya e-posta yoluyla ulaştığınızda, verdiğiniz bilgiler ve iletişim verileri talebinizin işlenmesi amacıyla saklanır. Amaç: Talebinizin işlenmesi. Yasal dayanak: GDPR Madde 6 fıkra 1 bent b. Bu veriler rızanız olmadan başkalarına aktarılmaz.'
                },
                {
                    title: '8. WhatsApp İletişimi',
                    content: 'Bize WhatsApp üzerinden ulaştığınızda, iletişim WhatsApp Ireland Ltd. üzerinden gerçekleşir. Lütfen WhatsApp\'ın kişisel verileri bağımsız olarak işlediğini unutmayın. WhatsApp kullanımı isteğe bağlıdır.'
                },
                {
                    title: '9. Google Analytics',
                    content: 'Bu web sitesi, Google Ireland Limited\'in bir web analiz hizmeti olan Google Analytics\'i kullanmaktadır. IP anonimleştirme etkindir. Veri işleme yalnızca rıza sonrası yapılır. Üçüncü ülkelere veri aktarımı mümkündür (standart sözleşme maddeleri). Rızanızı istediğiniz zaman geri çekebilirsiniz.'
                },
                {
                    title: '10. Meta Pixel (Facebook & Instagram)',
                    content: 'Rıza verdiyseniz, Meta Platforms Ireland Ltd.\'nin Meta Pixel\'ini kullanıyoruz. Amaç: Erişim ölçümü, dönüşüm takibi, kişiselleştirilmiş reklamcılık. Toplanan veriler bizim için anonimdir. Meta bu verileri kullanıcı profilinizle ilişkilendirebilir.'
                },
                {
                    title: '11. Sosyal Medya Bağlantıları',
                    content: 'Web sitemiz sosyal ağlara (örn. Facebook, Instagram) bağlantılar içermektedir. Bunlar sadece yönlendirme bağlantılarıdır. İlgili platformlardaki veri işlemeden yalnızca ilgili sağlayıcı sorumludur.'
                },
                {
                    title: '12. Saklama Süresi',
                    content: 'Kişisel veriler, yalnızca ilgili amaç için gerekli olduğu sürece veya yasal saklama yükümlülükleri mevcut olduğu sürece saklanır.'
                },
                {
                    title: '13. GDPR Kapsamındaki Haklarınız',
                    content: 'İstediğiniz zaman şu haklara sahipsiniz:\n- Bilgi alma (GDPR Madde 15)\n- Düzeltme (GDPR Madde 16)\n- Silme (GDPR Madde 17)\n- İşlemenin kısıtlanması (GDPR Madde 18)\n- Veri taşınabilirliği (GDPR Madde 20)\n- Rızanın geri çekilmesi (GDPR Madde 7)\n- Veri koruma makamına şیکayette bulunma'
                },
                {
                    title: '14. Veri Koruma Makamı',
                    content: 'Avusturya Veri Koruma Makamı: https://www.dsb.gv.at'
                },
                {
                    title: '15. Veri Güvenliği',
                    content: 'Verilerinizi kayba, manipülasyona, yetkisiz erişime veya ifşaya karşı korumak için teknik ve organizasyonel güvenlik önlemleri uyguluyoruz.'
                },
                {
                    title: '16. Bu Gizlilik Politikasındaki Değişiklikler',
                    content: 'Bu gizlilik politikası şu an için geçerlidir ve yasal veya teknik değişiklikler durumunda güncellenecektir.'
                }
            ]
        },
        impressum: {
            title: 'Künye',
            sections: [
                {
                    title: '§ 5 ECG, § 14 UGB ve § 63 GewO uyarınca bilgiler',
                    content: 'Sürücü Kursu Gate 11\nSahibi: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Viyana\nAvusturya'
                },
                {
                    title: 'İletişim',
                    content: 'Telefon: +43 1 767 32 87\nE-Posta: drive@fahrschulegate11.at'
                },
                {
                    title: 'Şirket Faaliyet Konusu',
                    content: 'Geçerli yasal hükümlere uygun olarak sürücü kursu işletmeciliği ve sürücü adaylarının eğitimi.'
                },
                {
                    title: 'Denetleyici Makam',
                    content: 'Viyana Şehri Belediye Meclisi (Magistrat)'
                },
                {
                    title: 'Mesleki Mevzuat',
                    content: 'Karayolları Trafik Kanunu (KFG)\nSürücü Kursu Kanunu\nGDPR, DSG, TKG 2021'
                },
                {
                    title: 'Tüketici Uyuşmazlık Çözümü',
                    content: 'Tüketici hakem heyetleri önünde uyuşmazlık çözüm prosedürlerine katılma zorunluluğumuz yoktur ve buna hazır değiliz.'
                },
                {
                    title: 'İçerik Sorumluluğu',
                    content: 'Sayfalarımızın içeriği büyük bir titizlikle oluşturulmuştur. Ancak içeriğin doğruluğu, eksiksizliği ve güncelliği konusunda garanti veremeyiz.'
                },
                {
                    title: 'Bağlantı Sorumluluğu',
                    content: 'Web sitemiz üçüncü şahıslara ait harici web sitelerine bağlantılar içermektedir. Bunların içerikleri üzerinde hiçbir etkimiz yoktur ve sorumluluk kabul etmiyoruz.'
                },
                {
                    title: 'Telif Hakkı',
                    content: 'Sayfa operatörleri tarafından bu web sitesinde oluşturulan içerik ve eserler Avusturya telif hakkı yasasına tabidir.'
                }
            ]
        },
        agb: {
            title: 'Genel Şartlar ve Koşullar (AGB)',
            sections: [
                {
                    title: '1. Kapsam',
                    content: 'Bu AGB, Sürücü Kursu Gate 11\'in müşterilerine sunduğu tüm sözleşmeler, hizmetler ve teklifler için geçerlidir. Müşterinin farklı koşulları, yazılı olarak açıkça onaylanmadığı sürece kabul edilmez.'
                },
                {
                    title: '2. Hizmetler',
                    content: 'Sürücü kursu özellikle şunları sunar:\n- Teorik ve pratik sürüş eğitimi\n- Sınav hazırlığı\n- Yasal olarak zorunlu eğitimler\n- Danışmanlık hizmetleri\nKesin hizmet kapsamı bireysel eğitim sözleşmesinden kaynaklanır.'
                },
                {
                    title: '3. Sözleşmenin Kurulması',
                    content: 'Sözleşme, müşterinin kaydı ve sürücü kursunun kabulü ile kurulur. Kayıt bağlayıcıdır.'
                },
                {
                    title: '4. Fiyatlar ve Ödeme',
                    content: 'Tüm fiyatlar yasal KDV dahil Euro (€) cinsindendir. Ödemeler zamanında yapılmalıdır. Ödeme gecikmesi durumunda sürücü kursu hizmetleri askıya alma hakkına sahiptir.'
                },
                {
                    title: '5. Randevu ve İptal',
                    content: 'Direksiyon dersleri bağlayıcı olarak kararlaştırılır. Ücretsiz iptal, randevudan en az 24 saat önce yapıldığı takdirde mümkündür. Randevuya gelinmemesi veya geç iptal durumunda ders ücreti tam olarak alınır.'
                },
                {
                    title: '6. Müşterinin Yükümlülükleri',
                    content: 'Müşteri şunları taahhüt eder:\n- Doğru bilgiler vermek\n- Sürüş eğitmenlerinin talimatlarına uymak\n- Sağlık kısıtlamalarını bildirmek\n- Yasal gereklilikleri yerine getirmek'
                },
                {
                    title: '7. Sorumluluk',
                    content: 'Sürücü kursu sadece kasıt veya ağır ihmal durumunda sorumludur. Hafif ihmal durumunda, sadece temel sözleşme yükümlülüklerinin ihlali durumunda ve öngörülebilir hasarla sınırlı olarak sorumludur. Sınavlarda başarısızlık, gecikmeler veya mücbir sebeplerden dolayı sorumluluk kabul edilmez.'
                },
                {
                    title: '8. Veri Koruma',
                    content: 'Kişisel verilerin işlenmesi web sitesindeki gizlilik politikasına göre yapılır.'
                },
                {
                    title: '9. Fesih / Cayma',
                    content: 'Sözleşmeden cayma ancak önemli bir nedenle mümkündür. Halihazırda verilen hizmetlerin ücreti ödenmelidir.'
                },
                {
                    title: '10. Yetkili Mahkeme ve Hukuk',
                    content: 'Avusturya hukuku geçerlidir. Yetkili mahkeme, yasal olarak izin verildiği sürece Viyana\'dır.'
                },
                {
                    title: '11. Geçersizlik Şartı',
                    content: 'Münferit hükümlerin geçersiz olması durumunda, diğer hükümlerin geçerliliği etkilenmez.'
                }
            ]
        },
        cookies: {
            title: 'Çerez Politikası',
            sections: [
                {
                    title: '1. Genel',
                    content: 'Bu web sitesi, web sitesinin çalışmasını sağlamak, istatistiksel değerlendirmeler yapmak ve pazarlama önlemleri yürütmek için çerezler ve benzer teknolojiler kullanır.'
                },
                {
                    title: '2. Çerez Nedir?',
                    content: 'Çerezler, cihazınızda saklanan ve bilgi içerebilen küçük metin dosyalarıdır.'
                },
                {
                    title: '3. Çerez Türleri',
                    content: 'a) Gerekli Çerezler: Teknik olarak gerekli, yasal dayanak: GDPR Madde 6 (1) (f).\nb) İstatistik Çerezleri: Web sitesini geliştirmemize yardımcı olur, yasal dayanak: GDPR Madde 6 (1) (a) (rıza).\nc) Pazarlama Çerezleri: Kişiselleştirilmiş reklamlar, yasal dayanak: GDPR Madde 6 (1) (a).'
                },
                {
                    title: '4. Çerez Onayı',
                    content: 'Web sitemizi ilk ziyaret ettiğinizde tüm çerezleri kabul edebilir, sadece gerekli olanlara izin verebilir veya bireysel ayarlar yapabilirsiniz. Rızanızı istediğiniz zaman geri çekebilirsiniz.'
                },
                {
                    title: '5. Üçüncü Taraf Sağlayıcılar',
                    content: 'Çerezler Google Ireland Limited ve Meta Platforms Ireland Ltd tarafından yerleştirilebilir. Üçüncü ülkelere veri aktarımı mümkündür (standart sözleşme maddeleri).'
                },
                {
                    title: '6. Saklama Süresi',
                    content: 'Çerezler ya oturum sonunda silinir ya da tanımlanmış bir süre boyunca saklanır.'
                },
                {
                    title: '7. Çerez Yönetimi',
                    content: 'Çerezleri istediğiniz zaman tarayıcı ayarları veya çerez bannerı aracılığıyla yönetebilir veya silebilirsiniz.'
                },
                {
                    title: '8. Güncellik',
                    content: 'Bu çerez politikası teknik veya yasal değişiklikler durumunda güncellenir.'
                }
            ]
        }
    },
    ar: {
        nav: {
            start: 'الرئيسية',
            about: 'من نحن',
            courses: 'التدريب',
            pricing: 'الأسعار',
            vehicles: 'المركبات',
            team: 'الفريق',
            plan: 'الخطة السنوية',
            register: 'التسجيل المسبق',
            contact: 'اتصل بنا',
            kurstermine: 'الدورات',
            courses_day: 'دورات نهارية',
            courses_night: 'دورات مسائية'
        },
        hero: {
            title: 'GATE',
            subtitle: 'حيث يلتقي الفخامة بالكفاءة.',
            description: 'تدرب على أحدث موديلات فولكس فاجن وبي إم دبليو وكاواساكي Z650. اختبر الأنظمة الحديثة من اليوم الأول.',
            cta_journey: 'ابدأ الرحلة',
            cta_courses: 'اكتشف الدورات',
            establishment: 'منذ ٢٠١٩ • فيينا'
        },
        about: {
            hero_title: 'التميز في',
            hero_italic: 'القيادة',
            hero_desc: 'مرحباً بكم في العنوان الأكثر تميزاً في فيينا لتعليم القيادة الحديث. نحن نرشدك بأسلوب ودقة وحكمة.',
            phil_title: 'فلسفتنا',
            phil_h2: 'القيادة فن نقوده نحو الإتقان.',
            phil_p1: 'منذ عام 2019، تتبع GATE 11 رؤية: ترسيخ تعليم القيادة كجربة من الجودة والتميز.',
            phil_p2: 'كل طالب هو فرد بحد ذاته. ينقل مرشدونا فهماً عميقاً للمركبة والطريق.',
            values_title: 'معايير GATE 11',
            values: [
                { title: 'أسطول فاخر', desc: 'التدريب على أحدث موديلات فولكس فاجن وبي إم دبليو وكاواساكي Z650.' },
                { title: 'مرشدون حصريون', desc: 'مرشدون مؤهلون تأهيلاً عالياً يجسدون الهدوء والكفاءة.' },
                { title: 'الطليعة الرقمية', desc: 'تعلم فعال من خلال أحدث المنصات الرقمية.' }
            ],
            team_title: 'الفريق',
            team_h2: 'الخبرة تلتقي بالالتزام.',
            team_p1: 'فريق مختار بعناية من الخبراء يشاركون الشغف بالخدمة من الدرجة الأولى.',
            team_p2: 'الثقة هي أساس كل رحلة آمنة. نحن نتطلع للقائك.',
            team_cta: 'تعرف علينا',
            cta_title: 'مدرجك نحو النجاح.',
            cta_desc: 'هل أنت جاهز للخطوة الأولى؟ نحن نتطلع للقائك.',
            cta_button: 'زورونا'
        },
        courses: {
            badge: 'تعليم متميز',
            title: 'أكاديمية القيادة',
            subtitle: 'حزم تدريب مرنة لنجاحك.',
            loading: 'جارٍ التحميل...',
            cta: 'سجل الآن',
            next_course: 'الدورة القادمة',
            soon: 'قريباً',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'الكلاسيكي',
                    price: '€ 1.490',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "32 وحدة درس نظري",
                        "18 حصة قيادة",
                        "رسوم إضافية للقيادة الليلية",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'التعليم المزدوج',
                    price: '€ 1.249',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "32 وحدة درس نظري",
                        "12 حصة قيادة",
                        "وحدة تعليم نظري",
                        "لوحة L",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: 'رخصة مبكرة في سن 17',
                    price: '€ 1.649',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "32 وحدة درس نظري",
                        "17 حصة قيادة",
                        "وحدة إحاطة قبلية",
                        "وحدتان إحاطة بعدية",
                        "لوحة L17",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'دخول الدراجات النارية',
                    price: '€ 1.349',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "26 وحدة درس نظري",
                        "14 حصة قيادة",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'ترقية الدراجات النارية',
                    price: '€ 1.249',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "6 وحدات درس نظري",
                        "14 حصة قيادة",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'دراجات نارية كاملة',
                    price: '€ 1.249',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "6 وحدات درس نظري",
                        "14 حصة قيادة",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                }
            ]
        },
        nightCourses: {
            badge: 'تعليم متميز',
            title: 'أكاديمية القيادة (مسائي)',
            subtitle: 'حزم تدريب مرنة لنجاحك.',
            loading: 'جارٍ التحميل...',
            cta: 'سجل الآن',
            next_course: 'الدورة القادمة',
            soon: 'قريباً',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'الكلاسيكي',
                    price: '€ 1.490',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "32 وحدة درس نظري",
                        "18 حصة قيادة",
                        "رسوم إضافية للقيادة الليلية",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'التعليم المزدوج',
                    price: '€ 1.249',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "32 وحدة درس نظري",
                        "12 حصة قيادة",
                        "وحدة تعليم نظري",
                        "لوحة L",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: 'رخصة مبكرة في سن 17',
                    price: '€ 1.649',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "32 وحدة درس نظري",
                        "17 حصة قيادة",
                        "وحدة إحاطة قبلية",
                        "وحدتان إحاطة بعدية",
                        "لوحة L17",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'دخول الدراجات النارية',
                    price: '€ 1.349',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "26 وحدة درس نظري",
                        "14 حصة قيادة",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'ترقية الدراجات النارية',
                    price: '€ 1.249',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "6 وحدات درس نظري",
                        "14 حصة قيادة",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'دراجات نارية كاملة',
                    price: '€ 1.249',
                    features: [
                        "الرسوم الإدارية",
                        "التأمين",
                        "6 وحدات درس نظري",
                        "14 حصة قيادة",
                        "الاختبار النظري الأول",
                        "الاختبار العملي الأول",
                        "كود أونلاين"
                    ]
                }
            ]
        },
        kurstermine: {
            title: 'دورة',
            titleOutline: 'المواعيد',
            subtitle: 'دوراتنا النظرية الحالية في لمحة. خطط لنجاحك مع GATE 11.',
            intensive: 'دورة مكثفة',
            evening: 'دورة مسائية',
            columns: {
                date: 'تاريخ',
                time: 'وقت',
                abk: 'اختصار',
                topics: 'مواضيع'
            },
            noData: 'لا توجد مواعيد متاحة.',
            loading: 'جارٍ التحميل...'
        },
        pricing: {
            title: 'الأسعار',
            subtitle: 'أسعار شفافة لتعليم من الدرجة الأولى.',
            action: 'عرض',
            request: 'طلب',
            cta_secure: 'احجز الآن',
            cta_request: 'استفسر',
            note: 'ملاحظة: الرسوم الحكومية والتقارير الطبية غير مشمولة.'
        },
        vehicles: {
            badge: 'التميز الهندسي',
            title: 'أسطولنا',
            subtitle: 'أتقن الطريق بمركبات تحدد التميز الهندسي.',
            cta: 'التسجيل المسبق',
            reveal: {
                title: 'الوحش',
                model: 'BMW M2 CS 2025',
                badge: 'العرض الأول في النمسا',
                subtitle: 'الأول والوحيد.',
                description: 'حصرياً لدى GATE 11. اختبر القوة الخام لـ 530 حصاناً بأكثر أشكالها أناقة. بيان باللون الأسود.',
                features: ['530 حصان', '3.5 ثانية 0-100', 'حزمة سباق M']
            }
        },
        plans: {
            title: 'الخطة السنوية',
            subtitle: 'نظرة عامة على عامك التدريبي بالكامل.',
            h2: 'تعليم منظم',
            desc: 'نحن نخطط مسبقاً حتى تتمكن من دمج رخصتك بشكل مثالي في حياتك.',
            status: 'الوضع الحالي',
            active: 'نشط',
            download: 'تحميل الخطة (PDF)'
        },
        team: {
            badge: 'Gate11 كوليكتيف',
            title: 'الفريق',
            subtitle: 'محترفون بقلب وعقل. نحن نرشدك بخبرة وصبر.',
            license: 'الفئات',
            noMembers: 'لم يتم العثور على أعضاء في الفريق.'
        },
        stats: {
            students: 'طلاب معتمدون',
            vehicles: 'مركبات فاخرة',
            instructors: 'مدربون خبراء',
            success: 'معدل النجاح'
        },
        features: {
            title: 'لماذا GATE11؟',
            subtitle: 'نحن لا نتبع المعايير فحسب، بل نضعها.',
            philosophy: 'اقرأ فلسفتنا',
            fleet_title: 'أسطول فاخر',
            fleet_desc: 'تدرب على أحدث موديلات فولكس فاجن وبي إم دبليو وكاواساكي Z650. اختبر الأنظمة الحديثة من اليوم الأول.',
            digital_title: 'الرقمية أولاً',
            digital_desc: 'من التسجيل عبر الإنترنت إلى تتبع التقدم الرقمي. نحن نقدر وقتك وكفاءتك.',
            mentorship_title: 'توجيه حصري',
            mentorship_desc: 'مدربونا هم مرشدون يشكلون سائقين هادئين وواثقين ومحترفين.'
        },
        cta: {
            title: 'هل أنت جاهز لتولي القيادة؟',
            description: 'رخصتك في انتظارك. ابدأ رحلتك اليوم مع أرقى أكاديمية قيادة في فيينا.',
            button: 'كن طالباً'
        },
        contact: {
            station: 'محطة',
            distance: '260 متر'
        },
        footer: {
            description: 'مدرجك للحصول على رخصة قيادة في فيينا-سيمرينغ. تدريب متميز لأقصى درجات الأمان.',
            contact: 'اتصال',
            address: 'العنوان',
            phone: 'الهاتف',
            email: 'البريد الإلكتروني',
            hours: 'ساعات العمل',
            slogan: 'التقاء الفخامة والخبرة.',
            addressLine: 'سيمرينغر هاوبتشتراسه 179',
            cityLine: '1110 فيينا',
            rights: 'جميع الحقوق محفوظة.',
            standards: {
                title: 'المعايير واللغات',
                certified: 'مدربو قيادة معتمدون من الدولة',
                austrian: 'تدريب وفقاً للإرشادات النمساوية'
            },
            schedule: {
                monThu: 'الاثنين - الخميس',
                fri: 'الجمعة',
                satSun: 'السبت - الأحد',
                closed: 'مغلق'
            },
            legal: {
                impressum: 'إشعار قانوني',
                privacy: 'سياسة الخصوصية',
                agb: 'الشروط والأحكام',
                cookies: 'ملفات تعريف الارتباط'
            }
        },
        preRegistration: {
            title: 'التسجيل المسبق',
            subtitle: 'عبر الإنترنت',
            portal: 'بوابة Gate11',
            steps: {
                personal: 'شخصي',
                address: 'العنوان',
                course: 'اختيار الدورة',
                documents: 'المستندات'
            },
            fields: {
                firstName: 'الاسم الأول',
                lastName: 'اسم العائلة',
                birthDate: 'تاريخ الميلاد',
                email: 'البريد الإلكتروني',
                phone: 'الهاتف',
                street: 'الشارع والرقم',
                zipCode: 'الرمز البريدي',
                city: 'المدينة',
                courseSelection: 'اختر الدورة'
            },
            docs: {
                info: 'التقديم الرقمي: قم بتحميل مستنداتك الآن لتسريع العملية في المكتب.',
                idCard: 'بطاقة الهوية',
                passport: 'جواز السفر',
                firstAid: 'شهادة الإسعافات الأولية',
                residence: 'شهادة الإقامة',
                optional: 'اختياري',
                bringLater: 'سأحضره معي أثناء التسجيل',
                uploaded: 'تم الرفع',
                select: 'اختر ملفاً'
            },
            nav: {
                back: 'رجوع',
                next: 'التالي',
                submit: 'إرسال'
            },
            success: {
                title: 'تم استلام التسجيل!',
                desc: 'شكراً لك يا {name}. تم نقل بياناتك بنجاح.',
                deadline: 'يرجى الحضور إلى مكتبنا خلال 3 أيام لاستكمال التسجيل.',
                download: 'تحميل كملف PDF',
                home: 'العودة للرئيسية'
            }
        },
        privacy: {
            title: 'سياسة الخصوصية',
            sections: [
                {
                    title: '1. معلومات عامة',
                    content: 'حماية بياناتك الشخصية تهمنا بشكل خاص. نحن نعامل بياناتك الشخصية بسرية ووفقًا للوائح القانونية لحماية البيانات ، لا سيما اللائحة العامة لحماية البيانات (GDPR) وقانون حماية البيانات النمساوي (DSG) وقانون الاتصالات (TKG 2021). تبلغك سياسة الخصوصية هذه بنوع ونطاق والغرض من معالجة البيانات الشخصية في إطار وجودنا على الإنترنت.'
                },
                {
                    title: '2. المسؤول بالمعنى المقصود في GDPR',
                    content: 'Fahrschule Gate 11\nالمالك: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Wien\nالنمسا\n\nالهاتف: +43 1 767 32 87\nالبريد الإلكتروني: drive@fahrschulegate11.at'
                },
                {
                    title: '3. البيانات الشخصية',
                    content: 'البيانات الشخصية هي جميع المعلومات التي تتعلق بشخص طبيعي محدد أو قابل للتحديد ، مثل: الاسم ، العنوان ، رقم الهاتف ، عنوان البريد الإلكتروني ، عنوان IP ، بيانات الاستخدام.'
                },
                {
                    title: '4. معالجة البيانات الشخصية',
                    content: 'نقوم بمعالجة البيانات الشخصية فقط في حالة استيفاء أحد الشروط التالية على الأقل:\n- لقد أعطيت موافقتك الصريحة (المادة 6 الفقرة 1 أ من اللائحة العامة لحماية البيانات)\n- المعالجة ضرورية لتنفيذ عقد أو تدابير ما قبل التعاقد (المادة 6 الفقرة 1 ب من اللائحة العامة لحماية البيانات)\n- المعالجة ضرورية للوفاء بالتزام قانوني (المادة 6 الفقرة 1 ج من اللائحة العامة لحماية البيانات)\n- المعالجة ضرورية لحماية المصالح المشروعة (المادة 6 الفقرة 1 و من اللائحة العامة لحماية البيانات).'
                },
                {
                    title: '5. بيانات الوصول / ملفات تعريف خادم',
                    content: 'عند زيارة موقعنا على الويب، يتم جمع البيانات التالية تلقائيًا: عنوان IP (مجهول)، تاريخ ووقت الوصول، الصفحات التي تم الوصول إليها، نوع المتصفح وإصداره، نظام التشغيل المستخدم، عنوان URL للمحيل. تخدم هذه البيانات حصريًا لضمان التشغيل الخالي من المشاكل وأمان النظام والتحسين الفني. لا يتم دمج هذه البيانات مع مصادر بيانات أخرى.'
                },
                {
                    title: '6. ملفات تعريف الارتباط (Cookies)',
                    content: 'يستخدم موقعنا ملفات تعريف الارتباط. ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك. أنواع ملفات تعريف الارتباط: الضرورية (مطلوبة تقنيًا) ، الكوكيز الإحصائية ، كوكيز التسويق. يتم تعيين الكوكيز غير الضرورية فقط بموافقتك الصريحة.\nالأساس القانوني:\n- المادة 6 الفقرة 1 أ من اللائحة العامة لحماية البيانات (الموافقة)\n- المادة 6 الفقرة 1 و من اللائحة العامة لحماية البيانات (ملفات تعريف الارتباط الضرورية تقنيًا)\nيمكنك تغيير أو سحب إعدادات ملفات تعريف الارتباط في أي وقت.'
                },
                {
                    title: '7. نموذج الاتصال والاتصال عبر البريد الإلكتروني',
                    content: 'إذا اتصلت بنا عبر نموذج الاتصال أو البريد الإلكتروني ، فسيتم تخزين تفاصيلك بما في ذلك بيانات الاتصال المقدمة لغرض معالجة طلبك. الغرض: معالجة طلبك. الأساس القانوني: المادة 6 الفقرة 1 ب من اللائحة العامة لحماية البيانات. لن يتم تمرير هذه البيانات دون موافقتك.'
                },
                {
                    title: '8. الاتصال عبر واتساب',
                    content: 'إذا اتصلت بنا عبر واتساب ، فسيتم الاتصال عبر WhatsApp Ireland Ltd. يرجى ملاحظة أن واتساب يعالج البيانات الشخصية بشكل مستقل. استخدام واتساب طوعي.'
                },
                {
                    title: '9. جوجل أناليتكس',
                    content: 'يستخدم هذا الموقع جوجل أناليتكس ، وهي خدمة تحليل ويب من شركة Google Ireland Limited. تم تفعيل ميزة إخفاء الهوية لعنوان IP. تتم معالجة البيانات فقط بعد الموافقة. نقل البيانات إلى دول ثالثة ممكن (الشروط التعاقدية القياسية). يمكنك سحب موافقتك في أي وقت.'
                },
                {
                    title: '10. Meta Pixel (فيسبوك وإنستغرام)',
                    content: 'بشرط أن تكون قد أعطيت موافقتك ، نستخدم Meta Pixel من شركة Meta Platforms Ireland Ltd. الغرض: قياس الوصول ، تتبع التحويل ، الإعلانات الشخصية. البيانات التي يتم جمعها مجهولة بالنسبة لنا. يمكن لشركة Meta ربط هذه البيانات بملفك الشخصي كسكخدم.'
                },
                {
                    title: '11. روابط وسائل التواصل الاجتماعي',
                    content: 'يحتوي موقعنا على روابط إلى الشبكات الاجتماعية (مثل فيسبوك وإنستغرام). هذه روابط محضة. بالنسبة لمعالجة البيانات على المنصات المعنية ، فإن المزود المعني هو المسؤول حصريًا.'
                },
                {
                    title: '12. مدة التخزين',
                    content: 'يتم تخزين البيانات الشخصية فقط طالما كان ذلك ضروريًا للغرض المعني أو طالما كانت هناك التزامات قانونية بالاحتفاظ بها.'
                },
                {
                    title: '13. حقوقك بموجب GDPR',
                    content: 'لديك الحق في أي وقت في:\n- الحصول على معلومات (المادة 15 من اللائحة العامة لحماية البيانات)\n- التصحيح (المادة 16 من اللائحة العامة لحماية البيانات)\n- الحذف (المادة 17 من اللائحة العامة لحماية البيانات)\n- تقييد المعالجة (المادة 18 من اللائحة العامة لحماية البيانات)\n- نقل البيانات (المادة 20 من اللائحة العامة لحماية البيانات)\n- سحب موافقتك (المادة 7 من اللائحة العامة لحماية البيانات)\n- تقديم شكوى إلى سلطة حماية البيانات'
                },
                {
                    title: '14. سلطة حماية البيانات',
                    content: 'سلطة حماية البيانات النمساوية: https://www.dsb.gv.at'
                },
                {
                    title: '15. أمن البيانات',
                    content: 'نحن نستخدم تدابير أمنية فنية وتنظيمية لحماية بياناتك من الضياع أو التلاعب أو الوصول غير المصرح به أو الإفصاح.'
                },
                {
                    title: '16. التغييرات في سياسة الخصوصية هذه',
                    content: 'سياسة الخصوصية هذه سارية حاليًا وسيتم تعديلها في حالة حدوث تغييرات قانونية أو فنية.'
                }
            ]
        },
        impressum: {
            title: 'إشعار قانوني',
            sections: [
                {
                    title: 'البيانات وفقًا للمادة 5 ECG والمادة 14 UGB والمادة 63 GewO',
                    content: 'مدرسة القيادة Gate 11\nالمالك: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Wien\nالنمسا'
                },
                {
                    title: 'الاتصال',
                    content: 'هاتف: +43 1 767 32 87\nبريد إلكتروني: drive@fahrschulegate11.at'
                },
                {
                    title: 'غرض الشركة',
                    content: 'تشغيل مدرسة لتعليم القيادة وتدريب سائقي المركبات وفقًا للأحكام القانونية المعمول بها.'
                },
                {
                    title: 'سلطة الإشراف',
                    content: 'مجلس مدينة فيينا (Magistrat)'
                },
                {
                    title: 'اللوائح المهنية',
                    content: 'قانون السيارات (KFG)\nقانون مدارس تعليم القيادة\nGDPR, DSG, TKG 2021'
                },
                {
                    title: 'حل نزاعات المستهلك',
                    content: 'نحن لسنا ملزمين وغير مستعدين للمشاركة في إجراءات تسوية المنازعات أمام هيئة تحكيم المستهلك.'
                },
                {
                    title: 'المسؤولية عن المحتوى',
                    content: 'تم إنشاء محتويات صفحاتنا بعناية كبيرة. ومع ذلك، لا يمكننا ضمان دقة واكتمال وحداثة المحتوى.'
                },
                {
                    title: 'المسؤولية عن الروابط',
                    content: 'يحتوي موقعنا على روابط لمواقع خارجية لأطراف ثالثة. ليس لدينا أي تأثير على محتوياتها ولا نتحمل أي مسؤولية عنها.'
                },
                {
                    title: 'حقوق الطبع والنشر',
                    content: 'تخضع المحتويات والأعمال التي أنشأها مشغلو الموقع على هذا الموقع لقانون حقوق الطبع والنشر النمساوي.'
                }
            ]
        },
        agb: {
            title: 'الشروط والأحكام العامة (AGB)',
            sections: [
                {
                    title: '1. النطاق',
                    content: 'تنطبق هذه الشروط والأحكام على جميع العقود والخدمات والعروض المقدمة من مدرسة القيادة Gate 11 لعملائها. لا يتم الاعتراف بأي شروط مخالفة للعميل ما لم تتم الموافقة الصريحة عليها كتابةً.'
                },
                {
                    title: '2. الخدمات',
                    content: 'تقدم مدرسة القيادة بشكل خاص:\n- التدريب النظري والعملي على القيادة\n- التحضير للاختبارات\n- الدورات التدريبية المفروضة قانوناً\n- الخدمات الاستشارية\nيتم تحديد نطاق الخدمات الدقيق في عقد التدريب الفردي.'
                },
                {
                    title: '3. إبرام العقد',
                    content: 'يتم إبرام العقد من خلال تسجيل العميل وقبول مدرسة القيادة. التسجيل ملزم.'
                },
                {
                    title: '4. الأسعار والدفع',
                    content: 'جميع الأسعار باليورو (€) شاملة ضريبة القيمة المضافة القانونية. يجب إجراء المدفوعات في الموعد المحدد. في حالة التأخر في السداد، يحق لمدرسة القيادة تعليق الخدمات.'
                },
                {
                    title: '5. المواعيد والإلغاء',
                    content: 'يتم الاتفاق على دروس القيادة بشكل ملزم. لا يمكن الإلغاء المجاني إلا إذا تم قبل 24 ساعة على الأقل من الموعد. في حالة عدم الحضور أو الإلغاء المتأخر، سيتم فرض رسوم الدرس بالكامل.'
                },
                {
                    title: '6. التزامات العميل',
                    content: 'يلتزم العميل بـ:\n- تقديم معلومات صحيحة\n- اتباع تعليمات مدربي القيادة\n- الإبلاغ عن القيود الصحية\n- استيفاء المتطلبات القانونية'
                },
                {
                    title: '7. المسؤولية',
                    content: 'تتحمل مدرسة القيادة المسؤولية فقط في حالة القصد أو الإهمال الجسيم. في حالة الإهمال الطفيف، تقتصر المسؤولية فقط على خرق الالتزامات التعاقدية الأساسية وبما يقتصر على الضرر المتوقع. تُستثنى المسؤولية عن الرسوب في الاختبارات أو التأخير أو القوة القاهرة.'
                },
                {
                    title: '8. حماية البيانات',
                    content: 'تتم معالجة البيانات الشخصية وفقاً لبيان الخصوصية المتاح على الموقع الإلكتروني.'
                },
                {
                    title: '9. الإنهاء / الانسحاب',
                    content: 'الانسحاب من العقد ممكن فقط لسبب هام. يجب دفع ثمن الخدمات التي تم تقديمها بالفعل.'
                },
                {
                    title: '10. الاختصاص القضائي والقانون',
                    content: 'ينطبق القانون النمساوي. مكان الاختصاص القضائي هو فيينا، طالما كان ذلك مسموحاً به قانوناً.'
                },
                {
                    title: '11. بند الاستقلالية',
                    content: 'إذا كانت الأحكام الفردية غير فعالة، فإن فعالية الأحكام المتبقية تظل غير متأثرة.'
                }
            ]
        },
        cookies: {
            title: 'سياسة ملفات تعريف الارتباط',
            sections: [
                {
                    title: '1. عام',
                    content: 'يستخدم هذا الموقع ملفات تعريف الارتباط والتقنيات المشابهة لضمان تشغيل الموقع، وتمكين التقييمات الإحصائية وإجراء تدابير التسويق.'
                },
                {
                    title: '2. ما هي ملفات تعريف الارتباط؟',
                    content: 'ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم تخزينها على جهازك ويمكن أن تحتوي على معلومات.'
                },
                {
                    title: '3. أنواع ملفات تعريف الارتباط',
                    content: 'أ) الكوكيز الضرورية: مطلوبة تقنياً، الأساس القانوني: المادة 6 (1) (f) من GDPR.\nب) الكوكيز الإحصائية: تساعدنا في تحسين الموقع، الأساس القانوني: المادة 6 (1) (أ) من GDPR (الموافقة).\nج) الكوكيز التسويقية: إعلانات مخصصة، الأساس القانوني: المادة 6 (1) (أ) من GDPR.'
                },
                {
                    title: '4. الموافقة على الكوكيز',
                    content: 'عند زيارتك الأولى لموقعنا، يمكنك قبول جميع الكوكيز، أو السماح بالضرورية فقط، أو إجراء إعدادات فردية. يمكنك سحب موافقتك في أي وقت.'
                },
                {
                    title: '5. موفرو الطرف الثالث',
                    content: 'يمكن تعيين الكوكيز بواسطة Google Ireland Limited و Meta Platforms Ireland Ltd. نقل البيانات إلى دول ثالثة ممكن (الشروط التعاقدية القياسية).'
                },
                {
                    title: '6. مدة التخزين',
                    content: 'يتم حذف الكوكيز إما في نهاية الجلسة أو تخزينها لمدة محددة.'
                },
                {
                    title: '7. إدارة الكوكيز',
                    content: 'يمكنك إدارة أو حذف الكوكيز في أي وقت عبر إعدادات المتصفح أو بنر الكوكيز.'
                },
                {
                    title: '8. الحداثة',
                    content: 'يتم تعديل سياسة ملفات تعريف الارتباط هذه في حالة حدوث تغييرات فنية أو قانونية.'
                }
            ]
        }
    },
    fa: {
        nav: {
            start: 'صفحه اصلی',
            about: 'درباره ما',
            courses: 'آموزش',
            pricing: 'قیمت‌ها',
            vehicles: 'وسایل نقلیه',
            team: 'تیم',
            plan: 'برنامه سالانه',
            register: 'پیش‌ثبت‌نام',
            contact: 'تماس',
            kurstermine: 'دوره‌ها',
            courses_day: 'دوره‌های روزانه',
            courses_night: 'دوره‌های شبانه'
        },
        hero: {
            title: 'GATE',
            subtitle: 'جایی که تجمل با شایستگی ملاقات می‌کند.',
            description: 'آموزش با جدیدترین مدل‌های فولکس‌واگن، بی‎‌ام‌و و کاوازاکی Z650. سیستم‌های مدرن را از روز اول تجربه کنید.',
            cta_journey: 'شروع سفر',
            cta_courses: 'بررسی دوره‌ها',
            establishment: 'از ۲۰۱۹ • وین'
        },
        about: {
            hero_title: 'تعادل در',
            hero_italic: 'فرمان',
            hero_desc: 'به منحصر به فردترین آدرس وین برای آموزش رانندگی مدرن خوش آمدید. ما شما را با سبک، دقت و خرد راهنمایی می‌کنیم.',
            phil_title: 'فلسفه ما',
            phil_h2: 'رانندگی هنری است که ما به سوی استادی هدایت می‌کنیم.',
            phil_p1: 'از سال ۲۰۱۹، GATE 11 یک چشم‌انداز را دنبال می‌کند: تثبیت آموزش رانندگی به عنوان تجربه‌ای از کیفیت و اعتبار.',
            phil_p2: 'هر دانش‌آموز یک فرد منحصر به فرد است. مربیان ما درک عمیقی از خودرو و جاده منتقل می‌کنند.',
            values_title: 'استانداردهای GATE 11',
            values: [
                { title: 'ناوگان پریمیوم', desc: 'آموزش با جدیدترین مدل‌های فولکس‌واگن، بی‎‌ام‌و و کاوازاکی Z650.' },
                { title: 'مربیان انحصاری', desc: 'مربیان بسیار واجد شرایط که آرامش و شایستگی را منعکس می‌کنند.' },
                { title: 'پیشگام دیجیتال', desc: 'یادگیری کارآمد از طریق مدرن‌ترین پلتفرم‌های دیجیتال.' }
            ],
            team_title: 'تیم',
            team_h2: 'تجربه با تعهد ملاقات می‌کند.',
            team_p1: 'تیمی دست‌چین شده از کارشناسان که اشتیاق به خدمات درجه یک را به اشتراک می‌گذارند.',
            team_p2: 'اعتماد پایه و اساس هر سفر ایمن است. ما مشتاق دیدار شما هستیم.',
            team_cta: 'با ما آشنا شوید',
            cta_title: 'باند شما به سوی موفقیت.',
            cta_desc: 'برای اولین قدم آماده‌اید؟ ما مشتاق دیدار شما هستیم.',
            cta_button: 'از ما دیدن کنید'
        },
        courses: {
            badge: 'آموزش عالی',
            title: 'آکادمی رانندگی',
            subtitle: 'بسته‌های آموزشی منعطف برای موفقیت شما.',
            loading: 'در حال بارگذاری...',
            cta: 'اکنون ثبت‌نام کنید',
            next_course: 'دوره بعدی',
            soon: 'به زودی',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'کلاسیک',
                    price: '€ 1.490',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۳۲ واحد درس تئوری",
                        "۱۸ جلسه رانندگی",
                        "هزینه اضافی رانندگی در شب",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'آموزش دوگانه',
                    price: '€ 1.249',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۳۲ واحد درس تئوری",
                        "۱۲ جلسه رانندگی",
                        "واحد آموزش تئوری",
                        "تابلو L",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: 'گواهینامه زودهنگام در ۱۷ سالگی',
                    price: '€ 1.649',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۳۲ واحد درس تئوری",
                        "۱۷ جلسه رانندگی",
                        "واحد توجیهی قبلی",
                        "دو واحد توجیهی بعدی",
                        "تابلو L17",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'ورود به موتورسیکلت',
                    price: '€ 1.349',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۲۶ واحد درس تئوری",
                        "۱۴ جلسه رانندگی",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'ارتقاء موتورسیکلت',
                    price: '€ 1.249',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۶ واحد درس تئوری",
                        "۱۴ جلسه رانندگی",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'موتورسیکلت کامل',
                    price: '€ 1.249',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۶ واحد درس تئوری",
                        "۱۴ جلسه رانندگی",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                }
            ]
        },
        nightCourses: {
            badge: 'آموزش عالی',
            title: 'آکادمی رانندگی (شبانه)',
            subtitle: 'بسته‌های آموزشی منعطف برای موفقیت شما.',
            loading: 'در حال بارگذاری...',
            cta: 'اکنون ثبت‌نام کنید',
            next_course: 'دوره بعدی',
            soon: 'به زودی',
            packages: [
                {
                    title: 'B-PAKET',
                    tag: 'کلاسیک',
                    price: '€ 1.490',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۳۲ واحد درس تئوری",
                        "۱۸ جلسه رانندگی",
                        "هزینه اضافی رانندگی در شب",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'B-DUAL',
                    tag: 'آموزش دوگانه',
                    price: '€ 1.249',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۳۲ واحد درس تئوری",
                        "۱۲ جلسه رانندگی",
                        "واحد آموزش تئوری",
                        "تابلو L",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'B-L17',
                    tag: 'گواهینامه زودهنگام در ۱۷ سالگی',
                    price: '€ 1.649',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۳۲ واحد درس تئوری",
                        "۱۷ جلسه رانندگی",
                        "واحد توجیهی قبلی",
                        "دو واحد توجیهی بعدی",
                        "تابلو L17",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'A1-PAKET',
                    tag: 'ورود به موتورسیکلت',
                    price: '€ 1.349',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۲۶ واحد درس تئوری",
                        "۱۴ جلسه رانندگی",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'A2-PAKET',
                    tag: 'ارتقاء موتورسیکلت',
                    price: '€ 1.249',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۶ واحد درس تئوری",
                        "۱۴ جلسه رانندگی",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                },
                {
                    title: 'A-PAKET',
                    tag: 'موتورسیکلت کامل',
                    price: '€ 1.249',
                    features: [
                        "هزینه اداری",
                        "بیمه",
                        "۶ واحد درس تئوری",
                        "۱۴ جلسه رانندگی",
                        "اولین آزمون تئوری",
                        "اولین آزمون عملی",
                        "کد آنلاین"
                    ]
                }
            ]
        },
        kurstermine: {
            title: 'دوره',
            titleOutline: 'تاریخ‌ها',
            subtitle: 'دوره‌های تئوری فعلی ما در یک نگاه. موفقیت خود را با GATE 11 برنامه‌ریزی کنید.',
            intensive: 'دوره فشرده',
            evening: 'دوره عصر',
            columns: {
                date: 'تاریخ',
                time: 'زمان',
                abk: 'اختصار',
                topics: 'موضوعات'
            },
            noData: 'تاریخی در دسترس نیست.',
            loading: 'در حال بارگذاری...'
        },
        pricing: {
            title: 'قیمت‌ها',
            subtitle: 'قیمت‌های شفاف برای آموزش درجه یک.',
            action: 'ویژه',
            request: 'درخواست',
            cta_secure: 'اکنون رزرو کنید',
            cta_request: 'استعلام',
            note: 'نکته: هزینه‌های دولتی و گزارش‌های پزشکی شامل نمی‌شود.'
        },
        vehicles: {
            badge: 'برتری مهندسی',
            title: 'ناوگان ما',
            subtitle: 'با وسایل نقلیه‌ای که برتری مهندسی را تعریف می‌کنند، بر جاده مسلط شوید.',
            cta: 'پیش‌ثبت‌نام',
            reveal: {
                title: 'هیولا',
                model: 'BMW M2 CS 2025',
                badge: 'اولین نمایش در اتریش',
                subtitle: 'اولین و تنها.',
                description: 'منحصراً در GATE 11. قدرت خام ۵۳۰ اسب بخار را در ظریف‌ترین شکل آن تجربه کنید. بیانیه‌ای به رنگ سیاه.',
                features: ['۵۳۰ اسب بخار', '۳.۵ ثانیه ۰-۱۰۰', 'پکیج مسابقه M']
            }
        },
        plans: {
            title: 'برنامه سالانه',
            subtitle: 'بررسی اجمالی کل سال آموزشی شما.',
            h2: 'آموزش ساختاریافته',
            desc: 'ما از قبل برنامه‌ریزی می‌کنیم تا بتوانید گواهینامه خود را به بهترین شکل در زندگی خود ادغام کنید.',
            status: 'وضعیت فعلی',
            active: 'فعال',
            download: 'دانلود برنامه (PDF)'
        },
        team: {
            badge: 'مجموعه Gate11',
            title: 'تیم',
            subtitle: 'حرفه‌ای‌هایی با قلب و ذهن. ما شما را با تخصص و صبر راهنمایی می‌کنیم.',
            license: 'کلاس‌ها',
            noMembers: 'هیچ عضو تیمی یافت نشد.'
        },
        stats: {
            students: 'دانش‌آموزان تایید شده',
            vehicles: 'وسایل نقلیه پریمیوم',
            instructors: 'مربیان خبره',
            success: 'نرخ موفقیت'
        },
        features: {
            title: 'چرا GATE11؟',
            subtitle: 'ما فقط استانداردها را دنبال نمی‌کنیم، ما آن‌ها را تعیین می‌کنیم.',
            philosophy: 'فلسفه ما را بخوانید',
            fleet_title: 'ناوگان پریمیوم',
            fleet_desc: 'آموزش با جدیدترین مدل‌های فولکس‌واگن، بی‎‌ام‌و و کاوازاکی Z650. سیستم‌های مدرن را از روز اول تجربه کنید.',
            digital_title: 'اول دیجیتال',
            digital_desc: 'از ثبت‌نام آنلاین تا پیگیری پیشرفت دیجیتال. ما به وقت و کارایی شما اهمیت می‌دهیم.',
            mentorship_title: 'منتورینگ انحصاری',
            mentorship_desc: 'مربیان ما منتورهایی هستند که رانندگان آرام، مطمئن و حرفه‌ای تربیت می‌کنند.'
        },
        cta: {
            title: 'آماده نشستن پشت فرمان هستید؟',
            description: 'گواهینامه رانندگی شما در انتظار است. سفر خود را امروز با معتبرترین آکادمی رانندگی وین آغاز کنید.',
            button: 'دانش‌آموز شوید'
        },
        contact: {
            station: 'ایستگاه',
            distance: '260 متر'
        },
        footer: {
            description: 'باند شما برای گرفتن گواهینامه در وین-سیمرینگ. آموزش پریمیوم برای حداکثر ایمنی.',
            contact: 'تماس',
            address: 'آدرس',
            phone: 'تلفن',
            email: 'ایمیل',
            hours: 'ساعات کاری',
            slogan: 'تلاقی لوکس و تخصص.',
            addressLine: 'سیمرینگر هاوپتاشتراسه ۱۷۹',
            cityLine: '۱۱۱۰ وین',
            rights: 'تمامی حقوق محفوظ است.',
            standards: {
                title: 'استانداردها و زبان‌ها',
                certified: 'مربیان رانندگی تایید شده توسط دولت',
                austrian: 'آموزش مطابق با دستورالعمل‌های اتریش'
            },
            schedule: {
                monThu: 'دوشنبه - پنجشنبه',
                fri: 'جمعه',
                satSun: 'شنبه - یکشنبه',
                closed: 'تعطیل'
            },
            legal: {
                impressum: 'اطلاعات حقوقی',
                privacy: 'سیاست حفظ حریم خصوصی',
                agb: 'شرایط و ضوابط',
                cookies: 'کوکی‌ها'
            }
        },
        preRegistration: {
            title: 'پیش‌ثبت‌نام',
            subtitle: 'آنلاین',
            portal: 'پورتال Gate11',
            steps: {
                personal: 'شخصی',
                address: 'آدرس',
                course: 'انتخاب دوره',
                documents: 'مدarک'
            },
            fields: {
                firstName: 'نام',
                lastName: 'نام خانوادگی',
                birthDate: 'تاریخ تولد',
                email: 'ایمیل',
                phone: 'تلفن',
                street: 'خیابان و شماره',
                zipCode: 'کد پستی',
                city: 'شهر',
                courseSelection: 'انتخاب دوره'
            },
            docs: {
                info: 'ارسال دیجیتال: مدارک خود را همین حالا آپلود کنید تا روند کار در دفتر سرعت یابند.',
                idCard: 'کارت شناسایی',
                passport: 'پاسپورت',
                firstAid: 'گواهی کمک‌های اولیه',
                residence: 'گواهی اقامت',
                optional: 'اختیاری',
                bringLater: 'هنگام ثبت‌نام با خودم می‌آورم',
                uploaded: 'آپلود شد',
                select: 'انتخاب فایل'
            },
            nav: {
                back: 'قبلی',
                next: 'بعدی',
                submit: 'ارسال'
            },
            success: {
                title: 'ثبت‌نام دریافت شد!',
                desc: 'با تشکر {name}. داده‌های شما با موفقیت منتقل شد.',
                deadline: 'لطفاً ظرف ۳ روز برای تکمیل ثبت‌نام به دفتر ما مراجعه کنید.',
                download: 'دانلود به صورت PDF',
                home: 'بازگشت به خانه'
            }
        },
        privacy: {
            title: 'سیاست حفظ حریم خصوصی',
            sections: [
                {
                    title: '۱. نکات عمومی',
                    content: 'حفاظت از داده‌های شخصی شما برای ما از اهمیت ویژه‌ای برخوردار است. ما با داده‌های شخصی شما به صورت محرمانه و مطابق با مقررات قانونی حفاظت از داده‌ها، به ویژه مقررات عمومی حفاظت از داده‌ها (GDPR)، قانون حفاظت از داده‌های اتریش (DSG) و قانون مخابرات (TKG 2021) رفتار می‌کنیم. این سیاست حفظ حریم خصوصی به شما در مورد نوع، محدوده و هدف پردازش داده‌های شخصی در چارچوب حضور اینترنتی ما اطلاع می‌دهد.'
                },
                {
                    title: '۲. مسئول به معنای GDPR',
                    content: 'Fahrschule Gate 11\nمالک: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Wien\nاتریش\n\nتلفن: +43 1 767 32 87\nایمیل: drive@fahrschulegate11.at'
                },
                {
                    title: '۳. داده‌های شخصی',
                    content: 'داده‌های شخصی تمام اطلاعاتی است که به یک شخص حقیقی شناسایی شده یا قابل شناسایی مربوط می‌شود، مانند: نام، آدرس، شماره تلفن، آدرس ایمیل، آدرس IP، داده‌های استفاده.'
                },
                {
                    title: '۴. پردازش داده‌های شخصی',
                    content: 'ما داده‌های شخصی را تنها در صورتی پردازش می‌کنیم که حداقل یکی از شرایط زیر برقرار باشد:\n- شما رضایت صریح خود را اعلام کرده باشید (ماده ۶ بند ۱ الف GDPR)\n- پردازش برای اجرای قرارداد یا اقدامات پیش‌قراردادی لازم باشد (ماده ۶ بند ۱ ب GDPR)\n- پردازش برای ایفای یک تعهد قانونی لازم باشد (ماده ۶ بند ۱ ج GDPR)\n- پردازش برای حفظ منافع مشروع لازم باشد (ماده ۶ بند ۱ و GDPR).'
                },
                {
                    title: '۵. داده‌های دسترسی / فایل‌های لاگ سرور',
                    content: 'هنگام بازدید از وب‌سایت ما، داده‌های زیر به طور خودکار ثبت می‌شوند: آدرس IP (ناشناس)، تاریخ و زمان دسترسی، صفحات بازدید شده، نوع و نسخه مرورگر، سیستم عامل مورد استفاده، URL مرجع. این داده‌ها صرفاً برای اطمینان از عملکرد بدون نقص، امنیت سیستم و بهینه‌سازی فنی استفاده می‌شوند. این داده‌ها با سایر منابع داده ترکیب نمی‌شوند.'
                },
                {
                    title: '۶. کوکی‌ها (Cookies)',
                    content: 'وب‌سایت ما از کوکی‌ها استفاده می‌کند. کوکی‌ها فایل‌های متنی کوچکی هستند که در دستگاه شما ذخیره می‌شوند. انواع کوکی‌ها: کوکی‌های ضروری (از نظر فنی لازم)، کوکی‌های آماری، کوکی‌های بازاریابی. کوکی‌های غیرضروری تنها با رضایت صریح شما تنظیم می‌شوند.\nمبنای قانونی:\n- ماده ۶ بند ۱ الف GDPR (رضایت)\n- ماده ۶ بند ۱ و GDPR (کوکی‌های ضروری از نظر فنی)\nشما می‌توانید در هر زمان تنظیمات کوکی خود را تغییر دهید یا لغو کنید.'
                },
                {
                    title: '۷. فرم تماس و تماس از طریق ایمیل',
                    content: 'اگر از طریق فرم تماس یا ایمیل با ما تماس بگیرید، مشخصات شما از جمله داده‌های تماس ارائه شده برای پردازش درخواست شما ذخیره می‌شود. هدف: پردازش درخواست شما. مبنای قانونی: ماده ۶ بند ۱ ب GDPR. این داده‌ها بدون رضایت شما به دیگران منتقل نخواهند شد.'
                },
                {
                    title: '۸. تماس از طریق واتس‌اپ',
                    content: 'اگر از طریق واتس‌اپ با ما تماس بگیرید، ارتباط از طریق WhatsApp Ireland Ltd انجام می‌شود. لطفاً توجه داشته باشید که واتس‌اپ داده‌های شخصی را به طور مستقل پردازش می‌کند. استفاده از واتس‌اپ داوطلبانه است.'
                },
                {
                    title: '۹. گوگل أنالیتیکس',
                    content: 'این وب‌سایت از Google Analytics، یک سرویس تجزیه و تحلیل وب متعلق به Google Ireland Limited استفاده می‌کند. ناشناس‌سازی IP فعال است. پردازش داده‌ها تنها پس از رضایت انجام می‌شود. انتقال داده‌ها به کشورهای ثالث امکان‌پذیر است (بندهای قراردادی استاندارد). شما می‌توانید رضایت خود را در هر زمان لغو کنید.'
                },
                {
                    title: '۱۰. Meta Pixel (فیس‌بوک و اینستاگرام)',
                    content: 'در صورتی که رضایت داده باشید، ما از Meta Pixel شرکت Meta Platforms Ireland Ltd استفاده می‌کنیم. هدف: اندازه‌گیری دسترسی، ردیابی تبدیل، تبلیغات شخصی‌سازی شده. داده‌های جمع‌آوری شده برای ما ناشناس هستند. متا می‌تواند این داده‌ها را به پروفایل کاربری شما مرتبط کند.'
                },
                {
                    title: '۱۱. لینک‌های رسانه‌های اجتماعی',
                    content: 'وب‌سایت ما حاوی لینک‌هایی به شبکه‌های اجتماعی (مانند فیس‌بوک، اینستاگرام) است. این‌ها صرفاً لینک‌های هدایت‌کننده هستند. برای پردازش داده‌ها در پلتفرم‌های مربوطه، صرفاً ارائه‌دهنده مربوطه مسئول است.'
                },
                {
                    title: '۱۲. مدت زمان نگهداری',
                    content: 'داده‌های شخصی تنها تا زمانی که برای هدف مربوطه لازم باشد یا الزامات نگهداری قانونی وجود داشته باشد، ذخیره می‌شوند.'
                },
                {
                    title: '۱۳. حقوق شما بر اساس GDPR',
                    content: 'شما در هر زمان حق دارید:\n- اطلاع‌رسانی (ماده ۱۵ GDPR)\n- اصلاح (ماده ۱۶ GDPR)\n- حذف (ماده ۱۷ GDPR)\n- محدودیت پردازش (ماده ۱۸ GDPR)\n- انتقال داده‌ها (ماده ۲۰ GDPR)\n- لغو رضایت (ماده ۷ GDPR)\n- شکایت به مرجع نظارتی حفاظت از داده‌ها'
                },
                {
                    title: '۱۴. مرجع حفاظت از داده‌ها',
                    content: 'مرجع حفاظت از داده‌های اتریش: https://www.dsb.gv.at'
                },
                {
                    title: '۱۵. امنیت داده‌ها',
                    content: 'ما از اقدامات امنیتی فنی و سازمانی برای محافظت از داده‌های شما در برابر از دست رفتن، دستکاری، دسترسی غیرمجاز یا افشا استفاده می‌کنیم.'
                },
                {
                    title: '۱۶. تغییرات در این سیاست حفظ حریم خصوصی',
                    content: 'این سیاست حفظ حریم خصوصی در حال حاضر معتبر است و در صورت تغییرات قانونی یا فنی اصلاح خواهد شد.'
                }
            ]
        },
        impressum: {
            title: 'اطلاعات حقوقی',
            sections: [
                {
                    title: 'مشخصات طبق بند ۵ ECG، بند ۱۴ UGB و بند ۶۳ GewO',
                    content: 'آموزشگاه رانندگی Gate 11\nمالک: Sercan Sökmen\nSimmeringer Hauptstraße 179\n1110 Wien\nاتریش'
                },
                {
                    title: 'تماس',
                    content: 'تلفن: +43 1 767 32 87\nایمیل: drive@fahrschulegate11.at'
                },
                {
                    title: 'موضوع فعالیت شرکت',
                    content: 'مدیریت آموزشگاه رانندگی و آموزش رانندگان وسایل نقلیه موتوری طبق مقررات قانونی حاکم.'
                },
                {
                    title: 'مرجع نظارتی',
                    content: 'شهرداری وین (Magistrat)'
                },
                {
                    title: 'مقررات حرفه‌ای',
                    content: 'قانون وسایل نقلیه موتوری (KFG)\nقانون آموزشگاه‌های رانندگی\nGDPR, DSG, TKG 2021'
                },
                {
                    title: 'حل اختلاف مصرف‌کننده',
                    content: 'ما موظف و مایل به شرکت در مراحل حل اختلاف در هیئت داوری مصرف‌کننده نیستیم.'
                },
                {
                    title: 'مسئولیت محتوا',
                    content: 'مطالب صفحات ما با کمال دقت تهیه شده است. با این حال، ما نمی‌توانیم در مورد درستی، کامل بودن و به‌روز بودن مطالب تضمینی ارائه دهیم.'
                },
                {
                    title: 'مسئولیت لینک‌ها',
                    content: 'وب‌سایت ما حاوی لینک‌هایی به وب‌سایت‌های خارجی اشخاص ثالث است. ما هیچ نفوذی بر محتوای آن‌ها نداریم و مسئولیتی در قبال آن‌ها نمی‌پذیریم.'
                },
                {
                    title: 'حق چاپ',
                    content: 'مطالب و آثار ایجاد شده توسط گردانندگان سایت در این وب‌سایت مشمول قانون کپی‌رایت اتریش است.'
                }
            ]
        },
        agb: {
            title: 'شرایط و ضوابط عمومی (AGB)',
            sections: [
                {
                    title: '۱. دامنه کاربرد',
                    content: 'این شرایط و ضوابط برای همه قراردادها، خدمات و پیشنهادات آموزشگاه رانندگی Gate 11 به مشتریانش اعمال می‌شود. شرایط متفاوت مشتری پذیرفته نمی‌شود مگر اینکه صریحاً به صورت کتبی تایید شده باشد.'
                },
                {
                    title: '۲. خدمات',
                    content: 'آموزشگاه رانندگی به ویژه موارد زیر را ارائه می‌دهد:\n- آموزش تئوری و عملی رانندگی\n- آماده‌سازی برای امتحان\n- دوره‌های آموزشی اجباری قانونی\n- خدمات مشاوره‌ای\nمحدوده دقیق خدمات در قرارداد آموزشی فردی تعیین می‌شود.'
                },
                {
                    title: '۳. انعقاد قرارداد',
                    content: 'قرارداد با ثبت‌نام مشتری و پذیرش توسط آموزشگاه رانندگی منعقد می‌شود. ثبت‌نام الزام‌آور است.'
                },
                {
                    title: '۴. قیمت‌ها و پرداخت',
                    content: 'کلیه قیمت‌ها به یورو (€) شامل مالیات بر ارزش افزوده قانونی است. پرداخت‌ها باید به موقع انجام شوند. در صورت تاخیر در پرداخت، آموزشگاه مجاز به تعلیق خدمات است.'
                },
                {
                    title: '۵. رزرو نوبت و لغو',
                    content: 'جلسات رانندگی به طور الزام‌آور توافق می‌شوند. لغو رایگان فقط در صورتی امکان‌پذیر است که حداقل ۲۴ ساعت قبل از موعد انجام شود. در صورت عدم حضور یا لغو دیرتر، هزینه جلسه به طور کامل دریافت می‌شود.'
                },
                {
                    title: '۶. وظایف مشتری',
                    content: 'مشتری متعهد می‌شود:\n- اطلاعات صحیح ارائه دهد\n- از دستورات مربیان رانندگی پیروی کند\n- محدودیت‌های سلامتی را گزارش دهد\n- الزامات قانونی را برآورده کند'
                },
                {
                    title: '۷. مسئولیت',
                    content: 'آموزشگاه رانندگی فقط در صورت عمد یا سهل‌انگاری فاحش مسئول است. در صورت سهل‌انگاری جزئی، مسئولیت فقط محدود به نقض تعهدات قراردادی اساسی و خسارات قابل پیش‌بینی است. مسئولیت در قبال عدم قبولی در امتحانات، تاخیرها یا حوادث غیرمترقبه منتفی است.'
                },
                {
                    title: '۸. حفاظت از داده‌ها',
                    content: 'پردازش داده‌های شخصی طبق بیانیه حریم خصوصی موجود در وب‌سایت انجام می‌شود.'
                },
                {
                    title: '۹. پایان قرارداد / انصراف',
                    content: 'انصراف از قرارداد فقط به دلایل مهم امکان‌پذیر است. هزینه‌ی خدماتی که قبلاً ارائه شده است باید پرداخت شود.'
                },
                {
                    title: '۱۰. محل دادرسی و قانون حاکم',
                    content: 'قانون اتریش حاکم است. محل دادرسی وین است، تا جایی که قانون اجازه دهد.'
                },
                {
                    title: '۱۱. بند جدایی‌پذیری',
                    content: 'اگر برخی از مفاد نامعتبر باشند، اعتبار سایر مفاد بدون تغییر باقی می‌ماند.'
                }
            ]
        },
        cookies: {
            title: 'سیاست کوکی‌ها',
            sections: [
                {
                    title: '۱. کلیات',
                    content: 'این وب‌سایت از کوکی‌ها و فناوری‌های مشابه برای اطمینان از عملکرد وب‌سایت، امکان ارزیابی‌های آماری و انجام اقدامات بازاریابی استفاده می‌کند.'
                },
                {
                    title: '۲. کوکی چیست؟',
                    content: 'کوکی‌ها فایل‌های متنی کوچکی هستند که در دستگاه شما ذخیره می‌شوند و می‌توانند حاوی اطلاعات باشند.'
                },
                {
                    title: '۳. انواع کوکی‌ها',
                    content: 'الف) کوکی‌های ضروری: از نظر فنی لازم، مبنای قانونی: بند ۶ (۱) (f) از GDPR.\nب) کوکی‌های آماری: به ما در بهبود وب‌سایت کمک می‌کنند، مبنای قانونی: بند ۶ (۱) (الف) از GDPR (رضایت).\nج) کوکی‌های بازاریابی: تبلیغات شخصی‌سازی شده، مبنای قانونی: بند ۶ (۱) (الف) از GDPR.'
                },
                {
                    title: '۴. رضایت کوکی',
                    content: 'در اولین بازدید، می‌توانید همه را بپذیرید، فقط موارد ضروری را مجاز کنید یا تنظیمات فردی انجام دهید. می‌توانید هر زمان رضایت خود را لغو کنید.'
                },
                {
                    title: '۵. ارائه‌دهندگان شخص ثالث',
                    content: 'کوکی‌ها می‌توانند توسط Google Ireland Limited و Meta Platforms Ireland Ltd تنظیم شوند. انتقال داده به کشورهای ثالث امکان‌پذیر است (بندهای قراردادی استاندارد).'
                },
                {
                    title: '۶. مدت زمان نگهداری',
                    content: 'کوکی‌ها یا در پایان جلسه حذف می‌شوند یا برای مدت زمان مشخصی ذخیره می‌شوند.'
                },
                {
                    title: '۷. مدیریت کوکی‌ها',
                    content: 'می‌توانید کوکی‌ها را در هر زمان از طریق تنظیمات مرورگر یا بنر کوکی مدیریت یا حذف کنید.'
                },
                {
                    title: '۸. به‌روز بودن',
                    content: 'این سیاست کوکی در صورت تغییرات فنی یا قانونی اصلاح می‌شود.'
                }
            ]
        }
    }
};
