# DeepSeek Harness and Cordis Paper Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship two English, source-grounded editorial pages for installing and understanding DeepSeek Harness and for understanding the Cordis paper.

**Architecture:** Add two statically rendered App Router pages backed by typed local content modules. Reuse the existing copy interaction and visual tokens, extend the current black-and-white design with page-specific technical-editorial components, and connect both routes through the existing navigation without introducing runtime fetching or dependencies.

**Tech Stack:** Next.js 16.3.1 App Router, React 19 server components, TypeScript 5.9, CSS, Node test runner.

---

## File map

- Create/normalize `src/content/deepseek-harness.ts`: official source links, install steps, product pillars, trace facts, and four runtime modes.
- Create/normalize `src/content/cordis-paper.ts`: paper metadata, plain-language concepts, implementation facts, evidence, advantages, and limits.
- Create/normalize `src/app/harness/page.tsx`: English Harness product and installation page.
- Create/normalize `src/app/paper/page.tsx`: English Cordis paper guide.
- Modify `src/components/plugin-directory.tsx`: add English navigation and two concise editorial entry cards while preserving FAQ and directory behavior.
- Modify `src/app/plugins/[owner]/[repo]/page.tsx`: expose both new routes in detail-page navigation.
- Modify `src/app/globals.css`: add responsive editorial page, diagram, command, and promo-card styling.
- Modify `src/app/layout.tsx`: retain a site-wide metadata template suitable for directory and editorial routes.
- Modify `tests/smoke.test.mjs`: lock route, language, sources, content, navigation, and visual hooks.

### Task 1: Lock the English source and route contract

**Files:**
- Modify: `tests/smoke.test.mjs`
- Test: `tests/smoke.test.mjs`

- [ ] **Step 1: Replace the draft page tests with failing English contract tests**

Add this helper and these tests after the existing test setup:

```js
const cjk = /[\u3400-\u9fff]/;

test("the homepage links to the Harness and paper reading paths in English", async () => {
  const directory = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  assert.match(directory, /href="\/harness"/);
  assert.match(directory, /href="\/paper"/);
  assert.match(directory, /Harness guide/);
  assert.match(directory, /Cordis paper/);
  assert.doesNotMatch(directory.match(/<section className="promo-grid"[\s\S]*?<\/section>/)?.[0] ?? "", cjk);
});

test("the Harness page presents installation before the English product overview", async () => {
  const page = await readFile(new URL("src/app/harness/page.tsx", root), "utf8");
  const content = await readFile(new URL("src/content/deepseek-harness.ts", root), "utf8");
  assert.match(page, /Install DeepSeek Harness/);
  assert.ok(page.indexOf("Installation") < page.indexOf("Product architecture"));
  assert.match(content, /npx @deepseek-ai\/dsh web/);
  assert.match(content, /Everything is a plugin/);
  assert.match(content, /Every run is traceable/);
  for (const mode of ["Standard mode", "Code mode", "Minimal mode", "Creator mode"]) {
    assert.match(content, new RegExp(mode));
  }
  assert.match(content, /https:\/\/deepseek\.com\/harness\/en\//);
  assert.match(content, /https:\/\/github\.com\/deepseek-ai\/deepseek-harness/);
  assert.doesNotMatch(page + content, cjk);
});

test("the paper page explains the full argument, implementation, evidence, and limits in English", async () => {
  const page = await readFile(new URL("src/app/paper/page.tsx", root), "utf8");
  const content = await readFile(new URL("src/content/cordis-paper.ts", root), "utf8");
  for (const claim of [
    "Temporal composability",
    "Spatial composability",
    "Revertible effects",
    "Reactive coeffects",
    "Unified context",
    "Configuration reconciliation",
    "Hot module replacement",
    "Koishi",
    "Boundaries",
  ]) {
    assert.match(page + content, new RegExp(claim, "i"));
  }
  assert.match(content, /preprint under active revision/i);
  assert.match(content, /https:\/\/github\.com\/cordiverse\/paper/);
  assert.match(content, /paper\.pdf/);
  assert.doesNotMatch(page + content, cjk);
});
```

- [ ] **Step 2: Run the tests and verify the current drafts fail for language and headings**

Run: `npm test`

Expected: FAIL in the new Harness, Paper, and homepage tests because the draft copy contains Chinese and does not use the approved English structure.

- [ ] **Step 3: Commit only the test contract**

```bash
git add tests/smoke.test.mjs
git commit -m "Require an English source-grounded Harness reading path" -m "Tested: npm test (expected failures before implementation)"
```

### Task 2: Build the typed Harness content and page

**Files:**
- Modify: `src/content/deepseek-harness.ts`
- Modify: `src/app/harness/page.tsx`
- Reuse: `src/components/copy-button.tsx`
- Test: `tests/smoke.test.mjs`

