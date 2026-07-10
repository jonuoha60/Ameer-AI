import { useState } from "react";
import "../../constants/styles/Helpcenter.css";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Faq = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

const categories = ["All", "Trips", "Account", "Billing", "Safety"];

const faqs: Faq[] = [
  {
    id: "f1",
    category: "Trips",
    question: "How does Ameer plan a trip for me?",
    answer:
      "Tell us where you're starting, where you want to go, and your budget. Ameer compares transport options — walking, transit, rideshare — and lays out routes, timing, and cost so you can pick what fits.",
  },
  {
    id: "f2",
    category: "Trips",
    question: "Can I save a trip and come back to it later?",
    answer:
      "Yes. Once you've built a trip, select a transport option and save it. Saved trips show up on your dashboard so you can revisit or edit them anytime.",
  },
  {
    id: "f3",
    category: "Trips",
    question: "Why can't I see distance or pricing for my route?",
    answer:
      "Pricing and distance data load once both locations are set. If a number is missing, double check both fields are filled in and try switching transport modes.",
  },
  {
    id: "f4",
    category: "Account",
    question: "How do I follow other travelers on Explore?",
    answer:
      "Open Explore and tap Follow on any traveler's card. You'll see their public trips in your feed, and you can unfollow anytime from the same button.",
  },
  {
    id: "f5",
    category: "Account",
    question: "How do I reset my password?",
    answer:
      "From the login screen, select Forgot password and enter your email. We'll send a reset link that's valid for 30 minutes.",
  },
  {
    id: "f6",
    category: "Billing",
    question: "Is Ameer free to use?",
    answer:
      "Core trip planning and Explore are free. Any paid features will always be shown clearly before you're charged — nothing runs in the background.",
  },
  {
    id: "f7",
    category: "Safety",
    question: "Does Ameer store my location history?",
    answer:
      "We only keep the trips you explicitly save. Live location is used to calculate routes in the moment and isn't stored beyond that session.",
  },
];

const HelpCenter = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleOpen = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q);

    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;

    return matchesQuery && matchesCategory;
  });

  return (
    <div>
      <Header home={false} />
      <div className="help-page">

        {/* HERO */}
        <div className="help-hero">
          <span className="help-eyebrow">Help center</span>
          <h1>What can we help you find?</h1>

          <div className="help-search">
            <input
              type="text"
              placeholder="Search for an answer..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="help-categories">
          {categories.map((cat) => (
            <button
              key={cat}
              className={
                activeCategory === cat
                  ? "help-chip active"
                  : "help-chip"
              }
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQ LIST */}
        <div className="help-faq-list">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                className={isOpen ? "help-faq-item open" : "help-faq-item"}
                key={faq.id}
              >
                <button
                  className="help-faq-question"
                  onClick={() => toggleOpen(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span className="help-faq-icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <p className="help-faq-answer">{faq.answer}</p>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <p className="help-empty">
              No answers match that search. Try a different term, or
              reach out on the Contact page.
            </p>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default HelpCenter;