"use client";

import Link from "next/link";
import { LayoutDashboard, Users, Home, Activity } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Live Rooms", href: "/admin/live-rooms", icon: Activity },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Rooms", href: "/admin/rooms", icon: Home },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-neutral-800 bg-neutral-900">
      <div className="p-6 text-lg font-semibold">ShareHut Admin</div>
      <nav className="space-y-1 px-3">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition
                ${
                  active
                    ? "bg-neutral-800 text-white"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                }`}
            >
              <Icon size={16} />
              {link.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
