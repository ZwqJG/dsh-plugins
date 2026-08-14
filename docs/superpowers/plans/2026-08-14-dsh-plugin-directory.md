# DSH Plugins 技术方案与实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个从 GitHub 自动同步 `dsh-plugin` 仓库、支持分类浏览和搜索、并提供插件详情与复制功能的 DeepSeek Harness 插件目录网站。

**Architecture:** 使用 Next.js 提供首页、分类结果页和插件详情页；服务端定时同步 GitHub 数据到 PostgreSQL，并在写入时自动分类和计算状态。前端只读取本地数据库/API，避免把 GitHub 限流和延迟暴露给用户；PostgreSQL 全文检索在当前约千级仓库量下足够，暂不引入独立搜索服务。

**Tech Stack:** Next.js（App Router）+ TypeScript、Tailwind CSS、Neon PostgreSQL、Drizzle ORM、PostgreSQL full-text search、GitHub REST API、Vercel Functions 与 Vercel Cron。

---

## 1. 架构决策

### 1.1 推荐架构

```text
Browser
  ↓
Next.js pages / route handlers
  ↓
PostgreSQL ← GitHub sync job ← GitHub REST API
  ↓
Search, category counts, plugin detail data
```

选择服务端同步而不是浏览器直接调用 GitHub API，原因是：

- 搜索和分类列表的响应稳定，不受单个访客触发的 GitHub 限流影响。
- 可以保留上一次成功同步的可用数据，GitHub 临时异常不会使网站空白。
- 分类、活跃状态、搜索文本和 SEO 页面均可提前生成。
- 当前约千级数据量使用 PostgreSQL 即可，不需要 Algolia、Meilisearch 或 Elasticsearch。

### 1.2 同步节奏

- 每 6 小时执行一次增量同步。
- 首次同步分页读取 `topic:dsh-plugin` 的全部公开仓库。
- 后续同步按 GitHub `updated` 排序扫描全部分页；只有 `pushed_at`、`updated_at` 或默认分支 SHA 变化的仓库才重新读取 README。
- 每次同步写入 `sync_runs` 日志；发生速率限制、网络错误或解析错误时，不删除旧数据。
- GitHub Token 仅放在服务端环境变量 `GITHUB_TOKEN`，前端永不读取。

### 1.3 自动归类规则

分类是确定性规则，不依赖大模型，以便结果稳定且可测试。规则优先级：

1. GitHub topics 的精确匹配。
2. README 标题、简介和安装段落中的关键词。
3. 仓库文件信号，例如 `plugin.json`、`SKILL.md`、`package.json`、Python entrypoint。
4. 没有命中时归入“其他”。

一个仓库可以拥有多个分类；得分最高者是主分类。规则配置保存在代码库中，变更后重新运行分类即可，不需要人工逐条审核。

### 1.4 海外部署方案

**首选：Vercel + Neon PostgreSQL。**

- Vercel 原生运行 Next.js 的 App Router、Route Handlers、SSR、ISR 和静态页面；全球访问优先命中边缘缓存，动态页面和数据库查询回源到同一区域的 Serverless Function。
- Neon 使用托管 PostgreSQL，保留本方案需要的全文检索、索引、事务和 Drizzle ORM 兼容性；数据库与 Vercel Function 选择同一美国东海岸区域，初期推荐 `iad1`（Washington, D.C.），减少动态请求的跨区域延迟。
- GitHub 同步端点通过 Vercel Cron 每 6 小时调用一次。Cron 时间为 UTC，端点使用 `CRON_SECRET` 验证，并用数据库锁和幂等 upsert 防止重复触发。
- 面向海外用户的首页、分类页和详情页均设置缓存；GitHub 同步结束后按需失效相关页面缓存。

**Vercel 套餐约束：**Hobby 计划的 Cron 最多每天运行一次，不能满足 6 小时同步。生产版应使用支持分钟级 Cron 的 Vercel 付费计划；如果第一阶段必须使用免费计划，则用 GitHub Actions 每 6 小时请求受 `CRON_SECRET` 保护的同步端点，并接受调度可能延迟的风险。

