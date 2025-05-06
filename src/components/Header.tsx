
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("home");
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Primary navigation categories with their dropdown items
  const primaryNavCategories = [
    {
      name: "Research",
      path: "/research",
      items: [
        { name: "Research Papers", path: "/research/papers" },
        { name: "Case Studies", path: "/research/case-studies" },
        { name: "Publications", path: "/research/publications" }
      ]
    },
    {
      name: "Consulting",
      path: "/consulting",
      items: [
        { name: "Enterprise Solutions", path: "/consulting/enterprise" },
        { name: "Digital Transformation", path: "/consulting/transformation" },
        { name: "Process Optimization", path: "/consulting/optimization" }
      ]
    },
    {
      name: "Training",
      path: "/training",
      items: [
        { name: "Corporate Training", path: "/training/corporate" },
        { name: "Certification Programs", path: "/training/certification" },
        { name: "Workshops", path: "/training/workshops" }
      ]
    },
    {
      name: "Insights",
      path: "/insights",
      items: [
        { name: "Blog", path: "/insights/blog" },
        { name: "Webinars", path: "/insights/webinars" },
        { name: "Industry Reports", path: "/insights/reports" }
      ]
    },
  ];

  // Secondary navigation items
  const secondaryNavItems = [
    { name: "Home", path: "/" },
    { name: "My Courses", path: "/my-courses" },
    { name: "Explore Courses", path: "/explore-courses" },
    { name: "Pricing", path: "/pricing" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  // Handle scroll effect for navbar
  React.useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
  };

  // Helper for NavigationMenu links
  const NavigationLinkItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(
          "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none">{title}</div>
        <p className="line-clamp-2 mt-1 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </a>
    );
  });
  NavigationLinkItem.displayName = "NavigationLinkItem";

  return (
    <header 
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      {/* Global Header - Top Navbar (IBM style) */}
      <div className="border-b border-[#e0e0e0]">
        <div className="container max-w-[1400px] mx-auto px-4">
          <div className={`flex items-center justify-between transition-all ${
            scrolled ? "h-14" : "h-16"
          }`}>
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
                  alt="Trizen Logo" 
                  className={`transition-all ${scrolled ? "h-8" : "h-10"}`} 
                />
              </Link>
            </div>

            {/* Primary Navigation - Desktop */}
            <div className="hidden lg:flex items-center ml-8 h-full">
              <NavigationMenu className="h-full">
                <NavigationMenuList className="h-full space-x-1">
                  {primaryNavCategories.map((category) => (
                    <NavigationMenuItem key={category.name} className="h-full">
                      <NavigationMenuTrigger 
                        className={`h-full font-medium text-sm ${
                          activeTab === category.name.toLowerCase() 
                            ? "text-primary font-semibold" 
                            : "text-gray-700"
                        }`}
                        onClick={() => handleNavClick(category.name.toLowerCase())}
                      >
                        {category.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-2 p-4">
                          {category.items.map((item) => (
                            <li key={item.name}>
                              <NavigationMenuLink asChild>
                                <Link 
                                  to={item.path}
                                  className="block p-2 hover:bg-gray-50 rounded text-sm"
                                >
                                  {item.name}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ))}
                  <NavigationMenuItem className="h-full">
                    <Link 
                      to="/careers" 
                      className={`flex items-center h-full px-4 text-sm font-medium ${
                        activeTab === "careers" 
                          ? "text-primary font-semibold" 
                          : "text-gray-700 hover:text-primary"
                      }`}
                      onClick={() => handleNavClick("careers")}
                    >
                      Careers
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right Side - Auth & Icons */}
            <div className="flex items-center gap-1 md:gap-3">
              {/* Search Icon */}
              <button className="p-2 text-gray-600 hover:text-primary">
                <Search className="h-5 w-5" />
              </button>
              
              {/* Auth Buttons */}
              <div className="hidden md:flex items-center space-x-3">
                {isAuthenticated ? (
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium flex items-center gap-2"
                      onClick={() => navigate('/profile')}
                    >
                      <User className="h-4 w-4" />
                      <span className="hidden sm:inline text-gray-700 text-sm">{user?.name || user?.email}</span>
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="font-medium text-sm"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </Button>
                    <Button 
                      size="sm" 
                      className="font-medium text-sm"
                      onClick={() => navigate('/signup')}
                    >
                      Sign up
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button 
                className="lg:hidden p-2 text-gray-600 hover:text-primary ml-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Navigation - Sub Navbar (if there's an active category) */}
      {activeTab !== "home" && !isMobile && (
        <div className="hidden lg:block border-b border-[#f1f1f1] bg-[#f9f9f9]">
          <div className="container max-w-[1400px] mx-auto px-4">
            <div className="flex h-12 items-center">
              <div className="flex space-x-6">
                {secondaryNavItems.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    className="text-sm text-gray-600 hover:text-primary transition-colors"
                    onClick={() => handleNavClick(item.name.toLowerCase())}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {/* Secondary CTA button - positioned right */}
              <div className="ml-auto">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-sm font-medium"
                >
                  Contact Trizen
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#f3f3f3] overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="container py-4">
            {/* Primary Navigation for Mobile */}
            <div className="space-y-4 mb-6">
              <h3 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Main Navigation
              </h3>
              <div className="flex flex-col space-y-2">
                {primaryNavCategories.map((category) => (
                  <div key={category.name} className="border-b border-gray-100 pb-2">
                    <div className="flex justify-between items-center py-2">
                      <Link 
                        to={category.path} 
                        className="text-gray-800 font-medium"
                        onClick={() => {
                          handleNavClick(category.name.toLowerCase());
                          setIsMenuOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    </div>
                    <div className="ml-4 mt-1 space-y-1">
                      {category.items.map((item) => (
                        <Link 
                          key={item.name} 
                          to={item.path}
                          className="block py-1.5 text-sm text-gray-600 hover:text-primary"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Link 
                  to="/careers"
                  className="py-2 text-gray-800 font-medium"
                  onClick={() => {
                    handleNavClick("careers");
                    setIsMenuOpen(false);
                  }}
                >
                  Careers
                </Link>
              </div>
            </div>

            {/* Secondary Navigation for Mobile */}
            <div className="space-y-4 border-t border-gray-100 pt-4">
              <h3 className="text-xs uppercase font-semibold text-gray-500 tracking-wider">
                Quick Links
              </h3>
              <div className="flex flex-col space-y-2">
                {secondaryNavItems.map((item) => (
                  <Link 
                    key={item.name} 
                    to={item.path}
                    className="py-2 text-gray-800"
                    onClick={() => {
                      handleNavClick(item.name.toLowerCase());
                      setIsMenuOpen(false);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Auth for Mobile */}
            <div className="mt-6 border-t border-gray-100 pt-4">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="font-medium">{user?.name || user?.email}</span>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/profile" 
                      className="py-2 text-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="py-2 text-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }} 
                      className="py-2 text-left text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={() => {
                      navigate('/login');
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/signup');
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Sign up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
