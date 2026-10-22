import { NextResponse } from "next/server";
import { errorPayload, getSessionUser, getUnreadSummary } from "@/features/connections";

// GET /api/messages/unread -> badge counts for the sidebar/nav
export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const unread = await getUnreadSummary(user.id);
    return NextResponse.json(unread, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    const { status, body } = errorPayload(error);
    return NextResponse.json(body, { status });
  }
}
