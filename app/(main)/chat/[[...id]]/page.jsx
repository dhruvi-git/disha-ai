import { redirect } from "next/navigation";
import { checkUser } from "@/lib/checkUser";
import {
  listConversations,
  loadConversation,
  serializeConversations,
} from "@/lib/chat-store";
import ChatApp from "@/components/chat/chat-app";

export const dynamic = "force-dynamic";

export const metadata = { title: "Chat with Disha" };

// Handles both /chat (new chat) and /chat/<id> (saved chat).
export default async function ChatPage({ params }) {
  const { id } = await params;
  const user = await checkUser();
  if (!user) redirect("/sign-in");

  const conversationId = id?.[0];
  let initialMessages = [];

  if (conversationId) {
    const conversation = await loadConversation(conversationId, user.id);
    if (!conversation) redirect("/chat");
    initialMessages = conversation.messages;
  }

  const conversations = serializeConversations(await listConversations(user.id));

  return (
    <ChatApp
      initialConversations={conversations}
      conversationId={conversationId}
      initialMessages={initialMessages}
    />
  );
}
