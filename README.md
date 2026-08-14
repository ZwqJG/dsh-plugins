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

## Deployment

The planned production target is Vercel + Neon PostgreSQL. The current static snapshot deploys to Vercel normally. Enable the six-hour Vercel Cron only after the Neon persistence task is complete, since Vercel Functions cannot update the deployed JSON file permanently.
