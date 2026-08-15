import type { Metadata } from "next";
import PluginDirectory from "@/components/plugin-directory";

export const metadata: Metadata = {
  title: "DSH Plugins — DeepSeek Harness Plugin Directory",
  description: "Discover plugins for DeepSeek Harness (dsh), the open-source agent harness from DeepSeek AI.",
};

export default function HomePage() {
  return <div className="site-shell"><PluginDirectory /></div>;
}
