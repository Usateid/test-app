import "dotenv/config";
import { db } from "@/index";
import { user, account } from "./schema/auth";
import { userInformation, userSubscriptions } from "./schema/user";
import { subscriptions } from "./schema/subscriptions";
import { lessons } from "./schema/lessons";
import { lessonRegistrations } from "./schema/lesson-registrations";
import { eq, gt } from "drizzle-orm";
import { randomUUID } from "crypto";

// Funzione helper per creare un hash semplice (in produzione usa bcrypt o simili)
async function hashPassword(password: string): Promise<string> {
  // Per semplicità uso un hash basic, in produzione usa better-auth o bcrypt
  const { createHash } = await import("crypto");
  return createHash("sha256").update(password).digest("hex");
}

async function seed() {
  console.log("🌱 Inizio seed del database...");

  // Lista di utenti da creare
  const usersToCreate = [
    // Admin
    {
      id: randomUUID(),
      name: "Admin User",
      email: "admin@example.com",
      emailVerified: true,
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      role: "admin" as const,
    },
    // Teachers
    {
      id: randomUUID(),
      name: "Mario Rossi",
      email: "mario.rossi@example.com",
      emailVerified: true,
      password: " ",
      firstName: "Mario",
      lastName: "Rossi",
      role: "teacher" as const,
    },
    {
      id: randomUUID(),
      name: "Laura Bianchi",
      email: "laura.bianchi@example.com",
      emailVerified: true,
      password: "teacher123",
      firstName: "Laura",
      lastName: "Bianchi",
      role: "teacher" as const,
    },
    {
      id: randomUUID(),
      name: "Giuseppe Verdi",
      email: "giuseppe.verdi@example.com",
      emailVerified: true,
      password: "teacher123",
      firstName: "Giuseppe",
      lastName: "Verdi",
      role: "teacher" as const,
    },
    // Regular Users
    {
      id: randomUUID(),
      name: "Paolo Neri",
      email: "paolo.neri@example.com",
      emailVerified: true,
      password: "asdasdasd",
      firstName: "Paolo",
      lastName: "Neri",
      role: "user" as const,
    },
    {
      id: randomUUID(),
      name: "Francesca Romano",
      email: "francesca.romano@example.com",
      emailVerified: true,
      password: "asdasdasd",
      firstName: "Francesca",
      lastName: "Romano",
      role: "user" as const,
    },
    {
      id: randomUUID(),
      name: "Andrea Ferrari",
      email: "andrea.ferrari@example.com",
      emailVerified: true,
      password: "asdasdasd",
      firstName: "Andrea",
      lastName: "Ferrari",
      role: "user" as const,
    },
    {
      id: randomUUID(),
      name: "Giulia Colombo",
      email: "giulia.colombo@example.com",
      emailVerified: true,
      password: "asdasdasd",
      firstName: "Giulia",
      lastName: "Colombo",
      role: "user" as const,
    },
    {
      id: randomUUID(),
      name: "Marco Ricci",
      email: "marco.ricci@example.com",
      emailVerified: true,
      password: "asdasdasd",
      firstName: "Marco",
      lastName: "Ricci",
      role: "user" as const,
    },
    {
      id: randomUUID(),
      name: "Chiara Marino",
      email: "chiara.marino@example.com",
      emailVerified: true,
      password: "asdasdasd",
      firstName: "Chiara",
      lastName: "Marino",
      role: "user" as const,
    },
  ];

  try {
    const teacherIds: string[] = [];
    const userIds: string[] = [];

    // Step 1: Create users (skip if they already exist)
    for (const userData of usersToCreate) {
      // Check if user already exists
      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.email, userData.email))
        .limit(1);

      if (existingUser) {
        console.log(
          `⏭️  User already exists: ${userData.email} (${userData.role})`
        );
        if (userData.role === "teacher") {
          teacherIds.push(existingUser.id);
        } else if (userData.role === "user") {
          userIds.push(existingUser.id);
        }
        continue;
      }

      console.log(`Creating user: ${userData.email}...`);

      // 1. Crea l'utente nella tabella user
      await db.insert(user).values({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
      });

      // 2. Crea le informazioni aggiuntive nella tabella userInformation
      await db.insert(userInformation).values({
        userId: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
      });

      // 3. Crea l'account con password
      const hashedPassword = await hashPassword(userData.password);
      await db.insert(account).values({
        id: randomUUID(),
        accountId: userData.id,
        providerId: "credential",
        userId: userData.id,
        password: hashedPassword,
        accessToken: null,
        refreshToken: null,
        idToken: null,
        accessTokenExpiresAt: null,
        refreshTokenExpiresAt: null,
        scope: null,
      });

      if (userData.role === "teacher") {
        teacherIds.push(userData.id);
      } else if (userData.role === "user") {
        userIds.push(userData.id);
      }

      console.log(`✅ User created: ${userData.email} (${userData.role})`);
    }

    // Step 2: Create subscriptions
    console.log("\n📦 Creating subscriptions...");
    const now = new Date();
    const subscriptionsToCreate = [
      {
        name: "Abbonamento Mensile Base",
        description: "Accesso illimitato per 30 giorni, 1 lezione al giorno",
        price: 5000, // in centesimi (50.00 EUR)
        fromDate: new Date(now.getFullYear(), now.getMonth(), 1),
        toDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        status: "active" as const,
        entriesPerDay: 1,
        entriesPerWeek: 7,
        center: "Vasto" as const,
        durationInDays: 30,
      },
      {
        name: "Abbonamento Mensile Premium",
        description: "Accesso illimitato per 30 giorni, 2 lezioni al giorno",
        price: 8000, // in centesimi (80.00 EUR)
        fromDate: new Date(now.getFullYear(), now.getMonth(), 1),
        toDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        status: "active" as const,
        entriesPerDay: 2,
        entriesPerWeek: 14,
        center: "Vasto" as const,
        durationInDays: 30,
      },
      {
        name: "Abbonamento Settimanale",
        description: "Accesso per 7 giorni, 1 lezione al giorno",
        price: 1500, // in centesimi (15.00 EUR)
        fromDate: now,
        toDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        status: "active" as const,
        entriesPerDay: 1,
        entriesPerWeek: 7,
        center: "Vasto" as const,
        durationInDays: 7,
      },
      {
        name: "Abbonamento Trimestrale",
        description: "Accesso illimitato per 90 giorni, 1 lezione al giorno",
        price: 12000, // in centesimi (120.00 EUR)
        fromDate: new Date(now.getFullYear(), now.getMonth(), 1),
        toDate: new Date(now.getFullYear(), now.getMonth() + 3, 0),
        status: "active" as const,
        entriesPerDay: 1,
        entriesPerWeek: 7,
        center: "Pescara" as const,
        durationInDays: 90,
      },
    ];

    const createdSubscriptionIds: string[] = [];
    for (const subData of subscriptionsToCreate) {
      const subId = randomUUID();
      await db.insert(subscriptions).values({
        id: subId,
        ...subData,
      });
      createdSubscriptionIds.push(subId);
      console.log(`✅ Subscription created: ${subData.name}`);
    }

    // Step 3: Create lessons
    console.log("\n📚 Creating lessons...");
    const lessonsToCreate = [];

    // Create lessons for the next 4 weeks
    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() + week * 7);
      weekStart.setHours(0, 0, 0, 0);

      // Create lessons for each day of the week
      for (let day = 0; day < 7; day++) {
        const lessonDate = new Date(weekStart);
        lessonDate.setDate(weekStart.getDate() + day);

        // Morning lesson (9:00 - 10:00)
        if (teacherIds[0]) {
          const startTime = new Date(lessonDate);
          startTime.setHours(9, 0, 0, 0);
          const endTime = new Date(lessonDate);
          endTime.setHours(10, 0, 0, 0);

          lessonsToCreate.push({
            title: "Yoga Mattutino",
            description: "Lezione di yoga per iniziare la giornata con energia",
            teacherId: teacherIds[0],
            startTime,
            endTime,
            center: "Vasto" as const,
            status: "scheduled" as const,
          });
        }

        // Afternoon lesson (18:00 - 19:00)
        if (teacherIds[1] && day < 5) {
          // Only weekdays
          const startTime = new Date(lessonDate);
          startTime.setHours(18, 0, 0, 0);
          const endTime = new Date(lessonDate);
          endTime.setHours(19, 0, 0, 0);

          lessonsToCreate.push({
            title: "Yoga Sera",
            description:
              "Lezione di yoga per rilassarsi dopo una giornata di lavoro",
            teacherId: teacherIds[1],
            startTime,
            endTime,
            center: "Vasto" as const,
            status: "scheduled" as const,
          });
        }

        // Evening lesson (19:30 - 20:30) - only on Wednesdays and Fridays
        if (teacherIds[2] && (day === 2 || day === 4)) {
          const startTime = new Date(lessonDate);
          startTime.setHours(19, 30, 0, 0);
          const endTime = new Date(lessonDate);
          endTime.setHours(20, 30, 0, 0);

          lessonsToCreate.push({
            title: "Yoga Avanzato",
            description: "Lezione di yoga per praticanti esperti",
            teacherId: teacherIds[2],
            startTime,
            endTime,
            center: "Pescara" as const,
            status: "scheduled" as const,
          });
        }
      }
    }

    let lessonsCreated = 0;
    for (const lessonData of lessonsToCreate) {
      await db.insert(lessons).values(lessonData);
      lessonsCreated++;
    }
    console.log(`✅ Created ${lessonsCreated} lessons`);

    // Step 4: Create some user-subscriptions (assign subscriptions to users)
    console.log("\n🔗 Creating user-subscriptions...");
    if (userIds.length > 0 && createdSubscriptionIds.length > 0) {
      // Assign monthly subscription to first 3 users
      for (let i = 0; i < Math.min(3, userIds.length); i++) {
        const activatedAt = new Date();
        const expiresAt = new Date(activatedAt);
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

        await db.insert(userSubscriptions).values({
          userId: userIds[i],
          subscriptionId: createdSubscriptionIds[0], // Monthly base subscription
          activatedAt,
          expiresAt,
        });
        console.log(`✅ User-subscription created for user ${i + 1}`);
      }

      // Assign weekly subscription to next 2 users
      for (let i = 3; i < Math.min(5, userIds.length); i++) {
        const activatedAt = new Date();
        const expiresAt = new Date(activatedAt);
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        await db.insert(userSubscriptions).values({
          userId: userIds[i],
          subscriptionId: createdSubscriptionIds[2], // Weekly subscription
          activatedAt,
          expiresAt,
        });
        console.log(`✅ User-subscription created for user ${i + 1}`);
      }
    }

    // Step 5: Create lesson registrations for specific user
    console.log("\n📝 Creating lesson registrations...");
    const specificUserId = "GiDhnQQj8cgZGD2915BGSgEa0PsLeWzs";

    // Verify user exists
    const [targetUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, specificUserId))
      .limit(1);

    if (targetUser) {
      // Get upcoming lessons (starting from now)
      const upcomingLessons = await db
        .select({
          id: lessons.id,
          title: lessons.title,
          startTime: lessons.startTime,
        })
        .from(lessons)
        .where(gt(lessons.startTime, new Date()))
        .orderBy(lessons.startTime)
        .limit(10); // Register for next 10 lessons

      if (upcomingLessons.length > 0) {
        let registrationsCreated = 0;
        for (const lesson of upcomingLessons) {
          try {
            await db.insert(lessonRegistrations).values({
              userId: specificUserId,
              lessonId: lesson.id,
            });
            registrationsCreated++;
            console.log(
              `✅ Registered user to lesson: ${
                lesson.title
              } (${lesson.startTime.toLocaleDateString()})`
            );
          } catch (error: any) {
            // Skip if already registered (primary key constraint)
            if (error?.code === "23505") {
              console.log(`⏭️  Already registered to lesson: ${lesson.title}`);
            } else {
              console.error(
                `❌ Error registering to lesson ${lesson.title}:`,
                error
              );
            }
          }
        }
        console.log(
          `✅ Created ${registrationsCreated} lesson registrations for user ${specificUserId}`
        );
      } else {
        console.log(`⚠️  No upcoming lessons found to register`);
      }
    } else {
      console.log(
        `⚠️  User with ID ${specificUserId} not found, skipping lesson registrations`
      );
    }
  } catch (error) {
    console.error("❌ Errore durante il seed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
