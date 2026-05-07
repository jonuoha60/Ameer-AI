import React, { useState, useRef, useEffect } from "react";
import "../constants/styles/Assistant.css";
import { LogoMark } from '../constants/styles/icons'
import axios from "axios"
import { Link, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useAuth } from "../hooks/useAuth";
import { tripMessage } from "../utils/helper";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  "Plan a 7-day trip to Japan 🗾",
  "Help me get home safely",
  "Budget travel for a restaurant close by",
  "Hidden gems in Morocco 🇲🇦",
];


export const Assistant = () => {
  const location = useLocation();
  const tripData = location.state;
  const { auth } = useAuth()
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  console.log("Trip Data:", tripData);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

useEffect(() => {
  const message = tripData
    ? tripMessage(tripData)
    : "";

  sendMessage(message);
}, []);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };



  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    try {
      const res = await axios.post("http://localhost:8080/assistant", {
        message: userMsg.content,
      });

      console.log(res.data.result.response)

      const data = res.data.result.response
      const reply =
        data || "Sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "Oops! Something went wrong. Please check your connection and try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages([]);

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="assistant-root">

     

      {/* Main */}
      <div className="assistant-main">

        {/* Header */}
        <header className="assistant-header">
          {/* <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
            <span className="menu-line" />
            <span className="menu-line" />
            <span className="menu-line" />
          </button> */}
          <div className="header-center">
            
              <Link to="/">
                <p className="header-name"><LogoMark /></p>
              </Link>
              <p className="header-name">Ameer AI · Always ready to explore</p>
            </div>
            <div>
          </div>
          <div className="status-dot" />
        </header>

        {/* Messages */}
        <div className="messages-area">
          {messages.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🌍</div>
              <h2 className="empty-title">Where to next {auth?.username} ?</h2>
              <p className="empty-subtitle">
                Ask me anything about travel — destinations, itineraries, tips, or hidden gems.
              </p>
              <div className="suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="suggestion-btn"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`msg-row ${msg.role === "user" ? "user" : "ai"}`}
            >

              <div className={`bubble ${msg.role === "user" ? "user" : "ai"}`}>
                <p className="bubble-text">
                               <ReactMarkdown>

                  {msg.content}
                  </ReactMarkdown>
                  </p>
                <p className="bubble-time">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="msg-row ai">
              <div className="msg-avatar">✈</div>
              <div className="bubble ai">
                <div className="typing">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="input-area">
          <div className="input-box">
            <textarea
              ref={textareaRef}
              className="input-textarea"
              placeholder="Ask Ameer anything about travel..."
              value={input}
              onChange={(e) => { setInput(e.target.value); autoResize(); }}
              onKeyDown={handleKey}
              rows={1}
            />
            <button
              className="send-btn"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22 2L11 13"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22 2L15 22L11 13L2 9L22 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="input-hint">Press Enter to send · Shift+Enter for new line</p>
        </div>

      </div>
    </div>
  );
};