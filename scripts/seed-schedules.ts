import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const modules = [
  { abk: "GW1", topic: "Einführungsphase, Verkehrsraum" },
  { abk: "GW2", topic: "Partnerkunde" },
  { abk: "GW3", topic: "Verkehrszeichen und Bodenmarkierungen" },
  { abk: "GW4", topic: "Fahrordnung I" },
  { abk: "GW5", topic: "Fahrordnung II" },
  { abk: "GW6", topic: "Vorrangsregel" },
  { abk: "GW7", topic: "Eisenbahnkreuzung, Abstellen" },
  { abk: "GW8", topic: "Wahl der Fahrgeschwindigkeit" },
  { abk: "GW9", topic: "Hintereinanderfahren, Überholen" },
  { abk: "GW10", topic: "Beeinträchtigung der Fahrtüchtigkeit, Unfall" },
  { abk: "B1", topic: "Lenkberechtigung, Pflichten des Lenkers" },
  { abk: "B2", topic: "Personenbeförderung, Beladung" },
  { abk: "B3", topic: "Fahrzeugkunde I" },
  { abk: "B4", topic: "Fahrzeugkunde II" },
  { abk: "B5", topic: "Fahrzeugkunde III" },
  { abk: "B6", topic: "Fahrdynamik" }
];

function parseDate(dateStr: string) {
  const [day, month, year] = dateStr.split('.').map(Number);
  return new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
}

function calculateSecondModuleTime(startTimeStr: string) {
  // e.g. "17:00" -> "18:45"
  // e.g. "15:00" -> "16:45"
  // e.g. "11:00" -> "12:45"
  // e.g. "09:00" -> "10:45"
  // e.g. "14:00" -> "15:45"
  const [hour, min] = startTimeStr.split(':').map(Number);
  const totalMin = hour * 60 + min + 105; // 1 hour 45 minutes gap
  const newHour = Math.floor(totalMin / 60);
  const newMin = totalMin % 60;
  return `${String(newHour).padStart(2, '0')}:${String(newMin).padStart(2, '0')}`;
}

async function main() {
  console.log("Starting course schedules seeding...");

  // 1. Delete all old schedules
  const deleted = await prisma.courseSchedule.deleteMany();
  console.log(`Cleared ${deleted.count} old course schedules.`);

  // 2. Define the course slots
  const coursesData = [
    // -------------------------------------------------------------
    // 1. Intensivkurs Juli (Abend / Afternoon)
    // -------------------------------------------------------------
    {
      name: "Intensivkurs Juli (Abend)",
      days: [
        { date: "01.07.2026", startTime: "17:00" },
        { date: "02.07.2026", startTime: "17:00" },
        { date: "03.07.2026", startTime: "15:00" },
        { date: "04.07.2026", startTime: "11:00" },
        { date: "06.07.2026", startTime: "17:00" },
        { date: "07.07.2026", startTime: "17:00" },
        { date: "08.07.2026", startTime: "17:00" },
        { date: "09.07.2026", startTime: "17:00" }
      ]
    },
    // -------------------------------------------------------------
    // 2. Intensivkurs Juli (Vormittag / Morning)
    // -------------------------------------------------------------
    {
      name: "Intensivkurs Juli (Vormittag)",
      days: [
        { date: "06.07.2026", startTime: "11:00" },
        { date: "07.07.2026", startTime: "11:00" },
        { date: "08.07.2026", startTime: "11:00" },
        { date: "09.07.2026", startTime: "11:00" },
        { date: "10.07.2026", startTime: "11:00" },
        { date: "13.07.2026", startTime: "11:00" },
        { date: "14.07.2026", startTime: "11:00" },
        { date: "15.07.2026", startTime: "11:00" }
      ]
    },
    // -------------------------------------------------------------
    // 3. Intensivkurs August (Vormittag 1)
    // -------------------------------------------------------------
    {
      name: "Intensivkurs August (Vormittag I)",
      days: [
        { date: "29.07.2026", startTime: "09:00" },
        { date: "30.07.2026", startTime: "09:00" },
        { date: "31.07.2026", startTime: "09:00" },
        { date: "03.08.2026", startTime: "09:00" },
        { date: "04.08.2026", startTime: "09:00" },
        { date: "05.08.2026", startTime: "09:00" },
        { date: "06.08.2026", startTime: "09:00" },
        { date: "07.08.2026", startTime: "09:00" }
      ]
    },
    // -------------------------------------------------------------
    // 4. Intensivkurs August (Vormittag 2)
    // -------------------------------------------------------------
    {
      name: "Intensivkurs August (Vormittag II)",
      days: [
        { date: "24.08.2026", startTime: "09:00" },
        { date: "25.08.2026", startTime: "09:00" },
        { date: "26.08.2026", startTime: "09:00" },
        { date: "27.08.2026", startTime: "09:00" },
        { date: "28.08.2026", startTime: "09:00" },
        { date: "31.08.2026", startTime: "09:00" },
        { date: "01.09.2026", startTime: "09:00" },
        { date: "02.09.2026", startTime: "09:00" }
      ]
    },
    // -------------------------------------------------------------
    // 5. Intensivkurs Mai (Nachmittag)
    // -------------------------------------------------------------
    {
      name: "Intensivkurs Mai",
      days: [
        { date: "15.05.2026", startTime: "14:00" },
        { date: "16.05.2026", startTime: "11:00" },
        { date: "18.05.2026", startTime: "17:00" },
        { date: "19.05.2026", startTime: "17:00" },
        { date: "20.05.2026", startTime: "17:00" },
        { date: "21.05.2026", startTime: "17:00" },
        { date: "22.05.2026", startTime: "14:00" },
        { date: "23.05.2026", startTime: "11:00" }
      ]
    }
  ];

  let totalCreated = 0;

  for (const course of coursesData) {
    console.log(`Processing ${course.name}...`);
    
    // Each course spans 8 days, covering 16 modules in total (2 per day)
    course.days.forEach((day, index) => {
      const moduleIndex1 = index * 2;
      const moduleIndex2 = index * 2 + 1;
      
      const mod1 = modules[moduleIndex1];
      const mod2 = modules[moduleIndex2];
      
      const parsedDate = parseDate(day.date);
      const time1 = day.startTime;
      const time2 = calculateSecondModuleTime(day.startTime);

      // Create first module of the day
      schedulesToCreate.push({
        date: parsedDate,
        time: time1,
        abbreviation: mod1.abk,
        topic: mod1.topic,
        type: "INTENSIVE" as const,
        isVisible: true
      });

      // Create second module of the day
      schedulesToCreate.push({
        date: parsedDate,
        time: time2,
        abbreviation: mod2.abk,
        topic: mod2.topic,
        type: "INTENSIVE" as const,
        isVisible: true
      });
    });
  }

  // Insert into DB
  for (const s of schedulesToCreate) {
    await prisma.courseSchedule.create({
      data: s
    });
    totalCreated++;
  }

  console.log(`Successfully created ${totalCreated} schedule records!`);
}

const schedulesToCreate: Array<{
  date: Date;
  time: string;
  abbreviation: string;
  topic: string;
  type: "INTENSIVE" | "EVENING";
  isVisible: boolean;
}> = [];

main().catch(console.error).finally(() => prisma.$disconnect());
