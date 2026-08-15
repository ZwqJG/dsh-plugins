# DSH Plugins

DeepSeek Harness plugin directory MVP.

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub topic data sync

The checked-in dataset is generated from the public GitHub `dsh-plugin` topic. Refresh it locally with:

```bash
npm run sync:github
```

Without `GITHUB_TOKEN`, GitHub Search API allows up to ten searches per minute. The script therefore syncs the first 1,000 matching repositories, which is GitHub Search API's maximum result window. Add `GITHUB_TOKEN` to `.env.local` before running the script to use authenticated API limits; a future Neon integration will support complete incremental syncing beyond the static snapshot.

### Automated schedule

`.github/workflows/sync-github-plugins.yml` runs on the default branch every day at 10:00 Asia/Shanghai (02:00 UTC). A second run at 10:30 Asia/Shanghai is the compensation trigger for a delayed or missed primary run. Each run retries the GitHub request up to three times with backoff, and the workflow can also be started manually from the GitHub Actions tab.

When the generated snapshot changes, the workflow commits and pushes `src/data/github-plugins.json` with the GitHub Actions bot. If there are no changes, it exits without creating a commit.

## Deployment

The current static snapshot deploys to Vercel normally. GitHub Actions refreshes the checked-in JSON before a new deployment is picked up. The protected internal sync route remains intentionally disabled until a persistent Neon-backed sync is implemented, because a Vercel Function cannot permanently rewrite the deployed JSON file.
