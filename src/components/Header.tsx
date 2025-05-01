
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const mainNavItems = [
    { name: "Research", path: "/research" },
    { name: "Consulting", path: "/consulting" },
    { name: "Training", path: "/training" },
    { name: "Insights", path: "/insights" },
    { name: "Careers", path: "/careers" },
  ];

  const secondaryNavItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top Navigation Bar with Logo */}
      <div className="container flex h-16 max-w-7xl items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
              alt="Trizen Logo" 
              className="h-14" 
            />
          </Link>
        </div>

        {/* Top Nav - Main Items */}
        <nav className="hidden lg:flex items-center gap-6">
          {mainNavItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="text-sm mr-2">Hello, {user?.name || user?.email}</span>
              <Button variant="outline" size="sm" onClick={logout}>Logout</Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => navigate('/login')}>Login</Button>
              <Button size="sm" onClick={() => navigate('/signup')}>Signup</Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            {isMenuOpen 
              ? <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>
              : <><line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line></>
            }
          </svg>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="container hidden lg:block max-w-7xl">
        <nav className="flex h-10 items-center justify-center">
          {secondaryNavItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className="px-4 text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container lg:hidden py-4 flex flex-col gap-4 border-t">
          {/* Main Nav Items for Mobile */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground px-2">Main Navigation</h4>
            {mainNavItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="block text-sm font-medium px-2 py-1"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="space-y-3 pt-2 border-t">
            <h4 className="text-sm font-semibold text-muted-foreground px-2">Quick Links</h4>
            {secondaryNavItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path} 
                className="block text-sm font-medium px-2 py-1"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex flex-col gap-2 pt-2 border-t">
            {isAuthenticated ? (
              <>
                <span className="text-sm px-2 py-1">Hello, {user?.name || user?.email}</span>
                <Button variant="outline" size="sm" className="w-full" onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/login')}>Login</Button>
                <Button size="sm" className="w-full" onClick={() => navigate('/signup')}>Signup</Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
