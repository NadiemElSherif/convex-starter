"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { NavHeader } from "@/components/nav-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Send, Trash2, Loader2, MessageSquare } from "lucide-react";

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversations = useQuery(api.chat.getConversations);
  const messages = useQuery(
    api.chat.getConversation,
    conversationId ? { conversationId } : "skip"
  );
  const sendMessage = useAction(api.chat.sendMessage);
  const deleteConversation = useMutation(api.chat.deleteConversation);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewConversation = () => {
    setConversationId(`conv_${Date.now()}`);
  };

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;
    const msg = input.trim();
    setInput("");
    setSending(true);

    try {
      await sendMessage({ content: msg, conversationId });
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (convId: string) => {
    await deleteConversation({ conversationId: convId });
    if (conversationId === convId) {
      setConversationId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">RAG Chat</h1>

        <div className="flex gap-4 h-[calc(100vh-220px)]">
          {/* Sidebar */}
          <div className="w-64 shrink-0 bg-white rounded-lg border overflow-hidden flex flex-col">
            <div className="p-3 border-b">
              <Button
                onClick={handleNewConversation}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-1" /> New Chat
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {conversations?.map((conv: { conversationId: string; firstMessage: string; createdAt: number }) => (
                <div
                  key={conv.conversationId}
                  className={`flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-50 border-b ${
                    conversationId === conv.conversationId
                      ? "bg-blue-50"
                      : ""
                  }`}
                  onClick={() => setConversationId(conv.conversationId)}
                >
                  <MessageSquare className="h-4 w-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-700 truncate flex-1">
                    {conv.firstMessage}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(conv.conversationId);
                    }}
                    className="h-6 w-6 p-0 shrink-0 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {conversations?.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">
                  No conversations
                </p>
              )}
            </div>
            <div className="p-3 border-t text-xs text-gray-400">
              Uses your todos & transcriptions as context
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 bg-white rounded-lg border flex flex-col overflow-hidden">
            {!conversationId ? (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3" />
                  <p>Select a conversation or start a new chat</p>
                </div>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages?.map((msg: { _id: string; role: string; content: string }) => (
                    <div
                      key={msg._id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-4 py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t p-3 flex gap-2">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                    className="resize-none min-h-[44px] max-h-32"
                    rows={1}
                    disabled={sending}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || sending}
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
