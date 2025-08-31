'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <Link
        href="/dashboard/admin/bibliotheque"
        className={`sidebar-link ${pathname === '/dashboard/admin/bibliotheque' ? 'active' : ''}`}
      >
        Bibliothèque Prix
      </Link>
    </div>
  );
}