**Cloudflare 备选：Cloudflare Workers + OpenNext + Neon PostgreSQL。**

- Cloudflare Workers 可通过 OpenNext 运行 Next.js，并支持 App Router、Route Handlers、SSR、ISR 和 Cron Trigger。
- 该路线需要 `@opennextjs/cloudflare`、Wrangler 和 `nodejs_compat`，构建与排障复杂度高于 Vercel。
- Cloudflare Cron Trigger 适合作为同步调度器；数据库仍建议使用 Neon PostgreSQL，而非 D1，以保留本方案的 PostgreSQL 全文检索和 Drizzle 查询能力。
- 只有当网站访问量明显增长、全球边缘动态运行成本成为主要问题，或团队已经以 Workers 为主时，再切换/采用此方案。

## 2. 数据模型

### 2.1 主要表

| 表 | 关键字段 | 作用 |
| --- | --- | --- |
| `plugins` | `id`, `github_id`, `owner`, `repo`, `description`, `readme`, `stars`, `language`, `license`, `pushed_at`, `status`, `search_vector` | 一个 GitHub 仓库一条记录，保存展示与检索字段。 |
| `categories` | `id`, `slug`, `name`, `position` | 固定的 12 个首页分类。 |
| `plugin_categories` | `plugin_id`, `category_id`, `score`, `is_primary` | 支持一对多分类和主分类。 |
| `plugin_tags` | `plugin_id`, `tag` | GitHub topic 与自动提取的能力标签。 |
| `sync_runs` | `id`, `started_at`, `finished_at`, `status`, `discovered_count`, `updated_count`, `error_summary` | 同步可观测性与数据新鲜度。 |

### 2.2 `plugins` 必需字段

```ts
type PluginStatus = "active" | "new" | "popular" | "archived" | "unclear" | "unavailable";

type PluginRecord = {
  id: string;
  githubId: number;
  owner: string;
  repo: string;
  githubUrl: string;
  description: string | null;
  readme: string | null;
  installationCommand: string | null;
  stars: number;
  forks: number;
  language: string | null;
  license: string | null;
  archived: boolean;
  pushedAt: Date | null;
  githubUpdatedAt: Date | null;
  lastSyncedAt: Date;
  status: PluginStatus;
};
```

`github_id` 必须唯一；仓库重命名时用该字段识别同一个仓库。`github_url` 由 `owner/repo` 构造并在写入时校验为 `https://github.com/<owner>/<repo>`，不接受任意外部地址。

## 3. 前端页面与接口

### 3.1 页面

| 路由 | 目的 | 数据 |
| --- | --- | --- |
| `/` | 搜索、12 个分类卡片、当前分类前 20 个插件 | 分类计数、默认/URL 指定分类的结果。 |
| `/categories/[slug]` | 某分类全部结果 | 分页结果、排序、查询参数。 |
| `/plugins/[owner]/[repo]` | 独立插件详情 | 插件、分类、标签、README 摘要、相关插件。 |

首页分类参数为 `/?category=agent-automation&sort=trending`；搜索参数为 `/?q=browser&category=web-ui`。参数必须白名单校验，未知分类回退到默认分类或全部结果。

### 3.2 服务端接口

| 接口 | 作用 | 缓存策略 |
| --- | --- | --- |
| `GET /api/plugins` | 搜索、分类、排序和分页 | 60 秒响应缓存；同步完成后失效。 |
| `GET /api/plugins/[owner]/[repo]` | 给详情页或客户端交互读取单插件数据 | 5 分钟缓存。 |
| `POST /api/internal/sync` | Cron 触发同步 | 仅 `CRON_SECRET` Bearer Token 可调用。 |
| `GET /api/health` | 部署与监控检查 | 返回数据库连通性和最近一次成功同步时间。 |

