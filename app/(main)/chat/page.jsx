"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  // useChat v3+ handles messages/status; input is managed locally.
  const { messages, sendMessage, status, error } = useChat({
    api: "/api/chat", // This connects directly to the route.js we built earlier!
  });
  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  const scrollRef = useRef(null);

  const getMessageText = (message) => {
    if (typeof message?.content === "string" && message.content.length > 0) {
      return message.content;
    }

    if (Array.isArray(message?.parts)) {
      return message.parts
        .filter((part) => part?.type === "text")
        .map((part) => part.text)
        .join("");
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = input.trim();
    if (!text || isLoading) {
      return;
    }

    setInput("");
    await sendMessage({ text });
  };

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-4xl mx-auto w-full p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="font-display text-2xl font-bold">Chat with Disha</h1>
        <p className="text-sm text-muted-foreground">
          Your personalized AI career coach. Ask for resume reviews, interview tips, or career guidance.
        </p>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm space-y-4">
             <Bot className="h-10 w-10 text-purple-500/50" />
            <p>Hi! I'm Disha. How can I help your career today?</p>
          </div>
        )}

        {messages.map((msg, i) => {
          const messageText = getMessageText(msg);

          return (
          <div key={msg.id || i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500 mt-0.5">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
                msg.role === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-slate-800 border border-slate-700 text-slate-200"
              }`}
            >
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{messageText}</ReactMarkdown>
                </div>
              ) : (
                messageText
              )}
            </div>

            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-700 text-white mt-0.5">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        )})}

        {/* Loading Animation */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-500">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-800 border border-slate-700 px-4 py-3 text-sm rounded-xl">
              <div className="flex gap-1 items-center h-full">
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"></span>
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce delay-150" style={{ animationDelay: '150ms' }}></span>
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-bounce delay-300" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="text-red-400 bg-red-950/50 border border-red-900/50 p-3 rounded-xl text-sm text-center">
            Connection error: {error.message}
          </div>
        )}
      </div>

      {/* Input Area */}
      {/* Wrapping this in a <form> is the magic trick that makes the Enter key work! */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Ask about careers, interviews, resumes..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="bg-slate-900 border-slate-700 flex-1 focus-visible:ring-purple-500"
          disabled={isLoading}
        />

        <Button
          type="submit"
          disabled={isLoading || !input?.trim()}
          className="bg-purple-600 hover:bg-purple-700 w-10 px-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}