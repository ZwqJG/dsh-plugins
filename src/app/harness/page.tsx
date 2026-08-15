import type { Metadata } from "next";
import Link from "next/link";
import CopyButton from "@/components/copy-button";
import SiteHeader from "@/components/site-header";
import {
  harnessFacts,
  harnessInstallSteps,
  harnessModes,
  harnessPillars,
  harnessSources,
  traceEvents,
  traceHeading,
  traceOperations,
} from "@/content/deepseek-harness";

export const metadata: Metadata = {
  title: "DeepSeek Harness: Installation and Product Guide",
  description:
    "Install DeepSeek Harness and understand its Cordis kernel, plugin architecture, traceable sessions, and runtime modes.",
};

const sourceLinks = Object.values(harnessSources);

export default function HarnessPage() {
  return (
    <div className="site-shell feature-page">
      <SiteHeader active="harness" />

      <main className="feature-main">
        <Link className="back-link" href="/">
          ← Plugin directory
        </Link>

        <section className="feature-hero" aria-labelledby="harness-title">
          <div className="feature-hero-copy">
            <p className="eyebrow">Official sources · developer preview</p>
            <h1 id="harness-title">Install DeepSeek Harness. Then understand the runtime.</h1>
            <p className="feature-lede">
              DeepSeek describes an agent as a model plus a harness: the model supplies intelligence;
              the harness connects it to tools, state, execution, and the environment where work happens.
            </p>
            <div className="feature-actions">
              <a className="action-link primary" href={harnessSources.overview.href} target="_blank" rel="noopener noreferrer">
                Official overview ↗
              </a>
              <a className="action-link" href={harnessSources.repository.href} target="_blank" rel="noopener noreferrer">
                Source on GitHub ↗
              </a>
            </div>
          </div>
          <aside className="feature-facts" aria-label="Harness facts">
            <p className="eyebrow">At a glance</p>
            <dl>
              {harnessFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </section>

        <section className="chapter" aria-labelledby="installation">
          <div className="chapter-heading">
            <span>01</span>
            <div>
              <p className="eyebrow">Start here</p>
              <h2 id="installation">Installation</h2>
            </div>
            <p>Use the package for the shortest path. Use the repository when you need the source.</p>
          </div>
          <ol className="install-grid">
            {harnessInstallSteps.map((step) => (
              <li className="command-card" key={step.number}>
                <span className="card-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
                {step.command ? (
                  <div className="copy-row command-row">
                    <code>{step.command}</code>
                    <CopyButton value={step.command} />
                  </div>
                ) : (
                  <a href={harnessSources.docs.href} target="_blank" rel="noopener noreferrer">
                    Check the current requirements ↗
                  </a>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="chapter" aria-labelledby="architecture">
          <div className="chapter-heading">
            <span>02</span>
            <div>
              <p className="eyebrow">Product architecture</p>
              <h2 id="architecture">Everything is a plugin</h2>
            </div>
            <p>The kernel stays small while the agent is assembled from replaceable capabilities.</p>
          </div>

          <div className="architecture-map" aria-label="Capabilities composed around the Cordis kernel">
            <div className="architecture-orbit" aria-hidden="true">
              <span>Models</span><span>Tools</span><span>Skills</span><span>Sessions</span>
              <span className="kernel">Cordis<br />kernel</span>
              <span>Sandboxes</span><span>Storage</span><span>Loops</span><span>UI</span>
            </div>
            <p>
              Configuration chooses the parts. Cordis mounts them, resolves dependencies, and gives them
              shared services and events. A capability can change without turning the entire harness into a fork.
            </p>
          </div>

          <div className="reading-grid three-up">
            {harnessPillars.map((pillar) => (
              <article className="reading-card" key={pillar.title}>
                <p className="eyebrow">{pillar.eyebrow}</p>
                <h3>{pillar.title}</h3>
                <p>{pillar.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="chapter trace-chapter" aria-labelledby="traceability">
          <div className="chapter-heading">
            <span>03</span>
            <div>
              <p className="eyebrow">{traceHeading}</p>
              <h2 id="traceability">One event stream, not scattered debug traces</h2>
            </div>
            <p>The Trajectory view reconstructs what the model saw and what the runtime did.</p>
          </div>
          <div className="trace-layout">
            <ol className="event-stream">
              {traceEvents.map((event, index) => (
                <li key={event}><span>{String(index + 1).padStart(2, "0")}</span>{event}</li>
              ))}
            </ol>
            <div className="trace-result">
              <p className="eyebrow">Built on the same log</p>
              <div>{traceOperations.map((operation) => <span key={operation}>{operation}</span>)}</div>
              <p>An append-only session record is the common substrate for inspection and continuation.</p>
            </div>
          </div>
        </section>

        <section className="chapter" aria-labelledby="runtime-modes">
          <div className="chapter-heading">
            <span>04</span>
            <div>
              <p className="eyebrow">Runtime modes</p>
              <h2 id="runtime-modes">Choose the operating surface</h2>
            </div>
            <p>Modes are compositions of capabilities, not separate products.</p>
          </div>
          <div className="reading-grid mode-grid">
            {harnessModes.map((mode) => (
              <article className="reading-card mode-card" key={mode.title}>
                <p className="eyebrow">{mode.eyebrow}</p>
                <h3>{mode.title}</h3>
                <p>{mode.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="status-note" aria-labelledby="preview-status">
          <div>
            <p className="eyebrow">Before you depend on it</p>
            <h2 id="preview-status">Developer preview means the contracts can move.</h2>
          </div>
          <p>
            DeepSeek says the project is iterating rapidly and compatibility-breaking changes will occur.
            Verify current setup instructions and APIs against the official repository.
          </p>
        </section>

        <section className="source-rail" aria-labelledby="harness-sources">
          <p className="eyebrow" id="harness-sources">Primary sources</p>
          {sourceLinks.map((source) => (
            <a href={source.href} target="_blank" rel="noopener noreferrer" key={source.href}>
              <span>{source.label}</span><span>↗</span>
            </a>
          ))}
        </section>
      </main>

      <footer className="footer">
        <span>DSH Plugins · independent reference</span>
        <span>Product facts checked against DeepSeek&apos;s official materials</span>
      </footer>
    </div>
  );
}
