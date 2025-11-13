import "dotenv/config";
import { db } from "@/index";
import { user, account } from "./schema/auth";
import { userInformation } from "./schema/user";
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
    for (const userData of usersToCreate) {
      console.log(`Creating user: ${userData.email}...`);

      // 1. Crea l'utente nella tabella user
      await db.insert(user).values({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        emailVerified: userData.emailVerified,
        image: null,
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

      console.log(`✅ User created: ${userData.email} (${userData.role})`);
    }

    console.log("\n🎉 Seed completato con successo!");
    console.log("\n📋 Riepilogo utenti creati:");
    console.log("Admin: 1");
    console.log("Teachers: 3");
    console.log("Users: 6");
    console.log("\n🔑 Password predefinite:");
    console.log("Admin: admin123");
    console.log("Teachers: teacher123");
    console.log("Users: asdasdasd");
  } catch (error) {
    console.error("❌ Errore durante il seed:", error);
    process.exit(1);
  }

  process.exit(0);
}

seed();
