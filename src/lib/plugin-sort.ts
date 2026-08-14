import type { Plugin } from "./plugins";

export type SortOption = "trending" | "popular" | "recent";

const statusRank: Record<Plugin["status"], number> = {
  Popular: 3,
  New: 2,
  Active: 1,
  Archived: 0,
};

function updatedTime(plugin: Plugin) {
  return plugin.updatedAt ? Date.parse(plugin.updatedAt) || 0 : 0;
}

function byRecent(left: Plugin, right: Plugin) {
  return updatedTime(right) - updatedTime(left) || right.stars - left.stars;
}

export function sortPlugins(plugins: Plugin[], sort: SortOption) {
  return [...plugins].sort((left, right) => {
    if (sort === "popular") return right.stars - left.stars || byRecent(left, right);
    if (sort === "recent") return byRecent(left, right);
    return statusRank[right.status] - statusRank[left.status] || right.stars - left.stars || byRecent(left, right);
  });
}