- [ ] **Step 1: Normalize the Harness content module to reviewed English facts**

Keep typed arrays and replace the draft content with these exact content groups:

```ts
export const harnessSources = {
  overview: "https://deepseek.com/harness/en/",
  repository: "https://github.com/deepseek-ai/deepseek-harness",
  docs: "https://deepseek-harness.github.io/",
  plugins: "https://github.com/topics/dsh-plugin",
  paper: "https://github.com/cordiverse/paper",
} as const;

export const harnessInstallSteps = [
  { number: "01", title: "Install Node.js", body: "DeepSeek's quick start requires Node.js before launching the Web UI." },
  { number: "02", title: "Launch the Web UI", body: "Run the developer-preview package directly with npx.", command: "npx @deepseek-ai/dsh web" },
  { number: "03", title: "Work from source", body: "Clone the canonical repository, then follow its current setup instructions.", command: "git clone https://github.com/deepseek-ai/deepseek-harness" },
] as const;
```

Define typed `harnessPillars`, `traceEvents`, and `harnessModes` arrays containing the official concepts: Cordis kernel; models, tools, skills, sessions, sandboxes, storage, loops, scheduling, and UI as plugins; configuration-based composition; append-only records for prompts, reasoning, tool calls/results, subagent scheduling, and context injections; and the exact four runtime modes.

- [ ] **Step 2: Replace the Harness draft page with the approved static structure**

The server component must export:

```ts
export const metadata: Metadata = {
  title: "DeepSeek Harness: Installation and Product Guide",
  description: "Install DeepSeek Harness and understand its Cordis kernel, plugin architecture, traceable sessions, and runtime modes.",
};
```

Render, in order, `Install DeepSeek Harness`, an `Installation` section with `CopyButton`, `Product architecture`, a CSS-only Cordis architecture diagram, `Every run is traceable`, `Runtime modes`, the developer-preview caveat, and official-source links. Use semantic `header`, `main`, `section`, `article`, `aside`, `ol`, and `dl` elements. Internal navigation uses `Link`; external links use `target="_blank" rel="noopener noreferrer"`.

- [ ] **Step 3: Run the Harness contract**

Run: `npm test`

Expected: the Harness test passes; the Paper and homepage English tests may still fail.

- [ ] **Step 4: Commit the Harness content and page**

```bash
git add src/content/deepseek-harness.ts src/app/harness/page.tsx
git commit -m "Make the Harness architecture legible before installation" -m "Tested: npm test"
```

### Task 3: Build the complete-reader Paper content and page

**Files:**
- Modify: `src/content/cordis-paper.ts`
- Modify: `src/app/paper/page.tsx`
- Test: `tests/smoke.test.mjs`

- [ ] **Step 1: Normalize the paper content module around the complete 88-page argument**

Define and export these typed groups:

```ts
export const paperStatus = {
  title: "A Programming Paradigm for Spatiotemporal Composability",
  authors: "Yifan Shi, Wei Zhang, and Tianyi Cui",
  date: "Draft of August 13, 2026",
  notice: "The repository labels this an active-revision preprint; claims and wording may change.",
} as const;

export const paperSources = {
  repository: "https://github.com/cordiverse/paper",
  pdf: "https://github.com/cordiverse/paper/blob/main/paper.pdf",
} as const;
```

Add typed arrays for `problemSignals`, `dimensions`, `mechanisms`, `systemGuarantees`, `implementationLayers`, `advantages`, and `boundaries`. Cover pages/sections 1–79: fine-grained unload versus process restart; dependency changes inside one address space; inverse-carrying effects; dependency specifications and activation/deactivation/neutral notifications; unified context and observational equivalence; components/fibers and withdrawal/iteration/asynchrony/failure; preservation, temporal/spatial composability, progress, and confluence; effect tracking, coeffect resolution, component lifecycle, declarative loader, configuration reconciliation, HMR, Koishi; and limitations around author-provided inverses, system boundaries, sandboxing, service multiplexing, versions, mutual dependencies, language/OS co-design, and preprint status.

- [ ] **Step 2: Replace the paper draft page with a plain-language engineering narrative**

The server component must export:

```ts
export const metadata: Metadata = {
  title: "The Cordis Paper, Explained",
  description: "A plain-language guide to temporal and spatial composability, Cordis design, advantages, evidence, and limits.",
};
```

Render sections titled `The problem`, `Two dimensions of composability`, `How the design works`, `From local rules to a whole system`, `How Cordis implements it`, `Why it matters`, and `Boundaries`. Include a CSS two-axis diagram and an explicit `What the paper does not prove` callout. Link directly to the repository and PDF.

- [ ] **Step 3: Run the paper contract**

Run: `npm test`

Expected: Harness and Paper tests pass; homepage English test may still fail.

- [ ] **Step 4: Commit the Paper content and page**

