export type PaperCard = {
  title: string;
  body: string;
};

export type PaperMechanism = PaperCard & {
  input: string;
  output: string;
};

export const paperStatus = {
  title: "A Programming Paradigm for Spatiotemporal Composability",
  authors: "Yifan Shi, Wei Zhang, and Tianyi Cui",
  date: "Draft of August 13, 2026",
  pages: "88 pages",
  notice: "The repository labels this a preprint under active revision; claims and wording may change.",
} as const;

export const paperSources = {
  repository: "https://github.com/cordiverse/paper",
  pdf: "https://github.com/cordiverse/paper/blob/main/paper.pdf",
} as const;

export const paperThesis =
  "Dynamic software needs two guarantees at once: a component must be removable without leaving its effects behind, and its dependencies must stay correct as other components appear, disappear, or change.";

export const problemSignals: PaperCard[] = [
  {
    title: "A process restart is too blunt",
    body: "Restarting can reclaim one faulty module's resources, but it also discards caches, connections, partial computations, and every unrelated component in the process.",
  },
  {
    title: "A service orchestrator is too coarse",
    body: "Containers can coordinate services, but they cannot express fine-grained dependencies between components sharing one address space without turning local calls into network boundaries.",
  },
  {
    title: "Self-modifying harnesses raise the stakes",
    body: "An agent that replaces its own tools or runtime parts cannot afford repeated full restarts—or a faulty update that destroys the process needed to recover.",
  },
];

export const dimensions = [
  {
    axis: "Time",
    title: "Temporal composability",
    question: "Can this component leave cleanly?",
    body: "Removing a component should recover the shared environment to an observationally equivalent prior state, without taking unrelated components down with it.",
  },
  {
    axis: "Space",
    title: "Spatial composability",
    question: "Can its dependencies stay correct?",
    body: "A component declares what it needs; the runtime reacts when providers arrive, depart, or change identity and coordinates the affected lifecycles.",
  },
] as const;

export const mechanisms: PaperMechanism[] = [
  {
    title: "Revertible effects",
    input: "A context transformation",
    output: "The new state + an inverse",
    body: "Each atomic operation returns the inverse appropriate to the state where it ran. The runtime composes those inverses in reverse order, so teardown is derived from setup rather than maintained as a separate uninstall script.",
  },
  {
    title: "Reactive coeffects",
    input: "A dependency specification",
    output: "Activate · deactivate · stay neutral",
    body: "Each context change is checked against what a component requires. Satisfaction activates it, loss deactivates it, and irrelevant changes leave it alone; isolation changes what a key resolves to and interception changes how it may be used.",
  },
  {
    title: "Unified context",
    input: "Effects + requirements",
    output: "One compositional boundary",
    body: "The paper combines effect state, its recovery accumulator, and the coeffect store into one recursive context. Observational equivalence defines when recovery is good enough even if physical representation differs.",
  },
];

export const lifecycle = [
  "A component is instantiated as a fiber with effects, dependency declarations, a parent context, and lifecycle state.",
  "A provider change recomputes the target set of providers for each dependent fiber.",
  "Loading and unloading are inertial: an asynchronous transition completes before a new target takes over.",
  "A departing provider stops serving first, waits for dependents to drain, and only then runs its own inverses.",
  "Failure records the error and removes the failed fiber's contribution while leaving independent components available.",
] as const;

export const systemGuarantees: PaperCard[] = [
  {
    title: "Preservation",
    body: "Every lifecycle transition keeps the runtime state well formed under the calculus's assumptions.",
  },
  {
    title: "Temporal + spatial composition",
    body: "The local effect and dependency rules lift to interleaved systems of components when shared operations meet the paper's independence discipline.",
  },
  {
    title: "Progress",
    body: "A well-formed, finitely changing system can keep moving rather than deadlocking inside an unfinished lifecycle transition.",
  },
  {
    title: "Confluence",
    body: "Once orchestration stops changing the target configuration, the quiescent result is determined by that final configuration rather than incidental operation order.",
  },
];

export const implementationLayers: PaperCard[] = [
  {
    title: "Core library",
    body: "ctx.effect tracks disposer functions; ctx.set and ctx.get provide coeffects; isolation, interception, and the fiber lifecycle connect both mechanisms.",
  },
  {
    title: "Configuration reconciliation",
    body: "A declarative entry tree is the source of truth. The loader applies the least disruptive change for identity, module, isolation, interception, configuration, or disabled-state updates.",
  },
  {
    title: "Hot module replacement",
    body: "Cordis classifies changed modules, detects stale entries, and transactionally replaces their fibers. Failed imports restore cached modules and rebuild from the previous components.",
  },
];

export const paperAdvantages = [
  "Cleanup stays beside the operation that created the effect, reducing the gap between setup and teardown.",
  "Unloading one component preserves process-local state and keeps independent components running.",
  "Dependencies become explicit and reactive instead of ad hoc lookups frozen at startup.",
  "The same small runtime model supports server plugins, browser UI plugins, configuration changes, and source reloads.",
] as const;

export const paperBoundaries: PaperCard[] = [
  {
    title: "Inverses are an author obligation",
    body: "Cordis tracks and composes the inverse a callback supplies; it does not prove that arbitrary cleanup code truly reverses the corresponding effect.",
  },
  {
    title: "Not every emission is reversible",
    body: "Resources inside the system boundary can be recovered. Data already written to an external file, network, or payment system may require withholding or application-level compensation.",
  },
  {
    title: "Dependency access is not a sandbox",
    body: "Declared coeffects and interception can constrain mediated services, but untrusted code still needs an external sandbox to block ambient host access.",
  },
  {
    title: "Cycles trade simplicity for granularity",
    body: "Mutual dependencies remain inactive unless they are decomposed into cores and integration components, which can increase configuration and naming overhead.",
  },
  {
    title: "Version compatibility remains open",
    body: "Key identity links providers and consumers, but interface drift, name collisions, and structural compatibility across independently built packages are not fully solved.",
  },
  {
    title: "The evidence is not a benchmark",
    body: "Koishi shows existence and adoption in one TypeScript ecosystem; the paper does not provide a controlled comparison of runtime overhead or developer productivity.",
  },
];

export const koishiEvidence = {
  scale: "4,000+ community plugins",
  note: "Koishi has used the shared compositional model in production across server and browser-console runtimes. The paper notes that Koishi currently uses Cordis v3 while the paper specifies v4, and treats the case study as observational evidence rather than a quantitative comparison.",
} as const;
