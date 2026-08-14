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
  { slug: "system", name: "⚙ 基础与系统", description: "Core runtime and system plugins" },
  { slug: "tools", name: "🛠 工具集", description: "Everyday tools for Harness" },
  { slug: "agent-automation", name: "🤖 Agent 与自动化", description: "Workflows, routing, and automation" },
  { slug: "web-ui", name: "🎨 Web UI 增强", description: "Web browsing and UI workflows" },
  { slug: "desktop-terminal", name: "🖥 桌面与终端", description: "Desktop, shell, and terminal tools" },
  { slug: "vision-multimodal", name: "👁 视觉与多模态", description: "Vision, audio, and multimodal inputs" },
  { slug: "memory-knowledge", name: "🧠 记忆与知识", description: "Memory, context, and learning" },
  { slug: "security-ops", name: "🛡 安全与运维", description: "Security, diagnostics, and ops" },
  { slug: "files-content", name: "📎 文件与内容", description: "Files, documents, and content" },
  { slug: "notifications-collab", name: "🔌 通知与协作", description: "Notifications and integrations" },
  { slug: "search-research", name: "🌐 搜索与研究", description: "Search, retrieval, and research" },
  { slug: "other", name: "📦 其他", description: "Unclassified plugins" },
];

export const plugins = generatedPlugins as Plugin[];

export const categoryCounts = plugins.reduce<Record<string, number>>((counts, plugin) => {
  counts[plugin.category] = (counts[plugin.category] ?? 0) + 1;
  return counts;
}, Object.fromEntries(categories.map((category) => [category.slug, 0])));

export function getPlugin(owner: string, repo: string) {
  return plugins.find((plugin) => plugin.owner.toLowerCase() === owner.toLowerCase() && plugin.repo.toLowerCase() === repo.toLowerCase());
}