优先在 Server Components 中直查数据库；上述 API 只在需要客户端增量筛选、外部监控或 Cron 触发时使用。这样避免为内部页面无意义地多一层 HTTP 请求。

### 3.3 首页交互

```text
加载首页
  → 渲染搜索栏和全部 12 个分类
  → 用户点击分类
  → 更新 category URL 参数
  → 查询该分类排序前 20 个插件
  → 用户点击插件行
  → 跳转 /plugins/[owner]/[repo]
```

- 12 个分类始终可见，当前项使用黑底白字。
- 首页结果永远最多 20 条；总数大于 20 时才显示“查看更多（剩余数量）”。
- 列表行包含：名称、作者、简介、主分类、辅助标签、语言、Stars、状态。
- 详情页使用 Clipboard API 复制 GitHub 地址和安装命令；如果权限拒绝，显示可选中文本和失败提示。

## 4. 文件结构

```text
src/
  app/
    page.tsx
    categories/[slug]/page.tsx
    plugins/[owner]/[repo]/page.tsx
    api/plugins/route.ts
    api/plugins/[owner]/[repo]/route.ts
    api/internal/sync/route.ts
    api/health/route.ts
  components/
    search-bar.tsx
    category-grid.tsx
    plugin-list.tsx
    plugin-list-row.tsx
    copy-button.tsx
    plugin-detail.tsx
  db/
    schema.ts
    client.ts
    queries.ts
  lib/
    github/client.ts
    github/sync.ts
    classification/rules.ts
    classification/classify.ts
    plugin-status.ts
    validation.ts
  styles/
    globals.css
scripts/
  sync-plugins.ts
tests/
  unit/classify.test.ts
  unit/plugin-status.test.ts
  unit/validation.test.ts
  integration/github-sync.test.ts
  e2e/plugin-directory.spec.ts
drizzle/
  0000_initial_schema.sql
```

每个模块只承担一个边界：`github` 只处理 GitHub 请求和转换，`classification` 只处理分类，`db` 只处理持久化，页面组件不直接调用 GitHub。

## 5. 安全、可靠性与性能

- 用服务端 Token 访问 GitHub；Token 不写进构建产物、浏览器环境变量或日志。
- `/api/internal/sync` 使用恒定时间比较的 secret 校验，并限制请求体大小为零；它不接收用户提供的仓库 URL。
- 所有 GitHub README 以纯文本形式存储/渲染，禁止直接注入 HTML，防止 XSS。
- 限制搜索查询长度为 100 字符、页码为正整数、每页最大 50 条。
- 数据库查询按 `category_id`、`pushed_at`、`stars` 和全文检索字段建立索引。
- 首页使用服务端缓存与按需失效；详情页采用 ISR/缓存重验证。
- GitHub 失败时使用上次成功数据，并在页面底部显示“数据最近同步于 …”。

## 6. 交付阶段

### Task 1: 初始化应用、样式和环境配置

**Files:**
- Create: `package.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/styles/globals.css`
- Create: `.env.example`

- [ ] 创建 Next.js + TypeScript 项目，并只安装 Next.js、React、Drizzle、PostgreSQL 驱动、Tailwind 与测试依赖。
- [ ] 在 `.env.example` 写入且仅写入下列变量名：

```dotenv
DATABASE_URL=
GITHUB_TOKEN=
CRON_SECRET=
```

- [ ] 建立黑白基础样式：白色页面背景、黑色文本与主要按钮、灰色边框；不引入渐变或彩色状态条。
- [ ] 运行 `npm run lint`、`npm run typecheck` 和 `npm test`，初始项目均应通过。

### Task 2: 建立 PostgreSQL schema 与迁移

**Files:**
- Create: `src/db/schema.ts`
- Create: `src/db/client.ts`
- Create: `drizzle/0000_initial_schema.sql`
- Test: `tests/integration/database-schema.test.ts`

