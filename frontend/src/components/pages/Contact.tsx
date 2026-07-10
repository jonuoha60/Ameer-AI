import { useState } from "react";
import "../../constants/styles/Contact.css";
import { Header } from "./Header";
import { Footer } from "./Footer";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // TODO: wire up to backend endpoint (e.g. axios.post("/contact", { name, email, message }))
    console.log("Contact form submitted:", { name, email, message });
    setSent(true);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div>
      <Header home={false} />
      <div className="contact-page">

        {/* LEFT: INFO */}
        <div className="contact-info">
          <span className="contact-eyebrow">Get in touch</span>
          <h1>Tell us where you're headed.</h1>
          <p className="contact-lead">
            Questions about a trip, feedback on the app, or a partnership
            idea — send it over. A real person on the Ameer team reads
            every message.
          </p>

          <div className="contact-detail">
            <span className="contact-detail-label">Email</span>
            <span className="contact-detail-value">hello@ameerai.com</span>
          </div>

          <div className="contact-detail">
            <span className="contact-detail-label">Response time</span>
            <span className="contact-detail-value">Within 1–2 business days</span>
          </div>

          <div className="contact-pin" aria-hidden="true">
            <span className="contact-pin-dot" />
            <span className="contact-pin-line" />
          </div>
        </div>

        {/* RIGHT: FORM */}
        <div className="contact-form-wrap">
          {sent ? (
            <div className="contact-success">
              <h2>Message sent</h2>
              <p>Thanks for reaching out — we'll get back to you soon.</p>
              <button
                className="contact-submit"
                onClick={() => setSent(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <label className="contact-field">
                <span>Name</span>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="contact-field">
                <span>Email</span>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>

              <label className="contact-field">
                <span>Message</span>
                <textarea
                  placeholder="What's on your mind?"
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>

              <button type="submit" className="contact-submit">
                Send message
              </button>
            </form>
          )}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Contact;