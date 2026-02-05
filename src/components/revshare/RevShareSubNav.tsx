import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const subPages = [
  { label: "Dashboard", path: "/revshare/dashboard" },
  { label: "Organization", path: "/revshare/organization" },
  { label: "Org Tree", path: "/revshare/organization-tree" },
  { label: "Trends", path: "/revshare/trends" },
];

export function RevShareSubNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-4 lg:hidden scrollbar-hide">
      {subPages.map((page) => {
        const isActive = location.pathname === page.path;
        return (
          <button
            key={page.path}
            onClick={() => navigate(page.path)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {page.label}
          </button>
        );
      })}
    </div>
  );
}
