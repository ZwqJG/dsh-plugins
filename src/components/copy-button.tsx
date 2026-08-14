"use client";

import { useState } from "react";

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setFailed(true);
      setCopied(false);
    }
  }

  return <button className={`copy-button ${copied ? "is-copied" : ""}`} onClick={copy} type="button">{copied ? "Copied" : failed ? "Select & copy" : "Copy"}</button>;
}
