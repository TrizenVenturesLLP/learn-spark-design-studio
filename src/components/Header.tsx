
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
import { ChevronDown } from "lucide-react";

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

  const nestedNavItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
              alt="Trizen Logo" 
              className="h-14" 
            />
          </Link>
        </div>

        {/* Desktop Main Navigation */}
        <nav className="hidden lg:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              {mainNavItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuTrigger>{item.name}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4">
                      {nestedNavItems.map((subItem) => (
                        <li key={subItem.name}>
                          <NavigationMenuLink asChild>
                            <Link
                              to={subItem.path}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{subItem.name}</div>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
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

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="container lg:hidden py-4 flex flex-col gap-4 border-t">
          {/* Main Nav Items for Mobile */}
          {mainNavItems.map((item) => (
            <div key={item.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <Link to={item.path} className="text-sm font-medium px-2 py-1">{item.name}</Link>
                <ChevronDown className="h-4 w-4" />
              </div>
              <div className="pl-4 border-l border-gray-200 space-y-1">
                {nestedNavItems.map((subItem) => (
                  <Link key={subItem.name} to={subItem.path} className="text-sm font-medium px-2 py-1 block">{subItem.name}</Link>
                ))}
              </div>
            </div>
          ))}
          
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
