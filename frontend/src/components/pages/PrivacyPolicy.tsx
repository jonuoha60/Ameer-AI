import "../../constants/styles/PrivacyPolicy.css";
import { Footer } from "./Footer";
import { Header } from "./Header";

const sections = [
  {
    id: "collect",
    title: "1. Information we collect",
    body: [
      "Account information: your name, email, and password when you create an Ameer account.",
      "Trip data: locations you enter as your starting point and destination, budget, selected transport mode, and any trips you choose to save.",
      "Location data: your device's live location, used only to calculate routes, distances, and transport options in the moment you request them.",
      "Usage data: how you interact with the app, such as pages visited and features used, to help us fix bugs and improve the product.",
    ],
  },
  {
    id: "use",
    title: "2. How we use your information",
    body: [
      "To plan routes and generate transport comparisons for the trips you build.",
      "To show your saved trips back to you across sessions and devices.",
      "To power the Explore feed, including showing your public trips to people who follow you, if you choose to share them.",
      "To respond to support requests submitted through the Contact or Help Center pages.",
      "To keep the app secure, including detecting abuse and preventing unauthorized access.",
    ],
  },
  {
    id: "sharing",
    title: "3. How we share your information",
    body: [
      "We do not sell your personal information.",
      "We share limited data with third-party services that power core features, such as mapping and transit providers, only as needed to return route and pricing results.",
      "We may share information if required by law, or to protect the rights, safety, or property of Ameer, our users, or the public.",
    ],
  },
  {
    id: "retention",
    title: "4. Data retention",
    body: [
      "Live location used to calculate a route is not stored beyond the session that generated it.",
      "Trips you explicitly save are kept until you delete them or close your account.",
      "Account information is retained while your account is active, and deleted within 30 days of account closure, except where we're required to keep records longer by law.",
    ],
  },
  {
    id: "choices",
    title: "5. Your choices",
    body: [
      "You can edit or delete any saved trip at any time from your dashboard.",
      "You can make your Explore trips private, so only you can see them.",
      "You can request a copy of your data, or ask us to delete your account entirely, by reaching out through the Contact page.",
      "You can turn off location permissions in your device settings, though this will limit route planning features.",
    ],
  },
  {
    id: "security",
    title: "6. Security",
    body: [
      "We use industry-standard measures, including encrypted connections and access controls, to protect your information. No method of transmission or storage is completely secure, and we can't guarantee absolute security.",
    ],
  },
  {
    id: "children",
    title: "7. Children's privacy",
    body: [
      "Ameer is not directed at children under 13, and we don't knowingly collect information from them. If you believe a child has provided us with personal information, contact us and we'll remove it.",
    ],
  },
  {
    id: "changes",
    title: "8. Changes to this policy",
    body: [
      "We may update this policy as the app evolves. If we make material changes, we'll notify you in the app or by email before they take effect.",
    ],
  },
];

const PrivacyPolicy = () => {
  return (
    <div>
      <Header home={false} />
      <div className="privacy-page">

        <div className="privacy-header">
          <span className="privacy-eyebrow">Legal</span>
          <h1>Privacy Policy</h1>
          <p className="privacy-updated">Last updated: July 9, 2026</p>
          <p className="privacy-intro">
            This policy explains what information Ameer collects, how we
            use it, and the choices you have. It applies to your use of
            the Ameer app and any related services.
          </p>
        </div>

        <div className="privacy-layout">

          {/* TABLE OF CONTENTS */}
          <nav className="privacy-toc" aria-label="Table of contents">
            <span className="privacy-toc-label">On this page</span>
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="privacy-toc-link"
              >
                {section.title}
              </a>
            ))}
          </nav>

          {/* CONTENT */}
          <div className="privacy-content">
            {sections.map((section) => (
              <section
                id={section.id}
                key={section.id}
                className="privacy-section"
              >
                <h2>{section.title}</h2>
                <ul>
                  {section.body.map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </section>
            ))}

            <section className="privacy-section">
              <h2>Questions?</h2>
              <p>
                If you have questions about this policy or how your data
                is handled, reach out through the Contact page and we'll
                get back to you.
              </p>
            </section>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;