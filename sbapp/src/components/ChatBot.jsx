import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! 👋 I'm the QuickServe assistant. Ask me anything about our services, bookings, or providers!"
    }
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8086/chat/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role, content: m.content }))
        })
      });

      const data = await response.json();
      console.log("API Response:", JSON.stringify(data));

      // ✅ Gemini response structure
      let reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        null;

      // Fallback structures
      if (!reply && data?.content?.[0]?.text)        reply = data.content[0].text;
      if (!reply && typeof data?.content === "string") reply = data.content;
      if (!reply && typeof data === "string")          reply = data;
      if (!reply && data?.error)                       reply = "Sorry, I couldn't process that right now.";
      if (!reply)                                      reply = "Sorry, I didn't understand that. Try asking about bookings, services or providers!";

      setMessages(prev => [...prev, { role: "assistant", content: reply }]);

    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connection error. Make sure Spring Boot is running on port 8086."
      }]);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        className={`cb-fab ${open ? "cb-fab-open" : ""}`}
        onClick={() => setOpen(o => !o)}
        title="Chat with us"
      >
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="cb-window">
          <div className="cb-header">
            <div className="cb-header-info">
              <div className="cb-avatar">QS</div>
              <div>
                <p className="cb-header-name">QuickServe Assistant</p>
                <p className="cb-header-status">
                  <span className="cb-online-dot" /> Online
                </p>
              </div>
            </div>
            <button className="cb-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="cb-messages">
            {messages.map((m, i) => (
              <div key={i} className={`cb-msg ${m.role === "user" ? "cb-msg-user" : "cb-msg-bot"}`}>
                {m.role === "assistant" && (
                  <div className="cb-bot-avatar">QS</div>
                )}
                <div className="cb-bubble">{m.content}</div>
              </div>
            ))}
            {loading && (
              <div className="cb-msg cb-msg-bot">
                <div className="cb-bot-avatar">QS</div>
                <div className="cb-bubble cb-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="cb-input-row">
            <input
              className="cb-input"
              placeholder="Ask me anything…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
            />
            <button
              className="cb-send-btn"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
