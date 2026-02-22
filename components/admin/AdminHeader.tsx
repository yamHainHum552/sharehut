"use client";

export default function AdminHeader() {
  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-900 flex items-center justify-between px-6">
      <h1 className="text-sm text-neutral-400">Super Admin Dashboard</h1>
      <div className="text-xs text-neutral-500">ShareHut Control Panel</div>
    </header>
  );
}
