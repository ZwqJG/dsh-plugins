import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyButton from "@/components/copy-button";
import SiteHeader from "@/components/site-header";
import { categories, getPlugin, plugins } from "@/lib/plugins";

type Props = { params: Promise<{ owner: string; repo: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return plugins.map((plugin) => ({ owner: plugin.owner, repo: plugin.repo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { owner, repo } = await params;
  const plugin = getPlugin(owner, repo);
  return plugin ? { title: `${plugin.repo} — DSH Plugins`, description: plugin.description } : { title: "Plugin not found — DSH Plugins" };
}

export default async function PluginPage({ params }: Props) {
  const { owner, repo } = await params;
  const plugin = getPlugin(owner, repo);
  if (!plugin) notFound();
  const category = categories.find((item) => item.slug === plugin.category);

  return <div className="site-shell">
    <SiteHeader variant="detail" />
    <main className="detail-shell">
      <Link className="back-link" href="/">← All plugins</Link>
      <section className="detail-header"><div className="eyebrow">{plugin.status} · GitHub data</div><h1>{plugin.repo}</h1><p className="detail-description">{plugin.description}</p><div className="detail-tags"><span className="tag primary">{category?.name ?? "Other"}</span>{plugin.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></section>
      <div className="detail-grid">
        <div>
          <section className="detail-section"><h2>GitHub repository</h2><div className="copy-row"><code>{plugin.githubUrl}</code><CopyButton value={plugin.githubUrl} /></div><a className="github-link" href={plugin.githubUrl} target="_blank" rel="noopener noreferrer">Open on GitHub ↗</a></section>
          <section className="detail-section"><h2>Install</h2>{plugin.install ? <div className="copy-row"><code>{plugin.install}</code><CopyButton value={plugin.install} /></div> : <p className="detail-copy">No verified install command was found in the synced repository metadata. Check the GitHub README for installation instructions.</p>}</section>
          <section className="detail-section"><h2>About this plugin</h2><p className="detail-copy">This plugin is indexed from the public GitHub repository and tagged automatically from its repository name, description, and topics. Check the repository README before using it in production.</p></section>
        </div>
        <aside><section className="detail-section"><h2>Repository facts</h2><dl className="stat-list"><div className="stat-item"><dt>Owner</dt><dd>{plugin.owner}</dd></div><div className="stat-item"><dt>Language</dt><dd>{plugin.language}</dd></div><div className="stat-item"><dt>Stars</dt><dd>★ {plugin.stars}</dd></div><div className="stat-item"><dt>Category</dt><dd>{category?.name ?? "Other"}</dd></div><div className="stat-item"><dt>Status</dt><dd>{plugin.status}</dd></div></dl></section></aside>
      </div>
    </main>
    <footer className="footer"><span>DSH Plugins · an independent community index</span><span>Data source: GitHub snapshot</span></footer>
  </div>;
}
