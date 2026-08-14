import generatedPlugins from "@/data/github-plugins.json";

export type Category = {
  slug: string;
  name: string;
  description: string;
};

export type Plugin = {
  owner: string;
  repo: string;
  description: string;
  category: string;
  tags: string[];
  language: string;
  stars: number;
  updatedAt: string | null;
  status: "Active" | "New" | "Popular" | "Archived";
  install: string | null;
  githubUrl: string;
};

export const categories: Category[] = [
  { slug: "system", name: "⚙ Core & System", description: "Core runtime and system plugins" },
  { slug: "tools", name: "🛠 Tooling", description: "Everyday tools for Harness" },
  { slug: "agent-automation", name: "🤖 Agent & Automation", description: "Workflows, routing, and automation" },
  { slug: "web-ui", name: "🎨 Web UI", description: "Web browsing and UI workflows" },
  { slug: "desktop-terminal", name: "🖥 Desktop & Terminal", description: "Desktop, shell, and terminal tools" },
  { slug: "vision-multimodal", name: "👁 Vision & Multimodal", description: "Vision, audio, and multimodal inputs" },
  { slug: "memory-knowledge", name: "🧠 Memory & Knowledge", description: "Memory, context, and learning" },
  { slug: "security-ops", name: "🛡 Security & Ops", description: "Security, diagnostics, and ops" },
  { slug: "files-content", name: "📎 Files & Content", description: "Files, documents, and content" },
  { slug: "notifications-collab", name: "🔌 Notifications & Integrations", description: "Notifications and integrations" },
  { slug: "search-research", name: "🌐 Search & Research", description: "Search, retrieval, and research" },
  { slug: "other", name: "📦 Other", description: "Unclassified plugins" },
];

export const plugins = generatedPlugins as Plugin[];

export const categoryCounts = plugins.reduce<Record<string, number>>((counts, plugin) => {
  counts[plugin.category] = (counts[plugin.category] ?? 0) + 1;
  return counts;
}, Object.fromEntries(categories.map((category) => [category.slug, 0])));

export function getPlugin(owner: string, repo: string) {
  return plugins.find((plugin) => plugin.owner.toLowerCase() === owner.toLowerCase() && plugin.repo.toLowerCase() === repo.toLowerCase());
}
