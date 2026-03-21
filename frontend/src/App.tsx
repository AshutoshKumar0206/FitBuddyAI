import axios from "axios";
import { useState, useRef, useEffect } from "react";

// --- Types ---
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

// ─── Typewriter Hook ──────────────────────────────────────────────────────────
function useTypewriter(text: string, isActive: boolean, onComplete: () => void) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive || !text) return;
    indexRef.current = 0;
    setDisplayed("");

    const step = () => {
      if (indexRef.current < text.length) {
        indexRef.current = Math.min(indexRef.current + 2, text.length);
        setDisplayed(text.slice(0, indexRef.current));
        rafRef.current = requestAnimationFrame(step);
      } else {
        onComplete();
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [text, isActive]);

  return displayed;
}

// ─── Thinking Dots ────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-start gap-3 animate-slideUp">
      <div
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)", boxShadow: "0 4px 12px #2dd4bf25" }}
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
        </svg>
      </div>
      <div
        className="px-4 py-4 rounded-2xl rounded-tl-sm flex gap-1.5 items-center"
        style={{ background: "#1e2a2a", border: "1px solid #1a3d3d" }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function ChatbotUI() {
  // CHANGED: Using an array to store the conversation history
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState(false);
  
  // Track which message ID is currently "typing"
  const [typingId, setTypingId] = useState<string | null>(null);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, loading]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 140) + "px";
  }, [input]);

  const generateResponse = async (message: string) => {
    try {
      const res = await axios.post(`${import.meta.env.REACT_PUBLIC_BASE_URL}/chats/chat`, { message });
      if (res.data.success) return res.data.reply;
    } catch (err) {
      console.error(err);
      return "Sorry, I encountered an error connecting to the server.";
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // 1. Add User Message to History
    const userMsg: ChatMessage = { id: Date.now().toString(), text, sender: 'user' };
    setChatHistory(prev => [...prev, userMsg]);
    
    setInput("");
    setLoading(true);

    // 2. Fetch AI Response
    const aiReplyText = await generateResponse(text);
    
    // 3. Add AI Message to History
    const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        text: aiReplyText || "No response received.", 
        sender: 'ai' 
    };
    
    setChatHistory(prev => [...prev, aiMsg]);
    setTypingId(aiMsg.id); // Trigger typewriter for this specific message
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        /* ... (Your existing CSS stays the same) ... */
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500&family=Syne:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root { --bg: #0a1010; --surface: #111a1a; --border: #1a2e2e; --accent: #2dd4bf; --muted: #64748b; --text: #e2e8f0; }
        body { background: var(--bg); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.32s cubic-bezier(.22,1,.36,1) both; }
        .animate-blink { animation: blink 0.9s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e3a3a; border-radius: 99px; }
      `}</style>

      <div style={{ fontFamily: "'DM Mono', monospace" }} className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-2xl flex flex-col" style={{ height: "min(88vh, 780px)", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
          
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid var(--border)", background: "linear-gradient(135deg, #0d1f1f 0%, #0a1818 100%)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)" }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </div>
            <div>
                <p className="text-center text-sm font-semibold tracking-wider uppercase" style={{ color: "#2dd4bf" }}>FitBuddy</p>
                <p className="text-xs text-slate-500 text-center">AI-powered assistant</p>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5" style={{ background: "var(--bg)" }}>
            {chatHistory.length === 0 && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-40">
                <p className="text-sm">Ask me anything</p>
              </div>
            )}

            {/* Render Every Message in History */}
            {chatHistory.map((msg) => (
              <div key={msg.id} className={`flex items-start gap-3 animate-slideUp ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'ai' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)" }}>
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-white fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" /></svg>
                  </div>
                )}

                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user' ? 'rounded-br-sm' : 'rounded-tl-sm'
                  }`}
                  style={{
                    background: msg.sender === 'user' ? "linear-gradient(135deg, #134e4a 0%, #0d3d3d 100%)" : "#1e2a2a",
                    color: msg.sender === 'user' ? "#ccfbf1" : "#e2e8f0",
                    border: msg.sender === 'user' ? "1px solid #1a5c57" : "1px solid #1a3d3d",
                  }}
                >
                  {/* If it's the current AI response, use the Typewriter component effect */}
                  {msg.sender === 'ai' && typingId === msg.id ? (
                    <TypewriterText text={msg.text} onComplete={() => setTypingId(null)} />
                  ) : (
                    msg.sender === 'ai' ? "AI:" + msg.text : "You:" + msg.text
                  )}
                </div>
              </div>
            ))}

            {loading && <ThinkingDots />}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div className="flex-shrink-0 px-4 py-4" style={{ borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
            <div className="glow-focus flex items-center gap-3 rounded-2xl px-4 py-2 transition-all duration-300" style={{ background: "#0a1414", border: "1px solid #1a3535", minHeight: "56px", width:"100%" }}>
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Send a message…"
                disabled={loading}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  color: "#e2e8f0",
                  fontSize: "14px", // Increased slightly for readability
                  lineHeight: "1.5",
                  paddingTop: "3px",    // Balanced padding
                  paddingBottom: "3px",
                  fontFamily: "'DM Mono', monospace",
                  overflowY: "auto",   // Keeps it clean until it grows too large
                  maxHeight: "50px"
                }}
                className="rounded-2xl placeholder-slate-600 disabled:opacity-40"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="cursor-pointer flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-30 relative z-20"
                style={{
                  background: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)",
                  boxShadow: input.trim() ? "0 4px 12px rgba(45, 212, 191, 0.3)" : "none",
                  minWidth: "50px", // Force the width so flexbox doesn't squash it
                  minHeight: "50px",
                }}
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-4 h-4 transition-all" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2.5"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>             
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Small helper for the typewriter effect inside the bubble
function TypewriterText({ text, onComplete }: { text: string; onComplete: () => void }) {
    const displayed = useTypewriter(text, true, onComplete);
    return (
        <>
            {displayed}
            <span className="inline-block w-0.5 h-4 bg-teal-400 ml-0.5 animate-blink align-middle" />
        </>
    );
}