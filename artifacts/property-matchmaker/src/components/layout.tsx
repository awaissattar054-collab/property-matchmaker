import { Link, useLocation } from "wouter";
import { Building2, MessageSquare, CalendarDays, BarChart3, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [location] = useLocation();

  const navigation = [
    { name: "AI Assistant", href: "/", icon: MessageSquare },
    { name: "Properties", href: "/properties", icon: Building2 },
    { name: "My Visits", href: "/visits", icon: CalendarDays },
    { name: "Market Stats", href: "/stats", icon: BarChart3 },
  ];

  const NavLinks = () => (
    <div className="flex flex-col gap-2">
      {navigation.map((item) => {
        const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        const Icon = item.icon;
        
        return (
          <Link key={item.name} href={item.href}>
            <span
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium shadow-sm hover-elevate"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 text-primary font-serif font-bold text-xl">
            <Building2 className="h-6 w-6" />
            <span>Estate AI</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Premium Property Matchmaker</p>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLinks />
        </nav>
      </aside>

      {/* Mobile Header & Sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2 text-primary font-serif font-bold text-lg">
            <Building2 className="h-5 w-5" />
            <span>Estate AI</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader className="text-left border-b border-border pb-4 mb-4">
                <SheetTitle className="flex items-center gap-2 text-primary font-serif font-bold">
                  <Building2 className="h-5 w-5" />
                  Estate AI
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
