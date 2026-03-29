'use client';

import Link from 'next/link';
import { BarChart3, ChevronRight, Shield, Users } from 'lucide-react';

const links = [
  {
    href: '/admin/users',
    title: 'Users & sanctions',
    description: 'Search accounts, bulk actions, warnings and suspensions.',
    icon: Users,
    accent: 'from-indigo-500 to-violet-600',
  },
  {
    href: '/admin/system',
    title: 'System & statistics',
    description: 'Aggregated metrics, report queue health, service checks.',
    icon: BarChart3,
    accent: 'from-sky-500 to-cyan-600',
  },
] as const;

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="mb-10 flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white shadow-lg shadow-indigo-500/25">
            <Shield className="h-7 w-7" aria-hidden />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Admin
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage users and review platform health. Access is restricted to administrators.
            </p>
          </div>
        </div>

        <ul className="space-y-3">
          {links.map(({ href, title, description, icon: Icon, accent }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex items-center gap-4 rounded-2xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:border-indigo-200 hover:shadow-md"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow-md`}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-semibold text-foreground">{title}</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
