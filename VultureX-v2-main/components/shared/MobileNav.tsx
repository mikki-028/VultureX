"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Compass,
  Heart,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Presentation,
  Search,
  Settings,
  ShieldCheck,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { NotificationBell } from "./NotificationBell";
import { useUnreadBadges } from "./use-unread-badges";

type Role = "startup" | "investor" | "admin";

export function MobileNav({ role }: { role: Role }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const badges = useUnreadBadges(role !== "admin");

  const items: { label: string; href: string; icon: typeof Heart; count?: number }[] =
    role === "admin"
      ? [
          { label: "Pitch Deck Requests", href: "/admin/pitch-decks", icon: Presentation },
          { label: "Impact Review", href: "/admin/impact", icon: ShieldCheck },
          { label: "Competitions", href: "/admin/competitions", icon: Trophy },
          { label: "Explore", href: "/explore", icon: Search },
          { label: "Settings", href: "/settings", icon: Settings },
        ]
      : [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          ...(role === "startup"
            ? [{ label: "Discover", href: "/discover", icon: Compass }]
            : []),
          { label: "Explore", href: "/explore", icon: Search },
          { label: "Competitions", href: "/competitions", icon: Trophy },
          { label: "Investors", href: "/investors", icon: Users },
          { label: "Interests", href: "/interests", icon: Heart, count: badges.pendingRequests },
          { label: "Messages", href: "/messages", icon: MessageSquare, count: badges.messages },
          { label: "Settings", href: "/settings", icon: Settings },
        ];

  return (
    <header className="md:hidden sticky top-0 z-50 bg-[var(--bg)]/95 backdrop-blur border-b border-[var(--border)]">
      <div className="h-12 px-4 flex items-center justify-between">
        <Link
          href={role === "admin" ? "/admin" : "/dashboard"}
          className="text-sm font-semibold"
          onClick={() => setOpen(false)}
        >
          VultureX
        </Link>
        <div className="flex items-center gap-1.5">
          <NotificationBell />
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--bg-elevated)] transition-colors"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="px-2 pb-3 pt-1 border-t border-[var(--border)] space-y-0.5">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs rounded-md transition-colors ${
                  active
                    ? "text-[var(--text)] bg-[var(--bg-elevated)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <item.icon size={14} />
                <span className="flex-1">{item.label}</span>
                {!!item.count && item.count > 0 && (
                  <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-[var(--accent)] text-[#171717] text-[9px] font-bold flex items-center justify-center tabular-nums">
                    {item.count > 9 ? "9+" : item.count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
