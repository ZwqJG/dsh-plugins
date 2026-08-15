import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import {
  dimensions,
  implementationLayers,
  koishiEvidence,
  lifecycle,
  mechanisms,
  paperAdvantages,
  paperBoundaries,
  paperSources,
  paperStatus,
  paperThesis,
  problemSignals,
  systemGuarantees,
} from "@/content/cordis-paper";

export const metadata: Metadata = {
  title: "The Cordis Paper, Explained",
  description:
    "A plain-language guide to temporal and spatial composability, Cordis design, advantages, evidence, and limits.",
};

export default function PaperPage() {
  return (
    <div className="site-shell feature-page paper-page">
      <SiteHeader active="paper" />

      <main className="feature-main">
        <Link className="back-link" href="/">
          ← Plugin directory
        </Link>

        <section className="feature-hero paper-hero" aria-labelledby="paper-title">
          <div className="feature-hero-copy">
            <p className="eyebrow">Paper guide · {paperStatus.date}</p>
            <h1 id="paper-title">The Cordis paper, explained.</h1>
            <p className="feature-lede">{paperThesis}</p>
            <div className="feature-actions">
              <a className="action-link primary" href={paperSources.pdf} target="_blank" rel="noopener noreferrer">
                Read the PDF ↗
              </a>
              <a className="action-link" href={paperSources.repository} target="_blank" rel="noopener noreferrer">
                Paper repository ↗
              </a>
            </div>
          </div>
          <aside className="feature-facts" aria-label="Paper facts">
            <p className="eyebrow">The source</p>
            <dl>
              <div><dt>Title</dt><dd>{paperStatus.title}</dd></div>
              <div><dt>Authors</dt><dd>{paperStatus.authors}</dd></div>
              <div><dt>Length</dt><dd>{paperStatus.pages}</dd></div>
              <div><dt>Status</dt><dd>Active-revision preprint</dd></div>
            </dl>
          </aside>
        </section>

        <p className="preprint-note">{paperStatus.notice}</p>

        <section className="chapter" aria-labelledby="paper-problem">
          <div className="chapter-heading">
            <span>01</span>
            <div><p className="eyebrow">The problem</p><h2 id="paper-problem">Modern components change while the system is running.</h2></div>
            <p>Existing recovery and orchestration tools operate at the wrong level of granularity.</p>
          </div>
          <div className="reading-grid three-up">
            {problemSignals.map((signal) => (
              <article className="reading-card" key={signal.title}>
                <h3>{signal.title}</h3><p>{signal.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="chapter" aria-labelledby="two-dimensions">
          <div className="chapter-heading">
            <span>02</span>
            <div><p className="eyebrow">Two dimensions of composability</p><h2 id="two-dimensions">Clean removal and correct dependencies are different problems.</h2></div>
            <p>The paper names one temporal dimension and one spatial dimension.</p>
          </div>
          <div className="composability-axis" aria-label="Temporal and spatial composability axes">
            <div className="axis-cross" aria-hidden="true"><span>time</span><span>space</span><i /></div>
            <div className="axis-cards">
              {dimensions.map((dimension) => (
                <article key={dimension.axis}>
                  <p className="eyebrow">{dimension.axis} axis</p>
                  <h3>{dimension.title}</h3>
                  <strong>{dimension.question}</strong>
                  <p>{dimension.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="chapter" aria-labelledby="design-mechanisms">
          <div className="chapter-heading">
            <span>03</span>
            <div><p className="eyebrow">How the design works</p><h2 id="design-mechanisms">Effects explain change. Coeffects explain need.</h2></div>
            <p>Cordis lifts both ideas from static theory into runtime mechanisms.</p>
          </div>
          <div className="mechanism-list">
            {mechanisms.map((mechanism, index) => (
              <article className="mechanism-row" key={mechanism.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{mechanism.title}</h3><p>{mechanism.body}</p></div>
                <dl><div><dt>Starts with</dt><dd>{mechanism.input}</dd></div><div><dt>Produces</dt><dd>{mechanism.output}</dd></div></dl>
              </article>
            ))}
          </div>
        </section>

        <section className="chapter" aria-labelledby="whole-system">
          <div className="chapter-heading">
            <span>04</span>
            <div><p className="eyebrow">From local rules to a whole system</p><h2 id="whole-system">A fiber carries one component through change.</h2></div>
            <p>The calculus covers withdrawal, iteration, asynchrony, and failure.</p>
          </div>
          <div className="paper-system-grid">
            <ol className="lifecycle-list">
              {lifecycle.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}
            </ol>
            <div className="guarantee-grid">
              {systemGuarantees.map((guarantee) => <article key={guarantee.title}><h3>{guarantee.title}</h3><p>{guarantee.body}</p></article>)}
            </div>
          </div>
        </section>

        <section className="chapter" aria-labelledby="cordis-implementation">
          <div className="chapter-heading">
            <span>05</span>
            <div><p className="eyebrow">How Cordis implements it</p><h2 id="cordis-implementation">A small core, a reconciler, and transactional reload.</h2></div>
            <p>The paper maps every major formal construct to a concrete runtime operation.</p>
          </div>
          <div className="reading-grid three-up implementation-grid">
            {implementationLayers.map((layer) => <article className="reading-card" key={layer.title}><h3>{layer.title}</h3><p>{layer.body}</p></article>)}
          </div>
          <aside className="evidence-strip">
            <div><p className="eyebrow">Case study · Koishi</p><strong>{koishiEvidence.scale}</strong></div>
            <p>{koishiEvidence.note}</p>
          </aside>
        </section>

        <section className="chapter" aria-labelledby="paper-advantages">
          <div className="chapter-heading">
            <span>06</span>
            <div><p className="eyebrow">Why it matters</p><h2 id="paper-advantages">Composition moves from convention into structure.</h2></div>
            <p>The runtime carries guarantees that plugin authors usually rebuild by hand.</p>
          </div>
          <ol className="advantage-list">
            {paperAdvantages.map((advantage, index) => <li key={advantage}><span>0{index + 1}</span><p>{advantage}</p></li>)}
          </ol>
        </section>

        <section className="chapter boundaries-chapter" aria-labelledby="paper-boundaries">
          <div className="chapter-heading">
            <span>07</span>
            <div><p className="eyebrow">Boundaries</p><h2 id="paper-boundaries">What the paper does not prove.</h2></div>
            <p>The formal guarantees depend on a disciplined boundary and stated assumptions.</p>
          </div>
          <div className="reading-grid boundary-grid">
            {paperBoundaries.map((boundary) => <article className="reading-card" key={boundary.title}><h3>{boundary.title}</h3><p>{boundary.body}</p></article>)}
          </div>
        </section>

        <section className="source-rail" aria-labelledby="paper-sources">
          <p className="eyebrow" id="paper-sources">Primary sources</p>
          <a href={paperSources.repository} target="_blank" rel="noopener noreferrer"><span>Paper repository</span><span>↗</span></a>
          <a href={paperSources.pdf} target="_blank" rel="noopener noreferrer"><span>Full PDF</span><span>↗</span></a>
        </section>
      </main>

      <footer className="footer">
        <span>DSH Plugins · independent paper guide</span>
        <span>Based on the complete August 13, 2026 preprint</span>
      </footer>
    </div>
  );
}
