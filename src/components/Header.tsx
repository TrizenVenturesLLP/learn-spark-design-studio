
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();

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
      {/* Top Navigation Bar with Logo and Main Nav Items */}
      <div className="container flex h-16 max-w-7xl items-center border-b">
        {/* Logo */}
        <div className="flex items-center mr-8">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
              alt="Trizen Logo" 
              className="h-14" 
            />
          </Link>
        </div>

        {/* Top Nav - Main Items */}
        <nav className="hidden lg:flex items-center">
          <div className="flex">
            {mainNavItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className="text-sm font-medium transition-colors hover:text-primary mr-6"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>

         {/* Spacer and Auth Buttons aligned right */}
        <div className="flex-1 flex justify-end items-center gap-2">
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

      {/* Bottom Navigation Bar - Secondary Links aligned left */}
      <div className="container hidden lg:block max-w-7xl">
        <nav className="flex h-10 items-center">
          <div className="flex">
            {secondaryNavItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className="text-sm font-medium transition-colors hover:text-primary mr-6"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container lg:hidden py-4 flex flex-col border-t">
          {/* Main Nav Items for Mobile - Now properly left-aligned */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Main Navigation</h4>
            <div className="flex flex-col">
              {mainNavItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className="text-sm font-medium py-2 text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 pt-4 mt-2 border-t">
            <h4 className="text-sm font-semibold text-muted-foreground">Quick Links</h4>
            <div className="flex flex-col">
              {secondaryNavItems.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className="text-sm font-medium py-2 text-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-4 mt-2 border-t">
            {isAuthenticated ? (
              <>
                <span className="text-sm py-2 text-left">Hello, {user?.name || user?.email}</span>
                <Button variant="outline" size="sm" className="mt-2" onClick={logout}>Logout</Button>
              </>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => { navigate('/login'); setIsMenuOpen(false); }}>Login</Button>
                <Button size="sm" onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}>Signup</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
