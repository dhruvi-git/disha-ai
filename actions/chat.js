"use server";

import { db } from "@/lib/prisma";
import {
  getDbUser,
  listConversations,
  loadConversation,
  serializeConversations,
} from "@/lib/chat-store";

export async function getConversationMessages(id) {
  const user = await getDbUser();
  if (!user) return null;
  const conversation = await loadConversation(id, user.id);
  return conversation?.messages ?? null;
}

export async function getConversations() {
  const user = await getDbUser();
  if (!user) return [];
  return serializeConversations(await listConversations(user.id));
}

export async function renameConversation(id, title) {
  const user = await getDbUser();
  if (!user) throw new Error("Unauthorized");
  const clean = String(title || "").replace(/\s+/g, " ").trim().slice(0, 80);
  if (!clean) return;
  await db.conversation.updateMany({
    where: { id, userId: user.id },
    data: { title: clean },
  });
}

export async function deleteConversation(id) {
  const user = await getDbUser();
  if (!user) throw new Error("Unauthorized");
  await db.conversation.deleteMany({ where: { id, userId: user.id } });
}
