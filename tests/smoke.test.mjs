import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the directory keeps all 12 categories and a 20-item limit", async () => {
  const source = await readFile(new URL("src/lib/plugins.ts", root), "utf8");
  const page = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  assert.equal((source.match(/slug: \"/g) ?? []).length, 12);
  assert.match(page, /const PAGE_SIZE = 20/);
  assert.match(page, /Browse by category/);
});

test("category counts are derived from the same plugin collection as the results", async () => {
  const source = await readFile(new URL("src/lib/plugins.ts", root), "utf8");
  const page = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  assert.doesNotMatch(source, /count: \d+/);
  assert.match(source, /export const categoryCounts = plugins\.reduce/);
  assert.match(source, /plugin\.owner\.toLowerCase\(\) === owner\.toLowerCase\(\)/);
  assert.match(page, /categoryCounts\[category\.slug\]/);
  assert.match(page, /window\.addEventListener\("popstate", syncCategory\)/);
});

test("view more expands the current filtered result list", async () => {
  const page = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  assert.match(page, /const \[visibleCount, setVisibleCount\] = useState\(PAGE_SIZE\)/);
  assert.match(page, /function updateQuery\(nextQuery: string\)/);
  assert.match(page, /onChange=\{\(event\) => updateQuery\(event\.target\.value\)\}/);
  assert.match(page, /onClick=\{\(\) => updateQuery\(""\)\}/);
  assert.match(page, /sortedPlugins\.slice\(0, visibleCount\)/);
  assert.match(page, /onClick=\{\(\) => setVisibleCount\(sortedPlugins\.length\)\}/);
});

test("sort selection controls the order of the visible plugin list", async () => {
  const page = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  const sort = await readFile(new URL("src/lib/plugin-sort.ts", root), "utf8").catch(() => "");
  assert.match(page, /const \[sort, setSort\] = useState<SortOption>\("trending"\)/);
  assert.match(page, /sortPlugins\(filteredPlugins, sort\)/);
  assert.match(page, /value=\{sort\} onChange=\{\(event\) => setSort\(event\.target\.value as SortOption\)\}/);
  assert.match(sort, /sort === "popular"/);
  assert.match(sort, /right\.stars - left\.stars/);
  assert.match(sort, /sort === "recent"/);
});

test("the directory reads generated GitHub topic data instead of hand-written examples", async () => {
  const source = await readFile(new URL("src/lib/plugins.ts", root), "utf8");
  const data = JSON.parse(await readFile(new URL("src/data/github-plugins.json", root), "utf8"));
  assert.match(source, /github-plugins\.json/);
  assert.doesNotMatch(source, /const examples/);
  assert.ok(data.length >= 100);
  assert.ok(data.every((plugin) => plugin.githubUrl.startsWith("https:\/\/github.com\/")));
});

test("detail pages expose copyable GitHub and install values", async () => {
  const page = await readFile(new URL("src/app/plugins/[owner]/[repo]/page.tsx", root), "utf8");
  assert.match(page, /CopyButton value=\{plugin\.githubUrl\}/);
  assert.match(page, /CopyButton value=\{plugin\.install\}/);
});

test("the sync endpoint is protected by a cron secret", async () => {
  const route = await readFile(new URL("src/app/api/internal/sync/route.ts", root), "utf8");
  assert.match(route, /authorization !== `Bearer \$\{secret\}`/);
  assert.match(route, /status: 401/);
});

test("plugin detail pages are statically generated and accurately describe the snapshot", async () => {
  const page = await readFile(new URL("src/app/plugins/[owner]/[repo]/page.tsx", root), "utf8");
  assert.match(page, /export const dynamicParams = false/);
  assert.match(page, /export function generateStaticParams\(\)/);
  assert.match(page, /plugins\.map\(\(plugin\) => \(\{ owner: plugin\.owner, repo: plugin\.repo \}\)\)/);
  assert.match(page, /repository name, description, and topics/);
  assert.doesNotMatch(page, /Updated automatically/);
});

test("runtime dependencies and sync pagination have deterministic bounds", async () => {
  const packageJson = await readFile(new URL("package.json", root), "utf8");
  const sync = await readFile(new URL("scripts/sync-github-plugins.mjs", root), "utf8");
  assert.doesNotMatch(packageJson, /"latest"/);
  assert.match(sync, /Math\.min\(10, Math\.max\(1,/);
});
