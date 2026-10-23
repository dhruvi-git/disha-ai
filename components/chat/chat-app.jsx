"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId } from "ai";
import {
  AlertCircle,
  Bot,
  FileText,
  Loader2,
  PanelLeft,
  Paperclip,
  RotateCcw,
  Send,
  Square,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ChatSidebar from "@/components/chat/chat-sidebar";
import Markdown from "@/components/chat/markdown";
import {
  deleteConversation,
  getConversationMessages,
  getConversations,
  renameConversation,
} from "@/actions/chat";

const ACCEPT = ".pdf,.docx,.txt,.md,.csv,.json";
const MAX_FILES = 3;
const DEFAULT_FILE_PROMPT = "Please review the attached file and give me your feedback.";

const SUGGESTIONS = [
  "Give me a personalized 3-month career roadmap",
  "Review my resume and suggest improvements",
  "Ask me 5 mock interview questions for my field",
  "How should I negotiate my first salary offer?",
];

function getMessageText(message) {
  if (!Array.isArray(message?.parts)) return "";
  return message.parts
    .filter((part) => part?.type === "text")
    .map((part) => part.text)
    .join("");
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentChip({ name, size, status, error, onRemove }) {
  const isError = status === "error";
  return (
    <div
      className={`flex max-w-[16rem] items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs ${
        isError
          ? "border-red-900/60 bg-red-950/40 text-red-300"
          : "border-slate-700 bg-slate-800 text-slate-200"
      }`}
      title={error || name}
    >
      {status === "uploading" ? (
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-purple-400" />
      ) : isError ? (
        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      ) : (
        <FileText className="h-3.5 w-3.5 shrink-0 text-purple-400" />
      )}
      <span className="min-w-0 truncate">{isError ? error : name}</span>
      {size != null && !isError && (
        <span className="shrink-0 text-slate-500">{formatSize(size)}</span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 text-slate-400 hover:text-white"
          aria-label={`Remove ${name}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

function ChatPanel({ chatId, initialMessages, title, onFirstSend, onReplyFinished, onOpenSidebar }) {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status, error, stop, regenerate } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
    onFinish: () => onReplyFinished(),
  });

  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [dragging, setDragging] = useState(false);
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const isBusy = status === "submitted" || status === "streaming";
  const uploading = attachments.some((a) => a.status === "uploading");
  const readyFiles = attachments.filter((a) => a.status === "ready");
  const canSend = !isBusy && !uploading && (input.trim() || readyFiles.length > 0);

  const lastMessage = messages[messages.length - 1];
  const showThinking =
    status === "submitted" ||
    (status === "streaming" && lastMessage?.role === "assistant" && !getMessageText(lastMessage));

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  // Auto-grow the textarea.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [input]);

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || []).slice(0, MAX_FILES - attachments.length);
    for (const file of files) {
      const localId = generateId();
      setAttachments((prev) => [
        ...prev,
        { localId, name: file.name, size: file.size, status: "uploading" },
      ]);

      try {
        const body = new FormData();
        body.append("file", file);
        const res = await fetch("/api/chat/upload", { method: "POST", body });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Upload failed");

        setAttachments((prev) =>
          prev.map((a) =>
            a.localId === localId
              ? { ...a, status: "ready", text: data.text, truncated: data.truncated }
              : a
          )
        );
      } catch (err) {
        setAttachments((prev) =>
          prev.map((a) =>
            a.localId === localId ? { ...a, status: "error", error: err.message } : a
          )
        );
      }
    }
  };

  const send = async (overrideText) => {
    const text = (overrideText ?? input).trim();
    const files = overrideText ? [] : readyFiles;
    if (isBusy || uploading || (!text && files.length === 0)) return;

    const messageText = text || DEFAULT_FILE_PROMPT;
    onFirstSend(messageText, messages.length === 0);

    setInput("");
    setAttachments([]);

    await sendMessage({
      text: messageText,
      ...(files.length > 0 && {
        metadata: {
          attachments: files.map(({ name, size, text: fileText, truncated }) => ({
            name,
            size,
            text: fileText,
            truncated,
          })),
        },
      }),
    });
  };

  return (
    <div
      className="relative flex min-w-0 flex-1 flex-col"
      onDragOver={(e) => {
        if (e.dataTransfer?.types?.includes("Files")) {
          e.preventDefault();
          setDragging(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        uploadFiles(e.dataTransfer.files);
      }}
    >
      {dragging && (
        <div className="pointer-events-none absolute inset-2 z-20 flex items-center justify-center rounded-xl border-2 border-dashed border-purple-500 bg-slate-950/80 text-sm text-purple-200">
          Drop files to attach (PDF, DOCX, TXT, MD, CSV)
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white lg:hidden"
          aria-label="Open chat history"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <h1 className="min-w-0 truncate font-semibold text-slate-100">
          {messages.length > 0 ? title || "Chat with Disha" : "Chat with Disha"}
        </h1>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center pt-10 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
                <Bot className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-semibold text-white">Hi! I&apos;m Disha.</h2>
              <p className="mt-1 max-w-md text-sm text-slate-400">
                Your AI career coach. Ask anything, or attach a resume or job description and ask about it.
              </p>
              <div className="mt-8 grid w-full max-w-2xl gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-left text-sm text-slate-300 transition-colors hover:border-purple-500/50 hover:bg-slate-800"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => {
            const text = getMessageText(msg);
            const files = msg.metadata?.attachments || [];

            if (msg.role === "assistant" && !text) return null;

            return msg.role === "user" ? (
              <div key={msg.id} className="flex justify-end gap-3">
                <div className="flex max-w-[85%] flex-col items-end gap-2">
                  {files.length > 0 && (
                    <div className="flex flex-wrap justify-end gap-2">
                      {files.map((f, i) => (
                        <AttachmentChip key={i} name={f.name} size={f.size} status="ready" />
                      ))}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-purple-600 px-4 py-2.5 text-sm text-white">
                    {text}
                  </div>
                </div>
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-white">
                  <User className="h-4 w-4" />
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 text-slate-200">
                  <Markdown>{text}</Markdown>
                </div>
              </div>
            );
          })}

          {showThinking && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1 py-3">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="h-2 w-2 animate-bounce rounded-full bg-purple-500"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-red-900/50 bg-red-950/50 p-3 text-sm text-red-300">
              <span>Something went wrong: {error.message}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => regenerate()}
                className="shrink-0 border-red-900/60 bg-transparent text-red-200 hover:bg-red-900/40"
              >
                <RotateCcw className="mr-1 h-3.5 w-3.5" /> Retry
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="border-t border-slate-800 px-4 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 focus-within:border-purple-500/70"
        >
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-3 pt-3">
              {attachments.map((a) => (
                <AttachmentChip
                  key={a.localId}
                  {...a}
                  onRemove={() =>
                    setAttachments((prev) => prev.filter((x) => x.localId !== a.localId))
                  }
                />
              ))}
            </div>
          )}
          <div className="flex items-end gap-2 p-2">
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT}
              multiple
              hidden
              onChange={(e) => {
                uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachments.length >= MAX_FILES || isBusy}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white disabled:opacity-40"
              aria-label="Attach file"
              title="Attach PDF, DOCX, TXT, MD or CSV (max 5 MB, up to 3 files)"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask about careers, interviews, resumes…"
              className="max-h-[200px] min-h-[40px] flex-1 resize-none bg-transparent px-1 py-2 text-sm text-white placeholder:text-slate-500 outline-none"
            />
            {isBusy ? (
              <Button
                type="button"
                onClick={() => stop()}
                className="h-10 w-10 shrink-0 rounded-xl bg-slate-700 px-0 hover:bg-slate-600"
                aria-label="Stop generating"
              >
                <Square className="h-4 w-4 fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canSend}
                className="h-10 w-10 shrink-0 rounded-xl bg-purple-600 px-0 hover:bg-purple-700"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-slate-500">
          Enter to send · Shift+Enter for a new line · Attach PDF, DOCX or text files
        </p>
      </div>
    </div>
  );
}

export default function ChatApp({ initialConversations, conversationId, initialMessages = [] }) {
  const [conversations, setConversations] = useState(initialConversations);
  const [chat, setChat] = useState(() => ({
    id: conversationId || generateId(),
    messages: initialMessages,
  }));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshConversations = useCallback(async () => {
    try {
      setConversations(await getConversations());
    } catch (err) {
      console.error("Could not refresh chats:", err);
    }
  }, []);

  const [loadingChat, setLoadingChat] = useState(false);

  const startNewChat = useCallback((push = true) => {
    setChat({ id: generateId(), messages: [] });
    setSidebarOpen(false);
    if (push) window.history.pushState(null, "", "/chat");
  }, []);

  const openChat = useCallback(
    async (id, push = true) => {
      setSidebarOpen(false);
      if (push) window.history.pushState(null, "", `/chat/${id}`);
      setLoadingChat(true);
      try {
        const messages = await getConversationMessages(id);
        if (messages) {
          setChat({ id, messages });
        } else {
          startNewChat(false);
          window.history.replaceState(null, "", "/chat");
        }
      } finally {
        setLoadingChat(false);
      }
    },
    [startNewChat]
  );

  // Support the browser back/forward buttons.
  useEffect(() => {
    const onPopState = () => {
      const match = window.location.pathname.match(/^\/chat\/([^/]+)$/);
      if (match) openChat(match[1], false);
      else if (window.location.pathname === "/chat") startNewChat(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [openChat, startNewChat]);

  const handleFirstSend = (text, isFirst) => {
    if (!isFirst) return;
    const optimisticTitle = text.length > 60 ? `${text.slice(0, 57)}…` : text;
    setConversations((prev) =>
      prev.some((c) => c.id === chat.id)
        ? prev
        : [{ id: chat.id, title: optimisticTitle, updatedAt: new Date().toISOString() }, ...prev]
    );
    window.history.replaceState(null, "", `/chat/${chat.id}`);
  };

  const handleRename = async (id, title) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, title } : c)));
    await renameConversation(id, title);
  };

  const handleDelete = async (id) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (id === chat.id) startNewChat();
    await deleteConversation(id);
  };

  const sidebar = (
    <ChatSidebar
      conversations={conversations}
      activeId={chat.id}
      onNewChat={() => startNewChat()}
      onRename={handleRename}
      onDelete={handleDelete}
      onNavigate={(id) => (id === chat.id ? setSidebarOpen(false) : openChat(id))}
    />
  );

  const activeTitle = conversations.find((c) => c.id === chat.id)?.title;

  return (
    <div className="flex h-[calc(100dvh-7rem)] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-slate-800 bg-slate-950 lg:block">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-slate-800 bg-slate-950 pt-2">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-2 top-2 rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close chat history"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="h-full pt-8">{sidebar}</div>
          </aside>
        </div>
      )}

      {loadingChat ? (
        <div className="flex flex-1 items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
      <ChatPanel
        key={chat.id}
        chatId={chat.id}
        initialMessages={chat.messages}
        title={activeTitle}
        onFirstSend={handleFirstSend}
        onReplyFinished={refreshConversations}
        onOpenSidebar={() => setSidebarOpen(true)}
      />
      )}
    </div>
  );
}
