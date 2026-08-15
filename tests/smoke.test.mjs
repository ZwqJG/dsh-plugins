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
  const copyButton = await readFile(new URL("src/components/copy-button.tsx", root), "utf8");
  assert.match(page, /CopyButton value=\{plugin\.githubUrl\}/);
  assert.match(page, /CopyButton value=\{plugin\.install\}/);
  assert.match(copyButton, /document\.execCommand\("copy"\)/);
  assert.match(copyButton, /clearTimeout/);
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

test("FAQ covers the DeepSeek Harness long-tail questions with official destinations", async () => {
  const faq = await readFile(new URL("src/lib/faq.ts", root), "utf8").catch(() => "");
  const page = await readFile(new URL("src/app/faq/page.tsx", root), "utf8").catch(() => "");
  for (const keyword of ["deepseek harness 招聘", "deepseek harness 团队", "deepseek harness agent", "deepseek harness 产品", "deepseek harness 是什么", "deepseek harness 面经", "deepseek harness 内测", "deepseek harness 发布时间", "deepseek harness github"]) {
    assert.match(faq, new RegExp(keyword));
  }
  assert.match(faq, /https:\/\/www\.deepseek\.com\/harness\//);
  assert.match(faq, /https:\/\/github\.com\/deepseek-ai\/deepseek-harness/);
  assert.match(faq, /https:\/\/talent\.deepseek\.com\//);
  assert.match(faq, /https:\/\/x\.com\/deepseek_ai/);
  assert.match(page, /id="faq-title"/);
  assert.match(page, /faqs\.map/);
  assert.match(page, /"@type": "FAQPage"/);
});

test("FAQ is a dedicated route and is not rendered below the homepage directory", async () => {
  const directory = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  const header = await readFile(new URL("src/components/site-header.tsx", root), "utf8");
  assert.doesNotMatch(directory, /className="section faq"/);
  assert.doesNotMatch(directory, /from "@\/lib\/faq"/);
  assert.match(header, /key: "faq", label: "FAQ", href: "\/faq"/);
  assert.match(header, /type PageKey = "harness" \| "paper" \| "faq"/);
});

const cjk = /[\u3400-\u9fff]/;

test("the homepage links to the Harness and paper reading paths in English", async () => {
  const header = await readFile(new URL("src/components/site-header.tsx", root), "utf8");
  const directory = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  const promo = directory.match(/<section className="promo-grid"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(header, /href: "\/harness"/);
  assert.match(header, /href: "\/paper"/);
  assert.match(promo, /Harness guide/);
  assert.match(promo, /Cordis paper/);
  assert.doesNotMatch(promo, cjk);
});

test("shared site navigation exposes page-specific variants and active state", async () => {
  const header = await readFile(new URL("src/components/site-header.tsx", root), "utf8");
  const harness = await readFile(new URL("src/app/harness/page.tsx", root), "utf8");
  const paper = await readFile(new URL("src/app/paper/page.tsx", root), "utf8");
  const detail = await readFile(new URL("src/app/plugins/[owner]/[repo]/page.tsx", root), "utf8");
  assert.match(header, /type HeaderVariant = "home" \| "feature" \| "detail"/);
  assert.match(header, /aria-current=\{active === item\.key \? "page" : undefined\}/);
  assert.match(harness, /<SiteHeader active="harness" \/>/);
  assert.match(paper, /<SiteHeader active="paper" \/>/);
  assert.match(detail, /<SiteHeader variant="detail" \/>/);
});

test("top navigation exposes one directory entry while categories remain on the directory page", async () => {
  const header = await readFile(new URL("src/components/site-header.tsx", root), "utf8");
  const directory = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  assert.match(header, /label: "Explore", href: "#explore"/);
  assert.doesNotMatch(header, /label: "Categories"/);
  assert.match(directory, /id="categories"/);
});

test("homepage navigation and destination links open in a new tab", async () => {
  const directory = await readFile(new URL("src/components/plugin-directory.tsx", root), "utf8");
  const header = await readFile(new URL("src/components/site-header.tsx", root), "utf8");
  assert.match(directory, /<SiteHeader variant="home" openLinksInNewTab \/>/);
  assert.match(directory, /<Link className="promo-card promo-card-harness" href="\/harness" target="_blank"/);
  assert.match(directory, /<Link className="promo-card promo-card-paper" href="\/paper" target="_blank"/);
  assert.match(directory, /<Link className="plugin-row" href=\{`\/plugins\/\$\{plugin\.owner\}\/\$\{plugin\.repo\}`} target="_blank"/);
  assert.match(header, /openLinksInNewTab\?: boolean/);
  assert.match(header, /target=\{openLinksInNewTab \? "_blank" : undefined\}/);
});

test("the Harness page presents installation before the English product overview", async () => {
  const page = await readFile(new URL("src/app/harness/page.tsx", root), "utf8").catch(() => "");
  const content = await readFile(new URL("src/content/deepseek-harness.ts", root), "utf8").catch(() => "");
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
  const page = await readFile(new URL("src/app/paper/page.tsx", root), "utf8").catch(() => "");
  const content = await readFile(new URL("src/content/cordis-paper.ts", root), "utf8").catch(() => "");
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

test("editorial pages expose responsive diagrams and reduced-motion support", async () => {
  const harness = await readFile(new URL("src/app/harness/page.tsx", root), "utf8");
  const paper = await readFile(new URL("src/app/paper/page.tsx", root), "utf8");
  const css = await readFile(new URL("src/app/globals.css", root), "utf8");
  assert.match(harness, /architecture-map/);
  assert.match(paper, /composability-axis/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(css, /\.footer span \+ span/);
  assert.match(css, /\.chapter \+ \.chapter \{ border-top: 0; \}/);
  assert.match(css, /prefers-reduced-motion/);
});
