import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  color?: string;
}

export default function Breadcrumbs({ items, color }: BreadcrumbsProps) {
  return (
    <nav
      className="flex items-center space-x-2 text-sm text-gray-600"
      style={color ? { color } : undefined}
    >
      {items.map((item, i) => (
        <div key={i} className="flex items-center space-x-2">
          {i > 0 && <ChevronRight className="w-4 h-4 opacity-50" />}
          {item.href ? (
            <Link
              to={item.href}
              className="hover:text-gray-900 transition-colors flex items-center gap-1"
              style={color ? { color } : undefined}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label && <span>{item.label}</span>}
            </Link>
          ) : (
            <span
              className="font-medium flex items-center gap-1"
              style={color ? { color } : undefined}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              {item.label && <span>{item.label}</span>}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
