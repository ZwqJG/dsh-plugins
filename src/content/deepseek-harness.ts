export type HarnessSource = {
  label: string;
  href: string;
};

export type InstallStep = {
  number: string;
  title: string;
  body: string;
  command?: string;
};

export type HarnessCard = {
  eyebrow: string;
  title: string;
  body: string;
};

export const harnessSources = {
  overview: {
    label: "Official overview",
    href: "https://deepseek.com/harness/en/",
  },
  repository: {
    label: "GitHub repository",
    href: "https://github.com/deepseek-ai/deepseek-harness",
  },
  docs: {
    label: "Developer documentation",
    href: "https://deepseek-harness.github.io/",
  },
  plugins: {
    label: "Community plugins",
    href: "https://github.com/topics/dsh-plugin",
  },
  paper: {
    label: "Cordis paper",
    href: "https://github.com/cordiverse/paper",
  },
} satisfies Record<string, HarnessSource>;

export const harnessFacts = [
  { label: "Status", value: "Developer preview" },
  { label: "License", value: "MIT" },
  { label: "Core", value: "Cordis" },
  { label: "Default Web UI", value: "127.0.0.1:3080" },
] as const;

export const harnessInstallSteps: InstallStep[] = [
  {
    number: "01",
    title: "Install Node.js",
    body: "The official quick start requires Node.js. With it available, you can launch the Web UI without cloning the repository.",
  },
  {
    number: "02",
    title: "Launch the Web UI",
    body: "Run the published package with npx. The Web UI is served on port 3080 by default.",
    command: "npx @deepseek-ai/dsh web",
  },
  {
    number: "03",
    title: "Or work from source",
    body: "Use the source path when you want to inspect the runtime, develop plugins, or contribute to the harness itself.",
    command:
      "git clone https://github.com/deepseek-ai/deepseek-harness.git\ncd deepseek-harness\npnpm install\npnpm run build\npnpm dsh web",
  },
];

export const harnessPillars: HarnessCard[] = [
  {
    eyebrow: "Kernel",
    title: "Cordis manages composition",
    body: "The Cordis kernel mounts and unmounts plugins and resolves their dependencies. Agent capabilities live outside the kernel, inside plugins.",
  },
  {
    eyebrow: "Capability model",
    title: "Everything is a plugin",
    body: "Models, tools, skills, sessions, sandboxes, storage, loops, scheduling, and the UI all use the same composable mechanism.",
  },
  {
    eyebrow: "Configuration",
    title: "Swap parts without rewriting the core",
    body: "Developers select, replace, or extend capabilities in configuration. Cordis services and events give those plugins a shared way to cooperate.",
  },
];

export const traceEvents = [
  "System prompts",
  "Model reasoning",
  "Tool calls and results",
  "Subagent scheduling",
  "Context injections",
] as const;

export const traceHeading = "Every run is traceable";

export const traceOperations = ["Resume", "Fork", "Search", "Replay"] as const;

export const harnessModes: HarnessCard[] = [
  {
    eyebrow: "Full stack",
    title: "Standard mode",
    body: "A full coding agent with file editing, shell, file and web search, skills, planning, goals, subagents, and workflows.",
  },
  {
    eyebrow: "Programmatic orchestration",
    title: "Code mode",
    body: "Standard capabilities exposed through the Code Mode SDK, so the model can coordinate multi-step tool work in one TypeScript program.",
  },
  {
    eyebrow: "Small surface",
    title: "Minimal mode",
    body: "A two-tool coding environment with persistent bash and a file editor, designed for a minimal benchmark setting.",
  },
  {
    eyebrow: "Runtime workshop",
    title: "Creator mode",
    body: "A preset-authoring environment with runtime inspection, in-memory plugin experiments, and guidance for combining new configurations.",
  },
];
