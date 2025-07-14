import { useState } from "react";
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCartModal } from "./shopping-cart";

export default function Navigation() {
  const { items } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 inset-x-0 bg-brand-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-brand-black/60 border-b border-gray-800 z-50">
      <div className="container py-2">
        <div className="hidden lg:flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div>
            <a href="#">Aura</a>
          </div>
          <Input
            type="search"
            placeholder="Search..."
            className="max-w-md lg:flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-800"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-800 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
        <div className="lg:hidden flex justify-between items-center">
          <div>
            <a href="#">Aura</a>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-800 relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 rounded-full px-1.5 py-0.5 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      <ShoppingCartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </nav>
  );
}
