"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, Search, FileText,
  BarChart3, Bookmark, Settings, LogOut, Heart, Presentation,
  MessageSquare, Users, Trophy, Compass, ShieldCheck,
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useUnreadBadges } from "./use-unread-badges";

type Role = "startup" | "investor" | "admin";

const navItems: { label: string; href: string; icon: typeof LayoutDashboard; roles?: Role[]; badge?: "messages" | "requests" }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["startup", "investor"] },
  { label: "Discover", href: "/discover", icon: Compass, roles: ["startup"] },
  { label: "Pitch Deck Requests", href: "/admin/pitch-decks", icon: Presentation, roles: ["admin"] },
  { label: "Impact Review", href: "/admin/impact", icon: ShieldCheck, roles: ["admin"] },
  { label: "Explore", href: "/explore", icon: Search },
  { label: "Competitions", href: "/competitions", icon: Trophy },
  { label: "Investors", href: "/investors", icon: Users },
  { label: "Rankings", href: "/rankings", icon: BarChart3 },
  { label: "Interests", href: "/interests", icon: Heart, badge: "requests" },
  { label: "Messages", href: "/messages", icon: MessageSquare, badge: "messages" },
  { label: "My Pitch Decks", href: "/pitch-decks", icon: Presentation, roles: ["startup"] },
  { label: "My Decks", href: "/deck", icon: FileText, roles: ["startup"] },
  { label: "Saved", href: "/saved", icon: Bookmark, roles: ["investor"] },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const badges = useUnreadBadges(role !== "admin");
  const items = navItems.filter((i) => !i.roles || i.roles.includes(role));

  return (
    <aside aria-label="Platform navigation" className="hidden md:flex flex-col w-48 border-r border-[var(--border)] min-h-screen shrink-0">
      <div className="px-3 h-12 flex items-center justify-between border-b border-[var(--border)]">
        <Link href={role === "admin" ? "/admin" : "/dashboard"} className="text-sm font-semibold">
          VultureX
        </Link>
        <NotificationBell />
      </div>
      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const count =
            item.badge === "messages"
              ? badges.messages
              : item.badge === "requests"
                ? badges.pendingRequests
                : 0;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-2.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                active
                  ? "text-[var(--text)] bg-[var(--bg-elevated)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <item.icon size={14} />
              <span className="flex-1 truncate">{item.label}</span>
              {count > 0 && (
                <span
                  className="min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--accent)] text-[#171717] text-[9px] font-bold flex items-center justify-center tabular-nums"
                  aria-label={`${count} unread`}
                >
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="px-2 py-3 border-t border-[var(--border)]">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2.5 px-3 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] rounded-md transition-colors w-full"
        >
          <LogOut size={14} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