- [ ] 编写数据库 schema，创建 `plugins`、`categories`、`plugin_categories`、`plugin_tags` 和 `sync_runs`。
- [ ] 为 `plugins.github_id` 建唯一索引；为 `plugin_categories(category_id, plugin_id)`、`plugins(stars DESC)` 和 `plugins(pushed_at DESC)` 建查询索引。
- [ ] 插入 12 个固定分类，`position` 为 1 至 12，slug 与产品文档分类名称一一对应。
- [ ] 测试重复 `github_id` 写入失败、一个插件可关联多个分类、每个分类能统计插件数。
- [ ] 运行迁移和数据库集成测试。

### Task 3: 实现 GitHub 客户端和同步任务

**Files:**
- Create: `src/lib/github/client.ts`
- Create: `src/lib/github/sync.ts`
- Create: `scripts/sync-plugins.ts`
- Test: `tests/integration/github-sync.test.ts`

- [ ] 实现 `searchRepositories(page)`，调用 GitHub Search API：

```ts
const query = new URLSearchParams({
  q: "topic:dsh-plugin is:public",
  sort: "updated",
  order: "desc",
  per_page: "100",
  page: String(page),
});
```

- [ ] 实现 `fetchReadme(owner, repo)`；返回 `null` 表示 README 不存在，429/5xx 抛出可重试错误，404 只标记该 README 缺失。
- [ ] 以 `github_id` upsert 仓库，解析后的 README 仅在仓库更新时间变化时重新读取。
- [ ] 每次同步在 `sync_runs` 写入 `running`、`success` 或 `failed` 状态及统计数据。
- [ ] 用 mock GitHub 响应测试分页、重复仓库 upsert、缺失 README、速率限制失败后旧记录保留。

### Task 4: 实现分类、标签、状态和安装命令提取

**Files:**
- Create: `src/lib/classification/rules.ts`
- Create: `src/lib/classification/classify.ts`
- Create: `src/lib/plugin-status.ts`
- Create: `src/lib/validation.ts`
- Test: `tests/unit/classify.test.ts`
- Test: `tests/unit/plugin-status.test.ts`
- Test: `tests/unit/validation.test.ts`

- [ ] 在 `rules.ts` 为每个固定分类定义 topic 和 README 关键词，例如 `agent`、`workflow`、`automation` 映射到 `agent-automation`。
- [ ] 实现 `classifyPlugin(input): ClassificationResult[]`：返回至少一个分类；命中分数最高者 `isPrimary: true`；无命中返回 `other`。
- [ ] 实现状态规则：归档仓库为 `archived`，新发现 30 天内为 `new`，达到 Stars 阈值为 `popular`，近期有 push 为 `active`，无明确使用信号为 `unclear`；按此顺序输出单一展示状态。
- [ ] 从 README 的 fenced code block 提取首个含 `dsh plugin install` 的命令；没有时返回 `null`，不可猜测命令。
- [ ] 单元测试要覆盖多分类、无匹配、归档优先级、README 无安装命令和危险 URL 拒绝。

### Task 5: 实现查询层与搜索

**Files:**
- Create: `src/db/queries.ts`
- Create: `src/app/api/plugins/route.ts`
- Create: `src/app/api/plugins/[owner]/[repo]/route.ts`
- Test: `tests/integration/plugin-query.test.ts`

- [ ] 实现 `getCategorySummaries()`，按固定 `position` 返回全部 12 个分类和插件数，零结果分类也必须返回。
- [ ] 实现 `listPlugins({ category, q, sort, limit, offset })`，首页固定传 `limit: 20`；搜索匹配名称、简介、README 和标签。
- [ ] 允许 `trending`、`popular`、`recently-updated`、`recently-added` 四种排序；未知值回退到 `trending`。
- [ ] 实现 `getPluginBySlug(owner, repo)` 和 `getRelatedPlugins(pluginId)`；相关插件优先共享分类和标签。
- [ ] 测试分类计数、20 条上限、第 21 条的剩余数量、中文/英文搜索、未知分类和不存在插件返回 404。

### Task 6: 实现首页、分类全量页和详情页

