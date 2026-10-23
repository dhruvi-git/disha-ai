"use client";

import { useState } from "react";
import { Check, MessageSquare, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

function groupByDate(conversations) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const day = 24 * 60 * 60 * 1000;

  const groups = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "Previous 7 days", items: [] },
    { label: "Previous 30 days", items: [] },
    { label: "Older", items: [] },
  ];

  for (const c of conversations) {
    const t = new Date(c.updatedAt).getTime();
    if (t >= startOfToday.getTime()) groups[0].items.push(c);
    else if (t >= startOfToday.getTime() - day) groups[1].items.push(c);
    else if (t >= startOfToday.getTime() - 7 * day) groups[2].items.push(c);
    else if (t >= startOfToday.getTime() - 30 * day) groups[3].items.push(c);
    else groups[4].items.push(c);
  }
  return groups.filter((g) => g.items.length > 0);
}

function ConversationItem({ conversation, active, onRename, onDelete, onNavigate }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(conversation.title);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const save = () => {
    setEditing(false);
    if (title.trim() && title.trim() !== conversation.title) {
      onRename(conversation.id, title.trim());
    } else {
      setTitle(conversation.title);
    }
  };

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          save();
        }}
        className="flex items-center gap-1 rounded-lg bg-slate-800 px-2 py-1.5"
      >
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setTitle(conversation.title);
              setEditing(false);
            }
          }}
          maxLength={80}
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none"
          aria-label="Chat title"
        />
        <button type="submit" className="text-slate-400 hover:text-white" aria-label="Save title">
          <Check className="h-3.5 w-3.5" />
        </button>
      </form>
    );
  }

  if (confirmDelete) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-red-950/40 border border-red-900/50 px-2 py-1.5 text-xs">
        <span className="flex-1 text-red-300">Delete this chat?</span>
        <button
          onClick={() => onDelete(conversation.id)}
          className="font-medium text-red-300 hover:text-red-200"
        >
          Delete
        </button>
        <button
          onClick={() => setConfirmDelete(false)}
          className="text-slate-400 hover:text-white"
          aria-label="Cancel"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`group relative flex items-center rounded-lg text-sm transition-colors ${
        active ? "bg-slate-800 text-white" : "text-slate-300 hover:bg-slate-800/60"
      }`}
    >
      <a
        href={`/chat/${conversation.id}`}
        onClick={(e) => {
          // Let ctrl/cmd-click open a new tab; otherwise switch chats in place.
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          onNavigate(conversation.id);
        }}
        className="min-w-0 flex-1 truncate px-3 py-2 pr-14"
        title={conversation.title}
      >
        {conversation.title}
      </a>
      <div
        className={`absolute right-1 flex items-center gap-0.5 ${
          active ? "opacity-100" : "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
        }`}
      >
        <button
          onClick={() => setEditing(true)}
          className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-white"
          aria-label="Rename chat"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-red-300"
          aria-label="Delete chat"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

export default function ChatSidebar({
  conversations,
  activeId,
  onNewChat,
  onRename,
  onDelete,
  onNavigate,
}) {
  const groups = groupByDate(conversations);

  return (
    <div className="flex h-full flex-col">
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {groups.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-xs text-slate-500">
            <MessageSquare className="h-6 w-6" />
            Your chats will appear here.
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((c) => (
                  <ConversationItem
                    key={`${c.id}-${c.title}`}
                    conversation={c}
                    active={c.id === activeId}
                    onRename={onRename}
                    onDelete={onDelete}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
