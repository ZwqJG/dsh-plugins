# DeepSeek Harness and Cordis Paper Pages

## Goal

Add two English editorial pages to DSH Plugins:

- `/harness`: a product overview whose upper section explains installation and whose lower section explains DeepSeek Harness.
- `/paper`: a plain-language guide to the Cordis paper, focused on the problem, design, advantages, and boundaries.

Both pages must feel native to the existing black-and-white developer-tool site, remain easy to scan on mobile, and cite the official material rather than presenting secondary claims as fact.

## Audience and success criteria

The primary reader is a developer who has heard of DeepSeek Harness but does not yet know how to install it, how it differs from a conventional agent shell, or what the Cordis paper contributes.

The work succeeds when a reader can:

1. Copy the official quick-start command without leaving the site.
2. Understand the `Agent = Model + Harness` framing and the meaning of “everything is a plugin.”
3. Compare Standard, Code, Minimal, and Creator modes.
4. Understand temporal and spatial composability without reading formal notation first.
5. See how revertible effects, reactive coeffects, unified context, the component lifecycle, configuration reconciliation, and hot module replacement fit together.
6. Distinguish the paper's demonstrated benefits from its explicit limitations and open questions.

## Information architecture

### Shared navigation

Add `Harness` and `Paper` links to the existing site navigation on the directory, plugin-detail, Harness, and Paper pages. Reuse a consistent header structure and keep the existing directory anchors.

### Harness page

The page order is fixed:

1. Hero: developer-preview status, concise definition, official-source actions.
2. Installation: Node.js prerequisite, `npx @deepseek-ai/dsh web`, and a source-install path that links to the canonical repository and documentation.
3. Product model: Cordis kernel, capabilities as plugins, and composition through configuration.
4. Traceability: append-only session events and the operations built on the event stream.
5. Runtime modes: Standard, Code, Minimal, and Creator.
6. Preview caveat and official source list.

The page must not imply that the developer preview is a stable API. Commands must be copied exactly from official material.

### Paper page

The page presents the 88-page preprint as an accessible engineering argument:

1. Paper identity: title, authors, August 13, 2026 draft date, and active-revision notice.
2. Problem: process restarts and service orchestration are too coarse for dynamically loaded in-process components.
3. Two dimensions: temporal composability and spatial composability.
4. Core mechanism: revertible effects, reactive coeffects, and their unified context.
5. System model: components, fibers, lifecycle transitions, failure handling, and the main metatheoretic guarantees.
6. Cordis implementation: core library, effect tracking, coeffect resolution, declarative component loader, configuration reconciliation, and hot module replacement.
7. Evidence: Koishi as a production case study, described as an existence proof rather than a broad benchmark.
8. Advantages: safe unload, reactive dependencies, local composition, and preserved in-process state.
9. Boundaries: author-supplied inverses, system-boundary limits, access control and sandboxing concerns, dependency versioning, language/runtime integration, and preprint status.
10. Direct links to the repository and PDF.

Formal claims will be paraphrased carefully. The page should explain the intuition before terminology and avoid claiming that Cordis automatically proves arbitrary cleanup code correct.

## Visual direction

Use a technical-editorial treatment that extends the current minimal black-and-white language:

- Large, tightly set headings and generous white space.
- Fine rules, numbered sections, compact metadata, and restrained off-white surfaces.
- Terminal-style command blocks with the existing copy interaction.
- A small CSS architecture diagram showing how capabilities mount around the Cordis kernel.
- A two-axis visual for temporal versus spatial composability.
- No gradients, decorative stock imagery, or new dependencies.
- Motion is limited to subtle hover/focus transitions and must respect reduced-motion preferences.

Typography and tokens should be centralized in the existing global stylesheet. The pages should remain recognizably part of DSH Plugins rather than mimic DeepSeek's official landing page.

## Technical design

- Implement both routes as static App Router server components.
- Store editorial content in typed local data modules so facts, source URLs, modes, paper concepts, advantages, and limitations can be reviewed independently from the page markup.
- Reuse the existing `CopyButton` client component for commands and source URLs.
- Use `next/link` for internal navigation and ordinary external anchors with safe `rel` values for official sources.
- Provide route-level `Metadata` with English titles and descriptions.
- Keep all layout and illustration work in CSS and semantic HTML; add no packages.
- Follow Next.js 16.3.1's local App Router documentation for pages, navigation, metadata, and fonts before implementation.

## Error handling and content integrity

The pages have no runtime data dependency, so source-site outages must not break rendering. External links are clearly labeled as external. Copy controls retain the existing success/failure behavior.

Content integrity rules:

- DeepSeek product claims come from the official Harness page, repository, or developer documentation.
- Paper claims come from the repository README and the complete PDF.
- Developer-preview and preprint notices remain visible.
- Interpretation is labeled through plain-language framing and does not invent performance numbers.

## Testing and verification

Add regression coverage that confirms:

- `/harness` and `/paper` source files exist and expose English metadata.
- Shared navigation links to both routes.
- The official quick-start command and official source URLs are present.
- The Harness page contains the four documented runtime modes and core design claims.
- The Paper page contains the two composability dimensions, the core mechanisms, advantages, boundaries, repository URL, and PDF URL.
- No Chinese copy remains on the two English pages.

Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build`. Then render both routes at desktop and mobile widths and visually inspect hierarchy, overflow, focus states, external links, and copy controls.

## Scope boundaries

This change does not add localization, a CMS, dynamic source fetching, new dependencies, a paper PDF mirror, or edits to the existing plugin data pipeline. It also does not claim affiliation beyond citing official DeepSeek and Cordis sources.
