
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/b66cad1a-9e89-49b0-a481-bbbb0a2bbded.png" 
              alt="Trizen Logo" 
              className="h-10" 
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">Home</Link>
          <Link to="/courses" className="text-sm font-medium hover:text-primary">Courses</Link>
          <Link to="/pricing" className="text-sm font-medium hover:text-primary">Pricing</Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">About</Link>
          <Link to="/contact" className="text-sm font-medium hover:text-primary">Contact</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button variant="outline" size="sm">Login</Button>
          <Button size="sm">Signup</Button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2" 
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
        <div className="container md:hidden py-4 flex flex-col gap-4 border-t">
          <Link to="/" className="text-sm font-medium px-2 py-1">Home</Link>
          <Link to="/courses" className="text-sm font-medium px-2 py-1">Courses</Link>
          <Link to="/pricing" className="text-sm font-medium px-2 py-1">Pricing</Link>
          <Link to="/about" className="text-sm font-medium px-2 py-1">About</Link>
          <Link to="/contact" className="text-sm font-medium px-2 py-1">Contact</Link>
          
          <div className="flex flex-col gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="w-full">Login</Button>
            <Button size="sm" className="w-full">Signup</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
