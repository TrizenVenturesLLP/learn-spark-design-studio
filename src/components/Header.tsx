
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronDown, Menu, Search, User, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <header 
      className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
        scrolled ? "shadow-sm" : "border-b border-[#e0e0e0]"
      }`}
    >
      {/* Global Header - Top Navbar */}
      <div className="container max-w-7xl mx-auto">
        <div className={`flex items-center justify-between transition-all ${
          scrolled ? "h-16" : "h-20"
        }`}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
                alt="Trizen Logo" 
                className={`transition-all ${scrolled ? "h-10" : "h-14"}`} 
              />
            </Link>
          </div>

          {/* Primary Navigation - Desktop */}
          <nav className="hidden lg:flex items-center ml-10 space-x-8">
            {primaryNavCategories.map((category) => (
              <DropdownMenu key={category.name}>
                <DropdownMenuTrigger asChild>
                  <button 
                    className={`flex items-center text-base font-medium ${
                      activeTab === category.name.toLowerCase() 
                        ? "text-primary font-semibold" 
                        : "text-gray-700 hover:text-primary"
                    }`}
                    onClick={() => handleNavClick(category.name.toLowerCase())}
                  >
                    {category.name}
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 bg-white">
                  {category.items.map((item) => (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link 
                        to={item.path}
                        className="w-full cursor-pointer flex items-center py-2 px-3 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}
            <Link 
              to="/careers" 
              className={`text-base font-medium ${
                activeTab === "careers" 
                  ? "text-primary font-semibold" 
                  : "text-gray-700 hover:text-primary"
              }`}
              onClick={() => handleNavClick("careers")}
            >
              Careers
            </Link>
          </nav>

          {/* Right Side - Auth & Icons */}
          <div className="flex items-center">
            {/* Search Icon */}
            <button className="ml-4 p-2 text-gray-600 hover:text-primary">
              <Search className="h-5 w-5" />
            </button>
            
            {/* Auth Buttons */}
            <div className="hidden md:flex items-center ml-4 space-x-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-primary">
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline">{user?.name || user?.email}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <button 
                        onClick={logout} 
                        className="w-full text-left cursor-pointer text-red-500 hover:text-red-600"
                      >
                        Logout
                      </button>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="font-medium"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  <Button 
                    size="sm" 
                    className="font-medium"
                    onClick={() => navigate('/signup')}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden ml-4 p-2 text-gray-600 hover:text-primary"
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

      {/* Secondary Navigation - Sub Navbar */}
      <div className="hidden lg:block border-t border-[#f3f3f3]">
        <div className="container max-w-7xl mx-auto">
          <nav className="flex h-10 items-center">
            {secondaryNavItems.map((item) => (
              <Link 
                key={item.name} 
                to={item.path}
                className={`text-sm mr-6 transition-colors ${
                  activeTab === item.name.toLowerCase() 
                    ? "font-medium text-primary" 
                    : "text-gray-600 hover:text-primary"
                }`}
                onClick={() => handleNavClick(item.name.toLowerCase())}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

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
