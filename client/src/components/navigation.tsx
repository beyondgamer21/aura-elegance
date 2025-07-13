import { useState } from "react";
import { Menu, X, Search, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toggleCart, totalItems } = useCart();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold aura-logo">AURA</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => scrollToSection("home")}
                className="hover:text-purple-400 transition-colors duration-300"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("shop")}
                className="hover:text-purple-400 transition-colors duration-300"
              >
                Shop
              </button>
              <button 
                onClick={() => scrollToSection("about")}
                className="hover:text-purple-400 transition-colors duration-300"
              >
                About
              </button>
              <button 
                onClick={() => scrollToSection("contact")}
                className="hover:text-purple-400 transition-colors duration-300"
              >
                Contact
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="relative hover:text-purple-400 transition-colors duration-300">
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleCart}
              className="relative hover:text-purple-400 transition-colors duration-300"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <button 
              className="md:hidden" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark border-t border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection("home")}
              className="block px-3 py-2 hover:bg-gray-800 rounded-md transition-colors duration-300 w-full text-left"
            >
              Home
            </button>
            <button 
              onClick={() => scrollToSection("shop")}
              className="block px-3 py-2 hover:bg-gray-800 rounded-md transition-colors duration-300 w-full text-left"
            >
              Shop
            </button>
            <button 
              onClick={() => scrollToSection("about")}
              className="block px-3 py-2 hover:bg-gray-800 rounded-md transition-colors duration-300 w-full text-left"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection("contact")}
              className="block px-3 py-2 hover:bg-gray-800 rounded-md transition-colors duration-300 w-full text-left"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
