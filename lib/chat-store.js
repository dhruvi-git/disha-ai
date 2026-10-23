import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

// Returns the signed-in user's DB record, or null.
export async function getDbUser() {
  const { userId } = await auth();
  if (!userId) return null;
  return db.user.findUnique({ where: { clerkUserId: userId } });
}

export async function listConversations(userId) {
  return db.conversation.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: 100,
    select: { id: true, title: true, updatedAt: true },
  });
}

// Loads one conversation (only if it belongs to the user) as UI messages.
export async function loadConversation(conversationId, userId) {
  const conversation = await db.conversation.findFirst({
    where: { id: conversationId, userId },
    include: { messages: { orderBy: { createdAt: "asc" } } },
  });
  if (!conversation) return null;

  return {
    id: conversation.id,
    title: conversation.title,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
      ...(m.metadata ? { metadata: m.metadata } : {}),
    })),
  };
}

export function textFromParts(parts = []) {
  return parts
    .filter((p) => p?.type === "text")
    .map((p) => p.text)
    .join("")
    .trim();
}

export function makeTitle(message) {
  const text = textFromParts(message?.parts).replace(/\s+/g, " ");
  const firstFile = message?.metadata?.attachments?.[0]?.name;
  const base = text || (firstFile ? `File: ${firstFile}` : "New chat");
  return base.length > 60 ? `${base.slice(0, 57).trimEnd()}…` : base;
}

// Serialize dates for passing from server components to client components.
export function serializeConversations(list) {
  return list.map((c) => ({ ...c, updatedAt: c.updatedAt.toISOString() }));
}