**Files:**
- Create: `src/components/search-bar.tsx`
- Create: `src/components/category-grid.tsx`
- Create: `src/components/plugin-list.tsx`
- Create: `src/components/plugin-list-row.tsx`
- Create: `src/components/copy-button.tsx`
- Create: `src/components/plugin-detail.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/categories/[slug]/page.tsx`
- Create: `src/app/plugins/[owner]/[repo]/page.tsx`
- Test: `tests/e2e/plugin-directory.spec.ts`

- [ ] 首页依次渲染搜索栏、全部 12 个分类卡片和当前分类的结果；分类选择写入 `category` 查询参数。
- [ ] 分类卡片采用黑白风格，当前项黑底白字，其他项白底灰边框；分类区在列表切换、搜索和返回首页时始终可见。
- [ ] 结果行显示插件名/作者、一行简介、主分类、辅助标签、语言、Stars 和状态；点击行进入 `/plugins/[owner]/[repo]`。
- [ ] 分类超过 20 条时显示“查看更多（剩余数量）”，链接到 `/categories/[slug]`；不超过 20 条时不渲染该按钮。
- [ ] 详情页显示 GitHub 地址、可解析的安装命令、README 摘要、数据字段和相关插件；`CopyButton` 使用 `navigator.clipboard.writeText`，失败时显示手动复制提示。
- [ ] Playwright 覆盖分类点击 URL 更新、分类始终可见、20 条限制、查看更多、列表跳详情、复制成功和复制降级提示。

### Task 7: 接入 Cron、健康检查、监控和 Vercel 部署

**Files:**
- Create: `src/app/api/internal/sync/route.ts`
- Create: `src/app/api/health/route.ts`
- Create: `vercel.json`
- Create: `.github/workflows/sync-plugins.yml`（仅免费计划的 Cron 备选）
- Create: `README.md`
- Test: `tests/integration/sync-route.test.ts`

- [ ] `/api/internal/sync` 只接受 `Authorization: Bearer <CRON_SECRET>`；无效或缺失时返回 401，不执行同步。
- [ ] 健康检查返回 `{ database: "ok", lastSuccessfulSyncAt: string | null }`；数据库不可用返回 503。
- [ ] 在 `vercel.json` 配置 UTC Cron：`0 */6 * * *` 调用 `/api/internal/sync`；在同步开始处获取数据库锁，并使重复请求成为幂等操作。
- [ ] 将 Vercel Function 与 Neon PostgreSQL 放在同一美国东海岸区域；首页、分类页和详情页采用缓存，数据同步成功后失效对应缓存。
- [ ] 如果部署使用 Vercel Hobby 计划，改用 `.github/workflows/sync-plugins.yml` 每 6 小时调用同步端点；此文件不能与 `vercel.json` Cron 同时启用。
- [ ] `README.md` 记录本地启动、迁移、手工同步、Vercel/Neon 环境变量、Cron 配置、GitHub 限流排查和 Cloudflare OpenNext 迁移条件。
- [ ] 执行完整质量门：`npm run lint`、`npm run typecheck`、`npm test`、`npx playwright test`、生产构建。

## 7. 验证清单

- 首次同步能写入 `topic:dsh-plugin` 的公开仓库，并对 GitHub `github_id` 去重。
- 无 GitHub Token、Token 失效、限流、README 404 和 API 5xx 都不会使前台丢失上次成功数据。
- 首页始终显示 12 个分类；分类切换不会移除分类区。
- 首页单分类只显示前 20 条；超过时准确显示剩余数量。
- 每条列表项含简介与分类标签；详情页可复制 GitHub 地址和可用安装命令。
- URL 只接受白名单分类/排序值；GitHub 内容不以 HTML 注入页面。

## 8. 明确推迟的能力

- 用户登录、收藏、评论、评分。
- 插件提交、人工审核、作者认领。
- 自建全文搜索集群。
- 站内安装和插件代码托管。
- 安全扫描结论或“官方认证”标识。
