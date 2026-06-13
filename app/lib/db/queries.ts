import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { users, roles, meetings, meeting_parts, chat_sessions, chat_messages } from "~/lib/db/schema";

// ambil semua
const allUsers = await db.select().from(users);

// ambil 1 user (cara A: select -> array)
const [user] = await db.select().from(users).where(eq(users.id, "uuid-user-id"));

// ambil 1 user (cara B: query API, butuh drizzle({ schema }))
const user2 = await db.query.users.findFirst({
  where: eq(users.id, "uuid-user-id"),
});

// insert user (returning => array)
const [newUser] = await db.insert(users).values({
  username: "wahyu",
  password: "secret",
  role_id: null,
  created_at: new Date(),
  updated_at: new Date(),
}).returning();

// update (returning => array)
const [updatedUser] = await db.update(users)
  .set({ username: "wahyu-ikbal" })
  .where(eq(users.id, "uuid-user-id"))
  .returning();

// soft delete
await db.update(users)
  .set({ deleted_at: new Date(), deleted_by: "uuid-admin-id" })
  .where(eq(users.id, "uuid-user-id"));

// join example (pakai eq di join condition)
const meetingsWithCreator = await db.select({
  meetingName: meetings.name,
  creatorName: users.username,
})
.from(meetings)
.leftJoin(users, eq(users.id, meetings.created_by));
