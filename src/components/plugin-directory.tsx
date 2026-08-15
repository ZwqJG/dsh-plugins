"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "@/components/site-header";
import { categories, categoryCounts, plugins } from "@/lib/plugins";
import { sortPlugins, type SortOption } from "@/lib/plugin-sort";

const PAGE_SIZE = 20;

function categoryFromUrl() {
  const category = new URLSearchParams(window.location.search).get("category");
  return categories.some((item) => item.slug === category) ? category : null;
}

export default function PluginDirectory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sort, setSort] = useState<SortOption>("trending");

  useEffect(() => {
    const syncCategory = () => setSelectedCategory(categoryFromUrl());
    syncCategory();
    window.addEventListener("popstate", syncCategory);
    return () => window.removeEventListener("popstate", syncCategory);
  }, []);

  const filteredPlugins = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return plugins.filter((plugin) => {
      const matchesCategory = !selectedCategory || plugin.category === selectedCategory;
      const haystack = [plugin.repo, plugin.owner, plugin.description, plugin.category, ...plugin.tags].join(" ").toLowerCase();
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [query, selectedCategory]);

  const sortedPlugins = useMemo(() => sortPlugins(filteredPlugins, sort), [filteredPlugins, sort]);
  const visiblePlugins = sortedPlugins.slice(0, visibleCount);
  const selectedName = categories.find((category) => category.slug === selectedCategory)?.name ?? "All plugins";
  const remaining = Math.max(sortedPlugins.length - visibleCount, 0);

  function selectCategory(slug: string) {
    const next = selectedCategory === slug ? null : slug;
    setSelectedCategory(next);
    setVisibleCount(PAGE_SIZE);
    const params = new URLSearchParams(window.location.search);
    if (next) params.set("category", next); else params.delete("category");
    window.history.pushState({}, "", `${window.location.pathname}${params.size ? `?${params}` : ""}`);
  }

  function updateQuery(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <>
      <SiteHeader variant="home" openLinksInNewTab />

      <main className="main" id="explore">
        <section className="hero">
          <div>
            <div className="eyebrow">The plugin directory for DeepSeek Harness</div>
            <h1>Find the plugin for your next task.</h1>
            <p>Discover plugins for DeepSeek Harness (dsh), the open-source agent harness from DeepSeek AI.</p>
          </div>
          <label className="search" aria-label="Search plugins">
            <span aria-hidden="true">⌕</span>
            <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search by name, capability, or tag" />
            {query && <button type="button" aria-label="Clear search" onClick={() => updateQuery("")}>×</button>}
          </label>
        </section>

        <section className="promo-grid" aria-label="Featured reading">
          <Link className="promo-card promo-card-harness" href="/harness" target="_blank" rel="noopener noreferrer">
            <span className="promo-kicker">Harness guide</span>
            <strong>Install it. Then understand the runtime.</strong>
            <span>Quick start, Cordis architecture, traceable sessions, and four runtime modes.</span>
          </Link>
          <Link className="promo-card promo-card-paper" href="/paper" target="_blank" rel="noopener noreferrer">
            <span className="promo-kicker">Cordis paper</span>
            <strong>Why dynamic composition needs two dimensions.</strong>
            <span>An accessible guide to the design, guarantees, evidence, and boundaries.</span>
          </Link>
        </section>

        <section className="section" id="categories">
          <div className="section-head"><h2>Browse by category</h2><span className="section-meta">12 categories · {plugins.length} indexed plugins</span></div>
          <div className="category-grid">
            {categories.map((category) => (
              <button key={category.slug} type="button" className={`category-card ${selectedCategory === category.slug ? "is-selected" : ""}`} onClick={() => selectCategory(category.slug)} aria-pressed={selectedCategory === category.slug}>
                <span className="category-top"><span>{category.name}</span><span className="category-count">{categoryCounts[category.slug]}</span></span>
                <span className="category-description">{category.description}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="results section" aria-live="polite">
          <div className="results-head"><div><h2 className="results-title">{selectedName}</h2><span className="section-meta"> {filteredPlugins.length} plugins{selectedCategory ? " · selected category" : ""}</span></div><select className="sort" aria-label="Sort plugins" value={sort} onChange={(event) => setSort(event.target.value as SortOption)}><option value="trending">Sort: Trending</option><option value="popular">Sort: Popular</option><option value="recent">Sort: Recently updated</option></select></div>
          {visiblePlugins.length === 0 ? <div className="empty">No plugins match “{query}”. Try another capability or category.</div> : <>
            <div className="list-head"><span>PLUGIN</span><span>DESCRIPTION &amp; CATEGORY</span><span>LANGUAGE</span><span>STATS</span></div>
            {visiblePlugins.map((plugin) => <Link className="plugin-row" href={`/plugins/${plugin.owner}/${plugin.repo}`} target="_blank" rel="noopener noreferrer" key={`${plugin.owner}/${plugin.repo}`}>
              <div><div className="plugin-name">{plugin.repo}</div><div className="plugin-owner">{plugin.owner}</div></div>
              <div className="plugin-copy"><div className="plugin-description">{plugin.description}</div><span className="tag primary">{categories.find((category) => category.slug === plugin.category)?.name ?? "Other"}</span>{plugin.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
              <div className="plugin-copy">● {plugin.language}</div>
              <div className="plugin-stat">★ {plugin.stars}<br /><span>{plugin.status}</span></div>
            </Link>)}
            {remaining > 0 && <button className="view-more" type="button" onClick={() => setVisibleCount(sortedPlugins.length)}>View {remaining} more plugins</button>}
          </>}
        </section>

      </main>

      <footer className="footer" id="about"><span>DSH Plugins · an independent community index</span><span>Data source: GitHub dsh-plugin topic</span></footer>
    </>
  );
}
