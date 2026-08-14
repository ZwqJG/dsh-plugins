import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const SEARCH_URL = "https://api.github.com/search/repositories";
const OUTPUT_FILE = resolve("src/data/github-plugins.json");
const requestedPageCount = Number.parseInt(process.env.SYNC_MAX_PAGES ?? "10", 10);
const MAX_PAGES = Math.min(10, Math.max(1, Number.isFinite(requestedPageCount) ? requestedPageCount : 10));
const token = process.env.GITHUB_TOKEN;

const categoryRules = [
  ["agent-automation", ["agent", "automation", "workflow", "orchestration", "scheduler", "cron", "router"]],
  ["web-ui", ["web", "browser", "ui", "frontend", "design", "playwright"]],
  ["desktop-terminal", ["desktop", "terminal", "tui", "shell", "cli"]],
  ["vision-multimodal", ["vision", "image", "video", "audio", "ocr", "multimodal", "vlm"]],
  ["memory-knowledge", ["memory", "knowledge", "rag", "learning", "context"]],
  ["security-ops", ["security", "audit", "ops", "devops", "diagnostic", "monitoring"]],
  ["files-content", ["file", "document", "pdf", "markdown", "content", "word", "excel"]],
  ["notifications-collab", ["slack", "discord", "telegram", "feishu", "lark", "notification", "collaboration"]],
  ["search-research", ["search", "research", "retrieval", "crawler", "scraper"]],
  ["tools", ["tool", "utility", "api", "developer"]],
  ["system", ["system", "runtime", "model", "core", "config"]],
];

function classify(repository) {
  const text = [repository.name, repository.description ?? "", ...(repository.topics ?? [])].join(" ").toLowerCase();
  return categoryRules.find(([, terms]) => terms.some((term) => text.includes(term)))?.[0] ?? "other";
}

function statusFor(repository, now) {
  if (repository.archived) return "Archived";
  if (repository.stargazers_count >= 50) return "Popular";
  const pushedAt = repository.pushed_at ? new Date(repository.pushed_at) : null;
  if (pushedAt && now.getTime() - pushedAt.getTime() < 30 * 24 * 60 * 60 * 1000) return "New";
  return "Active";
}

function normalize(repository, now) {
  const topics = (repository.topics ?? []).filter((topic) => !["dsh-plugin", "dsh", "deepseek-harness"].includes(topic)).slice(0, 3);
  return {
    owner: repository.owner.login,
    repo: repository.name,
    description: repository.description ?? "No repository description is available yet.",
    category: classify(repository),
    tags: topics,
    language: repository.language ?? "Unknown",
    stars: repository.stargazers_count,
    updatedAt: repository.updated_at ?? repository.pushed_at ?? null,
    status: statusFor(repository, now),
    install: null,
    githubUrl: repository.html_url,
  };
}

async function fetchPage(page) {
  const params = new URLSearchParams({
    q: "topic:dsh-plugin is:public",
    sort: "updated",
    order: "desc",
    per_page: "100",
    page: String(page),
  });
  const response = await fetch(`${SEARCH_URL}?${params}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const rateLimitReset = response.headers.get("x-ratelimit-reset");
    const resetHint = rateLimitReset ? ` (rate limit resets at ${new Date(Number(rateLimitReset) * 1000).toISOString()})` : "";
    throw new Error(`GitHub Search API returned ${response.status} for page ${page}${resetHint}`);
  }
  return response.json();
}

const now = new Date();
const repositories = [];
for (let page = 1; page <= MAX_PAGES; page += 1) {
  const result = await fetchPage(page);
  repositories.push(...result.items);
  process.stdout.write(`Fetched page ${page}: ${result.items.length} repositories\n`);
  if (result.items.length < 100) break;
}

const plugins = [...new Map(repositories.map((repository) => [repository.id, normalize(repository, now)])).values()];
await mkdir(resolve("src/data"), { recursive: true });
await writeFile(OUTPUT_FILE, `${JSON.stringify(plugins, null, 2)}\n`);
process.stdout.write(`Wrote ${plugins.length} plugins to ${OUTPUT_FILE}\n`);
