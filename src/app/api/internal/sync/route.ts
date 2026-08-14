import { NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");
  if (!secret || authorization !== `Bearer ${secret}`) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    ok: false,
    error: "Runtime sync requires database persistence. Run npm run sync:github during development or connect Neon PostgreSQL before enabling Vercel Cron.",
  }, { status: 501 });
}
