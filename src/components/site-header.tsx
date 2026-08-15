import Link from "next/link";

type PageKey = "harness" | "paper" | "faq";
type HeaderVariant = "home" | "feature" | "detail";

type SiteHeaderProps = {
  variant?: HeaderVariant;
  active?: PageKey;
  openLinksInNewTab?: boolean;
};

type NavItem =
  | { type: "page"; key: PageKey; label: string; href: string }
  | { type: "anchor"; label: string; href: string };

const pageItems: NavItem[] = [
  { type: "page", key: "harness", label: "Harness", href: "/harness" },
  { type: "page", key: "paper", label: "Paper", href: "/paper" },
];

const faqItem: NavItem = { type: "page", key: "faq", label: "FAQ", href: "/faq" };

const homeItems: NavItem[] = [
  { type: "anchor", label: "Explore", href: "#explore" },
  faqItem,
  ...pageItems,
  { type: "anchor", label: "About", href: "#about" },
];

const detailItems: NavItem[] = [
  ...pageItems,
  faqItem,
  { type: "anchor", label: "Explore", href: "/#explore" },
  { type: "anchor", label: "About", href: "/#about" },
];

const featureItems: NavItem[] = [
  ...pageItems,
  faqItem,
  { type: "anchor", label: "Explore", href: "/#explore" },
];

const itemsByVariant: Record<HeaderVariant, NavItem[]> = {
  home: homeItems,
  feature: featureItems,
  detail: detailItems,
};

export default function SiteHeader({ variant = "feature", active, openLinksInNewTab = false }: SiteHeaderProps) {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="DSH Plugins home" target={openLinksInNewTab ? "_blank" : undefined} rel={openLinksInNewTab ? "noopener noreferrer" : undefined}>
        <span className="brand-mark">DSH PLUGINS</span>
        <span className="brand-note">the DeepSeek Harness plugin index</span>
      </Link>
      <nav className="nav" aria-label="Main navigation">
        {itemsByVariant[variant].map((item) =>
          item.type === "page" ? (
            <Link key={item.href} href={item.href} target={openLinksInNewTab ? "_blank" : undefined} rel={openLinksInNewTab ? "noopener noreferrer" : undefined} aria-current={active === item.key ? "page" : undefined}>
              {item.label}
            </Link>
          ) : (
            <a key={item.href} href={item.href} target={openLinksInNewTab ? "_blank" : undefined} rel={openLinksInNewTab ? "noopener noreferrer" : undefined}>
              {item.label}
            </a>
          ),
        )}
      </nav>
    </header>
  );
}
