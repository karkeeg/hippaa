"use client";

import { useEffect, useRef, useState } from "react";
import { apiCall } from "@/lib/api";
import { useApp } from "@/lib/context";
import { User, MessageSquare, Send, Loader2, Trash2 } from "lucide-react";

export default function ChatInterface() {
  const { selectedClientId, chatHistory, addMessage, clearChat } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const formatMessageContent = (text: string): string => {
    // Remove markdown artifacts
    text = text.replace(/\$2/g, "");
    text = text.replace(/\$\$/g, "");
    text = text.replace(/\$\s*\d+/g, "");

    // Handle code blocks
    text = text.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

    // Handle headers
    text = text.replace(/^# (.*$)/gm, '<h1 class="clinical-heading">$1</h1>');
    text = text.replace(/^## (.*$)/gm, '<h2 class="clinical-heading">$1</h2>');
    text = text.replace(/^### (.*$)/gm, '<h3 class="clinical-heading">$1</h3>');

    // Handle bold and italic
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, "<strong><em>$1</em></strong>");
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");

    // Handle bullet points
    text = text.replace(/^• (.*$)/gm, '<li class="clinical-bullet">$1</li>');
    text = text.replace(/^\- (.*$)/gm, '<li class="clinical-bullet">$1</li>');

    // Wrap list items in ul tags
    text = text.replace(
      /(<li.*?>.*?<\/li>)+/g,
      '<ul class="clinical-list">$&</ul>',
    );

    // Handle paragraphs and line breaks
    text = text.replace(/\n\n/g, "</p><p>");
    text = text.replace(/\n(?!<)/g, "<br>");

    // Clean up
    text = text.replace(/<p>\s*<\/p>/g, "");
    text = text.replace(/\$/g, "");

    if (!text.startsWith("<")) {
      text = "<p>" + text + "</p>";
    }

    return text;
  };

  const sendMessage = async () => {
    const query = input.trim();
    if (!query) return;

    addMessage({ role: "user", content: query });
    setInput("");
    setLoading(true);

    try {
      const response = await apiCall(
        `/chat/smart?selected_client_id=${selectedClientId || ""}`,
        {
          method: "POST",
          body: JSON.stringify({ query, top_k: 10 }),
        },
      );

      const data = await response.json();

      if (data.status === "ok") {
        addMessage({ role: "assistant", content: data.answer, metadata: data });
      } else if (data.status === "clarification_needed") {
        addMessage({
          role: "assistant",
          content: data.answer,
          metadata: { ...data, intent: "clarification" },
        });
      } else {
        addMessage({
          role: "assistant",
          content: data.answer || "An error occurred",
          metadata: data,
        });
      }
    } catch (error) {
      addMessage({
        role: "assistant",
        content: `Error: ${error instanceof Error ? error.message : "Failed to connect"}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content active h-full flex flex-col min-h-0 overflow-hidden">
      <div className="chat-container flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="chat-messages flex-1 overflow-y-auto w-full">
          {chatHistory.length === 0 ? (
            <div
              style={{ textAlign: "center", padding: "40px", color: "#7a82a8" }}
            >
              <span id="chatPlaceholder">
                {selectedClientId
                  ? `Chat with the selected client. Ask questions about them.`
                  : "Select a client or knowledge base above to start chatting."}
              </span>
            </div>
          ) : (
            chatHistory.map((msg: any, idx: number) => (
              <div key={idx} className={`message ${msg.role}`}>
                <div className="message-avatar" style={{ width: "40px", height: "40px" }}>
                  {msg.role === "user" ? <User size={24} /> : <MessageSquare size={24} />}
                  </div>
                <div className="message-content">
                    {msg.role === "assistant" ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: formatMessageContent(msg.content),
                        }}
                      />
                    ) : (
                      msg.content
                    )}
                    {msg.role === "assistant" && msg.metadata && (
                    <div className="message-meta">
                        {msg.metadata.query_type && (
                        <div>Query Type: {msg.metadata.query_type}</div>
                        )}
                        {msg.metadata.num_matches && (
                        <div>Matches found: {msg.metadata.num_matches}</div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <div className="flex items-center gap-3 w-full">
            <div className="chat-input-wrapper flex-1">
              <textarea
                className="chat-input"
                placeholder="Ask about the selected client or general questions..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                rows={1}
              />
              <button
                className="send-btn"
                onClick={sendMessage}
                disabled={loading}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Thinking...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
