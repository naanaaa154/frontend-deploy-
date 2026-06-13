// drizzle/seed.ts
import { db } from "./index";
import { roles, users, meetings, meeting_parts, chat_sessions, chat_messages } from "./schema";
import { randomUUID } from "crypto";

async function main() {
  // 1. Seed roles
  const adminRoleId = randomUUID();
  const userRoleId = randomUUID();
  await db.insert(roles).values([
    { id: adminRoleId, name: "admin" },
    { id: userRoleId, name: "user" },
  ]);

  // 2. Seed users
  const adminUserId = randomUUID();
  const normalUserId = randomUUID();
  await db.insert(users).values([
    { id: adminUserId, username: "admin", password: "admin123", role_id: adminRoleId },
    { id: normalUserId, username: "user", password: "user123", role_id: userRoleId },
  ]);

  // 3. Seed meetings
  const meetingId = randomUUID();
  await db.insert(meetings).values([
    {
      id: meetingId,
      name: "Kickoff Meeting",
      agenda: "Discuss project kickoff",
      note: "Initial notes",
      location: "Zoom",
      summary: "Project kickoff summary",
      created_by: adminUserId,
      updated_by: adminUserId,
    },
  ]);

  // 4. Seed meeting_parts
  const meetingPartId = randomUUID();
  await db.insert(meeting_parts).values([
    {
      id: meetingPartId,
      start_time: new Date(),
      end_time: new Date(),
      keywords: JSON.stringify(["kickoff", "project"]),
      action_items: JSON.stringify(["Send follow-up email"]),
      participants: JSON.stringify([adminUserId, normalUserId]),
      meeting_id: meetingId,
      file_url: "https://example.com/file.mp3",
      transcript: JSON.stringify(["Welcome to the meeting..."]),
      status: "uploaded",
      created_by: adminUserId,
    },
  ]);

  // 5. Seed chat_sessions
  const chatSessionId = randomUUID();
  await db.insert(chat_sessions).values([
    {
      id: chatSessionId,
      user_id: adminUserId,
      meeting_id: meetingId,
      title: "Kickoff Chat",
      created_by: adminUserId,
      updated_by: adminUserId,
    },
  ]);

  // 6. Seed chat_messages
  await db.insert(chat_messages).values([
    {
      id: randomUUID(),
      chat_session_id: chatSessionId,
      body: "Hello, this is the first message.",
      role: "admin",
      feedback: "processing",
      context: JSON.stringify({}),
      created_by: adminUserId,
      updated_by: adminUserId,
    },
  ]);

  console.log("✅ Seed data inserted!");
}

main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
