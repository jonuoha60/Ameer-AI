import "../../constants/styles/PrivacyPolicy.css";
import { Footer } from "./Footer";
import { Header } from "./Header";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of terms",
    body: [
      "By creating an account or using Ameer, you agree to these Terms of Service. If you don't agree, please don't use the app.",
      "You must be at least 13 years old to use Ameer. If you're under 18, you confirm you have a parent or guardian's permission.",
    ],
  },
  {
    id: "account",
    title: "2. Your account",
    body: [
      "You're responsible for keeping your login credentials secure and for all activity that happens under your account.",
      "You agree to provide accurate information when you sign up, and to keep it up to date.",
      "We may suspend or terminate accounts that violate these terms, misuse the service, or are inactive for an extended period.",
    ],
  },
  {
    id: "service",
    title: "3. The service we provide",
    body: [
      "Ameer helps you plan trips by comparing transport options, distances, timing, and estimated costs based on information you provide and third-party mapping and transit data.",
      "Route, pricing, and timing estimates are informational and may not always match real-world conditions. Traffic, transit delays, and pricing changes from third-party providers are outside our control.",
      "Features may be added, changed, or removed at any time as the app evolves.",
    ],
  },
  {
    id: "conduct",
    title: "4. Acceptable use",
    body: [
      "Don't use Ameer to harass, impersonate, or harm other users.",
      "Don't post false, misleading, or infringing content in the Explore feed or anywhere else in the app.",
      "Don't attempt to access accounts, systems, or data that aren't yours, or interfere with the app's normal operation.",
      "Don't use automated tools to scrape, copy, or extract data from Ameer without our written permission.",
    ],
  },
  {
    id: "content",
    title: "5. Your content",
    body: [
      "You retain ownership of trips, reviews, photos, and other content you post to Ameer.",
      "By posting to the Explore feed, you give us a license to display that content within the app to other users, in line with your sharing settings.",
      "You're responsible for making sure you have the right to share anything you post, and that it doesn't violate anyone else's rights.",
    ],
  },
  {
    id: "third-party",
    title: "6. Third-party services",
    body: [
      "Ameer relies on third-party providers for maps, transit data, and ride pricing. We don't control these providers and aren't responsible for their accuracy, availability, or pricing changes.",
      "Any bookings or purchases made through a third-party provider are subject to that provider's own terms.",
    ],
  },
  {
    id: "disclaimer",
    title: "7. Disclaimers",
    body: [
      "Ameer is provided \"as is,\" without warranties of any kind, express or implied, including accuracy of route, distance, or pricing information.",
      "We don't guarantee the app will be uninterrupted, error-free, or available at all times.",
    ],
  },
  {
    id: "liability",
    title: "8. Limitation of liability",
    body: [
      "To the fullest extent permitted by law, Ameer and its team aren't liable for indirect, incidental, or consequential damages arising from your use of the app, including missed transport, incorrect pricing estimates, or travel disruptions.",
      "Our total liability for any claim relating to the service is limited to the amount you've paid us, if any, in the 12 months before the claim arose.",
    ],
  },
  {
    id: "termination",
    title: "9. Termination",
    body: [
      "You can stop using Ameer and close your account at any time from your account settings.",
      "We may suspend or terminate your access if you violate these terms, and will make reasonable efforts to notify you when possible.",
    ],
  },
  {
    id: "changes",
    title: "10. Changes to these terms",
    body: [
      "We may update these terms as Ameer evolves. If we make material changes, we'll notify you in the app or by email before they take effect. Continuing to use Ameer after changes take effect means you accept the updated terms.",
    ],
  },
];

const TermsOfService = () => {
  return (
    <div>
      <Header home={false} />
      <div className="privacy-page">

        <div className="privacy-header">
          <span className="privacy-eyebrow">Legal</span>
          <h1>Terms of Service</h1>
          <p className="privacy-updated">Last updated: July 9, 2026</p>
          <p className="privacy-intro">
            These terms govern your use of Ameer AI. Please read them
            alongside our Privacy Policy, which explains how we handle
            your data.
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
                If you have questions about these terms, reach out
                through the Contact page and we'll get back to you.
              </p>
            </section>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;