```bash
git add src/content/cordis-paper.ts src/app/paper/page.tsx
git commit -m "Translate Cordis theory into an engineering reading path" -m "Tested: npm test"
```

### Task 4: Integrate navigation and the homepage entry points

**Files:**
- Modify: `src/components/plugin-directory.tsx`
- Modify: `src/app/plugins/[owner]/[repo]/page.tsx`
- Modify: `src/app/layout.tsx`
- Test: `tests/smoke.test.mjs`

- [ ] **Step 1: Preserve the current FAQ/directory behavior and translate only the draft promo content**

Use these homepage card strings:

```tsx
<Link className="promo-card promo-card-harness" href="/harness">
  <span className="promo-kicker">Harness guide</span>
  <strong>Install it. Then understand the runtime.</strong>
  <span>Quick start, Cordis architecture, traceable sessions, and four runtime modes.</span>
</Link>
<Link className="promo-card promo-card-paper" href="/paper">
  <span className="promo-kicker">Cordis paper</span>
  <strong>Why dynamic composition needs two dimensions.</strong>
  <span>An accessible guide to the design, guarantees, evidence, and boundaries.</span>
</Link>
```

Keep `Explore`, `Categories`, and `FAQ` anchors intact. Add `Harness` and `Paper` links to both directory and plugin detail navigation. Retain the root metadata template with English description.

- [ ] **Step 2: Run the complete smoke suite**

Run: `npm test`

Expected: PASS with all directory, FAQ, Harness, and Paper tests green.

- [ ] **Step 3: Commit the navigation integration**

```bash
git add src/components/plugin-directory.tsx 'src/app/plugins/[owner]/[repo]/page.tsx' src/app/layout.tsx
git commit -m "Connect the directory to its Harness reading paths" -m "Tested: npm test"
```

### Task 5: Finish the technical-editorial visual system

**Files:**
- Modify: `src/app/globals.css`
- Test: `tests/smoke.test.mjs`

- [ ] **Step 1: Add a focused visual-source regression test**

```js
test("editorial pages expose responsive diagrams and reduced-motion support", async () => {
  const harness = await readFile(new URL("src/app/harness/page.tsx", root), "utf8");
  const paper = await readFile(new URL("src/app/paper/page.tsx", root), "utf8");
  const css = await readFile(new URL("src/app/globals.css", root), "utf8");
  assert.match(harness, /architecture-map/);
  assert.match(paper, /composability-axis/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /prefers-reduced-motion/);
});
```

- [ ] **Step 2: Run the test and verify the final visual hooks are initially incomplete**

Run: `npm test`

Expected: FAIL if either diagram hook, the 760px layout, or reduced-motion treatment is absent.

- [ ] **Step 3: Consolidate the draft CSS into the approved editorial language**

Keep existing directory/detail styles and add scoped `.feature-page` rules using the existing custom properties. Use an `Iowan Old Style`, `Baskerville`, `Times New Roman`, serif stack for editorial display text and the existing sans stack for body copy. Add styles for `.feature-hero`, `.chapter`, `.command-card`, `.architecture-map`, `.composability-axis`, `.reading-grid`, `.source-rail`, `.status-note`, and homepage `.promo-grid` cards. Ensure visible `:focus-visible` outlines, horizontal overflow protection for commands, a one-column layout at 760px, a compact navigation treatment at 600px, and disabled transitions under `prefers-reduced-motion: reduce`.

- [ ] **Step 4: Run automated verification**

Run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all commands exit 0; the build lists `/harness` and `/paper` as static routes.

- [ ] **Step 5: Commit the visual system**

```bash
git add src/app/globals.css tests/smoke.test.mjs
git commit -m "Give the technical guides a readable editorial hierarchy" -m "Tested: npm test; npm run lint; npm run typecheck; npm run build"
```

### Task 6: Render and visually verify both routes

**Files:**
- Modify if needed: `src/app/globals.css`
- Modify if needed: `src/app/harness/page.tsx`
- Modify if needed: `src/app/paper/page.tsx`

- [ ] **Step 1: Start the production build locally**

Run: `npm run start`

Expected: Next.js serves the built app locally with `/harness` and `/paper` reachable.

- [ ] **Step 2: Capture desktop and mobile screenshots**

Render both routes at approximately 1440×1000 and 390×844. Check navigation wrapping, command overflow, diagram labels, reading order, external links, visible focus, and copy feedback.

- [ ] **Step 3: Fix only evidence-backed visual defects and rerun verification**

Run:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

Expected: all commands exit 0 after any visual correction.

- [ ] **Step 4: Commit any visual verification corrections**

```bash
git add src/app/globals.css src/app/harness/page.tsx src/app/paper/page.tsx
git commit -m "Resolve the rendered guide layout at desktop and mobile widths" -m "Tested: desktop and mobile render; npm test; npm run lint; npm run typecheck; npm run build"
```
