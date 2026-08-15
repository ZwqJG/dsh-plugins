import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import { faqs, faqLastVerified } from "@/lib/faq";

export const metadata: Metadata = {
  title: "DeepSeek Harness FAQ",
  description: "Official-source answers about DeepSeek Harness, its product status, team, release, and ecosystem.",
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <div className="site-shell feature-page faq-page">
      <SiteHeader active="faq" />

      <main className="feature-main">
        <Link className="back-link" href="/">
          ← Plugin directory
        </Link>

        <section className="feature-hero faq-hero" aria-labelledby="faq-title">
          <div className="feature-hero-copy">
            <p className="eyebrow">FAQ · verified {faqLastVerified}</p>
            <h1 id="faq-title">DeepSeek Harness questions, answered.</h1>
            <p className="feature-lede">
              A compact reference for product status, installation, team and hiring questions, release timing,
              and the official places to verify changing information.
            </p>
            <div className="feature-actions">
              <Link className="action-link primary" href="/harness">Read the Harness guide ↗</Link>
              <a className="action-link" href="https://deepseek.com/harness/en/" target="_blank" rel="noopener noreferrer">
                Official overview ↗
              </a>
            </div>
          </div>
          <aside className="feature-facts" aria-label="FAQ facts">
            <p className="eyebrow">At a glance</p>
            <dl>
              <div><dt>Scope</dt><dd>Product, team, release, and ecosystem</dd></div>
              <div><dt>Sources</dt><dd>DeepSeek official materials</dd></div>
              <div><dt>Verified</dt><dd>{faqLastVerified}</dd></div>
            </dl>
          </aside>
        </section>

        <section className="chapter faq-chapter" aria-labelledby="faq-questions">
          <div className="chapter-heading">
            <span>01</span>
            <div>
              <p className="eyebrow">The questions</p>
              <h2 id="faq-questions">Start with the source, then go deeper.</h2>
            </div>
            <p>Answers are written for readers, with an official destination attached to every entry.</p>
          </div>
          <div className="faq-list">
            {faqs.map((faq) => (
              <details className="faq-item" key={faq.question}>
                <summary>{faq.question}</summary>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                  <a href={faq.officialHref} target="_blank" rel="noopener noreferrer">{faq.officialLabel} ↗</a>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="source-rail" aria-labelledby="faq-sources">
          <p className="eyebrow" id="faq-sources">Primary sources</p>
          <a href="https://deepseek.com/harness/en/" target="_blank" rel="noopener noreferrer"><span>DeepSeek Harness overview</span><span>↗</span></a>
          <a href="https://github.com/deepseek-ai/deepseek-harness" target="_blank" rel="noopener noreferrer"><span>DeepSeek Harness repository</span><span>↗</span></a>
          <a href="https://talent.deepseek.com/" target="_blank" rel="noopener noreferrer"><span>DeepSeek careers</span><span>↗</span></a>
        </section>
      </main>

      <footer className="footer">
        <span>DSH Plugins · independent FAQ reference</span>
        <span>Official links checked {faqLastVerified}</span>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
